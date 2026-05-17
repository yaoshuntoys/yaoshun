import type { LocalizedList, WebsiteProductJson } from '@/types';
import {
  buildProductRawData,
  localized,
  localizedList,
  parseCustomizationOptions,
  parseJson,
  parseLocalizedPairs,
  parseLocalizedTags,
  parsePriceTiers,
  parseProductDetails,
  splitLines,
} from '@/utils/websiteContract';

import type { ProductEditValues, ProductPayload } from './product-edit.model';

export function buildProductPayload(
  values: ProductEditValues,
  rawDataOverride?: WebsiteProductJson,
  seoKeywordsOverride?: LocalizedList,
): ProductPayload {
  const descriptionZh = splitLines(values.descriptionLinesZh);
  const categoriesZh = splitLines(values.categoriesZh);
  const images = splitLines(values.imagesText);
  const videos = splitLines(values.videosText);
  const rawData =
    rawDataOverride ??
    buildProductRawData({
      productId: values.productId,
      priority: values.priority ?? values.sortOrder ?? 0,
      tags: parseLocalizedTags(values.tagsText),
      titleZh: values.titleZh,
      titleEn: values.titleZh,
      summaryZh: values.summaryZh,
      summaryEn: values.summaryZh,
      descriptionZh,
      descriptionEn: descriptionZh,
      sourceUrl: values.sourceUrl?.trim() || undefined,
      categoriesZh,
      categoriesEn: categoriesZh,
      pricing: {
        display: localized(values.priceDisplayZh),
        currency: values.currency || '$',
        min: values.priceMin,
        max: values.priceMax,
        isRange: values.isRange,
        minOrder: localized(values.minOrderZh),
        tiers: parsePriceTiers(values.priceTiersText),
      },
      customizationOptions: parseCustomizationOptions(
        values.customizationOptionsText,
      ),
      specifications: parseLocalizedPairs(values.specificationsText),
      productAttributes: parseLocalizedPairs(values.productAttributesText),
      attributePairs: parseLocalizedPairs(values.attributePairsText),
      packagingPairs: parseLocalizedPairs(values.packagingPairsText),
      leadTime: parseJson<WebsiteProductJson['leadTime']>(
        values.leadTimeJson,
        { tiers: [] },
      ),
      videoDescription: {
        title: localized(values.videoDescriptionTitleZh),
        url: values.videoDescriptionUrl?.trim() || undefined,
        duration: values.videoDescriptionDuration?.trim() || undefined,
      },
      images,
      videos,
      productDetails: parseProductDetails(values.productDetailsText),
    });
  const titleEn = rawData.title?.en || rawData.title?.zh || values.titleZh;
  const summaryEn = rawData.summary?.en || rawData.summary?.zh || values.summaryZh || '';
  const descriptionEn = rawData.description?.en?.length
    ? rawData.description.en
    : rawData.description?.zh ?? descriptionZh;
  const seoKeywords =
    seoKeywordsOverride ?? localizedList(splitLines(values.seoKeywordsZh), []);

  return {
    productId: values.productId,
    slug: values.slug || values.productId,
    category: values.category,
    titleZh: values.titleZh,
    titleEn,
    summaryZh: values.summaryZh?.trim() || undefined,
    summaryEn,
    descriptionZh: descriptionZh.join('\n'),
    descriptionEn: descriptionEn.join('\n') || descriptionZh.join('\n'),
    specs: rawData.specifications || [],
    productAttributes: rawData.productAttributes || [],
    attributePairs: rawData.attributePairs || [],
    pricing: rawData.pricing ?? {},
    customizationOptions: rawData.customizationOptions || [],
    images,
    seoKeywords,
    detailConfig: values.detailConfig ?? {},
    rawData,
    cover: values.cover?.trim() || images[0],
    status: values.status,
    sortOrder: values.sortOrder ?? values.priority ?? 0,
  };
}
