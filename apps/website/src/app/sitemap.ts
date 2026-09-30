import type { MetadataRoute } from "next";

import { products } from "@/content/site/products-catalog";
import {
  getNewsLastModified,
  getProductLastModified,
  getStaticRouteLastModified,
} from "@/lib/content-lastmod";
import { defaultLocale, localeRegistry, locales } from "@/lib/i18n";
import { getNewsList } from "@/lib/site-data";
import { localizedUrlPath, routePathMap, type RouteKey } from "@/lib/routes";
import { siteUrl, toAbsoluteUrl } from "@/lib/site-config";

const sitemapRouteKeys = [
  "home",
  "about",
  "solutions",
  "products",
  "news",
  "faq",
  "contact",
  "privacy",
  "refundReturn",
  "terms",
] as const satisfies readonly RouteKey[];

function withBase(path: string): string {
  if (path === "/") return siteUrl;

  return `${siteUrl}${path}`;
}

function buildAlternates(path: string) {
  return {
    languages: {
      ...Object.fromEntries(
        locales.map((locale) => [
          localeRegistry[locale].htmlLang,
          withBase(localizedUrlPath(locale, path)),
        ]),
      ),
      "x-default": withBase(localizedUrlPath(defaultLocale, path)),
    },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const routeEntries = sitemapRouteKeys.map((key) => routePathMap[key]);
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of routeEntries) {
      entries.push({
        url: withBase(localizedUrlPath(locale, route)),
        lastModified: getStaticRouteLastModified(route),
        alternates: buildAlternates(route),
      });
    }

    for (const product of products) {
      if (!product.productId) continue;
      const path = `/products/${product.productId}`;
      entries.push({
        url: withBase(localizedUrlPath(locale, path)),
        lastModified: getProductLastModified(product.productId),
        alternates: buildAlternates(path),
        images: product.images?.slice(0, 4).map((image) => toAbsoluteUrl(image)),
      });
    }

    for (const article of getNewsList()) {
      const path = `/news/${article.slug}`;
      entries.push({
        url: withBase(localizedUrlPath(locale, path)),
        lastModified: getNewsLastModified(article.slug, article.publishedAt),
        alternates: buildAlternates(path),
        images: article.image ? [toAbsoluteUrl(article.image)] : undefined,
      });
    }
  }

  return entries;
}
