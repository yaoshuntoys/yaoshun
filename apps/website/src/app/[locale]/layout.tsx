import type {Metadata, Viewport} from "next";
import {Outfit} from "next/font/google";

import {SiteShell} from "@/components/layout/site-shell";
import {ImageLightbox} from "@/components/media/image-lightbox";
import {SiteStructuredData} from "@/components/seo/structured-data";
import {ClientRuntime} from "@/components/tracking/client-runtime";
import {TawkScript} from "@/components/tracking/tawk-script";
import {getLocaleFromParams, localeRegistry, locales} from "@/lib/i18n";
import {
  googleSiteVerification,
  siteName,
  siteUrl,
} from "@/lib/site-config";

import "@/styles/globals.css";
import "@/styles/marketing.css";
import "@/styles/page-shared.css";

const outfit = Outfit({
  display: "swap",
  preload: false,
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Page Not Found | Yaoshun Toys",
  applicationName: siteName,
  authors: [{name: siteName}],
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

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const locale = await getLocaleFromParams(params);

  return (
    <html
      className={outfit.variable}
      data-scroll-behavior="smooth"
      lang={localeRegistry[locale].htmlLang}
      suppressHydrationWarning
    >
      <body>
        <SiteStructuredData locale={locale} />
        <SiteShell locale={locale}>{children}</SiteShell>
        <ImageLightbox />
        <TawkScript />
        <ClientRuntime />
      </body>
    </html>
  );
}
