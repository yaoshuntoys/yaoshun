'use client';

import {Suspense, useEffect, useState, type ComponentType} from 'react';

type RuntimeComponent = ComponentType<Record<string, never>>;

type LocalRuntimeComponents = {
  AnalyticsEvents: RuntimeComponent;
  CookieConsentManager: RuntimeComponent;
};

type ThirdPartyRuntimeComponents = {
  SpeedInsights: RuntimeComponent;
  TawkScript: RuntimeComponent;
  TrackingScripts: RuntimeComponent;
  VercelAnalytics: RuntimeComponent;
};

function scheduleIdle(callback: () => void, timeout: number) {
  let done = false;
  const run = () => {
    if (done) {
      return;
    }

    done = true;
    callback();
  };
  const timerId = window.setTimeout(run, timeout);
  const idleId =
    typeof window.requestIdleCallback === 'function'
      ? window.requestIdleCallback(run, {timeout})
      : undefined;

  return () => {
    done = true;
    window.clearTimeout(timerId);

    if (idleId !== undefined && typeof window.cancelIdleCallback === 'function') {
      window.cancelIdleCallback(idleId);
    }
  };
}

export function ClientRuntime() {
  const [localRuntime, setLocalRuntime] =
    useState<LocalRuntimeComponents | null>(null);
  const [thirdPartyRuntime, setThirdPartyRuntime] =
    useState<ThirdPartyRuntimeComponents | null>(null);

  useEffect(() => {
    let active = true;
    const cleanup = scheduleIdle(() => {
      void Promise.all([
        import('@/components/tracking/analytics-events'),
        import('@/components/tracking/cookie-consent-manager'),
      ]).then(([analytics, cookieConsent]) => {
        if (!active) {
          return;
        }

        setLocalRuntime({
          AnalyticsEvents: analytics.AnalyticsEvents as RuntimeComponent,
          CookieConsentManager: cookieConsent.CookieConsentManager as RuntimeComponent,
        });
      });
    }, 1200);

    return () => {
      active = false;
      cleanup();
    };
  }, []);

  useEffect(() => {
    let active = true;
    const cleanup = scheduleIdle(() => {
      void Promise.all([
        import('@/components/tracking/tracking-scripts'),
        import('@/components/tracking/tawk-script'),
        import('@vercel/analytics/next'),
        import('@vercel/speed-insights/next'),
      ]).then(([tracking, tawk, analytics, speedInsights]) => {
        if (!active) {
          return;
        }

        setThirdPartyRuntime({
          SpeedInsights: speedInsights.SpeedInsights as RuntimeComponent,
          TawkScript: tawk.TawkScript as RuntimeComponent,
          TrackingScripts: tracking.TrackingScripts as RuntimeComponent,
          VercelAnalytics: analytics.Analytics as RuntimeComponent,
        });
      });
    }, 3500);

    return () => {
      active = false;
      cleanup();
    };
  }, []);

  const AnalyticsEvents = localRuntime?.AnalyticsEvents;
  const CookieConsentManager = localRuntime?.CookieConsentManager;
  const SpeedInsights = thirdPartyRuntime?.SpeedInsights;
  const TawkScript = thirdPartyRuntime?.TawkScript;
  const TrackingScripts = thirdPartyRuntime?.TrackingScripts;
  const VercelAnalytics = thirdPartyRuntime?.VercelAnalytics;

  return (
    <>
      {AnalyticsEvents && CookieConsentManager ? (
        <>
          <Suspense fallback={null}>
            <AnalyticsEvents />
          </Suspense>
          <CookieConsentManager />
        </>
      ) : null}
      {SpeedInsights && TawkScript && TrackingScripts && VercelAnalytics ? (
        <>
          <TrackingScripts />
          <TawkScript />
          <VercelAnalytics />
          <SpeedInsights />
        </>
      ) : null}
    </>
  );
}
