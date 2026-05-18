'use client';

import Script from 'next/script';
import {useSyncExternalStore} from 'react';

import {readCookieConsentStatus, subscribeToCookieConsent} from '@/lib/cookie-consent';
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

function buildTrackingBootstrap() {
  const configs = [googleAnalyticsId, googleAdsId].filter(Boolean)
    .map((id) => `gtag('config', '${id}', ${id === googleAnalyticsId ? "{send_page_view: false}" : '{}'});`)
    .join('\n');

  return `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('consent', 'default', {
      ad_personalization: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      analytics_storage: 'denied',
      wait_for_update: 500
    });
    gtag('consent', 'update', {
      ad_personalization: 'granted',
      ad_storage: 'granted',
      ad_user_data: 'granted',
      analytics_storage: 'granted'
    });
    ${configs}
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

  if (consentStatus !== 'granted') {
    return null;
  }

  return (
    <>
      <Script id="google-tracking-bootstrap" strategy="afterInteractive">
        {buildTrackingBootstrap()}
      </Script>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${trackingId}`} strategy="lazyOnload" />
    </>
  );
}
