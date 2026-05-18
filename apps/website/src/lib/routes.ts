import {
  defaultLocale,
  getLocalePattern,
  localePathPrefix,
  type Locale,
} from "@/lib/i18n";

export const routePathMap = {
  home: "",
  about: "/about",
  solutions: "/solutions",
  products: "/products",
  news: "/news",
  faq: "/faq",
  contact: "/contact",
  privacy: "/privacy",
  refundReturn: "/refund-return",
  terms: "/terms",
} as const;

export type RouteKey = keyof typeof routePathMap;

export function localizedUrlPath(locale: Locale, path = ""): string {
  const normalizedPath = path ? `/${path.replace(/^\/+/, "")}` : "";
  const urlPath = `${localePathPrefix(locale)}${normalizedPath}`;

  return urlPath || "/";
}

export function localizedPath(locale: Locale, route: RouteKey): string {
  return localizedUrlPath(locale, routePathMap[route]);
}

export function contactFormPath(locale: Locale): string {
  return `${localizedPath(locale, "contact")}#contact-message`;
}

export function productPath(locale: Locale, slug: string): string {
  return localizedUrlPath(locale, `/products/${slug}`);
}

export function replaceLocaleInPath(pathname: string, locale: Locale): string {
  const pattern = getLocalePattern();

  if (pattern.test(pathname)) {
    const nextPathname = pathname.replace(pattern, localePathPrefix(locale));

    return nextPathname || "/";
  }

  if (locale === defaultLocale) {
    return pathname || "/";
  }

  return `${localePathPrefix(locale)}${pathname === "/" ? "" : pathname}`;
}
