"use client";

import {useEffect} from "react";
import {useParams} from "next/navigation";

import {FallbackPage} from "@/components/sections/fallback-page";
import {defaultLocale, isLocale, type Locale} from "@/lib/i18n";
import {contactFormPath, localizedPath} from "@/lib/routes";

function useSafeLocale(): Locale {
  const params = useParams<{locale?: string | string[]}>();
  const candidate = Array.isArray(params.locale) ? params.locale[0] : params.locale;

  return candidate && isLocale(candidate) ? candidate : defaultLocale;
}

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & {digest?: string};
  reset: () => void;
}) {
  const locale = useSafeLocale();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <FallbackPage
      actions={[
        {
          icon: "retry",
          label: {en: "Try Again", zh: "重试"},
          onClick: reset,
        },
        {
          href: localizedPath(locale, "home"),
          icon: "home",
          label: {en: "Back to Home", zh: "返回首页"},
          variant: "secondary",
        },
        {
          href: contactFormPath(locale),
          icon: "contact",
          label: {en: "Send Details", zh: "发送详情"},
          variant: "secondary",
        },
      ]}
      description={{
        en: "This page ran into a temporary issue. Your navigation is still available, and retrying usually resolves transient loading problems.",
        zh: "当前页面遇到临时问题。站点导航仍可使用，通常重试即可恢复临时加载异常。",
      }}
      eyebrow={{en: "Runtime Fallback", zh: "运行兜底"}}
      locale={locale}
      statusLabel="500"
      supportText={{
        en: "For quote-related pages, include the URL and reference code when contacting us.",
        zh: "如果这是报价相关页面，联系我们时请附上页面地址和参考编号。",
      }}
      technicalDetails={error.digest ? `Reference: ${error.digest}` : undefined}
      title={{en: "This Page Needs A Retry", zh: "当前页面需要重试"}}
    />
  );
}
