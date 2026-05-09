import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";

import { ImageLightbox } from "@/components/media/image-lightbox";
import { ClientRuntime } from "@/components/tracking/client-runtime";
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
});

const defaultTitle = t(defaultLocale, homeContent.seo.title);
const defaultDescription = t(defaultLocale, homeContent.seo.description);
const defaultKeywords = Array.from(
  new Set(locales.flatMap((locale) => t(locale, siteSeo.defaultKeywords))),
);
const defaultAlternates = Object.fromEntries(
  locales.map((locale) => [
    localeRegistry[locale].htmlLang,
    `${siteUrl}/${locale}`,
  ]),
);

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: defaultTitle,
  description: defaultDescription,
  keywords: defaultKeywords,
  alternates: {
    canonical: `${siteUrl}/${defaultLocale}`,
    languages: {
      ...defaultAlternates,
      "x-default": `${siteUrl}/${defaultLocale}`,
    },
  },
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
  classification: "B2B toy manufacturing, toy OEM/ODM, custom toy development",
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
  other: {
    "geo.region": "CN-GD",
    "geo.placename": "Dongguan",
    "business:contact_data:country_name": "China",
    "business:contact_data:region": "Guangdong",
    "business:contact_data:locality": "Dongguan",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
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
        {children}
        <ImageLightbox />
        <ClientRuntime />
      </body>
    </html>
  );
}
