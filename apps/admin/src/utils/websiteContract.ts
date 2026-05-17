import type {
  LocalizedList,
  LocalizedPair,
  LocalizedTag,
  LocalizedText,
  WebsiteNewsArticleSeed,
  WebsiteProductCustomizationOption,
  WebsiteProductDetailBlock,
  WebsiteProductJson,
  WebsiteProductPriceTier,
} from '@/types/website-contract';

export function localized(zh?: string, en?: string): LocalizedText {
  return {
    zh: zh?.trim() || undefined,
    en: en?.trim() || zh?.trim() || undefined,
  };
}

export function localizedList(zh: string[] = [], en: string[] = []): LocalizedList {
  return {
    zh: zh.filter(Boolean),
    en: en.length ? en.filter(Boolean) : zh.filter(Boolean),
  };
}

export function splitLines(value?: string): string[] {
  return (value || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

export function parseJson<T>(value: string | undefined, fallback: T): T {
  if (!value?.trim()) return fallback;
  return JSON.parse(value) as T;
}

export function stringifyJson(value: unknown) {
  return JSON.stringify(value ?? null, null, 2);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function translatedEntry(
  translated: unknown,
  key: 'zh' | 'en',
): unknown {
  if (!isRecord(translated)) return undefined;
  return translated[key];
}

function isStringList(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

export function mergeTranslatedLocalizedFields<T>(
  source: T,
  translated: unknown,
): T {
  if (Array.isArray(source)) {
    const translatedItems = Array.isArray(translated) ? translated : [];
    return source.map((item, index) =>
      mergeTranslatedLocalizedFields(item, translatedItems[index]),
    ) as T;
  }

  if (!isRecord(source)) {
    return source;
  }

  if ('zh' in source && 'en' in source) {
    const sourceZh = source.zh;
    const sourceEn = source.en;
    const translatedZh = translatedEntry(translated, 'zh');
    const translatedEn = translatedEntry(translated, 'en');

    if (typeof sourceZh === 'string' || typeof sourceEn === 'string') {
      return {
        ...source,
        en:
          typeof translatedZh === 'string'
            ? translatedZh
            : typeof translatedEn === 'string'
              ? translatedEn
              : sourceEn || sourceZh,
      } as T;
    }

    if (isStringList(sourceZh) || isStringList(sourceEn)) {
      return {
        ...source,
        en:
          isStringList(translatedZh)
            ? translatedZh
            : isStringList(translatedEn)
              ? translatedEn
              : sourceEn || sourceZh,
      } as T;
    }
  }

  if ('zh' in source && typeof source.zh === 'string') {
    const translatedZh = translatedEntry(translated, 'zh');
    const translatedEn = translatedEntry(translated, 'en');
    return {
      ...source,
      en:
        typeof translatedZh === 'string'
          ? translatedZh
          : typeof translatedEn === 'string'
            ? translatedEn
            : (source as { en?: string }).en || source.zh,
    } as T;
  }

  return Object.fromEntries(
    Object.entries(source).map(([key, value]) => [
      key,
      mergeTranslatedLocalizedFields(
        value,
        isRecord(translated) ? translated[key] : undefined,
      ),
    ]),
  ) as T;
}

export function parseLocalizedPairs(value?: string): LocalizedPair[] {
  return splitLines(value)
    .map((line) => {
      const [keyZh = '', valueZh = '', keyEn = keyZh, valueEn = valueZh] = line
        .split('|')
        .map((part) => part.trim());
      return {
        key: localized(keyZh, keyEn),
        value: localized(valueZh, valueEn),
      };
    })
    .filter((item) => item.key?.zh && item.value?.zh);
}

export function stringifyLocalizedPairs(value?: LocalizedPair[]) {
  return (value || [])
    .map((item) =>
      [
        item.key?.zh || '',
        item.value?.zh || '',
        item.key?.en || item.key?.zh || '',
        item.value?.en || item.value?.zh || '',
      ].join('|'),
    )
    .join('\n');
}

export function parseLocalizedTags(value?: string): LocalizedTag[] {
  return splitLines(value)
    .map((line) => {
      const [key = '', zh = '', en = zh] = line.split('|').map((part) => part.trim());
      return { key: key || zh, zh, en };
    })
    .filter((item) => item.key && item.zh);
}

export function stringifyLocalizedTags(value?: LocalizedTag[]) {
  return (value || [])
    .map((item) => [item.key, item.zh, item.en || item.zh].join('|'))
    .join('\n');
}

export function parsePriceTiers(value?: string): WebsiteProductPriceTier[] {
  return splitLines(value)
    .map((line) => {
      const [quantityZh = '', price = '', quantityEn = quantityZh] = line
        .split('|')
        .map((part) => part.trim());
      return {
        quantity: localized(quantityZh, quantityEn),
        price,
      };
    })
    .filter((item) => item.quantity?.zh || item.price);
}

export function stringifyPriceTiers(value?: WebsiteProductPriceTier[]) {
  return (value || [])
    .map((item) =>
      [item.quantity?.zh || '', item.price || '', item.quantity?.en || item.quantity?.zh || ''].join('|'),
    )
    .join('\n');
}

export function parseCustomizationOptions(value?: string): WebsiteProductCustomizationOption[] {
  return splitLines(value)
    .map((line) => {
      const [
        labelZh = '',
        minOrderZh = '',
        labelEn = labelZh,
        minOrderEn = minOrderZh,
      ] = line.split('|').map((part) => part.trim());
      return {
        label: localized(labelZh, labelEn),
        minOrder: localized(minOrderZh, minOrderEn),
      };
    })
    .filter((item) => item.label?.zh);
}

export function stringifyCustomizationOptions(value?: WebsiteProductCustomizationOption[]) {
  return (value || [])
    .map((item) =>
      [
        item.label?.zh || '',
        item.minOrder?.zh || '',
        item.label?.en || item.label?.zh || '',
        item.minOrder?.en || item.minOrder?.zh || '',
      ].join('|'),
    )
    .join('\n');
}

export function parseProductDetails(value?: string): WebsiteProductDetailBlock[] {
  return splitLines(value)
    .map((line) => {
      const [titleZh = '', textZh = '', image = '', titleEn = titleZh, textEn = textZh] = line
        .split('|')
        .map((part) => part.trim());
      return {
        sectionTitle: localized(titleZh, titleEn),
        text: localized(textZh, textEn),
        image: image || undefined,
      };
    })
    .filter((item) => item.sectionTitle?.zh || item.text?.zh || item.image);
}

export function stringifyProductDetails(value?: WebsiteProductDetailBlock[]) {
  return (value || [])
    .map((item) =>
      [
        item.sectionTitle?.zh || '',
        item.text?.zh || '',
        item.image || '',
        item.sectionTitle?.en || item.sectionTitle?.zh || '',
        item.text?.en || item.text?.zh || '',
      ].join('|'),
    )
    .join('\n');
}

export function buildProductRawData(input: {
  productId: string;
  priority: number;
  tags?: LocalizedTag[];
  titleZh: string;
  titleEn: string;
  summaryZh?: string;
  summaryEn?: string;
  descriptionZh: string[];
  descriptionEn: string[];
  sourceUrl?: string;
  categoriesZh: string[];
  categoriesEn: string[];
  pricing?: WebsiteProductJson['pricing'];
  customizationOptions?: WebsiteProductCustomizationOption[];
  specifications?: LocalizedPair[];
  productAttributes?: LocalizedPair[];
  attributePairs?: LocalizedPair[];
  packagingPairs?: LocalizedPair[];
  leadTime?: WebsiteProductJson['leadTime'];
  videoDescription?: WebsiteProductJson['videoDescription'];
  images?: string[];
  videos?: string[];
  productDetails?: WebsiteProductDetailBlock[];
}): WebsiteProductJson {
  const images = input.images?.filter(Boolean) || [];
  const videos = input.videos?.filter(Boolean) || [];
  return {
    productId: input.productId,
    module: 'toys',
    priority: input.priority,
    tags: input.tags || [],
    title: localized(input.titleZh, input.titleEn),
    summary: localized(input.summaryZh, input.summaryEn),
    description: localizedList(input.descriptionZh, input.descriptionEn),
    sourceUrl: input.sourceUrl,
    categories: localizedList(input.categoriesZh, input.categoriesEn),
    pricing: input.pricing,
    customizationOptions: input.customizationOptions || [],
    specifications: input.specifications || [],
    productAttributes: input.productAttributes || [],
    attributePairs: input.attributePairs || [],
    packagingPairs: input.packagingPairs || [],
    leadTime: input.leadTime,
    videoDescription: input.videoDescription,
    media: {
      main: [
        ...images.map((url) => ({ type: 'image', url })),
        ...videos.map((url) => ({ type: 'video', url })),
      ],
      detail: (input.productDetails || [])
        .map((item) => item.image)
        .filter(Boolean)
        .map((url) => ({ type: 'image', url })),
    },
    images,
    videos,
    productDetails: input.productDetails || [],
  };
}

export function buildNewsRawData(input: {
  slug: string;
  category: WebsiteNewsArticleSeed['category'];
  titleZh: string;
  titleEn: string;
  excerptZh?: string;
  excerptEn?: string;
  publishedAt: string;
  image: string;
  galleryImages?: string[];
  featuredTopic?: boolean;
  seoKeywords?: Partial<Record<'zh' | 'en', string[]>>;
  bodyZh: string;
  bodyEn: string;
  relatedProduct?: WebsiteNewsArticleSeed['relatedProduct'];
}): WebsiteNewsArticleSeed {
  return {
    slug: input.slug,
    category: input.category,
    title: localized(input.titleZh, input.titleEn),
    excerpt: localized(input.excerptZh, input.excerptEn),
    publishedAt: input.publishedAt,
    image: input.image,
    galleryImages: input.galleryImages || [],
    featuredTopic: input.featuredTopic,
    seoKeywords: input.seoKeywords,
    body: localized(input.bodyZh, input.bodyEn),
    relatedProduct: input.relatedProduct,
  };
}
