"use client";

import Link from "next/link";
import { type FormEvent, useRef, useState } from "react";

import {
  buildCampaignEventParams,
  recordCampaignAttribution,
} from "@/lib/campaign-attribution";
import { showGlobalFormFeedback } from "@/lib/form-feedback-events";
import { t, type Locale } from "@/lib/i18n";
import { localizedPath } from "@/lib/routes";
import { inputClass, primaryButtonClass, textareaClass } from "@/lib/ui";

type ContactFormProps = {
  locale: Locale;
  labels: {
    name: {
      label: { en?: string; zh?: string };
      placeholder: { en?: string; zh?: string };
    };
    email: {
      label: { en?: string; zh?: string };
      placeholder: { en?: string; zh?: string };
    };
    message: {
      label: { en?: string; zh?: string };
      placeholder: { en?: string; zh?: string };
    };
    privacyNotice: { en?: string; zh?: string };
    privacyLink: { en?: string; zh?: string };
    submit: { en?: string; zh?: string };
    success: { en?: string; zh?: string };
    error: { en?: string; zh?: string };
  };
};

type FormTrackingValue = string | number | boolean;

function SendHorizontal({
  size = 24,
  strokeWidth = 2,
}: {
  size?: number;
  strokeWidth?: number;
}) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      viewBox="0 0 24 24"
      width={size}
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

function LoadingSpinner({ size = 16 }: { size?: number }) {
  return (
    <span
      aria-hidden="true"
      className="inline-block animate-spin rounded-full border-2 border-white/35 border-t-white"
      style={{ height: size, width: size }}
    />
  );
}

function trackFormEvent(
  eventName: string,
  params: Record<string, FormTrackingValue>,
) {
  void import("@/lib/analytics")
    .then(({ trackEvent }) => {
      trackEvent(eventName, params);
    })
    .catch(() => undefined);
}

function reportLeadConversion() {
  void import("@/lib/analytics")
    .then(({ reportGoogleAdsLeadConversion }) => {
      reportGoogleAdsLeadConversion({ currency: "USD", value: 1 });
    })
    .catch(() => undefined);
}

export function ContactForm({ locale, labels }: ContactFormProps) {
  const [submitState, setSubmitState] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [hasStarted, setHasStarted] = useState(false);
  const isSubmittingRef = useRef(false);
  const errorTitle = t(locale, { en: "Submission Failed", zh: "提交失败" });
  const successTitle = t(locale, { en: "Inquiry Sent", zh: "咨询已发送" });
  const isSubmitting = submitState === "submitting";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmittingRef.current) {
      return;
    }

    isSubmittingRef.current = true;
    setSubmitState("submitting");
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();
    const website = String(formData.get("website") ?? "").trim();
    const attribution = recordCampaignAttribution();
    let ok = false;

    try {
      const response = await fetch("/api/contact-form", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name,
          company: "",
          email,
          message,
          website,
          locale,
          attribution,
        }),
      });

      if (!response.ok) {
        trackFormEvent("form_submit_error", {
          error_type: "response_error",
          form_location: "contact_page",
          lead_type: "contact_form",
          locale,
          status_code: response.status,
        });
        ok = false;
      } else {
        ok = true;
      }
    } catch {
      trackFormEvent("form_submit_error", {
        error_type: "network_error",
        form_location: "contact_page",
        lead_type: "contact_form",
        locale,
      });
      ok = false;
    }

    if (ok) {
      trackFormEvent("generate_lead", {
        ...buildCampaignEventParams(attribution),
        form_location: "contact_page",
        has_company: false,
        has_subject: false,
        lead_type: "contact_form",
        locale,
      });
      reportLeadConversion();
      setSubmitState("success");
      showGlobalFormFeedback({
        message: t(locale, labels.success),
        title: successTitle,
        type: "success",
      });
      form.reset();
      isSubmittingRef.current = false;
      return;
    }

    setSubmitState("error");
    showGlobalFormFeedback({
      message: t(locale, labels.error),
      title: errorTitle,
      type: "error",
    });
    isSubmittingRef.current = false;
  }

  return (
    <>
      <form
        className="grid gap-4"
        onFocusCapture={() => {
          if (hasStarted) {
            return;
          }

          setHasStarted(true);
          trackFormEvent("form_start", {
            ...buildCampaignEventParams(recordCampaignAttribution()),
            form_location: "contact_page",
            lead_type: "contact_form",
            locale,
          });
        }}
        onSubmit={handleSubmit}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-[0.92rem] font-bold text-[#17306e]">
              {t(locale, labels.name.label)}
            </span>
            <input
              className={inputClass}
              name="name"
              placeholder={t(locale, labels.name.placeholder)}
              required
              type="text"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-[0.92rem] font-bold text-[#17306e]">
              {t(locale, labels.email.label)}
            </span>
            <input
              className={inputClass}
              name="email"
              placeholder={t(locale, labels.email.placeholder)}
              required
              type="email"
            />
          </label>
        </div>
        <label className="grid gap-2">
          <span className="text-[0.92rem] font-bold text-[#17306e]">
            {t(locale, labels.message.label)}
          </span>
          <textarea
            className={textareaClass}
            name="message"
            placeholder={t(locale, labels.message.placeholder)}
            required
            rows={6}
          />
        </label>
        <div
          aria-hidden="true"
          className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
        >
          <label>
            Website
            <input
              autoComplete="off"
              name="website"
              tabIndex={-1}
              type="text"
            />
          </label>
        </div>
        <p className="m-0 text-[0.78rem] leading-5 text-[#6f7ea9]">
          {t(locale, labels.privacyNotice)}{" "}
          <Link
            className="font-semibold text-[#2563ff] transition hover:text-[#0e2f9a]"
            href={localizedPath(locale, "privacy")}
          >
            {t(locale, labels.privacyLink)}
          </Link>
        </p>
        <button
          className={`${primaryButtonClass} w-full`}
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? (
            <LoadingSpinner size={15} />
          ) : (
            <SendHorizontal size={15} strokeWidth={2.1} />
          )}
          <span>
            {isSubmitting
              ? t(locale, { en: "Sending...", zh: "发送中..." })
              : t(locale, labels.submit)}
          </span>
        </button>
      </form>
    </>
  );
}
