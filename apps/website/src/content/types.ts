import type {Locale} from "@/lib/i18n";

export type LocalizedText = Partial<Record<Locale, string>>;

export type NewsCategoryKey =
  | "all"
  | "company"
  | "product"
  | "events"
  | "insights"
  | "awards";

export type NewsArticleSeed = {
  slug: string;
  category: NewsCategoryKey;
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
};

export type ShowcaseProductSeed = {
  productId: string;
  label: LocalizedText;
  summary: LocalizedText;
  collection: "starter" | "building" | "creative" | "themed" | "accessories";
  ageGroup: "3plus" | "5plus" | "8plus" | "10plus";
  pieceBand: "0-100" | "101-200" | "201-300" | "300plus";
  hero?: boolean;
  bestseller?: boolean;
};
