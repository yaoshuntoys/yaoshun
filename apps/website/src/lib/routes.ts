import { getLocalePattern, type Locale } from "@/lib/i18n";

export const routePathMap = {
  home: "",
  about: "/about",
  solutions: "/solutions",
  oemOdm: "/oem-odm",
  products: "/products",
  news: "/news",
  factory: "/factory",
  compliance: "/compliance",
  faq: "/faq",
  contact: "/contact",
  privacy: "/privacy",
  terms: "/terms",
} as const;

export type RouteKey = keyof typeof routePathMap;

export function localizedPath(locale: Locale, route: RouteKey): string {
  return `/${locale}${routePathMap[route]}`;
}

export function contactFormPath(locale: Locale): string {
  return `${localizedPath(locale, "contact")}#contact-message`;
}

export function productPath(locale: Locale, slug: string): string {
  return `/${locale}/products/${slug}`;
}

export function replaceLocaleInPath(pathname: string, locale: Locale): string {
  const pattern = getLocalePattern();

  if (pattern.test(pathname)) {
    return pathname.replace(pattern, `/${locale}`);
  }

  return `/${locale}${pathname === "/" ? "" : pathname}`;
}
