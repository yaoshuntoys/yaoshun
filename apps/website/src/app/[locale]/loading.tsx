"use client";

import {useParams} from "next/navigation";

import {FallbackPage} from "@/components/sections/fallback-page";
import {defaultLocale, isLocale, type Locale} from "@/lib/i18n";

function useSafeLocale(): Locale {
  const params = useParams<{locale?: string | string[]}>();
  const candidate = Array.isArray(params.locale) ? params.locale[0] : params.locale;

  return candidate && isLocale(candidate) ? candidate : defaultLocale;
}

export default function LocaleLoading() {
  const locale = useSafeLocale();

  return (
    <FallbackPage
      description={{
        en: "We are loading the latest page content and keeping the current navigation ready.",
        zh: "我们正在加载页面内容，并保持当前导航可用。",
      }}
      eyebrow={{en: "Loading", zh: "加载中"}}
      isLoading
      locale={locale}
      statusLabel={locale === "zh" ? "加载中" : "Loading"}
      suggestions={[]}
      title={{en: "Preparing Your Page", zh: "正在准备页面"}}
    />
  );
}
