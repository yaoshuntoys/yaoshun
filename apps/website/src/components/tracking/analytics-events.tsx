'use client';

import {usePathname} from 'next/navigation';
import {useEffect} from 'react';

import {buildTrackedDatasetParams, trackEvent, trackPageView} from '@/lib/analytics';

export function AnalyticsEvents() {
  const pathname = usePathname();

  useEffect(() => {
    trackPageView(pathname);
  }, [pathname]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-track-event]') : null;

      if (!target?.dataset.trackEvent) {
        return;
      }

      trackEvent(target.dataset.trackEvent, {
        ...buildTrackedDatasetParams(target.dataset),
        page_path: pathname,
      });
    };

    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [pathname]);

  return null;
}
