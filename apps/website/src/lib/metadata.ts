import type { Metadata } from "next";

import { siteSeo, type LocalizedKeywords, type LocalizedText } from "@/content/site";
import {
  defaultLocale,
  localeRegistry,
  locales,
  t,
  type Locale,
} from "@/lib/i18n";
import {
  defaultOgImage,
  siteName,
  siteUrl,
  toAbsoluteUrl,
} from "@/lib/site-config";

type LocalizedSeo = {
  title: LocalizedText;
  description: LocalizedText;
  keywords?: LocalizedKeywords;
};

function normalizePath(path: string): string {
  return path ? `/${path.replace(/^\/+/, "")}` : "";
}

function uniqueKeywords(keywords: string[]): string[] {
  return Array.from(
    new Set(
      keywords
        .map((keyword) => keyword.trim())
        .filter(Boolean),
    ),
  );
}

export function buildMetadata(
  locale: Locale,
  title: string,
  description: string,
  path: string,
  keywords: string[] = [],
): Metadata {
  const normalizedPath = normalizePath(path);
  const localePath = `/${locale}${normalizedPath}`;
  const canonical = `${siteUrl}${localePath}`;
  const mergedKeywords = uniqueKeywords([
    ...t(locale, siteSeo.defaultKeywords),
    ...keywords,
  ]);
  const alternates = Object.fromEntries(
    locales.map((item) => [
      localeRegistry[item].htmlLang,
      `${siteUrl}/${item}${normalizedPath}`,
    ]),
  );

  return {
    title,
    description,
    keywords: mergedKeywords,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical,
      languages: {
        ...alternates,
        "x-default": `${siteUrl}/${defaultLocale}${normalizedPath}`,
      },
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
      title,
      description,
      url: canonical,
      locale: localeRegistry[locale].ogLocale,
      alternateLocale: locales
        .filter((item) => item !== locale)
        .map((item) => localeRegistry[item].ogLocale),
      siteName,
      type: "website",
      images: [
        {
          url: toAbsoluteUrl(defaultOgImage),
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [toAbsoluteUrl(defaultOgImage)],
    },
  };
}

export function buildPageMetadata(
  locale: Locale,
  seo: LocalizedSeo,
  path: string,
  extraKeywords: string[] = [],
): Metadata {
  return buildMetadata(
    locale,
    t(locale, seo.title),
    t(locale, seo.description),
    path,
    [...(seo.keywords ? t(locale, seo.keywords) : []), ...extraKeywords],
  );
}
