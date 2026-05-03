import {newsArticles} from "@/content/pages/news";
import {type NewsArticleSeed, type ShowcaseProductSeed} from "@/content/types";
import {
  products,
  type ProductJson,
} from "@/content/site/products-catalog";
import {t, type Locale} from "@/lib/i18n";

export type ShowcaseCatalogItem = ShowcaseProductSeed & {
  product: ProductJson;
  images: string[];
};

const curatedHomeFeaturedProductIds = [
  "1601110728943",
  "1601728749802",
  "1601316583146",
  "1601730326005",
] as const;

const curatedProductsFeaturedRailIds = [
  "1600884595638",
  "1600900125789",
  "1601213973459",
  "1601214840405",
  "1601316497567",
] as const;

function extractPieceCount(product: ProductJson) {
  const pools = [
    product.title?.en,
    product.title?.zh,
    ...(product.attributePairs || []).flatMap((item) => [item.value?.en, item.value?.zh]),
  ]
    .map((value) => String(value || "").trim())
    .filter(Boolean);

  for (const entry of pools) {
    const match = entry.match(/(\d{2,4})\s*(?:piece|pieces|pcs|pc|件)/i);
    if (match) return Number(match[1]);
  }

  for (const entry of pools) {
    const match = entry.match(/\b(\d{2,4})\b/);
    if (!match) continue;
    const count = Number(match[1]);
    if (count >= 20 && count <= 300) return count;
  }

  return 0;
}

function derivePieceBand(product: ProductJson): ShowcaseProductSeed["pieceBand"] {
  const pieceCount = extractPieceCount(product);
  if (pieceCount > 300) return "300plus";
  if (pieceCount > 200) return "201-300";
  if (pieceCount > 100) return "101-200";
  return "0-100";
}

function deriveAgeGroup(product: ProductJson): ShowcaseProductSeed["ageGroup"] {
  const pools = (product.attributePairs || [])
    .flatMap((item) => [item.value?.en, item.value?.zh])
    .map((value) => String(value || ""));

  const numbers = Array.from(
    pools.join(" ").matchAll(/\d+(?:\.\d+)?/g),
    (match) => Number(match[0]),
  ).filter((value) => Number.isFinite(value));

  const minAge = numbers.length ? Math.min(...numbers) : 5;
  if (minAge >= 10) return "10plus";
  if (minAge >= 8) return "8plus";
  if (minAge >= 5) return "5plus";
  return "3plus";
}

function deriveCollection(product: ProductJson): ShowcaseProductSeed["collection"] {
  const text = [
    product.title?.en,
    product.title?.zh,
    ...(product.categories?.en || []),
    ...(product.categories?.zh || []),
  ]
    .join(" ")
    .toLowerCase();

  const pieceCount = extractPieceCount(product);
  const isAccessory =
    /(connector|construction rod|rods|sphere|rotating ball piece|piece set|配件|连接球|连接杆)/.test(text) &&
    !/(fort building kit|fort builder|堡垒搭建|套装)/.test(text);

  if (isAccessory) return "accessories";
  if (/(glow|secret base|christmas|sports|outdoor|night|夜光|秘密基地|圣诞|运动)/.test(text)) return "themed";
  if (/(rotating|oversized|creative|1:8|升级|大颗粒|旋转球)/.test(text)) return "creative";
  if (pieceCount > 0 && pieceCount <= 80) return "starter";
  return "building";
}

function normalizeCatalogSummary(product: ProductJson) {
  const summary = product.summary || {};
  const trimLine = (value: string | undefined) =>
    String(value || "")
      .replace(/\s+/g, " ")
      .replace(/[|]/g, " ")
      .trim()
      .slice(0, 140);

  return {
    en: trimLine(summary.en || product.title?.en || product.productId),
    zh: trimLine(summary.zh || product.title?.zh || product.productId),
  };
}

export function getShowcaseCatalog(): ShowcaseCatalogItem[] {
  return products.map((product, index) => {
    const seed: ShowcaseProductSeed = {
      productId: product.productId,
      label: {
        en: product.title?.en || product.productId,
        zh: product.title?.zh || product.title?.en || product.productId,
      },
      summary: normalizeCatalogSummary(product),
      collection: deriveCollection(product),
      ageGroup: deriveAgeGroup(product),
      pieceBand: derivePieceBand(product),
      hero: index < 3,
      bestseller: index < 6,
    };

    return {
      ...seed,
      product,
      images: product.images || [],
    };
  });
}

function getCuratedShowcaseItems(
  productIds: readonly string[],
  fallbackLimit = productIds.length,
) {
  const catalog = getShowcaseCatalog();
  const byId = new Map(catalog.map((item) => [item.product.productId, item]));
  const curated = productIds
    .map((productId) => byId.get(productId))
    .filter((item): item is ShowcaseCatalogItem => Boolean(item));

  if (curated.length >= fallbackLimit) {
    return curated;
  }

  const selectedIds = new Set(curated.map((item) => item.product.productId));

  return [
    ...curated,
    ...catalog
      .filter((item) => !selectedIds.has(item.product.productId))
      .slice(0, fallbackLimit - curated.length),
  ];
}

export function getHomeFeaturedShowcaseCatalog() {
  return getCuratedShowcaseItems(curatedHomeFeaturedProductIds, 4);
}

export function getProductsFeaturedRailCatalog() {
  return getCuratedShowcaseItems(curatedProductsFeaturedRailIds, 5);
}

export function findShowcaseProduct(productId: string) {
  return getShowcaseCatalog().find((item) => item.product.productId === productId);
}

export function getRelatedShowcaseProducts(productId: string, limit = 3) {
  const catalog = getShowcaseCatalog();
  const current = catalog.find((item) => item.product.productId === productId);

  if (!current) {
    return catalog.slice(0, limit);
  }

  return catalog
    .filter((item) => item.product.productId !== productId)
    .sort((a, b) => {
      const collectionMatch = Number(b.collection === current.collection) - Number(a.collection === current.collection);
      if (collectionMatch !== 0) {
        return collectionMatch;
      }

      return a.label.en?.localeCompare(b.label.en ?? "") ?? 0;
    })
    .slice(0, limit);
}

export function getAdjacentShowcaseProducts(productId: string) {
  const catalog = getShowcaseCatalog();
  const index = catalog.findIndex((item) => item.product.productId === productId);

  return {
    previous: index > 0 ? catalog[index - 1] : undefined,
    next: index >= 0 && index < catalog.length - 1 ? catalog[index + 1] : undefined,
  };
}

export function getProductPiecesLabel(item: ShowcaseCatalogItem) {
  const pieceCount = extractPieceCount(item.product);
  return pieceCount ? `${pieceCount} PCS` : item.pieceBand.toUpperCase();
}

export function getProductPriceLabel(item: ShowcaseCatalogItem) {
  return item.product.pricing?.display?.en || item.product.pricing?.display?.zh || "Quote on request";
}

export function getPrimaryAttributes(product: ProductJson, limit = 6) {
  return (product.attributePairs || [])
    .filter((pair) => (pair.key?.en || pair.key?.zh) && (pair.value?.en || pair.value?.zh))
    .slice(0, limit);
}

export function getPackagingAttributes(product: ProductJson, limit = 4) {
  return (product.packagingPairs || [])
    .filter((pair) => (pair.key?.en || pair.key?.zh) && (pair.value?.en || pair.value?.zh))
    .slice(0, limit);
}

export function getNewsList() {
  return [...newsArticles].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function findNewsArticle(slug: string): NewsArticleSeed | undefined {
  return getNewsList().find((item) => item.slug === slug);
}

export function getRecentNews(slug: string, limit = 4) {
  return getNewsList().filter((item) => item.slug !== slug).slice(0, limit);
}

export function getAdjacentNews(slug: string) {
  const list = getNewsList();
  const index = list.findIndex((item) => item.slug === slug);

  return {
    previous: index >= 0 ? list[index + 1] : undefined,
    next: index > 0 ? list[index - 1] : undefined,
  };
}

export function formatPublishedDate(locale: Locale, publishedAt: string) {
  const dateFormats: Record<Locale, Intl.DateTimeFormatOptions & {localeCode: string}> = {
    en: {localeCode: "en-US", month: "short", day: "numeric", year: "numeric"},
    zh: {localeCode: "zh-CN", month: "numeric", day: "numeric", year: "numeric"},
  };
  const {localeCode, ...formatOptions} = dateFormats[locale];

  return new Intl.DateTimeFormat(localeCode, {
    ...formatOptions,
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${publishedAt}T00:00:00Z`));
}

export function getNewsCategoryLabel(locale: Locale, article: NewsArticleSeed) {
  const labels: Record<NewsArticleSeed["category"], {en: string; zh: string}> = {
    all: {en: "All News", zh: "全部新闻"},
    company: {en: "Company News", zh: "企业新闻"},
    product: {en: "Product Updates", zh: "产品更新"},
    events: {en: "Events & Exhibitions", zh: "活动与展会"},
    insights: {en: "Industry Insights", zh: "行业洞察"},
    awards: {en: "Awards & Recognition", zh: "奖项与荣誉"},
    press: {en: "Press Releases", zh: "新闻稿"},
  };

  return t(locale, labels[article.category]);
}
