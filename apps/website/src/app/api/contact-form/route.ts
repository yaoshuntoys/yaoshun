import { NextResponse } from "next/server";
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

type EmailProvider = "smtp" | "resend";

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
  to: string;
  user: string;
};

type ResendConfig = {
  apiKey: string;
  from: string;
  to: string;
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
  const to = getEnvValue("TAWK_TICKET_EMAIL") || defaultContactRecipient;
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
      to,
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
  const to =
    getEnvValue("RESEND_TO_EMAIL") ||
    getEnvValue("TAWK_TICKET_EMAIL") ||
    defaultContactRecipient;
  const missing = [!apiKey ? "RESEND_API_KEY" : ""];
  const invalid = [
    !isValidEmail(to) ? "RESEND_TO_EMAIL / TAWK_TICKET_EMAIL must be a valid email" : "",
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

async function sendWithSmtp(config: SmtpConfig, payload: MailPayload) {
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: { user: config.user, pass: config.pass },
  });

  await transporter.sendMail({
    from: config.from,
    to: config.to,
    replyTo: payload.replyTo,
    subject: payload.subject,
    text: payload.text,
    html: payload.html,
    headers: payload.headers,
  });
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
}

async function sendLeadEmail(payload: MailPayload) {
  const smtp = getSmtpConfig();
  const resend = getResendConfig();
  const skipped: Record<EmailProvider, ProviderDiagnostics> = {
    smtp: smtp.diagnostics,
    resend: resend.diagnostics,
  };
  const sendTasks: Array<{
    provider: EmailProvider;
    send: () => Promise<void>;
  }> = [];

  if (smtp.config) {
    const smtpConfig = smtp.config;
    sendTasks.push({
      provider: "smtp",
      send: () => sendWithSmtp(smtpConfig, payload),
    });
  }

  if (resend.config) {
    const resendConfig = resend.config;
    sendTasks.push({
      provider: "resend",
      send: () => sendWithResend(resendConfig, payload),
    });
  }

  const results = await Promise.all(
    sendTasks.map(async ({ provider, send }) => {
      try {
        await send();
        return { ok: true as const, provider };
      } catch (error) {
        return {
          ok: false as const,
          provider,
          reason: formatUnknownError(error),
        };
      }
    }),
  );
  const attempted = sendTasks.map((task) => task.provider);
  const successes = results
    .filter((result) => result.ok)
    .map((result) => result.provider);
  const failures = results
    .filter((result) => !result.ok)
    .map((result) => ({
      provider: result.provider,
      reason: result.reason,
    }));
  const diagnosticSummary = {
    attempted,
    failures,
    skipped,
    successes,
  };
  const hasSkippedProviderIssues = !smtp.diagnostics.configured || !resend.diagnostics.configured;

  if (successes.length > 0) {
    if (
      failures.length > 0 ||
      attempted.length > successes.length ||
      hasSkippedProviderIssues
    ) {
      console.warn("Contact form email sent with partial provider issues", diagnosticSummary);
    }

    return diagnosticSummary;
  }

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

    await sendLeadEmail({
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
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to submit contact form", error);
    return NextResponse.json(
      { ok: false, message: "Failed to submit form. Please try again later." },
      { status: 500 },
    );
  }
}
