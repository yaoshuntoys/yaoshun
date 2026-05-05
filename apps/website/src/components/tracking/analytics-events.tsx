'use client';

import {usePathname, useSearchParams} from 'next/navigation';
import {useEffect} from 'react';

import {buildTrackedDatasetParams, trackEvent, trackPageView} from '@/lib/analytics';

export function AnalyticsEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const currentPath = search ? `${pathname}?${search}` : pathname;

  useEffect(() => {
    trackPageView(currentPath);
  }, [currentPath]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-track-event]') : null;

      if (!target?.dataset.trackEvent) {
        return;
      }

      trackEvent(target.dataset.trackEvent, {
        ...buildTrackedDatasetParams(target.dataset),
        page_path: currentPath,
      });
    };

    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [currentPath]);

  return null;
}
