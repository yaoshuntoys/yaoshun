'use client';

import Script from 'next/script';
import {useSyncExternalStore} from 'react';

import {
  readCookieConsentStatus,
  subscribeToCookieConsent,
  type CookieConsentStatus,
} from '@/lib/cookie-consent';
import {googleTrackingReadyEventName} from '@/lib/analytics';
import {googleAdsId, googleAnalyticsId} from '@/lib/site-config';

function resolveThirdPartyTrackingEnabled() {
  const flag = process.env.NEXT_PUBLIC_ENABLE_THIRD_PARTY_TRACKING?.trim().toLowerCase();

  if (flag === '0' || flag === 'false') {
    return false;
  }

  if (flag === '1' || flag === 'true') {
    return true;
  }

  return true;
}

const enableThirdPartyTracking = resolveThirdPartyTrackingEnabled();

function buildTrackingBootstrap(consentStatus: CookieConsentStatus | null) {
  const configs = [googleAnalyticsId, googleAdsId].filter(Boolean)
    .map((id) => `gtag('config', '${id}', ${id === googleAnalyticsId ? "{send_page_view: false}" : '{}'});`)
    .join('\n');
  const grantedConsentUpdate = consentStatus === 'granted'
    ? `
    gtag('consent', 'update', {
      ad_personalization: 'granted',
      ad_storage: 'granted',
      ad_user_data: 'granted',
      analytics_storage: 'granted'
    });`
    : '';

  return `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    gtag('consent', 'default', {
      ad_personalization: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      analytics_storage: 'denied',
      wait_for_update: 500
    });
    ${grantedConsentUpdate}
    gtag('js', new Date());
    ${configs}
    window.dispatchEvent(new Event('${googleTrackingReadyEventName}'));
  `;
}

export function TrackingScripts() {
  const consentStatus = useSyncExternalStore(
    subscribeToCookieConsent,
    readCookieConsentStatus,
    () => null,
  );

  if (!enableThirdPartyTracking) {
    return null;
  }

  const trackingId = googleAdsId || googleAnalyticsId;

  if (!trackingId) {
    return null;
  }

  return (
    <>
      <Script id="google-tracking-bootstrap" strategy="afterInteractive">
        {buildTrackingBootstrap(consentStatus)}
      </Script>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${trackingId}`} strategy="lazyOnload" />
    </>
  );
}
