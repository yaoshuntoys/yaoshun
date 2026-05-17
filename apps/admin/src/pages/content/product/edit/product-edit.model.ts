import type { LocalizedList, Product, WebsiteProductJson } from '@/types';
import {
  stringifyCustomizationOptions,
  stringifyJson,
  stringifyLocalizedPairs,
  stringifyLocalizedTags,
  stringifyPriceTiers,
  stringifyProductDetails,
} from '@/utils/websiteContract';

export const productModules = [
  { key: 'website-basic', label: '官网基础信息' },
  { key: 'seo-category', label: 'SEO 与分类' },
  { key: 'price-moq', label: '价格与 MOQ' },
  { key: 'media', label: '媒体资源' },
  { key: 'attributes', label: '属性表' },
  { key: 'customization', label: '定制选项' },
  { key: 'packaging-leadtime', label: '包装与交期' },
  { key: 'details', label: '详情内容' },
];

export type RevisionRecord = {
  id: number;
  version: number;
  action: string;
  operatorName?: string | null;
  summary?: string | null;
  createdAt: string;
};

export interface ProductEditValues {
  productId: string;
  priority?: number;
  slug: string;
  category: Product['category'];
  titleZh: string;
  summaryZh?: string;
  descriptionLinesZh?: string;
  sourceUrl?: string;
  categoriesZh?: string;
  tagsText?: string;
  seoKeywordsZh?: string;
  priceDisplayZh?: string;
  currency?: string;
  priceMin?: number;
  priceMax?: number;
  isRange?: boolean;
  minOrderZh?: string;
  priceTiersText?: string;
  cover?: string;
  imagesText?: string;
  videosText?: string;
  specificationsText?: string;
  productAttributesText?: string;
  attributePairsText?: string;
  customizationOptionsText?: string;
  packagingPairsText?: string;
  leadTimeJson?: string;
  videoDescriptionTitleZh?: string;
  videoDescriptionUrl?: string;
  videoDescriptionDuration?: string;
  productDetailsText?: string;
  detailConfig?: Record<string, unknown>;
  status: Product['status'];
  sortOrder?: number;
}

export type ProductPayload = {
  [key: string]: unknown;
  seoKeywords: LocalizedList;
  rawData: WebsiteProductJson;
};

function firstText(value?: Partial<Record<'zh' | 'en', string>>) {
  return value?.zh || value?.en || '';
}

function listText(value?: Partial<Record<'zh' | 'en', string[]>>) {
  return (value?.zh || value?.en || []).join('\n');
}

export function buildProductInitialValues(
  product: Product,
): Partial<ProductEditValues> {
  const raw = product.rawData as WebsiteProductJson | undefined;
  return {
    productId: raw?.productId || product.productId || product.slug,
    priority: raw?.priority ?? product.sortOrder ?? 0,
    slug: product.slug,
    category: product.category,
    titleZh: firstText(raw?.title) || product.titleZh,
    summaryZh: firstText(raw?.summary) || product.summaryZh,
    descriptionLinesZh: listText(raw?.description) || product.descriptionZh,
    sourceUrl: raw?.sourceUrl,
    categoriesZh: listText(raw?.categories),
    tagsText: stringifyLocalizedTags(raw?.tags),
    seoKeywordsZh: (product.seoKeywords?.zh || []).join('\n'),
    priceDisplayZh: firstText(raw?.pricing?.display),
    currency: raw?.pricing?.currency || '$',
    priceMin: raw?.pricing?.min,
    priceMax: raw?.pricing?.max,
    isRange: raw?.pricing?.isRange,
    minOrderZh: firstText(raw?.pricing?.minOrder),
    priceTiersText: stringifyPriceTiers(raw?.pricing?.tiers),
    cover: product.cover || raw?.images?.[0],
    imagesText: (raw?.images || product.images || []).join('\n'),
    videosText: (raw?.videos || []).join('\n'),
    specificationsText: stringifyLocalizedPairs(raw?.specifications),
    productAttributesText: stringifyLocalizedPairs(raw?.productAttributes),
    attributePairsText: stringifyLocalizedPairs(raw?.attributePairs),
    customizationOptionsText: stringifyCustomizationOptions(
      raw?.customizationOptions,
    ),
    packagingPairsText: stringifyLocalizedPairs(raw?.packagingPairs),
    leadTimeJson: stringifyJson(raw?.leadTime ?? { tiers: [] }),
    videoDescriptionTitleZh: firstText(raw?.videoDescription?.title),
    videoDescriptionUrl: raw?.videoDescription?.url,
    videoDescriptionDuration: raw?.videoDescription?.duration,
    productDetailsText: stringifyProductDetails(raw?.productDetails),
    detailConfig: product.detailConfig ?? {},
    status: product.status,
    sortOrder: product.sortOrder,
  };
}
