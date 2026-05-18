import { after, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { Resend } from "resend";

import { defaultLocale, isLocale } from "@/lib/i18n";

export const runtime = "nodejs";

const rateLimitWindowMs = 10 * 60 * 1000;
const maxSubmissionsPerWindow = 5;
const maxMessageLength = 5000;
const maxAttributionLength = 8000;
const defaultContactRecipient = "yaoshuntoys@gmail.com";
const rateLimitBuckets = new Map<string, number[]>();

type EmailProvider = "smtp-contact" | "smtp-tawk" | "resend";

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

type SmtpConfig = {
  from: string;
  host: string;
  pass: string;
  port: number;
  secure: boolean;
  user: string;
};

type ResendConfig = {
  apiKey: string;
  from: string;
  to: string[];
};

type DeliveryTarget = {
  from: string;
  to: string[];
};

type DeliveryTask = {
  provider: EmailProvider;
  send: () => Promise<string | undefined>;
  target: DeliveryTarget;
};

type DeliverySuccess = {
  messageId?: string;
  ok: true;
  provider: EmailProvider;
};

type DeliveryFailure = {
  ok: false;
  provider: EmailProvider;
  reason: string;
};

type DeliveryResult = DeliverySuccess | DeliveryFailure;

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

function getSmtpConfig(): {
  config: SmtpConfig | null;
  diagnostics: ProviderDiagnostics;
} {
  const host = getEnvValue("EMAIL_HOST");
  const rawPort = getEnvValue("EMAIL_PORT");
  const user = getEnvValue("EMAIL_USER");
  const pass = getEnvValue("EMAIL_PASS");
  const from = getEnvValue("EMAIL_FROM");
  const port = Number(rawPort);
  const missing = [
    !host ? "EMAIL_HOST" : "",
    !rawPort ? "EMAIL_PORT" : "",
    !user ? "EMAIL_USER" : "",
    !pass ? "EMAIL_PASS" : "",
    !from ? "EMAIL_FROM" : "",
  ];
  const invalid = [
    rawPort && (!Number.isInteger(port) || port <= 0)
      ? "EMAIL_PORT must be a positive integer"
      : "",
  ];
  const diagnostics = {
    configured: !missing.some(Boolean) && !invalid.some(Boolean),
    invalid: uniqueValues(invalid),
    missing: uniqueValues(missing),
  };

  if (!diagnostics.configured) {
    return { config: null, diagnostics };
  }

  return {
    config: {
      from,
      host,
      pass,
      port,
      secure: port === 465,
      user,
    },
    diagnostics,
  };
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

async function sendWithSmtp(config: SmtpConfig, to: string[], payload: MailPayload) {
  const transporter = nodemailer.createTransport({
    connectionTimeout: 8000,
    dnsTimeout: 5000,
    greetingTimeout: 8000,
    host: config.host,
    port: config.port,
    secure: config.secure,
    socketTimeout: 12000,
    auth: { user: config.user, pass: config.pass },
  });

  const info = await transporter.sendMail({
    from: config.from,
    to: to.join(", "),
    replyTo: payload.replyTo,
    subject: payload.subject,
    text: payload.text,
    html: payload.html,
    headers: payload.headers,
  });

  return typeof info.messageId === "string" ? info.messageId : undefined;
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

function formatProviderDiagnostics(diagnostics: ProviderDiagnostics) {
  return diagnostics.configured
    ? diagnostics
    : {
        ...diagnostics,
        missing: diagnostics.missing,
      };
}

function getLeadEmailTasks(payload: MailPayload) {
  const smtp = getSmtpConfig();
  const resend = getResendConfig();
  const contactSmtpRecipients = getEmailList([
    getPrimaryRecipient(),
    getEnvValue("SMTP_TO_EMAIL"),
  ]);
  const tawkRecipients = getEmailList([getEnvValue("TAWK_TICKET_EMAIL")]);
  const skipped: Record<EmailProvider, ProviderDiagnostics> = {
    "smtp-contact": smtp.diagnostics,
    "smtp-tawk": tawkRecipients.length > 0
      ? smtp.diagnostics
      : {
          configured: false,
          invalid: [],
          missing: ["TAWK_TICKET_EMAIL"],
        },
    resend: resend.diagnostics,
  };
  const invalidContactRecipients = contactSmtpRecipients.some((item) => !isValidEmail(item));
  const invalidTawkRecipients = tawkRecipients.some((item) => !isValidEmail(item));
  const sendTasks: DeliveryTask[] = [];

  if (smtp.config && contactSmtpRecipients.length > 0 && !invalidContactRecipients) {
    const smtpConfig = smtp.config;
    sendTasks.push({
      provider: "smtp-contact",
      send: () => sendWithSmtp(smtpConfig, contactSmtpRecipients, payload),
      target: {
        from: smtpConfig.from,
        to: contactSmtpRecipients,
      },
    });
  } else if (invalidContactRecipients) {
    skipped["smtp-contact"] = {
      configured: false,
      invalid: ["SMTP_TO_EMAIL / CONTACT_FORM_TO_EMAIL must contain valid email addresses"],
      missing: [],
    };
  }

  if (smtp.config && tawkRecipients.length > 0 && !invalidTawkRecipients) {
    const smtpConfig = smtp.config;
    sendTasks.push({
      provider: "smtp-tawk",
      send: () => sendWithSmtp(smtpConfig, tawkRecipients, payload),
      target: {
        from: smtpConfig.from,
        to: tawkRecipients,
      },
    });
  } else if (invalidTawkRecipients) {
    skipped["smtp-tawk"] = {
      configured: false,
      invalid: ["TAWK_TICKET_EMAIL must contain valid email addresses"],
      missing: [],
    };
  }

  if (resend.config) {
    const resendConfig = resend.config;
    sendTasks.push({
      provider: "resend",
      send: () => sendWithResend(resendConfig, payload),
      target: {
        from: resendConfig.from,
        to: resendConfig.to,
      },
    });
  }

  return { sendTasks, skipped };
}

async function runDeliveryTask(task: DeliveryTask): Promise<DeliveryResult> {
  try {
    const messageId = await task.send();
    return {
      messageId,
      ok: true,
      provider: task.provider,
    };
  } catch (error) {
    return {
      ok: false,
      provider: task.provider,
      reason: formatUnknownError(error),
    };
  }
}

function summarizeDeliveryResults(
  sendTasks: DeliveryTask[],
  skipped: Record<EmailProvider, ProviderDiagnostics>,
  results: DeliveryResult[],
) {
  const attempted = sendTasks.map((task) => task.provider);
  const failures: Array<{ provider: EmailProvider; reason: string }> = [];
  const successes: EmailProvider[] = [];
  const transportIds: Array<{ messageId: string; provider: EmailProvider }> = [];

  for (const result of results) {
    if (result.ok) {
      successes.push(result.provider);

      if (result.messageId) {
        transportIds.push({
          messageId: result.messageId,
          provider: result.provider,
        });
      }

      continue;
    }

    failures.push({
      provider: result.provider,
      reason: result.reason,
    });
  }

  return {
    attempted,
    failures,
    skipped: {
      "smtp-contact": formatProviderDiagnostics(skipped["smtp-contact"]),
      "smtp-tawk": formatProviderDiagnostics(skipped["smtp-tawk"]),
      resend: formatProviderDiagnostics(skipped.resend),
    },
    successes,
    targets: Object.fromEntries(
      sendTasks.map((task) => [
        task.provider,
        {
          from: maskEmailAddress(task.target.from),
          to: task.target.to.map(maskEmailAddress),
        },
      ]),
    ) as Record<EmailProvider, DeliveryTarget>,
    transportIds,
  };
}

async function waitForFirstSuccessfulDelivery(
  taskPromises: Array<Promise<DeliveryResult>>,
) {
  return new Promise<DeliveryResult[]>((resolve) => {
    const completedResults: DeliveryResult[] = [];

    if (taskPromises.length === 0) {
      resolve(completedResults);
      return;
    }

    for (const taskPromise of taskPromises) {
      taskPromise.then((result) => {
        completedResults.push(result);

        if (result.ok || completedResults.length === taskPromises.length) {
          resolve([...completedResults]);
        }
      });
    }
  });
}

async function sendLeadEmail(payload: MailPayload) {
  const { sendTasks, skipped } = getLeadEmailTasks(payload);
  const taskPromises = sendTasks.map(runDeliveryTask);
  const firstResults = await waitForFirstSuccessfulDelivery(taskPromises);
  const hasFirstSuccess = firstResults.some((result) => result.ok);

  if (hasFirstSuccess) {
    const diagnosticSummary = summarizeDeliveryResults(sendTasks, skipped, firstResults);
    console.info("Contact form email first delivery succeeded", diagnosticSummary);

    after(async () => {
      const allResults = await Promise.all(taskPromises);
      const finalDiagnosticSummary = summarizeDeliveryResults(sendTasks, skipped, allResults);

      if (allResults.some((result) => !result.ok) || allResults.length < sendTasks.length) {
        console.warn(
          "Contact form email completed with partial provider issues",
          finalDiagnosticSummary,
        );
        return;
      }

      console.info("Contact form email delivery result", finalDiagnosticSummary);
    });

    return diagnosticSummary;
  }

  const results = await Promise.all(taskPromises);
  const diagnosticSummary = summarizeDeliveryResults(sendTasks, skipped, results);

  console.error("Contact form email delivery failed", diagnosticSummary);
  throw new Error("No email provider delivered the contact form email.");
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

    const submittedAt = new Date().toISOString();
    const subjectPrefix = locale === "en" ? "Website Form" : "官网表单";
    const subject =
      locale === "en"
        ? `${subjectPrefix}: Inquiry from ${name}${company ? ` (${company})` : ""}`
        : `${subjectPrefix}: ${name}${company ? ` (${company})` : ""} 的咨询`;
    const escapedName = escapeHtml(name);
    const escapedCompany = escapeHtml(company || "-");
    const escapedEmail = escapeHtml(normalizedEmail);
    const escapedLocale = escapeHtml(locale);
    const escapedSubmittedAt = escapeHtml(submittedAt);
    const escapedMessage = escapeHtml(message);
    const escapedAttribution = escapeHtml(attribution || "-");
    const attributionHtml = attribution
      ? `
                  <tr>
                    <td style="width:150px;padding:14px 0;border-bottom:1px solid #e5e7eb;font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.1em;vertical-align:top;">Attribution</td>
                    <td style="padding:14px 0;border-bottom:1px solid #e5e7eb;font-size:12px;line-height:1.65;color:#111827;vertical-align:top;white-space:pre-wrap;word-break:break-word;">${escapedAttribution}</td>
                  </tr>`
      : "";
    const text = [
      `Name: ${name}`,
      `Company: ${company || "-"}`,
      `Email: ${normalizedEmail}`,
      `Locale: ${locale}`,
      `Submitted At: ${submittedAt}`,
      attribution ? `Attribution: ${attribution}` : "",
      "",
      "Message:",
      message,
    ].filter(Boolean).join("\n");

    const mailPayload = {
      headers: {
        "X-Lead-Source": "website-contact-form",
      },
      html: `
        <div style="margin:0;background:#eef2f7;padding:28px 12px;font-family:'Segoe UI',Arial,sans-serif;color:#111827;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:720px;margin:0 auto;border-collapse:collapse;background:#ffffff;border:1px solid #dbe3ef;">
            <tr>
              <td style="padding:26px 30px;background:linear-gradient(135deg,#0f2b6b 0%,#123b92 100%);color:#ffffff;">
                <div style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;opacity:0.82;">Website Inquiry</div>
                <h2 style="margin:10px 0 0 0;font-size:26px;line-height:1.25;font-weight:800;">New Lead From Contact Form</h2>
                <p style="margin:10px 0 0 0;font-size:13px;line-height:1.7;opacity:0.9;">A new inquiry has been submitted from the official website. The details are listed below.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 30px 30px 30px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;">
                  <tr>
                    <td style="width:150px;padding:14px 0;border-bottom:1px solid #e5e7eb;font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.1em;vertical-align:top;">Name</td>
                    <td style="padding:14px 0;border-bottom:1px solid #e5e7eb;font-size:15px;color:#111827;font-weight:600;vertical-align:top;">${escapedName}</td>
                  </tr>
                  <tr>
                    <td style="width:150px;padding:14px 0;border-bottom:1px solid #e5e7eb;font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.1em;vertical-align:top;">Email</td>
                    <td style="padding:14px 0;border-bottom:1px solid #e5e7eb;font-size:15px;color:#0f2b6b;font-weight:700;vertical-align:top;">${escapedEmail}</td>
                  </tr>
                  <tr>
                    <td style="width:150px;padding:14px 0;border-bottom:1px solid #e5e7eb;font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.1em;vertical-align:top;">Company</td>
                    <td style="padding:14px 0;border-bottom:1px solid #e5e7eb;font-size:14px;color:#111827;vertical-align:top;">${escapedCompany}</td>
                  </tr>
                  <tr>
                    <td style="width:150px;padding:14px 0;border-bottom:1px solid #e5e7eb;font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.1em;vertical-align:top;">Locale</td>
                    <td style="padding:14px 0;border-bottom:1px solid #e5e7eb;font-size:14px;color:#111827;vertical-align:top;">${escapedLocale}</td>
                  </tr>
                  <tr>
                    <td style="width:150px;padding:14px 0;border-bottom:1px solid #e5e7eb;font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.1em;vertical-align:top;">Submitted At</td>
                    <td style="padding:14px 0;border-bottom:1px solid #e5e7eb;font-size:14px;color:#111827;vertical-align:top;">${escapedSubmittedAt}</td>
                  </tr>
                  ${attributionHtml}
                  <tr>
                    <td style="width:150px;padding:14px 0;font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.1em;vertical-align:top;">Message</td>
                    <td style="padding:14px 0;font-size:14px;line-height:1.75;color:#111827;vertical-align:top;white-space:pre-wrap;word-break:break-word;">${escapedMessage}</td>
                  </tr>
                </table>
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
