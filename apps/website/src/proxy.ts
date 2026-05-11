import { NextResponse, type NextRequest } from "next/server";

import {
  defaultLocale,
  getLocaleFromPathname,
  localeCookieName,
  localePathPrefix,
} from "@/lib/i18n";
import {
  consentRequiredCookieName,
  isConsentRequiredCountry,
} from "@/lib/privacy-region";

const oneYearInSeconds = 60 * 60 * 24 * 365;
const thirtyDaysInSeconds = 60 * 60 * 24 * 30;
const internalLocaleRewriteHeader = "x-yaoshun-internal-locale-rewrite";

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

function rewriteDefaultLocalePath(
  request: NextRequest,
  consentRequired: boolean,
) {
  const url = request.nextUrl.clone();
  url.pathname =
    request.nextUrl.pathname === "/"
      ? `/${defaultLocale}`
      : `/${defaultLocale}${request.nextUrl.pathname}`;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(internalLocaleRewriteHeader, "1");

  const response = NextResponse.rewrite(url, {
    request: {
      headers: requestHeaders,
    },
  });
  applyContextCookies(response, request, defaultLocale, consentRequired);
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
    const isInternalLocaleRewrite =
      request.headers.get(internalLocaleRewriteHeader) === "1";

    if (
      localeInPath === defaultLocale &&
      localePathPrefix(defaultLocale) === "" &&
      !isInternalLocaleRewrite
    ) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const response = NextResponse.next();
    applyContextCookies(response, request, localeInPath, consentRequired);
    return response;
  }

  return rewriteDefaultLocalePath(request, consentRequired);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
