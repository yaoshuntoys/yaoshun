import "server-only";

import { statSync } from "node:fs";
import path from "node:path";

import { newsSourcePathBySlug } from "@/content/pages/news";
import { productSourcePathById } from "@/content/site/products-catalog";

const ROOT = process.cwd();
const FALLBACK_DATE = new Date("2026-01-01T00:00:00.000Z");
const NEWS_CONTENT_PATH = "apps/website/src/content/pages/news.ts";

const staticRouteSourcePaths: Record<string, string[]> = {
  "": [
    "apps/website/src/app/[locale]/page.tsx",
    "apps/website/src/content/site/home.ts",
    "apps/website/src/content/pages/home.ts",
    "apps/website/src/content/site/shared.ts",
  ],
  "/about": [
    "apps/website/src/app/[locale]/about/page.tsx",
    "apps/website/src/content/site/about.ts",
    "apps/website/src/content/pages/about.ts",
    "apps/website/src/content/site/shared.ts",
  ],
  "/solutions": [
    "apps/website/src/app/[locale]/solutions/page.tsx",
    "apps/website/src/content/site/solutions.ts",
    "apps/website/src/content/pages/solutions.ts",
    "apps/website/src/content/site/shared.ts",
  ],
  "/products": [
    "apps/website/src/app/[locale]/products/page.tsx",
    "apps/website/src/content/site/products.ts",
    "apps/website/src/content/pages/products.ts",
    "apps/website/src/content/site/products-catalog.ts",
    "apps/website/src/content/site/shared.ts",
  ],
  "/news": [
    "apps/website/src/app/[locale]/news/page.tsx",
    "apps/website/src/content/site/news.ts",
    NEWS_CONTENT_PATH,
    "apps/website/src/content/site/shared.ts",
  ],
  "/faq": [
    "apps/website/src/app/[locale]/faq/page.tsx",
    "apps/website/src/content/site/faq.ts",
    "apps/website/src/content/pages/faq.ts",
    "apps/website/src/content/site/shared.ts",
  ],
  "/contact": [
    "apps/website/src/app/[locale]/contact/page.tsx",
    "apps/website/src/content/site/contact.ts",
    "apps/website/src/content/pages/contact.ts",
    "apps/website/src/content/site/shared.ts",
  ],
  "/privacy": [
    "apps/website/src/app/[locale]/privacy/page.tsx",
    "apps/website/src/content/site/privacy.ts",
    "apps/website/src/components/sections/legal-document-page.tsx",
  ],
  "/refund-return": [
    "apps/website/src/app/[locale]/refund-return/page.tsx",
    "apps/website/src/content/site/refund-return.ts",
    "apps/website/src/components/sections/legal-document-page.tsx",
  ],
  "/terms": [
    "apps/website/src/app/[locale]/terms/page.tsx",
    "apps/website/src/content/site/terms.ts",
    "apps/website/src/components/sections/legal-document-page.tsx",
  ],
};

function getFileLastModified(relativePath: string): Date | undefined {
  try {
    return statSync(path.join(ROOT, relativePath)).mtime;
  } catch {
    return undefined;
  }
}

function getLatestDate(dates: Array<Date | undefined>): Date {
  const timestamps = dates
    .map((value) => value?.getTime())
    .filter((value): value is number => Number.isFinite(value));

  if (timestamps.length === 0) {
    return FALLBACK_DATE;
  }

  return new Date(Math.max(...timestamps));
}

export function getStaticRouteLastModified(route: string): Date {
  const sourcePaths = [
    ...(staticRouteSourcePaths[route] || []),
    ...(route === "/news" ? Array.from(newsSourcePathBySlug.values()) : []),
  ];
  return getLatestDate(sourcePaths.map(getFileLastModified));
}

export function getProductLastModified(productId: string): Date {
  const sourcePath = productSourcePathById.get(productId);
  return getLatestDate([
    sourcePath ? getFileLastModified(sourcePath) : undefined,
    getFileLastModified("apps/website/src/app/[locale]/products/[slug]/page.tsx"),
    getFileLastModified("apps/website/src/content/site/products-catalog.ts"),
  ]);
}

export function getNewsLastModified(slug: string, publishedAt: string): Date {
  const publishedDate = new Date(`${publishedAt}T00:00:00.000Z`);
  const sourcePath = newsSourcePathBySlug.get(slug);

  return getLatestDate([
    publishedDate,
    sourcePath ? getFileLastModified(sourcePath) : undefined,
    getFileLastModified(NEWS_CONTENT_PATH),
    getFileLastModified("apps/website/src/app/[locale]/news/[slug]/page.tsx"),
  ]);
}
