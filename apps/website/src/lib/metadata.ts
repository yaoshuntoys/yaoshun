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
import { localizedUrlPath } from "@/lib/routes";
import { cleanSeoKeywords, primarySeoKeyword } from "@/lib/seo-keywords";

type LocalizedSeo = {
  title: LocalizedText;
  description: LocalizedText;
  keywords?: LocalizedKeywords;
};

type MetadataImageOptions = {
  alt?: string;
  height?: number;
  url: string;
  width?: number;
};

type BuildMetadataOptions = {
  image?: MetadataImageOptions;
};

const SEO_TITLE_LIMIT = 65;
const SEO_DESCRIPTION_LIMIT = 160;
const CJK_TITLE_LIMIT = 48;
const CJK_DESCRIPTION_LIMIT = 80;

function normalizePath(path: string): string {
  return path ? `/${path.replace(/^\/+/, "")}` : "";
}

function containsCjk(value: string) {
  return /[\u3400-\u9fff\uf900-\ufaff]/u.test(value);
}

function truncateSeoText(value: string, limit: number) {
  const normalized = value.replace(/\s+/g, " ").trim();
  const characters = Array.from(normalized);

  if (characters.length <= limit) {
    return normalized;
  }

  const hardLimit = characters.slice(0, limit + 1).join("");
  const lastBoundary = Math.max(
    hardLimit.lastIndexOf(" "),
    hardLimit.lastIndexOf(","),
    hardLimit.lastIndexOf(";"),
    hardLimit.lastIndexOf(":"),
    hardLimit.lastIndexOf("，"),
    hardLimit.lastIndexOf("；"),
    hardLimit.lastIndexOf("。"),
  );
  const candidate =
    lastBoundary >= Math.floor(limit * 0.68)
      ? hardLimit.slice(0, lastBoundary)
      : characters.slice(0, limit).join("");

  return candidate.replace(/[\s,;:，；、|\-]+$/u, "").trim();
}

function optimizeSeoTitle(title: string) {
  const normalized = title.replace(/\s+/g, " ").trim();
  const limit = containsCjk(normalized) ? CJK_TITLE_LIMIT : SEO_TITLE_LIMIT;

  if (Array.from(normalized).length <= limit) {
    return normalized;
  }

  const withoutBrandSuffix = normalized.replace(
    /\s*\|\s*yaoshun(?:\s+toys)?\s*$/iu,
    "",
  );

  return truncateSeoText(withoutBrandSuffix, limit);
}

function optimizeSeoDescription(description: string) {
  const normalized = description.replace(/\s+/g, " ").trim();
  const limit = containsCjk(normalized)
    ? CJK_DESCRIPTION_LIMIT
    : SEO_DESCRIPTION_LIMIT;

  return truncateSeoText(normalized, limit);
}

export function buildMetadata(
  locale: Locale,
  title: string,
  description: string,
  path: string,
  keywords: string[] = [],
  options: BuildMetadataOptions = {},
): Metadata {
  const seoTitle = optimizeSeoTitle(title);
  const seoDescription = optimizeSeoDescription(description);
  const normalizedPath = normalizePath(path);
  const localePath = localizedUrlPath(locale, normalizedPath);
  const canonical = `${siteUrl}${localePath}`;
  const mergedKeywords = cleanSeoKeywords(
    [
      primarySeoKeyword,
      ...(keywords.length ? keywords : t(locale, siteSeo.defaultKeywords)),
    ],
  );
  const alternates = Object.fromEntries(
    locales.map((item) => [
      localeRegistry[item].htmlLang,
      `${siteUrl}${localizedUrlPath(item, normalizedPath)}`,
    ]),
  );
  const primaryImage = options.image
    ? {
        url: toAbsoluteUrl(options.image.url),
        width: options.image.width,
        height: options.image.height,
        alt: options.image.alt || seoTitle,
      }
    : {
        url: toAbsoluteUrl(defaultOgImage),
        width: 1200,
        height: 630,
        alt: seoTitle,
      };

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: mergedKeywords,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical,
      languages: {
        ...alternates,
        "x-default": `${siteUrl}${localizedUrlPath(defaultLocale, normalizedPath)}`,
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
      title: seoTitle,
      description: seoDescription,
      url: canonical,
      locale: localeRegistry[locale].ogLocale,
      alternateLocale: locales
        .filter((item) => item !== locale)
        .map((item) => localeRegistry[item].ogLocale),
      siteName,
      type: "website",
      images: [primaryImage],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      images: [primaryImage.url],
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
