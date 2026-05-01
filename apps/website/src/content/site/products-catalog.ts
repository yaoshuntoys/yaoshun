import "server-only";

import type { LocalizedTag, ProductModule } from "@/content/site/shared";

import p1601110728943 from "../../../data/1688-products/toys/1601110728943/product.json";
import p1601730435470 from "../../../data/1688-products/toys/1601730435470/product.json";
import p1600898789412 from "../../../data/1688-products/toys/1600898789412/product.json";
import p1601362237263 from "../../../data/1688-products/toys/1601362237263/product.json";
import p1601728749802 from "../../../data/1688-products/toys/1601728749802/product.json";
import p1601316583146 from "../../../data/1688-products/toys/1601316583146/product.json";
import p1601730326005 from "../../../data/1688-products/toys/1601730326005/product.json";
import p1600884595638 from "../../../data/1688-products/toys/1600884595638/product.json";
import p1600900125789 from "../../../data/1688-products/toys/1600900125789/product.json";
import p1601213973459 from "../../../data/1688-products/toys/1601213973459/product.json";
import p1601214840405 from "../../../data/1688-products/toys/1601214840405/product.json";
import p1601313719232 from "../../../data/1688-products/toys/1601313719232/product.json";
import p1601316497567 from "../../../data/1688-products/toys/1601316497567/product.json";
import p1601724919450 from "../../../data/1688-products/toys/1601724919450/product.json";
import p1601729143208 from "../../../data/1688-products/toys/1601729143208/product.json";
import p1601729187617 from "../../../data/1688-products/toys/1601729187617/product.json";

export type ProductJsonLocalizedText = Partial<Record<"zh" | "en", string>>;
export type ProductJsonLocalizedList = Partial<Record<"zh" | "en", string[]>>;
export type ProductJsonPair = {
  key?: ProductJsonLocalizedText;
  value?: ProductJsonLocalizedText;
};
export type ProductJsonPriceTier = {
  quantity?: ProductJsonLocalizedText;
  price?: string;
};
export type ProductJsonCustomizationOption = {
  label?: ProductJsonLocalizedText;
  minOrder?: ProductJsonLocalizedText;
};
export type ProductJsonMediaItem = {
  type?: "image" | "video" | string;
  url?: string;
};
export type ProductJsonDetailBlock = {
  sectionTitle?: ProductJsonLocalizedText;
  type?: string;
  image?: string;
  text?: ProductJsonLocalizedText;
};
export type ProductJson = {
  productId: string;
  module: ProductModule;
  priority: number;
  tags?: LocalizedTag[];
  structuredData?: Array<Record<string, unknown>>;
  title?: ProductJsonLocalizedText;
  summary?: ProductJsonLocalizedText;
  description?: ProductJsonLocalizedList;
  sourceUrl?: string;
  categories?: ProductJsonLocalizedList;
  pricing?: {
    display?: ProductJsonLocalizedText;
    currency?: string;
    min?: number;
    max?: number;
    isRange?: boolean;
    minOrder?: ProductJsonLocalizedText;
    tiers?: ProductJsonPriceTier[];
  };
  customizationOptions?: ProductJsonCustomizationOption[];
  specifications?: ProductJsonPair[];
  productAttributes?: ProductJsonPair[];
  attributePairs?: ProductJsonPair[];
  packagingAndShipping?: {
    unitSize?: string;
    unitVolume?: string;
    unitWeight?: string;
    summary?: ProductJsonLocalizedText;
    blocks?: Array<{
      title?: ProductJsonLocalizedText;
      text?: ProductJsonLocalizedText;
      label?: ProductJsonLocalizedText;
      value?: ProductJsonLocalizedText;
    }>;
  };
  packagingPairs?: ProductJsonPair[];
  leadTime?: {
    tiers?: Array<{
      minQuantity?: string;
      maxQuantity?: string;
      processPeriodDays?: number;
    }>;
  };
  videoDescription?: {
    title?: ProductJsonLocalizedText;
    url?: string;
    duration?: string;
  };
  media?: {
    main?: ProductJsonMediaItem[];
    detail?: ProductJsonMediaItem[];
  };
  images?: string[];
  videos?: string[];
  productDetails?: ProductJsonDetailBlock[];
};

const importedProducts = [
  p1601110728943,
  p1601730435470,
  p1600898789412,
  p1601362237263,
  p1601728749802,
  p1601316583146,
  p1601730326005,
  p1600884595638,
  p1600900125789,
  p1601213973459,
  p1601214840405,
  p1601313719232,
  p1601316497567,
  p1601724919450,
  p1601729143208,
  p1601729187617,
] as ProductJson[];

export const products: ProductJson[] = [...importedProducts].sort(
  (a, b) => a.priority - b.priority || a.productId.localeCompare(b.productId),
);
