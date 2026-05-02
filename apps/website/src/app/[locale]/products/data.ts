const customSideImage = "/site/products/custom-side-v2.webp";

import type {LocalizedText, ShowcaseProductSeed} from "@/content/site-relaunch";

export const productCollections: Array<{key: ShowcaseProductSeed["collection"]; label: LocalizedText}> = [
  {key: "starter", label: {en: "Starter Kits", zh: "入门套装"}},
  {key: "building", label: {en: "Building Sets", zh: "搭建套装"}},
  {key: "creative", label: {en: "Creative Sets", zh: "创意套装"}},
  {key: "themed", label: {en: "Themed Sets", zh: "主题套装"}},
  {key: "accessories", label: {en: "Accessories", zh: "配件"}},
];

export const pieceBands: Array<{key: ShowcaseProductSeed["pieceBand"]; label: LocalizedText}> = [
  {key: "0-100", label: {en: "0-100 PCS", zh: "0-100 件"}},
  {key: "101-200", label: {en: "101-200 PCS", zh: "101-200 件"}},
  {key: "201-300", label: {en: "201-300 PCS", zh: "201-300 件"}},
  {key: "300plus", label: {en: "300+ PCS", zh: "300+ 件"}},
];

export const productsPageAssets = {
  fallbackImage: "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/products-q92/1601110728943/1.webp",
  lifestyleImage: customSideImage,
} as const;
