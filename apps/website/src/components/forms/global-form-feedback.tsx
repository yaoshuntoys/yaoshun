"use client";

import { Check, CircleAlert, X } from "lucide-react";
import { useEffect, useId, useState } from "react";

import {
  globalFormFeedbackEventName,
  type GlobalFormFeedbackPayload,
} from "@/lib/form-feedback-events";
import { t, type Locale } from "@/lib/i18n";

type GlobalFormFeedbackProps = {
  locale: Locale;
};

export function GlobalFormFeedback({ locale }: GlobalFormFeedbackProps) {
  const [feedback, setFeedback] = useState<GlobalFormFeedbackPayload | null>(
    null,
  );
  const titleId = useId();
  const closeLabel = t(locale, { en: "Close", zh: "关闭" });

  useEffect(() => {
    function handleFeedback(event: Event) {
      const payload = (event as CustomEvent<GlobalFormFeedbackPayload>).detail;

      if (!payload?.message || !payload.title || !payload.type) {
        return;
      }

      setFeedback(payload);
    }

    window.addEventListener(globalFormFeedbackEventName, handleFeedback);

    return () => {
      window.removeEventListener(globalFormFeedbackEventName, handleFeedback);
    };
  }, []);

  useEffect(() => {
    if (!feedback) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setFeedback(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [feedback]);

  if (!feedback) {
    return null;
  }

  const isSuccess = feedback.type === "success";

  return (
    <div
      aria-labelledby={titleId}
      aria-modal="true"
      className="fixed inset-0 z-[120] grid place-items-center bg-[rgba(13,24,54,0.42)] px-4 py-6 backdrop-blur-sm"
      role="dialog"
    >
      <div className="relative w-full max-w-[24rem] rounded-[1.35rem] border border-[rgba(32,62,143,0.10)] bg-white p-5 text-center shadow-[0_28px_70px_-32px_rgba(18,41,103,0.38)]">
        <button
          aria-label={closeLabel}
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full text-[#6f7ea9] transition hover:bg-[#f2f6ff] hover:text-[#132968]"
          type="button"
          onClick={() => setFeedback(null)}
        >
          <X size={17} strokeWidth={2.4} />
        </button>
        <div
          className={`mx-auto mb-3 grid h-11 w-11 place-items-center rounded-full ${
            isSuccess
              ? "bg-[#0f9b62]/10 text-[#0f9b62]"
              : "bg-[#d0342c]/10 text-[#d0342c]"
          }`}
        >
          {isSuccess ? (
            <Check size={22} strokeWidth={2.4} />
          ) : (
            <CircleAlert size={22} strokeWidth={2.4} />
          )}
        </div>
        <h3
          className="m-0 font-display text-[1.28rem] font-bold leading-tight text-[#132968]"
          id={titleId}
        >
          {feedback.title}
        </h3>
        <p className="mx-auto mt-2 max-w-[19rem] text-[0.92rem] leading-6 text-[#6f7ea9]">
          {feedback.message}
        </p>
        <button
          className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[#2563ff] px-5 text-[0.92rem] font-bold text-white shadow-[0_18px_34px_-20px_rgba(37,99,255,0.6)] transition hover:-translate-y-0.5 hover:bg-[#1a43c9] hover:text-white"
          type="button"
          onClick={() => setFeedback(null)}
        >
          {closeLabel}
        </button>
      </div>
    </div>
  );
}
