import { notFound } from "next/navigation";

export const localeRegistry = {
  en: {
    label: "English",
    nativeLabel: "English",
    markets: ["US", "UK", "AU"],
    htmlLang: "en",
    ogLocale: "en_US",
  },
  zh: {
    label: "Chinese",
    nativeLabel: "简体中文",
    markets: ["CN", "SG", "MY"],
    htmlLang: "zh-CN",
    ogLocale: "zh_CN",
  },
} as const;

export type Locale = keyof typeof localeRegistry;
export const locales = Object.keys(localeRegistry) as Locale[];
export const defaultLocale: Locale = "en";
export const localeCookieName = "preferred-locale";

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function normalizeLocaleCandidate(
  value: string | null | undefined,
): string | null {
  if (!value) {
    return null;
  }

  return value.toLowerCase().replace(/_/g, "-").trim();
}

export function matchSupportedLocale(
  value: string | null | undefined,
): Locale | null {
  const normalized = normalizeLocaleCandidate(value);

  if (!normalized) {
    return null;
  }

  if (isLocale(normalized)) {
    return normalized;
  }

  const primary = normalized.split("-")[0];

  if (isLocale(primary)) {
    return primary;
  }

  return null;
}

export function getLocalePattern(): RegExp {
  return new RegExp(`^/(${locales.join("|")})(?=/|$)`);
}

export function localePathPrefix(locale: Locale): string {
  return locale === defaultLocale ? "" : `/${locale}`;
}

export function getLocaleFromPathname(pathname: string): Locale | null {
  const match = pathname.match(getLocalePattern());

  return match?.[1] && isLocale(match[1]) ? match[1] : null;
}

export function resolvePreferredLocale(options?: {
  cookieLocale?: string | null;
}): Locale {
  const matchedCookie = matchSupportedLocale(options?.cookieLocale);

  if (matchedCookie) {
    return matchedCookie;
  }

  return defaultLocale;
}

export async function getLocaleFromParams(
  params: Promise<{ locale: string }>,
): Promise<Locale> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return locale;
}

export function t<T>(locale: Locale, value: Partial<Record<Locale, T>>): T {
  const localized = value[locale];

  if (localized !== undefined) {
    return localized;
  }

  const fallback = value[defaultLocale];

  if (fallback !== undefined) {
    return fallback;
  }

  const firstValue = Object.values(value)[0];

  if (firstValue !== undefined) {
    return firstValue as T;
  }

  throw new Error(`Missing translation for locale "${locale}"`);
}
