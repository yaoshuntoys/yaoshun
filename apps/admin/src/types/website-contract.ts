export type Locale = 'zh' | 'en';

export type LocalizedText = Partial<Record<Locale, string>>;
export type LocalizedList = Partial<Record<Locale, string[]>>;

export interface LocalizedPair {
  key?: LocalizedText;
  value?: LocalizedText;
}

export interface LocalizedTag {
  key: string;
  zh: string;
  en: string;
}

export type ProductModule = 'toys';

export interface WebsiteProductPriceTier {
  quantity?: LocalizedText;
  price?: string;
}

export interface WebsiteProductCustomizationOption {
  label?: LocalizedText;
  minOrder?: LocalizedText;
}

export interface WebsiteProductMediaItem {
  type?: 'image' | 'video' | string;
  url?: string;
}

export interface WebsiteProductDetailBlock {
  sectionTitle?: LocalizedText;
  type?: string;
  image?: string;
  text?: LocalizedText;
}

export interface WebsiteProductJson {
  productId: string;
  module: ProductModule;
  priority: number;
  tags?: LocalizedTag[];
  structuredData?: Array<Record<string, unknown>>;
  title?: LocalizedText;
  summary?: LocalizedText;
  description?: LocalizedList;
  sourceUrl?: string;
  categories?: LocalizedList;
  pricing?: {
    display?: LocalizedText;
    currency?: string;
    min?: number;
    max?: number;
    isRange?: boolean;
    minOrder?: LocalizedText;
    tiers?: WebsiteProductPriceTier[];
  };
  customizationOptions?: WebsiteProductCustomizationOption[];
  specifications?: LocalizedPair[];
  productAttributes?: LocalizedPair[];
  attributePairs?: LocalizedPair[];
  packagingAndShipping?: {
    unitSize?: string;
    unitVolume?: string;
    unitWeight?: string;
    summary?: LocalizedText;
    blocks?: Array<{
      title?: LocalizedText;
      text?: LocalizedText;
      label?: LocalizedText;
      value?: LocalizedText;
    }>;
  };
  packagingPairs?: LocalizedPair[];
  leadTime?: {
    tiers?: Array<{
      minQuantity?: string;
      maxQuantity?: string;
      processPeriodDays?: number;
    }>;
  };
  videoDescription?: {
    title?: LocalizedText;
    url?: string;
    duration?: string;
  };
  media?: {
    main?: WebsiteProductMediaItem[];
    detail?: WebsiteProductMediaItem[];
  };
  images?: string[];
  videos?: string[];
  productDetails?: WebsiteProductDetailBlock[];
}

export type WebsiteNewsCategory =
  | 'all'
  | 'company'
  | 'product'
  | 'events'
  | 'insights'
  | 'awards';

export interface WebsiteNewsArticleSeed {
  slug: string;
  category: WebsiteNewsCategory;
  title: LocalizedText;
  excerpt: LocalizedText;
  publishedAt: string;
  image: string;
  galleryImages?: string[];
  featuredTopic?: boolean;
  seoKeywords?: Partial<Record<Locale, string[]>>;
  body: LocalizedText;
  relatedProduct?: {
    productId: string;
    label: LocalizedText;
    description?: LocalizedText;
  };
}

