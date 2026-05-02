import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

import { defaultLocale, isLocale } from "@/lib/i18n";

export const runtime = "nodejs";

const rateLimitWindowMs = 10 * 60 * 1000;
const maxSubmissionsPerWindow = 5;
const maxMessageLength = 5000;
const rateLimitBuckets = new Map<string, number[]>();

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

    const ticketEmail = process.env.TAWK_TICKET_EMAIL?.trim();
    const host = process.env.EMAIL_HOST?.trim();
    const port = Number(process.env.EMAIL_PORT);
    const user = process.env.EMAIL_USER?.trim();
    const pass = process.env.EMAIL_PASS?.trim();
    const from = process.env.EMAIL_FROM?.trim();

    if (!ticketEmail || !host || !user || !pass || !from || !Number.isInteger(port) || port <= 0) {
      return jsonError("Mail config missing.", 500);
    }

    const secure = port === 465;

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });

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
    const text = [
      `Name: ${name}`,
      `Company: ${company || "-"}`,
      `Email: ${normalizedEmail}`,
      `Locale: ${locale}`,
      `Submitted At: ${submittedAt}`,
      "",
      "Message:",
      message,
    ].join("\n");

    await transporter.sendMail({
      from,
      to: ticketEmail,
      replyTo: normalizedEmail,
      subject,
      text,
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
      headers: {
        "X-Lead-Source": "website-contact-form",
      },
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
