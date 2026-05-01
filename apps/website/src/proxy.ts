import {NextResponse, type NextRequest} from 'next/server';

import {defaultLocale, getLocaleFromPathname, localeCookieName} from '@/lib/i18n';
import {consentRequiredCookieName, isConsentRequiredCountry} from '@/lib/privacy-region';

const oneYearInSeconds = 60 * 60 * 24 * 365;
const thirtyDaysInSeconds = 60 * 60 * 24 * 30;

function resolveCountryCode(request: NextRequest): string | null {
  return request.headers.get('x-vercel-ip-country')
    ?? request.headers.get('cf-ipcountry')
    ?? request.headers.get('x-country-code');
}

function applyContextCookies(
  response: NextResponse,
  locale: string,
  consentRequired: boolean
) {
  response.cookies.set(localeCookieName, locale, {
    path: '/',
    maxAge: oneYearInSeconds
  });
  response.cookies.set(consentRequiredCookieName, consentRequired ? '1' : '0', {
    path: '/',
    maxAge: thirtyDaysInSeconds
  });
}

export function proxy(request: NextRequest) {
  const localeInPath = getLocaleFromPathname(request.nextUrl.pathname);
  const requestHeaders = new Headers(request.headers);
  const consentRequired = isConsentRequiredCountry(resolveCountryCode(request));

  if (localeInPath) {
    requestHeaders.set('x-detected-locale', localeInPath);
    const response = NextResponse.next({
      request: {
        headers: requestHeaders
      }
    });
    applyContextCookies(response, localeInPath, consentRequired);
    return response;
  }

  if (request.nextUrl.pathname === '/') {
    requestHeaders.set('x-detected-locale', defaultLocale);
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}`;
    const response = NextResponse.redirect(url);
    applyContextCookies(response, defaultLocale, consentRequired);
    return response;
  }

  if (request.nextUrl.pathname === '') {
    requestHeaders.set('x-detected-locale', defaultLocale);
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}`;
    const response = NextResponse.redirect(url);
    applyContextCookies(response, defaultLocale, consentRequired);
    return response;
  }

  requestHeaders.set('x-detected-locale', defaultLocale);
  const response = NextResponse.next({
    request: {
      headers: requestHeaders
    }
  });
  response.cookies.set(consentRequiredCookieName, consentRequired ? '1' : '0', {
    path: '/',
    maxAge: thirtyDaysInSeconds
  });
  return response;
}

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)']
};
