import type { MetadataRoute } from "next";

import { products } from "@/content/site/products-catalog";
import {
  getNewsLastModified,
  getProductLastModified,
  getStaticRouteLastModified,
} from "@/lib/content-lastmod";
import { defaultLocale, localeRegistry, locales } from "@/lib/i18n";
import { getNewsList } from "@/lib/site-data";
import { routePathMap, type RouteKey } from "@/lib/routes";
import { siteUrl } from "@/lib/site-config";

const sitemapRouteKeys = [
  "home",
  "about",
  "solutions",
  "products",
  "news",
  "faq",
  "contact",
  "privacy",
  "terms",
] as const satisfies readonly RouteKey[];

function withBase(path: string): string {
  return `${siteUrl}${path}`;
}

function buildAlternates(path: string) {
  return {
    languages: {
      ...Object.fromEntries(
        locales.map((locale) => [
          localeRegistry[locale].htmlLang,
          withBase(`/${locale}${path}`),
        ]),
      ),
      "x-default": withBase(`/${defaultLocale}${path}`),
    },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const routeEntries = sitemapRouteKeys.map((key) => routePathMap[key]);
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of routeEntries) {
      entries.push({
        url: withBase(`/${locale}${route}`),
        lastModified: getStaticRouteLastModified(route),
        alternates: buildAlternates(route),
        changeFrequency: route === "" ? "weekly" : "monthly",
        priority: route === "" ? 1 : 0.8,
      });
    }

    for (const product of products) {
      if (!product.productId) continue;
      const path = `/products/${product.productId}`;
      entries.push({
        url: withBase(`/${locale}${path}`),
        lastModified: getProductLastModified(product.productId),
        alternates: buildAlternates(path),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }

    for (const article of getNewsList()) {
      const path = `/news/${article.slug}`;
      entries.push({
        url: withBase(`/${locale}${path}`),
        lastModified: getNewsLastModified(article.publishedAt),
        alternates: buildAlternates(path),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
