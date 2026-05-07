"use client";

import {readCookieConsentStatus} from "@/lib/cookie-consent";

export type CampaignTouch = {
  capturedAt: string;
  landingPage: string;
  params: Record<string, string>;
  path: string;
  referrer: string;
};

export type CampaignAttribution = {
  firstTouch: CampaignTouch;
  lastTouch: CampaignTouch;
};

const firstTouchStorageKey = "yaoshun-campaign-first-touch";
const lastTouchStorageKey = "yaoshun-campaign-last-touch";

const campaignParamKeys = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "gbraid",
  "wbraid",
  "msclkid",
] as const;

function readJson<T>(key: string): T | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : null;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    return;
  }
}

function getCurrentTouch(): CampaignTouch | null {
  if (typeof window === "undefined") {
    return null;
  }

  const url = new URL(window.location.href);
  const params: Record<string, string> = {};

  for (const key of campaignParamKeys) {
    const value = url.searchParams.get(key)?.trim();

    if (value) {
      params[key] = value.slice(0, 240);
    }
  }

  return {
    capturedAt: new Date().toISOString(),
    landingPage: url.href,
    params,
    path: `${url.pathname}${url.search}`,
    referrer: document.referrer || "",
  };
}

function hasCampaignSignal(touch: CampaignTouch) {
  if (Object.keys(touch.params).length > 0) {
    return true;
  }

  if (!touch.referrer) {
    return false;
  }

  try {
    return new URL(touch.referrer).origin !== window.location.origin;
  } catch {
    return true;
  }
}

export function recordCampaignAttribution(): CampaignAttribution | null {
  if (readCookieConsentStatus() !== "granted") {
    return readCampaignAttribution();
  }

  const touch = getCurrentTouch();

  if (!touch) {
    return null;
  }

  const firstTouch = readJson<CampaignTouch>(firstTouchStorageKey);
  const lastTouch = readJson<CampaignTouch>(lastTouchStorageKey);

  if (!firstTouch) {
    writeJson(firstTouchStorageKey, touch);
  }

  if (!lastTouch || hasCampaignSignal(touch)) {
    writeJson(lastTouchStorageKey, touch);
  }

  return readCampaignAttribution();
}

export function readCampaignAttribution(): CampaignAttribution | null {
  const firstTouch = readJson<CampaignTouch>(firstTouchStorageKey);
  const lastTouch = readJson<CampaignTouch>(lastTouchStorageKey);

  if (!firstTouch && !lastTouch) {
    return null;
  }

  return {
    firstTouch: firstTouch || lastTouch!,
    lastTouch: lastTouch || firstTouch!,
  };
}

export function buildCampaignEventParams(
  attribution: CampaignAttribution | null = readCampaignAttribution(),
) {
  const lastTouch = attribution?.lastTouch;
  const firstTouch = attribution?.firstTouch;
  const params = lastTouch?.params || {};

  return {
    landing_page: firstTouch?.path || "",
    referrer: lastTouch?.referrer || "",
    utm_source: params.utm_source || "",
    utm_medium: params.utm_medium || "",
    utm_campaign: params.utm_campaign || "",
    utm_term: params.utm_term || "",
    utm_content: params.utm_content || "",
    gclid_present: Boolean(params.gclid),
    gbraid_present: Boolean(params.gbraid),
    wbraid_present: Boolean(params.wbraid),
    msclkid_present: Boolean(params.msclkid),
  };
}
