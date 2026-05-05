"use client";

import {type FormEvent, useState} from "react";
import {SendHorizontal} from "lucide-react";

import {reportGoogleAdsLeadConversion, trackEvent} from "@/lib/analytics";
import {t, type Locale} from "@/lib/i18n";
import {formFeedbackBaseClass, inputClass, primaryButtonClass, textareaClass} from "@/lib/ui";

type ContactFormProps = {
  locale: Locale;
  labels: {
    name: {label: {en?: string; zh?: string}; placeholder: {en?: string; zh?: string}};
    email: {label: {en?: string; zh?: string}; placeholder: {en?: string; zh?: string}};
    message: {label: {en?: string; zh?: string}; placeholder: {en?: string; zh?: string}};
    submit: {en?: string; zh?: string};
    success: {en?: string; zh?: string};
    error: {en?: string; zh?: string};
  };
};

export function ContactForm({locale, labels}: ContactFormProps) {
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [hasStarted, setHasStarted] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState("submitting");
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();
    const website = String(formData.get("website") ?? "").trim();
    let ok = false;

    try {
      const response = await fetch("/api/contact-form", {
        method: "POST",
        headers: {"content-type": "application/json"},
        body: JSON.stringify({
          name,
          company: "",
          email,
          message,
          website,
          locale,
        }),
      });

      if (!response.ok) {
        trackEvent("form_submit_error", {
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
      trackEvent("form_submit_error", {
        error_type: "network_error",
        form_location: "contact_page",
        lead_type: "contact_form",
        locale,
      });
      ok = false;
    }

    if (ok) {
      trackEvent("generate_lead", {
        form_location: "contact_page",
        has_company: false,
        has_subject: false,
        lead_type: "contact_form",
        locale,
      });
      reportGoogleAdsLeadConversion({currency: "CNY", value: 1});
      setSubmitState("success");
      form.reset();
      return;
    }

    setSubmitState("error");
  }

  return (
    <form
      className="grid gap-4"
      onFocusCapture={() => {
        if (hasStarted) {
          return;
        }

        setHasStarted(true);
        trackEvent("form_start", {
          form_location: "contact_page",
          lead_type: "contact_form",
          locale,
        });
      }}
      onSubmit={handleSubmit}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-[0.92rem] font-bold text-[#17306e]">{t(locale, labels.name.label)}</span>
          <input className={inputClass} name="name" placeholder={t(locale, labels.name.placeholder)} required type="text" />
        </label>
        <label className="grid gap-2">
          <span className="text-[0.92rem] font-bold text-[#17306e]">{t(locale, labels.email.label)}</span>
          <input className={inputClass} name="email" placeholder={t(locale, labels.email.placeholder)} required type="email" />
        </label>
      </div>
      <label className="grid gap-2">
        <span className="text-[0.92rem] font-bold text-[#17306e]">{t(locale, labels.message.label)}</span>
        <textarea className={textareaClass} name="message" placeholder={t(locale, labels.message.placeholder)} required rows={6} />
      </label>
      <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
        <label>
          Website
          <input autoComplete="off" name="website" tabIndex={-1} type="text" />
        </label>
      </div>
      <button className={`${primaryButtonClass} w-full`} disabled={submitState === "submitting"} type="submit">
        <SendHorizontal size={15} strokeWidth={2.1} />
        <span>{t(locale, labels.submit)}</span>
      </button>
      {submitState === "success" ? (
        <p className={`${formFeedbackBaseClass} text-[#0f9b62]`}>{t(locale, labels.success)}</p>
      ) : null}
      {submitState === "error" ? (
        <p className={`${formFeedbackBaseClass} text-[#d0342c]`}>{t(locale, labels.error)}</p>
      ) : null}
    </form>
  );
}
