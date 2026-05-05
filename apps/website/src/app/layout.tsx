import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Suspense } from "react";

import { AnalyticsEvents } from "@/components/tracking/analytics-events";
import { CookieConsentManager } from "@/components/tracking/cookie-consent-manager";
import { TawkScript } from "@/components/tracking/tawk-script";
import { TrackingScripts } from "@/components/tracking/tracking-scripts";
import { homeContent, siteSeo } from "@/content/site";
import {
  defaultLocale,
  localeRegistry,
  locales,
  t,
} from "@/lib/i18n";
import {
  defaultOgImage,
  googleSiteVerification,
  siteName,
  siteUrl,
  toAbsoluteUrl,
} from "@/lib/site-config";

import "../styles/globals.css";
import "../styles/marketing.css";
import "../styles/page-shared.css";

const outfit = Outfit({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["500", "600", "700", "800"],
});

const defaultTitle = t(defaultLocale, homeContent.seo.title);
const defaultDescription = t(defaultLocale, homeContent.seo.description);
const defaultKeywords = Array.from(
  new Set(locales.flatMap((locale) => t(locale, siteSeo.defaultKeywords))),
);

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: defaultTitle,
  description: defaultDescription,
  keywords: defaultKeywords,
  applicationName: siteName,
  authors: [{ name: siteName }],
  category: "manufacturing",
  creator: siteName,
  formatDetection: {
    address: false,
    email: false,
    telephone: false,
  },
  publisher: siteName,
  referrer: "origin-when-cross-origin",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      {
        url: "/favicon-rounded.png",
        type: "image/png",
        sizes: "64x64",
      },
    ],
    shortcut: "/favicon-rounded.png",
    apple: [
      {
        url: "/favicon-rounded-192.png",
        type: "image/png",
        sizes: "192x192",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName,
    title: defaultTitle,
    description: defaultDescription,
    url: siteUrl,
    locale: localeRegistry[defaultLocale].ogLocale,
    alternateLocale: locales
      .filter((locale) => locale !== defaultLocale)
      .map((locale) => localeRegistry[locale].ogLocale),
    images: [
      {
        url: toAbsoluteUrl(defaultOgImage),
        width: 1200,
        height: 630,
        alt: defaultTitle,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: [toAbsoluteUrl(defaultOgImage)],
  },
  verification: {
    google: googleSiteVerification || undefined,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      className={outfit.variable}
      data-scroll-behavior="smooth"
      lang={localeRegistry[defaultLocale].htmlLang}
      suppressHydrationWarning
    >
      <body>
        <TawkScript />
        <TrackingScripts />
        <Suspense fallback={null}>
          <AnalyticsEvents />
        </Suspense>
        {children}
        <CookieConsentManager />
        <VercelAnalytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
