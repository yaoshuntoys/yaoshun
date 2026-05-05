"use client";

import {useParams} from "next/navigation";

import {LoadingView} from "@/components/sections/loading-view";
import {defaultLocale, isLocale, type Locale} from "@/lib/i18n";

function useSafeLocale(): Locale {
  const params = useParams<{locale?: string | string[]}>();
  const candidate = Array.isArray(params.locale) ? params.locale[0] : params.locale;

  return candidate && isLocale(candidate) ? candidate : defaultLocale;
}

export default function LocaleLoading() {
  const locale = useSafeLocale();

  return (
    <LoadingView
      description={{
        en: "Loading the next page.",
        zh: "正在加载页面。",
      }}
      locale={locale}
      title={{en: "Loading", zh: "加载中"}}
    />
  );
}
