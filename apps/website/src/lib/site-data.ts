import {newsArticles} from "@/content/pages/news";
import {type NewsArticleSeed, type ShowcaseProductSeed} from "@/content/types";
import {seoKeywordPools} from "@/content/site/shared";
import {
  products,
  type ProductJson,
  type ProductJsonPair,
} from "@/content/site/products-catalog";
import {t, type Locale} from "@/lib/i18n";
import {areSeoKeywordsSimilar, isAllowedSeoKeyword} from "@/lib/seo-keywords";

export type ShowcaseCatalogItem = ShowcaseProductSeed & {
  product: ProductJson;
  images: string[];
};

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
  const isCustom = /(custom|oem|odm|private label|定制|贴牌|来样|来图)/.test(text);

  if (isCustom) return "accessories";
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

function localizeProductText(
  locale: Locale,
  value: Partial<Record<Locale, string>> | undefined,
  fallback = "",
) {
  if (!value) return fallback;
  return value[locale] || value.en || value.zh || fallback;
}

function getKeywordPool(
  locale: Locale,
  value: Partial<Record<Locale, readonly string[]>>,
) {
  return value[locale] || value.en || value.zh || [];
}

function normalizeSeoKeyword(value: string) {
  return value
    .replace(/[|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeKeywordForMatching(keyword: string) {
  return keyword
    .toLowerCase()
    .replace(/[&,+/]/g, " ")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const seoSearchIntentSignals = [
  "abs rotating",
  "ai",
  "assembly",
  "building",
  "castle",
  "connector",
  "custom",
  "drawing",
  "educational",
  "export",
  "extrusion",
  "factory",
  "fort",
  "glow",
  "injection",
  "kit",
  "manufacturer",
  "mold",
  "odm",
  "oem",
  "packaging",
  "private label",
  "rods",
  "sample",
  "source",
  "stem",
  "storage",
  "supplier",
  "tent",
  "toy",
  "yaoshun",
  "搭建",
  "拼搭",
  "拼插",
  "积木",
  "堡垒",
  "帐篷",
  "城堡",
  "秘密基地",
  "夜光",
  "旋转球",
  "连接杆",
  "连接球",
  "收纳袋",
  "益智",
  "玩具",
  "定制",
  "贴牌",
  "包装",
  "彩盒",
  "来样",
  "来图",
  "工厂",
  "源头",
  "尧顺",
  "模具",
  "开模",
  "注塑",
  "挤出",
  "交付",
  "出口",
] as const;

function hasSeoSearchIntent(keyword: string) {
  const normalized = keyword
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, "")
    .trim();

  if (/^(toy|toys|kids|children|material|package|service|玩具)$/i.test(keyword)) {
    return false;
  }

  if (/^([a-z]{2,3}|[A-Z]{2,3})$/.test(keyword.trim())) {
    return false;
  }

  if (/other|mother\s+kids|其他|母婴/i.test(keyword)) {
    return false;
  }

  return (
    normalized.length > 1 &&
    seoSearchIntentSignals.some((signal) =>
      normalizeKeywordForMatching(keyword).includes(signal.toLowerCase()),
    )
  );
}

function uniqueSeoKeywords(keywords: readonly string[], limit: number) {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const item of keywords) {
    const keyword = normalizeSeoKeyword(item);
    const lookupKey = keyword.toLowerCase();

    if (
      !keyword ||
      keyword.length > 90 ||
      !isAllowedSeoKeyword(keyword) ||
      !hasSeoSearchIntent(keyword) ||
      seen.has(lookupKey) ||
      result.some((existing) => areSeoKeywordsSimilar(keyword, existing))
    ) {
      continue;
    }

    seen.add(lookupKey);
    result.push(keyword);

    if (result.length >= limit) {
      break;
    }
  }

  return result;
}

const categorySeoKeywordRules = [
  {
    source: ["educational toys", "益智玩具"],
    keywords: {
      en: ["STEM educational toys", "educational building toys"],
      zh: ["STEM益智玩具", "益智搭建玩具"],
    },
  },
  {
    source: ["blocks model building toys", "积木与模型拼搭玩具"],
    keywords: {
      en: ["building block assembly toys", "model building toys"],
      zh: ["积木拼搭玩具", "模型拼搭玩具"],
    },
  },
  {
    source: ["building block sets", "积木套装"],
    keywords: {
      en: ["building block sets", "fort building block sets"],
      zh: ["积木套装", "堡垒积木拼搭套装"],
    },
  },
  {
    source: ["outdoor toys structures", "户外玩具与设施"],
    keywords: {
      en: ["outdoor fort building kit", "outdoor building toys"],
      zh: ["户外堡垒拼搭套装", "户外搭建玩具"],
    },
  },
] as const;

function getMappedCategorySeoKeywords(locale: Locale, values: string[]) {
  const sourceText = normalizeKeywordForMatching(values.join(" "));

  return categorySeoKeywordRules.flatMap((rule) =>
    rule.source.some((source) =>
      sourceText.includes(normalizeKeywordForMatching(source)),
    )
      ? getKeywordPool(locale, rule.keywords)
      : [],
  );
}

function getMaterialSeoKeywords(locale: Locale, value: string) {
  const normalized = normalizeKeywordForMatching(value);
  const keywords: string[] = [];

  if (normalized.includes("pp")) {
    keywords.push(
      ...getKeywordPool(locale, {
        en: ["PP rods connector balls", "PP fort building toy parts"],
        zh: ["PP连接杆连接球", "PP堡垒拼搭玩具配件"],
      }),
    );
  }

  if (normalized.includes("abs")) {
    keywords.push(
      ...getKeywordPool(locale, {
        en: ["ABS rotating ball connectors", "ABS rotating ball fort building kit"],
        zh: ["ABS旋转球连接件", "ABS旋转球堡垒拼搭套装"],
      }),
    );
  }

  if (/non\s*woven|无纺布/.test(normalized)) {
    keywords.push(
      ...getKeywordPool(locale, {
        en: ["non-woven fabric fort cover", "fort tent cover kit"],
        zh: ["无纺布堡垒帐篷布套", "堡垒帐篷布套"],
      }),
    );
  }

  return keywords;
}

function getPackagingSeoKeywords(locale: Locale, value: string) {
  const normalized = normalizeKeywordForMatching(value);
  const keywords: string[] = [];

  if (normalized.includes("color box") || normalized.includes("彩盒")) {
    keywords.push(
      ...getKeywordPool(locale, {
        en: ["color box toy packaging", "custom color box packaging"],
        zh: ["彩盒包装定制", "玩具彩盒包装"],
      }),
    );
  }

  if (normalized.includes("storage bag") || normalized.includes("收纳袋")) {
    keywords.push(
      ...getKeywordPool(locale, {
        en: ["storage bag fort kit", "building toy storage bag"],
        zh: ["收纳袋玩具套装", "搭建玩具收纳袋"],
      }),
    );
  }

  if (normalized.includes("carton") || normalized.includes("外箱")) {
    keywords.push(
      ...getKeywordPool(locale, {
        en: ["export carton toy packaging"],
        zh: ["玩具出口外箱包装"],
      }),
    );
  }

  return keywords;
}

const seoPairKeyHints = [
  "type",
  "product name",
  "item name",
  "theme",
  "style",
  "function",
  "feature",
  "material",
  "service",
  "packaging",
  "package",
  "keywords",
  "产品类型",
  "产品名称",
  "主题",
  "产品风格",
  "功能",
  "特色",
  "材质",
  "服务",
  "包装方式",
  "关键词",
] as const;

function getSeoPairKeywords(locale: Locale, pair: ProductJsonPair) {
  const key = [
    localizeProductText(locale, pair.key),
    localizeProductText(locale === "zh" ? "en" : "zh", pair.key),
  ]
    .join(" ")
    .toLowerCase();
  const value = localizeProductText(locale, pair.value);

  if (key.includes("company type") || key.includes("企业类型")) {
    return [];
  }

  if (!seoPairKeyHints.some((hint) => key.includes(hint.toLowerCase()))) {
    return [];
  }

  if (key.includes("material") || key.includes("材质")) {
    return getMaterialSeoKeywords(locale, value);
  }

  if (key.includes("packaging") || key.includes("package") || key.includes("包装")) {
    return getPackagingSeoKeywords(locale, value);
  }

  if (key.includes("service") || key.includes("服务")) {
    if (/private|label|贴牌/i.test(value)) {
      return getKeywordPool(locale, {
        en: ["private label toy packaging"],
        zh: ["私标玩具包装"],
      });
    }

    if (/oem|odm|定制/i.test(value)) {
      return getKeywordPool(locale, {
        en: ["OEM ODM toy customization"],
        zh: ["OEM ODM玩具定制"],
      });
    }

    return [];
  }

  return [value];
}

function getPieceCountSeoKeywords(locale: Locale, product: ProductJson) {
  const pieceCount = extractPieceCount(product);

  if (!pieceCount) {
    return [];
  }

  const titleText = [
    product.title?.en,
    product.title?.zh,
    ...(product.categories?.en || []),
    ...(product.categories?.zh || []),
  ]
    .join(" ")
    .toLowerCase();
  const isGlow = /glow|luminous|发光|夜光/.test(titleText);
  const isSecretBase = /secret base|秘密基地/.test(titleText);

  if (isGlow) {
    return getKeywordPool(locale, {
      en: [`${pieceCount}-piece glow fort kit`],
      zh: [`${pieceCount}件夜光堡垒拼搭套装`],
    });
  }

  if (isSecretBase) {
    return getKeywordPool(locale, {
      en: [`${pieceCount}-piece secret base fort kit`],
      zh: [`${pieceCount}件秘密基地堡垒拼搭套装`],
    });
  }

  return getKeywordPool(locale, {
    en: [`${pieceCount}-piece fort building kit`],
    zh: [`${pieceCount}件堡垒拼搭套装`],
  });
}

function getProductCustomizationSeoKeywords(locale: Locale, product: ProductJson) {
  const text = [
    ...(product.customizationOptions || []).flatMap((item) => [
      item.label?.en,
      item.label?.zh,
    ]),
    ...(product.specifications || []).flatMap((item) => [
      item.value?.en,
      item.value?.zh,
    ]),
  ]
    .join(" ")
    .toLowerCase();
  const keywords: string[] = [];

  if (/logo|packaging|graphic|custom|oem|odm|定制|包装|图文/.test(text)) {
    keywords.push(
      ...getKeywordPool(locale, {
        en: ["custom fort kit packaging"],
        zh: ["堡垒套装包装定制"],
      }),
    );
  }

  if (/private|label|贴牌/.test(text)) {
    keywords.push(
      ...getKeywordPool(locale, {
        en: ["private label fort building kit"],
        zh: ["私标堡垒拼搭套装"],
      }),
    );
  }

  return keywords;
}

export function getProductSeoKeywords(
  locale: Locale,
  product: ProductJson,
  limit = 6,
) {
  const title = localizeProductText(locale, product.title, product.productId);
  const sourceCategories = [
    ...(product.categories?.en || []),
    ...(product.categories?.zh || []),
  ];
  const tags =
    product.tags?.map((tag) => (locale === "zh" ? tag.zh : tag.en)) || [];
  const categorySeoKeywords = getMappedCategorySeoKeywords(locale, [
    ...sourceCategories,
    ...tags,
  ]);
  const pairValues = [
    ...(product.attributePairs || []),
    ...(product.productAttributes || []),
    ...(product.specifications || []),
    ...(product.packagingPairs || []),
  ]
    .flatMap((pair) => getSeoPairKeywords(locale, pair))
    .filter(Boolean);

  return uniqueSeoKeywords(
    [
      title,
      ...getPieceCountSeoKeywords(locale, product),
      ...categorySeoKeywords,
      ...pairValues,
      ...getProductCustomizationSeoKeywords(locale, product),
    ],
    limit,
  );
}

export function getCatalogSeoKeywords(locale: Locale, limit = 2) {
  return uniqueSeoKeywords(
    getKeywordPool(locale, {
      en: ["rotating ball fort kits", "storage bag fort kit options"],
      zh: ["旋转球堡垒拼搭套装", "收纳袋堡垒拼搭套装"],
    }),
    limit,
  );
}

function getBusinessCategoryPairValue(locale: Locale, pair: ProductJsonPair) {
  const key = [
    localizeProductText(locale, pair.key),
    localizeProductText(locale === "zh" ? "en" : "zh", pair.key),
  ]
    .join(" ")
    .toLowerCase();

  if (key.includes("company type") || key.includes("企业类型")) {
    return "";
  }

  if (
    ![
      "type",
      "product type",
      "product name",
      "theme",
      "style",
      "产品类型",
      "产品名称",
      "主题",
      "产品风格",
    ].some((hint) => key.includes(hint.toLowerCase()))
  ) {
    return "";
  }

  return localizeProductText(locale, pair.value);
}

export function getProductBusinessCategories(
  locale: Locale,
  product: ProductJson,
  limit = 2,
) {
  const sourceCategories = [
    ...(product.categories?.en || []),
    ...(product.categories?.zh || []),
    ...(product.tags?.flatMap((tag) => [tag.en, tag.zh]) || []),
  ];
  const pairCategories = [
    ...(product.attributePairs || []),
    ...(product.productAttributes || []),
    ...(product.specifications || []),
  ]
    .map((pair) => getBusinessCategoryPairValue(locale, pair))
    .filter(Boolean);

  return uniqueSeoKeywords(
    [
      ...pairCategories,
      ...getMappedCategorySeoKeywords(locale, sourceCategories),
      ...getKeywordPool(locale, seoKeywordPools.products),
    ],
    limit,
  );
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
      bestseller: index < 4,
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
  return getShowcaseCatalog().slice(0, 4);
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

export function getProductPriceLabel(item: ShowcaseCatalogItem, locale: Locale = "en") {
  return (
    item.product.pricing?.display?.[locale] ||
    item.product.pricing?.display?.en ||
    item.product.pricing?.display?.zh ||
    "Quote on request"
  );
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
    company: {en: "Factory & Delivery", zh: "工厂与交付"},
    product: {en: "Products & Customization", zh: "产品与定制"},
    events: {en: "Events & Exhibitions", zh: "活动与展会"},
    insights: {en: "Industry Insights", zh: "行业洞察"},
    awards: {en: "Qualifications & Honors", zh: "资质与荣誉"},
  };

  return t(locale, labels[article.category]);
}
