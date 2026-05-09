const rawSiteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.yaoshuntoys.com").trim();

function normalizeSiteUrl(value: string): string {
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;

  return withProtocol.replace(/\/+$/, "");
}

export const siteUrl = normalizeSiteUrl(rawSiteUrl);
export const siteHomeUrl = `${siteUrl}/`;
export const siteName = "Yaoshun Toys";
export const siteLegalName = "Dongguan Yaoshun Technology Co., Ltd.";
export const siteAlternateNames = [
  "yaoshun toys",
  "Yaoshun",
  "尧顺玩具",
  "尧顺",
] as const;
export const siteDescription = "Dongguan Yaoshun Technology Co., Ltd. is a Dongguan source toy factory supporting building toys, custom toys, toy OEM/ODM, custom development, in-house mold development, precision injection molding, assembly, packaging, and export-ready delivery for global B2B buyers.";
export const defaultOgImage = "/site/misc/home-bg.webp";

export const googleAnalyticsId = (process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || "").trim();
export const googleAdsId = (process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "").trim();
export const googleAdsLeadConversionSendTo = (process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_CONVERSION_SEND_TO || "").trim();
export const googleAdsContactConversionSendTo = (process.env.NEXT_PUBLIC_GOOGLE_ADS_CONTACT_CONVERSION_SEND_TO || "").trim();
export const googleAdsLeadConversionCurrency = (process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_CONVERSION_CURRENCY || "CNY").trim() || "CNY";
export const googleAdsLeadConversionValue = Number(process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_CONVERSION_VALUE || "1");
export const googleSiteVerification = (
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
  || process.env.GOOGLE_SITE_VERIFICATION
  || ""
).trim();

export function toAbsoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
}
