import { NextResponse, type NextRequest } from "next/server";

import {
  getLocaleFromPathname,
  localeCookieName,
  resolvePreferredLocale,
} from "@/lib/i18n";
import {
  consentRequiredCookieName,
  isConsentRequiredCountry,
} from "@/lib/privacy-region";

const oneYearInSeconds = 60 * 60 * 24 * 365;
const thirtyDaysInSeconds = 60 * 60 * 24 * 30;

function resolveCountryCode(request: NextRequest): string | null {
  return (
    request.headers.get("x-vercel-ip-country") ??
    request.headers.get("cf-ipcountry") ??
    request.headers.get("x-country-code")
  );
}

function isPrefetchRequest(request: NextRequest) {
  return (
    request.headers.get("next-router-prefetch") === "1" ||
    request.headers.get("purpose") === "prefetch" ||
    request.headers.get("sec-purpose")?.includes("prefetch")
  );
}

function applyContextCookies(
  response: NextResponse,
  request: NextRequest,
  locale: string,
  consentRequired: boolean,
) {
  if (isPrefetchRequest(request)) {
    return;
  }

  const consentRequiredValue = consentRequired ? "1" : "0";

  if (request.cookies.get(localeCookieName)?.value !== locale) {
    response.cookies.set(localeCookieName, locale, {
      path: "/",
      maxAge: oneYearInSeconds,
    });
  }

  if (request.cookies.get(consentRequiredCookieName)?.value !== consentRequiredValue) {
    response.cookies.set(consentRequiredCookieName, consentRequiredValue, {
      path: "/",
      maxAge: thirtyDaysInSeconds,
    });
  }
}

function getPreferredLocale(request: NextRequest) {
  return resolvePreferredLocale({
    cookieLocale: request.cookies.get(localeCookieName)?.value,
  });
}

function redirectToLocalizedPath(
  request: NextRequest,
  locale: string,
  consentRequired: boolean,
) {
  const url = request.nextUrl.clone();
  url.pathname =
    request.nextUrl.pathname === "/"
      ? `/${locale}`
      : `/${locale}${request.nextUrl.pathname}`;

  const response = NextResponse.redirect(url);
  applyContextCookies(response, request, locale, consentRequired);
  return response;
}

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/sitemap" || request.nextUrl.pathname === "/sitemap/") {
    const url = request.nextUrl.clone();
    url.pathname = "/sitemap.xml";
    return NextResponse.redirect(url, 308);
  }

  const localeInPath = getLocaleFromPathname(request.nextUrl.pathname);
  const consentRequired = isConsentRequiredCountry(resolveCountryCode(request));

  if (localeInPath) {
    const response = NextResponse.next();
    applyContextCookies(response, request, localeInPath, consentRequired);
    return response;
  }

  return redirectToLocalizedPath(
    request,
    getPreferredLocale(request),
    consentRequired,
  );
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
