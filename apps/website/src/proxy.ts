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

function applyContextCookies(
  response: NextResponse,
  locale: string,
  consentRequired: boolean,
) {
  response.cookies.set(localeCookieName, locale, {
    path: "/",
    maxAge: oneYearInSeconds,
  });
  response.cookies.set(consentRequiredCookieName, consentRequired ? "1" : "0", {
    path: "/",
    maxAge: thirtyDaysInSeconds,
  });
}

function getPreferredLocale(request: NextRequest) {
  return resolvePreferredLocale({
    acceptLanguage: request.headers.get("accept-language"),
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
  response.headers.append("Vary", "Accept-Language");
  applyContextCookies(response, locale, consentRequired);
  return response;
}

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/sitemap" || request.nextUrl.pathname === "/sitemap/") {
    const url = request.nextUrl.clone();
    url.pathname = "/sitemap.xml";
    return NextResponse.redirect(url, 308);
  }

  const localeInPath = getLocaleFromPathname(request.nextUrl.pathname);
  const requestHeaders = new Headers(request.headers);
  const consentRequired = isConsentRequiredCountry(resolveCountryCode(request));

  if (localeInPath) {
    requestHeaders.set("x-detected-locale", localeInPath);
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
    applyContextCookies(response, localeInPath, consentRequired);
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
