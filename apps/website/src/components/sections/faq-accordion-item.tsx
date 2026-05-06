"use client";

import {useEffect, useRef} from "react";

import type {Locale} from "@/lib/i18n";

function trackFaqExpand(locale: Locale, question: string) {
  void import("@/lib/analytics")
    .then(({trackEvent}) => {
      trackEvent("faq_expand", {
        locale,
        location: "faq_page",
        question,
      });
    })
    .catch(() => undefined);
}

export function FaqAccordionItem({
  answer,
  defaultOpen = false,
  locale,
  question,
}: {
  answer: string;
  defaultOpen?: boolean;
  locale: Locale;
  question: string;
}) {
  const readyRef = useRef(false);

  useEffect(() => {
    readyRef.current = true;
  }, []);

  return (
    <details
      className="faq-accordion-item"
      onToggle={(event) => {
        if (!readyRef.current || !event.currentTarget.open) {
          return;
        }

        trackFaqExpand(locale, question);
      }}
      open={defaultOpen}
    >
      <summary>
        <span>{question}</span>
        <span aria-hidden="true" className="faq-accordion-icon">+</span>
      </summary>
      <p className="faq-accordion-answer">{answer}</p>
    </details>
  );
}
