import type { WebsiteNewsArticleSeed, WebsiteProductJson } from '@/types/website-contract';

export interface Article {
  id: number;
  slug: string;
  category: 'company' | 'product' | 'events' | 'insights' | 'awards';
  titleZh: string;
  titleEn: string;
  contentZh: string;
  contentEn: string;
  summaryZh?: string;
  summaryEn?: string;
  cover?: string;
  galleryImages?: string[];
  featuredTopic?: boolean;
  seoKeywords?: Record<string, string[]>;
  relatedProduct?: Record<string, unknown>;
  detailConfig?: Record<string, unknown>;
  rawData?: WebsiteNewsArticleSeed;
  viewCount: number;
  status: 'draft' | 'published' | 'archived';
  publishedAt?: string | null;
  sortOrder?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductSpec {
  labelZh: string;
  labelEn: string;
  value: string;
}

export interface FaqItem {
  id: number;
  categoryKey: string;
  categoryLabelZh: string;
  categoryLabelEn: string;
  questionZh: string;
  questionEn: string;
  answerZh: string;
  answerEn: string;
  status: 'active' | 'inactive';
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Partner {
  id: number;
  nameZh: string;
  nameEn: string;
  logo?: string | null;
  website?: string | null;
  status: 'active' | 'inactive';
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  productId?: string;
  slug: string;
  category: 'finished-toys' | 'parts-structures' | 'process-support' | 'accessories';
  titleZh: string;
  titleEn: string;
  summaryZh?: string;
  summaryEn?: string;
  descriptionZh: string;
  descriptionEn: string;
  specs: ProductSpec[];
  productAttributes?: Record<string, unknown>[];
  attributePairs?: Record<string, unknown>[];
  pricing?: Record<string, unknown>;
  customizationOptions?: Record<string, unknown>[];
  images?: string[];
  seoKeywords?: Record<string, string[]>;
  detailConfig?: Record<string, unknown>;
  rawData?: WebsiteProductJson;
  cover?: string;
  status: 'active' | 'inactive';
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  sortOrder: number;
  createdAt: string;
}

export interface Page {
  id: string;
  key: string;
  title: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  updatedAt: string;
}
