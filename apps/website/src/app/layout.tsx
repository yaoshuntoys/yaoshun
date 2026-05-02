import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import { headers } from "next/headers";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { AnalyticsEvents } from "@/components/analytics-events";
import { TawkScript } from "@/components/tawk-script";
import { TrackingScripts } from "@/components/tracking-scripts";
import { homeContent, siteSeo } from "@/content/site";
import {
  defaultLocale,
  localeRegistry,
  locales,
  matchSupportedLocale,
  t,
} from "@/lib/i18n";
import {
  defaultOgImage,
  googleSiteVerification,
  siteName,
  siteUrl,
  toAbsoluteUrl,
} from "@/lib/site-config";

import "./globals.css";
import "../components/marketing.css";
import "./[locale]/home.css";
import "./[locale]/about/about.css";
import "./[locale]/solutions/solutions.css";
import "./[locale]/news/news.css";
import "./[locale]/news/news-article.css";
import "./[locale]/contact/contact.css";
import "./[locale]/faq/faq.css";
import "./[locale]/products/products.css";
import "./[locale]/products/product-detail.css";

const outfit = Outfit({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["500", "600", "700", "800"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  weight: ["400", "500", "600", "700"],
});

const defaultTitle = t(defaultLocale, homeContent.seo.title);
const defaultDescription = t(defaultLocale, homeContent.seo.description);
const languageAlternates = Object.fromEntries(
  locales.map((locale) => [
    localeRegistry[locale].htmlLang,
    `${siteUrl}/${locale}`,
  ]),
);
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
  alternates: {
    canonical: siteUrl,
    languages: {
      ...languageAlternates,
      "x-default": `${siteUrl}/${defaultLocale}`,
    },
  },
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const requestHeaders = await headers();
  const detectedLocale = matchSupportedLocale(
    requestHeaders.get("x-detected-locale"),
  );
  const htmlLang =
    localeRegistry[detectedLocale ?? defaultLocale].htmlLang;

  return (
    <html
      className={`${outfit.variable} ${plusJakartaSans.variable}`}
      data-scroll-behavior="smooth"
      lang={htmlLang}
      suppressHydrationWarning
    >
      <body>
        <TawkScript />
        <TrackingScripts />
        <AnalyticsEvents />
        {children}
        <VercelAnalytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
