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
import p2026050701 from "../../../data/1688-products/toys/2026050701/product.json";
import p2026050702 from "../../../data/1688-products/toys/2026050702/product.json";
import p2026050703 from "../../../data/1688-products/toys/2026050703/product.json";
import p2026050704 from "../../../data/1688-products/toys/2026050704/product.json";
import p2026050705 from "../../../data/1688-products/toys/2026050705/product.json";
import p2026050706 from "../../../data/1688-products/toys/2026050706/product.json";
import p2026050707 from "../../../data/1688-products/toys/2026050707/product.json";
import p2026050708 from "../../../data/1688-products/toys/2026050708/product.json";

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

function withSource(data: ProductJson, sourcePath: string) {
  return {data, sourcePath};
}

const importedProducts = [
  withSource(p1601110728943 as ProductJson, "apps/website/data/1688-products/toys/1601110728943/product.json"),
  withSource(p1601730435470 as ProductJson, "apps/website/data/1688-products/toys/1601730435470/product.json"),
  withSource(p1600898789412 as ProductJson, "apps/website/data/1688-products/toys/1600898789412/product.json"),
  withSource(p1601362237263 as ProductJson, "apps/website/data/1688-products/toys/1601362237263/product.json"),
  withSource(p1601728749802 as ProductJson, "apps/website/data/1688-products/toys/1601728749802/product.json"),
  withSource(p1601316583146 as ProductJson, "apps/website/data/1688-products/toys/1601316583146/product.json"),
  withSource(p1601730326005 as ProductJson, "apps/website/data/1688-products/toys/1601730326005/product.json"),
  withSource(p1600884595638 as ProductJson, "apps/website/data/1688-products/toys/1600884595638/product.json"),
  withSource(p1600900125789 as ProductJson, "apps/website/data/1688-products/toys/1600900125789/product.json"),
  withSource(p1601213973459 as ProductJson, "apps/website/data/1688-products/toys/1601213973459/product.json"),
  withSource(p1601214840405 as ProductJson, "apps/website/data/1688-products/toys/1601214840405/product.json"),
  withSource(p1601313719232 as ProductJson, "apps/website/data/1688-products/toys/1601313719232/product.json"),
  withSource(p1601316497567 as ProductJson, "apps/website/data/1688-products/toys/1601316497567/product.json"),
  withSource(p1601724919450 as ProductJson, "apps/website/data/1688-products/toys/1601724919450/product.json"),
  withSource(p1601729143208 as ProductJson, "apps/website/data/1688-products/toys/1601729143208/product.json"),
  withSource(p1601729187617 as ProductJson, "apps/website/data/1688-products/toys/1601729187617/product.json"),
  withSource(p2026050701 as ProductJson, "apps/website/data/1688-products/toys/2026050701/product.json"),
  withSource(p2026050702 as ProductJson, "apps/website/data/1688-products/toys/2026050702/product.json"),
  withSource(p2026050703 as ProductJson, "apps/website/data/1688-products/toys/2026050703/product.json"),
  withSource(p2026050704 as ProductJson, "apps/website/data/1688-products/toys/2026050704/product.json"),
  withSource(p2026050705 as ProductJson, "apps/website/data/1688-products/toys/2026050705/product.json"),
  withSource(p2026050706 as ProductJson, "apps/website/data/1688-products/toys/2026050706/product.json"),
  withSource(p2026050707 as ProductJson, "apps/website/data/1688-products/toys/2026050707/product.json"),
  withSource(p2026050708 as ProductJson, "apps/website/data/1688-products/toys/2026050708/product.json"),
] as const;

export const productSourcePathById = new Map(
  importedProducts.map((item) => [item.data.productId, item.sourcePath]),
);

export const products: ProductJson[] = importedProducts.map((item) => item.data).sort(
  (a, b) => a.priority - b.priority || a.productId.localeCompare(b.productId),
);
