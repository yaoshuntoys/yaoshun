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
  replyTo: string;
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
    replyTo: payload.replyTo,
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

function getRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function getString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function summarizeAttribution(value: unknown) {
  const attribution = getRecord(value);

  if (!attribution) {
    return "Direct";
  }

  const explicitSource = getString(attribution.source);

  if (explicitSource) {
    return explicitSource.slice(0, 180);
  }

  const lastTouch = getRecord(attribution.lastTouch);
  const params = getRecord(lastTouch?.params);
  const source = getString(params?.utm_source);
  const medium = getString(params?.utm_medium);
  const campaign = getString(params?.utm_campaign);

  if (source || medium || campaign) {
    const channel = [source, medium].filter(Boolean).join(" / ");

    return [channel, campaign].filter(Boolean).join(" - ").slice(0, 180);
  }

  const referrer = getString(lastTouch?.referrer);

  if (referrer) {
    try {
      return new URL(referrer).hostname.replace(/^www\./, "").slice(0, 180);
    } catch {
      return referrer.slice(0, 180);
    }
  }

  return "Direct";
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
    const attributionSummary = summarizeAttribution(body.attribution);
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
    const formattedSubmittedAt = formatSubmittedAt(submittedDate, locale);
    const subjectPrefix = locale === "en" ? "Website Inquiry" : "官网询单";
    const subject = `[${subjectPrefix}] ${name}${company ? ` - ${company}` : ""}`;
    const mailCopy =
      locale === "zh"
        ? {
            company: "公司",
            direct: "直接访问",
            email: "邮箱",
            inquiry: "官网询单",
            message: "询盘内容",
            newInquiry: `来自 ${name} 的新询单`,
            reply: "回复客户",
            source: "来源",
            website: "中文官网",
          }
        : {
            company: "Company",
            direct: "Direct",
            email: "Email",
            inquiry: "Website inquiry",
            message: "Project brief",
            newInquiry: `New inquiry from ${name}`,
            reply: "Reply to customer",
            source: "Source",
            website: "English website",
          };
    const escapedCompany = escapeHtml(company);
    const escapedEmail = escapeHtml(normalizedEmail);
    const escapedMailto = escapeHtml(`mailto:${normalizedEmail}`);
    const escapedSubmittedAt = escapeHtml(formattedSubmittedAt);
    const escapedMessage = escapeHtml(message);
    const escapedAttributionSummary = escapeHtml(
      attributionSummary === "Direct" ? mailCopy.direct : attributionSummary,
    );
    const companyHtml = company
      ? `
                  <tr>
                    <td style="width:78px;padding:0;font-size:12px;font-weight:700;color:#6f7ea9;vertical-align:top;">${mailCopy.company}</td>
                    <td style="padding:0;font-size:14px;color:#17306e;vertical-align:top;word-break:break-word;">${escapedCompany}</td>
                  </tr>`
      : "";
    const text = [
      mailCopy.newInquiry,
      `${mailCopy.email}: ${normalizedEmail}`,
      company ? `${mailCopy.company}: ${company}` : "",
      "",
      `${mailCopy.message}:`,
      message,
      "",
      `${mailCopy.website} · ${mailCopy.source}: ${
        attributionSummary === "Direct" ? mailCopy.direct : attributionSummary
      } · ${formattedSubmittedAt}`,
    ].filter(Boolean).join("\n");

    const mailPayload = {
      headers: {
        "X-Lead-Source": "website-contact-form",
      },
      html: `
        <div style="margin:0;background:#ffffff;padding:20px 18px;font-family:Arial,'Helvetica Neue',sans-serif;color:#17306e;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:640px;margin:0 auto;border-collapse:collapse;background:#ffffff;">
            <tr>
              <td style="height:4px;background:#2563ff;font-size:0;line-height:0;">&nbsp;</td>
            </tr>
            <tr>
              <td style="padding:14px 0;border-bottom:1px solid #dfe7f3;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;">
                  <tr>
                    <td style="vertical-align:middle;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;">
                        <tr>
                          <td style="padding-right:10px;vertical-align:middle;">
                            <img src="https://www.yaoshuntoys.com/favicon-rounded-192.png" width="34" height="34" alt="Yaoshun Toys" style="display:block;width:34px;height:34px;border:0;border-radius:8px;" />
                          </td>
                          <td style="vertical-align:middle;white-space:nowrap;font-size:19px;line-height:1;font-weight:800;">
                            <span style="color:#2563ff;">yaoshun</span><span style="color:#ff9700;"> toys</span>
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td align="right" style="vertical-align:middle;font-size:11px;font-weight:700;line-height:1.3;color:#6f7ea9;">${mailCopy.inquiry}</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 0 0 0;">
                <div style="font-size:11px;line-height:1.4;color:#6f7ea9;">${escapedSubmittedAt}</div>
                <h1 style="margin:5px 0 14px 0;font-size:22px;line-height:1.3;font-weight:800;color:#17306e;">${escapeHtml(mailCopy.newInquiry)}</h1>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;">
                  <tr>
                    <td style="width:78px;padding:0 0 7px 0;font-size:12px;font-weight:700;color:#6f7ea9;vertical-align:top;">${mailCopy.email}</td>
                    <td style="padding:0 0 7px 0;font-size:14px;font-weight:700;vertical-align:top;word-break:break-word;"><a href="${escapedMailto}" style="color:#2563ff;text-decoration:none;">${escapedEmail}</a></td>
                  </tr>
                  ${companyHtml}
                </table>
                <div style="margin:16px 0 0 0;padding:14px 0;border-top:1px solid #dfe7f3;border-bottom:1px solid #dfe7f3;">
                  <div style="margin:0 0 6px 0;font-size:11px;font-weight:700;line-height:1.4;color:#6f7ea9;text-transform:uppercase;">${mailCopy.message}</div>
                  <div style="font-size:14px;line-height:1.65;color:#17306e;white-space:pre-wrap;word-break:break-word;">${escapedMessage}</div>
                </div>
                <div style="margin-top:12px;font-size:11px;line-height:1.5;color:#8a97b8;word-break:break-word;">${mailCopy.website} · ${mailCopy.source}: ${escapedAttributionSummary}</div>
                <a href="${escapedMailto}" style="display:inline-block;margin-top:12px;padding:9px 14px;background:#ff9700;border-radius:6px;color:#ffffff;font-size:13px;font-weight:700;text-decoration:none;">${mailCopy.reply}</a>
              </td>
            </tr>
          </table>
        </div>
      `,
      replyTo: normalizedEmail,
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
