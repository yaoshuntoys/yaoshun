"use client";

import {type FormEvent, useState} from "react";

import {t, type Locale} from "@/lib/i18n";
import {formFeedbackBaseClass, inputClass, primaryButtonClass, textareaClass} from "@/lib/ui";

export function HomeLeadForm({locale}: {locale: Locale}) {
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
      company: "",
      website: String(formData.get("website") ?? "").trim(),
      locale,
    };

    try {
      const response = await fetch("/api/contact-form", {
        method: "POST",
        headers: {"content-type": "application/json"},
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        setState("error");
        return;
      }

      setState("success");
      form.reset();
    } catch {
      setState("error");
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <input
          className={inputClass}
          name="name"
          placeholder={t(locale, {en: "Your Name *", zh: "你的姓名 *"})}
          required
          type="text"
        />
        <input
          className={inputClass}
          name="email"
          placeholder={t(locale, {en: "Your Email *", zh: "你的邮箱 *"})}
          required
          type="email"
        />
      </div>
      <textarea
        className={`${textareaClass} min-h-[7rem]`}
        name="message"
        placeholder={t(locale, {en: "Your Message *", zh: "你的留言 *"})}
        required
        rows={3}
      />
      <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
        <label>
          Website
          <input autoComplete="off" name="website" tabIndex={-1} type="text" />
        </label>
      </div>
      <button className={`${primaryButtonClass} w-full`} disabled={state === "submitting"} type="submit">
        {t(locale, {en: "Send Message", zh: "发送消息"})}
      </button>
      {state === "success" ? (
        <p className={`${formFeedbackBaseClass} text-[#0f9b62]`}>
          {t(locale, {en: "Message sent successfully.", zh: "消息发送成功。"})}
        </p>
      ) : null}
      {state === "error" ? (
        <p className={`${formFeedbackBaseClass} text-[#d0342c]`}>
          {t(locale, {en: "Submission failed. Please try again.", zh: "提交失败，请稍后重试。"})}
        </p>
      ) : null}
    </form>
  );
}
