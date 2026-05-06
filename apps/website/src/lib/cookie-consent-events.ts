"use client";

const cookieConsentManageEventName = "cookie-consent-manage";

export function openCookieConsentManager() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(cookieConsentManageEventName));
}

export function subscribeToCookieConsentManager(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener(cookieConsentManageEventName, callback);

  return () => {
    window.removeEventListener(cookieConsentManageEventName, callback);
  };
}
