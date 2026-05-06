import {consentRequiredCookieName} from '@/lib/privacy-region';

export type CookieConsentStatus = 'granted' | 'denied';

export const cookieConsentStorageKey = 'yaoshun-cookie-consent';
const cookieConsentChangeEventName = 'cookie-consent-change';

export {
  openCookieConsentManager,
  subscribeToCookieConsentManager,
} from '@/lib/cookie-consent-events';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

type GoogleConsentState = {
  ad_personalization: 'granted' | 'denied';
  ad_storage: 'granted' | 'denied';
  ad_user_data: 'granted' | 'denied';
  analytics_storage: 'granted' | 'denied';
};

const grantedGoogleConsentState: GoogleConsentState = {
  ad_personalization: 'granted',
  ad_storage: 'granted',
  ad_user_data: 'granted',
  analytics_storage: 'granted',
};

const deniedGoogleConsentState: GoogleConsentState = {
  ad_personalization: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  analytics_storage: 'denied',
};

export function isCookieConsentStatus(value: unknown): value is CookieConsentStatus {
  return value === 'granted' || value === 'denied';
}

export function getGoogleConsentState(status: CookieConsentStatus): GoogleConsentState {
  return status === 'granted' ? grantedGoogleConsentState : deniedGoogleConsentState;
}

export function readCookieConsentStatus(): CookieConsentStatus | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const value = window.localStorage.getItem(cookieConsentStorageKey);

    if (isCookieConsentStatus(value)) {
      return value;
    }

    return isConsentRequiredRegion() ? null : 'granted';
  } catch {
    return isConsentRequiredRegion() ? null : 'granted';
  }
}

export function applyGoogleConsent(status: CookieConsentStatus) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return;
  }

  window.gtag('consent', 'update', getGoogleConsentState(status));
}

export function persistCookieConsentStatus(status: CookieConsentStatus) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(cookieConsentStorageKey, status);
  } catch {
    return;
  }
}

export function dispatchCookieConsentChange() {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new Event(cookieConsentChangeEventName));
}

export function subscribeToCookieConsent(callback: () => void) {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === cookieConsentStorageKey) {
      callback();
    }
  };
  const handleConsentChange = () => {
    callback();
  };

  window.addEventListener('storage', handleStorage);
  window.addEventListener(cookieConsentChangeEventName, handleConsentChange);

  return () => {
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener(cookieConsentChangeEventName, handleConsentChange);
  };
}

function isConsentRequiredRegion() {
  if (typeof document === 'undefined') {
    return true;
  }

  const flag = readCookieValue(consentRequiredCookieName);

  if (flag === '0') {
    return false;
  }

  if (flag === '1') {
    return true;
  }

  return true;
}

function readCookieValue(name: string): string | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const cookieName = `${name}=`;
  const entries = document.cookie.split(';');

  for (const entry of entries) {
    const trimmed = entry.trim();

    if (trimmed.startsWith(cookieName)) {
      return trimmed.slice(cookieName.length);
    }
  }

  return null;
}
