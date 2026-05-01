import type {MetadataRoute} from 'next';

import {newsArticles} from '@/app/[locale]/news/data';
import {products} from '@/content/site/products-catalog';
import {localeRegistry, locales} from '@/lib/i18n';
import {routePathMap} from '@/lib/routes';
import {siteUrl} from '@/lib/site-config';

function withBase(path: string): string {
  return `${siteUrl}${path}`;
}

function buildAlternates(path: string) {
  return {
    languages: Object.fromEntries(locales.map((locale) => [localeRegistry[locale].htmlLang, withBase(`/${locale}${path}`)]))
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = Object.values(routePathMap);
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of routes) {
      entries.push({
        url: withBase(`/${locale}${route}`),
        lastModified: now,
        alternates: buildAlternates(route),
        changeFrequency: route === '' ? 'weekly' : 'monthly',
        priority: route === '' ? 1 : 0.8
      });
    }

    for (const product of products) {
      if (!product.productId) continue;
      entries.push({
        url: withBase(`/${locale}/products/${product.productId}`),
        lastModified: now,
        alternates: buildAlternates(`/products/${product.productId}`),
        changeFrequency: 'monthly',
        priority: 0.7
      });
    }

    for (const article of newsArticles) {
      entries.push({
        url: withBase(`/${locale}/news/${article.slug}`),
        lastModified: now,
        alternates: buildAlternates(`/news/${article.slug}`),
        changeFrequency: 'monthly',
        priority: 0.7
      });
    }
  }

  return entries;
}
