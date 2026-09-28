'use client';

import {usePathname, useSearchParams} from 'next/navigation';
import {useEffect} from 'react';

import {
  buildTrackedDatasetParams,
  googleTrackingReadyEventName,
  trackEvent,
  trackPageView,
} from '@/lib/analytics';
import {buildCampaignEventParams, recordCampaignAttribution} from '@/lib/campaign-attribution';

export function AnalyticsEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const currentPath = search ? `${pathname}?${search}` : pathname;

  useEffect(() => {
    const attribution = recordCampaignAttribution();
    let pageViewSent = false;
    const sendPageView = () => {
      if (pageViewSent || typeof window.gtag !== 'function') {
        return;
      }

      pageViewSent = true;
      trackPageView(currentPath, undefined, buildCampaignEventParams(attribution));
    };

    sendPageView();
    window.addEventListener(googleTrackingReadyEventName, sendPageView);

    return () => {
      window.removeEventListener(googleTrackingReadyEventName, sendPageView);
    };
  }, [currentPath]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-track-event]') : null;

      if (!target?.dataset.trackEvent) {
        return;
      }

      const eventName = target.dataset.trackEvent;
      const eventParams = {
        ...buildTrackedDatasetParams(target.dataset),
        ...buildCampaignEventParams(),
        page_path: currentPath,
      };

      trackEvent(eventName, eventParams);

      if (eventName === 'contact_click') {
        void import('@/lib/analytics')
          .then(({reportGoogleAdsContactConversion}) => {
            reportGoogleAdsContactConversion();
          })
          .catch(() => undefined);
      }
    };

    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [currentPath]);

  return null;
}
