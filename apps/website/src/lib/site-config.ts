const rawSiteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").trim();
export const siteUrl = rawSiteUrl.replace(/\/+$/, "");
export const siteName = "Dongguan Yaoshun Technology Co., Ltd. | yaoshun toys";
export const siteDescription = "Dongguan Yaoshun Technology Co., Ltd. is a Dongguan source toy factory supporting building toys, custom toys, toy OEM/ODM, custom development, in-house mold development, precision injection molding, assembly, packaging, and export-ready delivery for global B2B buyers.";
export const defaultOgImage = "/site/misc/home-bg.webp";

export const googleAnalyticsId = (process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || "").trim();
export const googleAdsId = (process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "").trim();
export const googleAdsLeadConversionSendTo = (process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_CONVERSION_SEND_TO || "").trim();
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
