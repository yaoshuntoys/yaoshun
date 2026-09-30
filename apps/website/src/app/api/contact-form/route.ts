import { NextResponse } from "next/server";
import { Resend } from "resend";

import { defaultLocale, isLocale } from "@/lib/i18n";

export const runtime = "nodejs";

const rateLimitWindowMs = 10 * 60 * 1000;
const maxSubmissionsPerWindow = 5;
const maxMessageLength = 5000;
const maxAttributionLength = 8000;
const defaultContactRecipient = "info@yaoshuntoys.com";
const rateLimitBuckets = new Map<string, number[]>();

type MailPayload = {
  headers: Record<string, string>;
  html: string;
  subject: string;
  text: string;
};

type ProviderDiagnostics = {
  configured: boolean;
  invalid: string[];
  missing: string[];
};

type ResendConfig = {
  apiKey: string;
  from: string;
  to: string[];
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ ok: false, message }, { status });
}

function getEnvValue(name: string) {
  return process.env[name]?.trim() ?? "";
}

function uniqueValues(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function getPrimaryRecipient() {
  return getEnvValue("CONTACT_FORM_TO_EMAIL") || defaultContactRecipient;
}

function getEmailList(values: string[]) {
  return uniqueValues(
    values
      .flatMap((value) => value.split(","))
      .map((value) => value.trim().toLowerCase()),
  );
}

function maskEmailAddress(value: string) {
  return value.replace(
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,
    (email) => {
      const [local = "", domain = ""] = email.split("@");
      const visiblePrefix = local.slice(0, 2) || "*";

      return `${visiblePrefix}***@${domain}`;
    },
  );
}

function formatUnknownError(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return "Unknown error";
  }
}

function getResendConfig(): {
  config: ResendConfig | null;
  diagnostics: ProviderDiagnostics;
} {
  const apiKey = getEnvValue("RESEND_API_KEY");
  const from = getEnvValue("RESEND_FROM_EMAIL") || "onboarding@resend.dev";
  const to = getEmailList([getPrimaryRecipient(), getEnvValue("RESEND_TO_EMAIL")]);
  const missing = [!apiKey ? "RESEND_API_KEY" : ""];
  const invalid = [
    to.length === 0 || to.some((item) => !isValidEmail(item))
      ? "RESEND_TO_EMAIL / CONTACT_FORM_TO_EMAIL must contain valid email addresses"
      : "",
    !from ? "RESEND_FROM_EMAIL" : "",
  ];
  const diagnostics = {
    configured: !missing.some(Boolean) && !invalid.some(Boolean),
    invalid: uniqueValues(invalid),
    missing: uniqueValues(missing),
  };

  if (!diagnostics.configured) {
    return { config: null, diagnostics };
  }

  return { config: { apiKey, from, to }, diagnostics };
}

async function sendWithResend(config: ResendConfig, payload: MailPayload) {
  const resend = new Resend(config.apiKey);
  const result = await resend.emails.send({
    from: config.from,
    to: config.to,
    // Keep the notification's Reply-To on the inquiry mailbox. The customer
    // email is shown in the message body so the team can copy it into a new
    // outbound message instead of replying to this internal notification.
    replyTo: config.to[0],
    subject: payload.subject,
    text: payload.text,
    html: payload.html,
    headers: payload.headers,
  });

  if (result.error) {
    throw new Error(`${result.error.name}: ${result.error.message}`);
  }

  return result.data?.id;
}

async function sendLeadEmail(payload: MailPayload) {
  const { config, diagnostics } = getResendConfig();

  if (!config) {
    console.error("Contact form Resend configuration is invalid", diagnostics);
    throw new Error("Resend is not configured for contact form delivery.");
  }

  try {
    const messageId = await sendWithResend(config, payload);
    const deliverySummary = {
      messageId,
      provider: "resend",
      target: {
        from: maskEmailAddress(config.from),
        to: config.to.map(maskEmailAddress),
      },
    };

    console.info("Contact form email delivered", deliverySummary);
    return deliverySummary;
  } catch (error) {
    console.error("Contact form email delivery failed", {
      provider: "resend",
      reason: formatUnknownError(error),
    });
    throw new Error("Resend failed to deliver the contact form email.", { cause: error });
  }
}

function stringifyAttribution(value: unknown) {
  if (!value || typeof value !== "object") {
    return "";
  }

  try {
    const serialized = JSON.stringify(value, null, 2);

    return serialized.length > maxAttributionLength
      ? `${serialized.slice(0, maxAttributionLength)}\n...[truncated]`
      : serialized;
  } catch {
    return "";
  }
}

function formatSubmittedAt(date: Date, locale: "en" | "zh") {
  const formatted = new Intl.DateTimeFormat(
    locale === "zh" ? "zh-CN" : "en-US",
    {
      day: "numeric",
      hour: "2-digit",
      hour12: locale === "en",
      minute: "2-digit",
      month: locale === "zh" ? "numeric" : "short",
      timeZone: "Asia/Shanghai",
      year: "numeric",
    },
  ).format(date);

  return `${formatted} (GMT+8)`;
}

function getClientAddress(request: Request) {
  const xForwardedFor = request.headers.get("x-forwarded-for");

  if (xForwardedFor) {
    const [firstIp] = xForwardedFor.split(",");
    if (firstIp?.trim()) {
      return firstIp.trim();
    }
  }

  const xRealIp = request.headers.get("x-real-ip");

  if (xRealIp?.trim()) {
    return xRealIp.trim();
  }

  return "unknown";
}

function isRateLimited(rateLimitKey: string, now: number) {
  const existing = rateLimitBuckets.get(rateLimitKey) ?? [];
  const threshold = now - rateLimitWindowMs;
  const recent = existing.filter((timestamp) => timestamp > threshold);
  recent.push(now);
  rateLimitBuckets.set(rateLimitKey, recent);

  if (rateLimitBuckets.size > 5000) {
    for (const [key, timestamps] of rateLimitBuckets.entries()) {
      if (timestamps.length === 0 || timestamps[timestamps.length - 1] <= threshold) {
        rateLimitBuckets.delete(key);
      }
    }
  }

  return recent.length > maxSubmissionsPerWindow;
}

export async function POST(request: Request) {
  try {
    let body: {
      name?: string;
      company?: string;
      email?: string;
      message?: string;
      website?: string;
      locale?: string;
      attribution?: unknown;
    };

    try {
      body = (await request.json()) as typeof body;
    } catch {
      return jsonError("Invalid JSON payload.", 400);
    }

    if (!body || typeof body !== "object") {
      return jsonError("Invalid form payload.", 400);
    }

    const name = String(body.name ?? "").trim();
    const company = String(body.company ?? "").trim();
    const email = String(body.email ?? "").trim();
    const message = String(body.message ?? "").trim();
    const website = String(body.website ?? "").trim();
    const rawLocale = String(body.locale ?? defaultLocale).trim();
    const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
    const attribution = stringifyAttribution(body.attribution);
    const normalizedEmail = email.toLowerCase();
    const now = Date.now();

    if (website) {
      console.info("Contact form honeypot submission ignored");

      return NextResponse.json({ ok: true });
    }

    if (!name) {
      return jsonError("Name is required.", 400);
    }

    if (!email) {
      return jsonError("Email is required.", 400);
    }

    if (!message) {
      return jsonError("Project brief is required.", 400);
    }

    if (name.length > 120) {
      return jsonError("Name is too long.", 400);
    }

    if (company.length > 160) {
      return jsonError("Company is too long.", 400);
    }

    if (message.length > maxMessageLength) {
      return jsonError("Project brief is too long.", 400);
    }

    if (!isValidEmail(normalizedEmail)) {
      return jsonError("Invalid email format.", 400);
    }

    const clientAddress = getClientAddress(request);
    const rateLimitKey = `${clientAddress}:${normalizedEmail}`;

    if (isRateLimited(rateLimitKey, now)) {
      return jsonError("Too many requests. Please try again later.", 429);
    }

    const submittedDate = new Date();
    const submittedAt = submittedDate.toISOString();
    const formattedSubmittedAt = formatSubmittedAt(submittedDate, "zh");
    const subjectPrefix = "官网询单";
    const subject = `[${subjectPrefix}] 来自 ${name} 的新询单`;
    const mailCopy = {
      copyEmail: "点击客户邮箱，或复制后新建邮件回复",
      email: "客户邮箱",
      forwarded: "此邮件由官网客户留言自动转发至询单邮箱。",
      inquiry: "官网询单",
      message: "留言内容",
      name: "客户名称",
      newInquiry: `来自 ${name} 的新询单`,
      noReply: "请勿直接回复此邮件",
      eventJson: "事件详情",
      source: "来源",
      website: "官网客户留言",
    };
    const escapedName = escapeHtml(name);
    const escapedEmail = escapeHtml(normalizedEmail);
    const escapedMailto = escapeHtml(`mailto:${normalizedEmail}`);
    const escapedSubmittedAt = escapeHtml(formattedSubmittedAt);
    const escapedMessage = escapeHtml(message);
    const eventJson = attribution || "{}";
    const escapedEventJson = escapeHtml(eventJson);
    const textareaStyle =
      "box-sizing:border-box;min-height:96px;padding:12px 14px;background:#f8fbff;border:1px solid #dfe7f3;border-radius:6px;color:#17306e;";
    const text = [
      mailCopy.newInquiry,
      "",
      `${mailCopy.noReply}。`,
      mailCopy.forwarded,
      `${mailCopy.copyEmail}。`,
      "",
      `${mailCopy.name}: ${name}`,
      `${mailCopy.email}: ${normalizedEmail}`,
      "",
      `${mailCopy.message}:`,
      message,
      "",
      `${mailCopy.eventJson}:`,
      eventJson,
      "",
      `${mailCopy.source}: ${mailCopy.website}`,
      formattedSubmittedAt,
    ].filter(Boolean).join("\n");

    const mailPayload = {
      headers: {
        "X-Lead-Source": "website-contact-form",
        "X-Reply-Policy": "click-customer-email-to-start-new-message",
      },
      html: `
        <div style="margin:0;background:#f8fbff;padding:28px 12px;font-family:Arial,'Helvetica Neue',sans-serif;color:#17306e;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:640px;margin:0 auto;border-collapse:separate;border-spacing:0;background:#ffffff;border:1px solid #dfe7f3;border-radius:10px;overflow:hidden;">
            <tr>
              <td style="padding:26px 28px 17px 28px;border-bottom:4px solid #2563ff;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;">
                  <tr>
                    <td style="vertical-align:middle;white-space:nowrap;font-size:28px;line-height:1;font-weight:800;letter-spacing:-.4px;">
                      <span style="color:#2563ff;">yaoshun</span><span style="color:#ff9700;"> toys</span>
                    </td>
                    <td align="right" style="vertical-align:middle;font-size:15px;font-weight:800;line-height:1.3;color:#6f7ea9;">${mailCopy.inquiry}</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                <h1 style="margin:0;font-size:27px;line-height:1.3;font-weight:800;color:#17306e;">${escapeHtml(mailCopy.newInquiry)}</h1>

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:16px;border-collapse:separate;border-spacing:0;background:#fff4f1;border:1px solid #fecdca;border-radius:8px;">
                  <tr>
                    <td style="padding:14px 16px;border-left:4px solid #d92d20;">
                      <div style="margin:0 0 4px 0;font-size:13px;font-weight:800;line-height:1.4;color:#b42318;">${mailCopy.noReply}</div>
                      <div style="font-size:13px;line-height:1.55;color:#7a271a;">${mailCopy.forwarded}${mailCopy.copyEmail}。</div>
                    </td>
                  </tr>
                </table>

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:14px;border-collapse:collapse;">
                  <tr>
                    <td style="width:104px;padding:0 0 4px 0;font-size:13px;font-weight:700;color:#6f7ea9;vertical-align:top;">${mailCopy.name}</td>
                    <td style="padding:0 0 4px 0;font-size:15px;font-weight:800;color:#17306e;vertical-align:top;word-break:break-word;">${escapedName}</td>
                  </tr>
                  <tr>
                    <td style="width:104px;padding:0 0 4px 0;font-size:13px;font-weight:700;color:#6f7ea9;vertical-align:top;">${mailCopy.email}</td>
                    <td style="padding:0 0 4px 0;font-size:15px;font-weight:800;vertical-align:top;word-break:break-word;user-select:all;"><a href="${escapedMailto}" style="color:#2563ff;text-decoration:underline;text-underline-offset:2px;">${escapedEmail}</a></td>
                  </tr>
                </table>

                <div style="margin-top:4px;">
                  <div style="font-size:12px;font-weight:700;line-height:1.4;color:#6f7ea9;letter-spacing:.45px;">${mailCopy.message}</div>
                  <div style="margin-top:8px;${textareaStyle}font-size:15px;line-height:1.7;white-space:pre-wrap;word-break:break-word;">${escapedMessage}</div>
                </div>

                <div style="margin-top:12px;">
                  <div style="font-size:12px;font-weight:700;line-height:1.4;color:#6f7ea9;letter-spacing:.45px;">${mailCopy.eventJson}</div>
                  <pre style="margin:8px 0 0 0;${textareaStyle}font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,'Liberation Mono','Courier New',monospace;font-size:11px;line-height:1.55;color:#52658f;white-space:pre-wrap;word-break:break-word;">${escapedEventJson}</pre>
                </div>

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:4px;padding-top:6px;border-collapse:collapse;border-top:1px solid #dfe7f3;">
                  <tr>
                    <td style="font-size:12px;line-height:1.5;color:#6f7ea9;">${mailCopy.source}: ${mailCopy.website}</td>
                    <td align="right" style="font-size:12px;line-height:1.5;color:#8a97b8;">${escapedSubmittedAt}</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>
      `,
      subject,
      text,
    };

    console.info("Contact form submission received", {
      attribution,
      clientAddress,
      company,
      email: normalizedEmail,
      locale,
      message,
      name,
      submittedAt,
      subject,
      userAgent: request.headers.get("user-agent") ?? "",
    });

    await sendLeadEmail(mailPayload);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to submit contact form", error);
    return NextResponse.json(
      { ok: false, message: "Failed to submit form. Please try again later." },
      { status: 500 },
    );
  }
}
