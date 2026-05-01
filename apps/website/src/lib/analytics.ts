'use client';

import {googleAdsLeadConversionSendTo} from '@/lib/site-config';
import {readCookieConsentStatus} from '@/lib/cookie-consent';
import {getLocaleFromPathname} from '@/lib/i18n';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

type AnalyticsValue = string | number | boolean;
type AnalyticsParams = Record<string, AnalyticsValue>;

function normalizeDatasetKey(key: string): string {
  return key
    .replace(/^track/, '')
    .replace(/^[A-Z]/, (match) => match.toLowerCase())
    .replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);
}

function parseDatasetValue(value: string): AnalyticsValue {
  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  if (/^-?\d+(\.\d+)?$/.test(value)) {
    return Number(value);
  }

  return value;
}

export function trackEvent(eventName: string, params: AnalyticsParams = {}) {
  if (
    typeof window === 'undefined'
    || typeof window.gtag !== 'function'
    || readCookieConsentStatus() !== 'granted'
  ) {
    return;
  }

  window.gtag('event', eventName, params);
}

export function trackPageView(pathname: string, title?: string) {
  if (typeof window === 'undefined') {
    return;
  }

  const locale = getLocaleFromPathname(pathname);

  trackEvent('page_view', {
    page_path: pathname,
    page_location: window.location.href,
    page_title: title ?? document.title,
    locale: locale ?? 'unknown',
  });
}

type GoogleAdsConversionOptions = {
  currency?: string;
  url?: string;
  value?: number;
};

export function reportGoogleAdsLeadConversion(options: GoogleAdsConversionOptions = {}) {
  if (
    typeof window === 'undefined'
    || typeof window.gtag !== 'function'
    || !googleAdsLeadConversionSendTo
    || readCookieConsentStatus() !== 'granted'
  ) {
    return true;
  }

  const {currency = 'CNY', url, value = 1} = options;
  const callback = () => {
    if (url) {
      window.location.href = url;
    }
  };

  window.gtag('event', 'conversion', {
    send_to: googleAdsLeadConversionSendTo,
    value,
    currency,
    event_callback: callback,
  });

  return false;
}

export function buildTrackedDatasetParams(dataset: DOMStringMap): AnalyticsParams {
  const params: AnalyticsParams = {};

  for (const [key, value] of Object.entries(dataset)) {
    if (!value || key === 'trackEvent') {
      continue;
    }

    if (!key.startsWith('track')) {
      continue;
    }

    params[normalizeDatasetKey(key)] = parseDatasetValue(value);
  }

  return params;
}
