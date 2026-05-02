const rawSiteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").trim();
export const siteUrl = rawSiteUrl.replace(/\/+$/, "");
export const siteName = "yaoshun toys | Dongguan Yaoshun Technology Co., Ltd.";
export const siteDescription = "yaoshun toys is the international website of Dongguan Yaoshun Technology Co., Ltd., focused on educational toys, AI toy plastic electronics, interlocking building toys, custom plastic products, in-house mold development, precision injection, extrusion, eco-safe materials, and global OEM/ODM delivery support.";
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
