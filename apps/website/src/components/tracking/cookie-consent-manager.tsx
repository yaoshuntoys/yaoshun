"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {useEffect, useMemo, useState} from "react";

import {
  applyGoogleConsent,
  dispatchCookieConsentChange,
  persistCookieConsentStatus,
  readCookieConsentStatus,
  subscribeToCookieConsent,
  subscribeToCookieConsentManager,
  type CookieConsentStatus,
} from "@/lib/cookie-consent";
import {defaultLocale, getLocaleFromPathname, t, type Locale} from "@/lib/i18n";
import {localizedPath} from "@/lib/routes";

const cookieConsentCopy = {
  title: {
    en: "Cookie Settings",
    zh: "Cookie 设置",
  },
  description: {
    en: "We use necessary cookies and optional analytics/advertising measurement.",
    zh: "我们使用必要 Cookie，以及可选的分析与广告衡量。",
  },
  accept: {
    en: "Accept",
    zh: "接受",
  },
  reject: {
    en: "Reject",
    zh: "拒绝",
  },
  privacy: {
    en: "Privacy Policy",
    zh: "隐私政策",
  },
  googleData: {
    en: "Google data use",
    zh: "Google 数据使用",
  },
  close: {
    en: "Close",
    zh: "关闭",
  },
};

export function CookieConsentManager() {
  const pathname = usePathname();
  const locale = useMemo(
    () => getLocaleFromPathname(pathname) ?? defaultLocale,
    [pathname],
  );
  const [status, setStatus] = useState<CookieConsentStatus | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const refreshStatus = () => {
      const nextStatus = readCookieConsentStatus();

      setStatus(nextStatus);
      setIsReady(true);

      if (nextStatus === null) {
        setIsOpen(true);
      }
    };

    refreshStatus();

    const unsubscribeConsent = subscribeToCookieConsent(refreshStatus);
    const unsubscribeManager = subscribeToCookieConsentManager(() => {
      refreshStatus();
      setIsOpen(true);
    });

    return () => {
      unsubscribeConsent();
      unsubscribeManager();
    };
  }, []);

  function saveStatus(nextStatus: CookieConsentStatus) {
    persistCookieConsentStatus(nextStatus);
    applyGoogleConsent(nextStatus);
    setStatus(nextStatus);
    setIsOpen(false);
    dispatchCookieConsentChange();
  }

  if (!isReady || !isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[90] px-3 pb-3 sm:px-4 sm:pb-4">
      <section
        aria-labelledby="cookie-consent-title"
        className="mx-auto flex w-full max-w-[680px] flex-col gap-2.5 rounded-[0.9rem] border border-[rgba(32,62,143,0.10)] bg-white/96 p-2.5 shadow-[0_18px_54px_-34px_rgba(18,41,103,0.34)] backdrop-blur-xl sm:flex-row sm:items-center sm:gap-3 sm:p-3"
        role="dialog"
      >
        <div className="min-w-0 flex-1">
          <h2
            className="font-display text-[0.9rem] font-bold leading-tight tracking-normal text-[#132968]"
            id="cookie-consent-title"
          >
            {t(locale, cookieConsentCopy.title)}
          </h2>
          <p className="mt-1 text-[0.78rem] leading-5 text-[#6f7ea9]">
            {t(locale, cookieConsentCopy.description)}
            <Link
              className="ml-1 font-semibold text-[#2563ff] transition hover:text-[#0e2f9a]"
              href={localizedPath(locale, "privacy")}
            >
              {t(locale, cookieConsentCopy.privacy)}
            </Link>
            <a
              className="ml-1 font-semibold text-[#2563ff] transition hover:text-[#0e2f9a]"
              href="https://business.safety.google/privacy/"
              rel="noopener noreferrer"
              target="_blank"
            >
              {t(locale, cookieConsentCopy.googleData)}
            </a>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:shrink-0 sm:justify-end">
          <button
            className="inline-flex h-8 items-center justify-center rounded-full border border-transparent bg-[linear-gradient(135deg,#2563ff_0%,#1a43c9_100%)] px-3 text-[0.76rem] font-bold text-white shadow-[0_12px_24px_-18px_rgba(37,99,255,0.58)] transition hover:-translate-y-0.5"
            type="button"
            onClick={() => saveStatus("granted")}
          >
            {t(locale, cookieConsentCopy.accept)}
          </button>
          <button
            className="inline-flex h-8 items-center justify-center rounded-full border border-[rgba(37,99,255,0.16)] bg-white px-3 text-[0.76rem] font-bold text-[#132968] shadow-[0_12px_24px_-20px_rgba(18,41,103,0.18)] transition hover:-translate-y-0.5 hover:border-[rgba(37,99,255,0.22)] hover:bg-[#f7faff] hover:text-[#2563ff]"
            type="button"
            onClick={() => saveStatus("denied")}
          >
            {t(locale, cookieConsentCopy.reject)}
          </button>
          {status !== null ? (
            <button
              className="inline-flex h-8 items-center justify-center rounded-full px-2.5 text-[0.75rem] font-semibold text-[#6f7ea9] transition hover:bg-[#2563ff]/6 hover:text-[#132968]"
              type="button"
              onClick={() => setIsOpen(false)}
            >
              {t(locale, cookieConsentCopy.close)}
            </button>
          ) : null}
        </div>
      </section>
    </div>
  );
}
