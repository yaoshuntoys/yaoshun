import Script from 'next/script';

import {cookieConsentStorageKey} from '@/lib/cookie-consent';
import {consentRequiredCookieName} from '@/lib/privacy-region';
import {googleAdsId, googleAnalyticsId} from '@/lib/site-config';

const enableThirdPartyTracking = (
  process.env.NODE_ENV === 'production'
  || process.env.NEXT_PUBLIC_ENABLE_THIRD_PARTY_TRACKING === '1'
);

function buildTrackingBootstrap() {
  const configs = [googleAnalyticsId, googleAdsId].filter(Boolean)
    .map((id) => `gtag('config', '${id}', ${id === googleAnalyticsId ? "{send_page_view: false}" : '{}'});`)
    .join('\n');

  return `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    gtag('js', new Date());
    var consentRequired = true;
    try {
      var consentCookieName = '${consentRequiredCookieName}=';
      var cookieItems = document.cookie.split(';');
      for (var index = 0; index < cookieItems.length; index += 1) {
        var cookie = cookieItems[index].trim();
        if (cookie.indexOf(consentCookieName) === 0) {
          consentRequired = cookie.slice(consentCookieName.length) !== '0';
          break;
        }
      }
    } catch (error) {}
    gtag('consent', 'default', consentRequired ? {
      ad_personalization: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      analytics_storage: 'denied',
      wait_for_update: 500
    } : {
      ad_personalization: 'granted',
      ad_storage: 'granted',
      ad_user_data: 'granted',
      analytics_storage: 'granted',
      wait_for_update: 500
    });
    try {
      var cookieConsentStatus = window.localStorage.getItem('${cookieConsentStorageKey}');
      if (cookieConsentStatus === 'granted') {
        gtag('consent', 'update', {
          ad_personalization: 'granted',
          ad_storage: 'granted',
          ad_user_data: 'granted',
          analytics_storage: 'granted'
        });
      } else if (cookieConsentStatus === 'denied') {
        gtag('consent', 'update', {
          ad_personalization: 'denied',
          ad_storage: 'denied',
          ad_user_data: 'denied',
          analytics_storage: 'denied'
        });
      }
    } catch (error) {}
    ${configs}
  `;
}

export function TrackingScripts() {
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
        {buildTrackingBootstrap()}
      </Script>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${trackingId}`} strategy="lazyOnload" />
    </>
  );
}
