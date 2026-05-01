import type { Metadata } from "next";
import { headers } from "next/headers";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";

import { AnalyticsEvents } from "@/components/analytics-events";
import { TawkScript } from "@/components/tawk-script";
import { TrackingScripts } from "@/components/tracking-scripts";
import { defaultLocale, localeRegistry, matchSupportedLocale } from "@/lib/i18n";
import {
  defaultOgImage,
  googleSiteVerification,
  siteDescription,
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

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteName,
  description: siteDescription,
  keywords: [
    "尧顺",
    "尧顺科技",
    "东莞市尧顺科技有限公司",
    "益智玩具厂家",
    "积木拼装玩具厂家",
    "拼插玩具供应商",
    "玩具制造商",
    "玩具OEM ODM",
    "精密注塑",
    "塑料制品定制",
    "环保无毒玩具材料",
    "Yaoshun",
    "Dongguan Yaoshun Technology",
    "Dongguan Yaoshun Technology Co., Ltd.",
    "educational toy manufacturer",
    "interlocking toy manufacturer",
    "building block toy supplier",
    "precision injection molding",
    "custom plastic product manufacturer",
    "eco-friendly toy materials",
    "toy manufacturer",
    "OEM toy manufacturer",
    "ODM toy manufacturer",
  ],
  applicationName: siteName,
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  manifest: "/site.webmanifest",
  icons: {
    icon: "/favicon.svg",
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
    title: siteName,
    description: siteDescription,
    url: siteUrl,
    locale: localeRegistry[defaultLocale].ogLocale,
    images: [
      {
        url: toAbsoluteUrl(defaultOgImage),
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
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
      data-scroll-behavior="smooth"
      lang={htmlLang}
      suppressHydrationWarning
    >
      <head>
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link
          crossOrigin=""
          href="https://fonts.gstatic.com"
          rel="preconnect"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <TawkScript />
        <TrackingScripts />
        <AnalyticsEvents />
        {children}
        <VercelAnalytics />
      </body>
    </html>
  );
}
