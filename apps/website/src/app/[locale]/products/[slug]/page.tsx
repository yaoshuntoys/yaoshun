import type { Metadata } from "next";
import "@/styles/pages/product-detail.css";
import Image from "@/components/media/smart-image";
import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  Clock3,
  Package2,
  PackageCheck,
  Palette,
  Puzzle,
  Ruler,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { notFound } from "next/navigation";

import { ProductGallery } from "@/components/products/product-gallery";
import { ProductMediaStrip } from "@/components/products/product-media-strip";
import { StructuredData } from "@/components/seo/structured-data";
import {
  products,
  type ProductJson,
  type ProductJsonPair,
} from "@/content/site/products-catalog";
import { productsPageContent } from "@/content/site";
import { buildMetadata } from "@/lib/metadata";
import {
  findShowcaseProduct,
  getAdjacentShowcaseProducts,
  getPackagingAttributes,
  getPrimaryAttributes,
  getProductBusinessCategories,
  getProductSeoKeywords,
} from "@/lib/site-data";
import { getLocaleFromParams, locales, t, type Locale } from "@/lib/i18n";
import { contactFormPath } from "@/lib/routes";
import { toAbsoluteUrl } from "@/lib/site-config";

const alternateLocale: Record<Locale, Locale> = {
  en: "zh",
  zh: "en",
};

function localize(
  locale: Locale,
  value: Partial<Record<Locale, string>> | undefined,
  fallback = "",
) {
  if (!value) return fallback;
  return value[locale] || value.en || value.zh || fallback;
}

function applyProductSeoTemplate(template: string, productTitle: string) {
  return template.replace("{product}", productTitle);
}

function findProduct(slug: string): ProductJson | undefined {
  return products.find((item) => item.productId === slug);
}

function normalizeLookupLabel(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function findPair(
  locale: Locale,
  pairs: ProductJsonPair[],
  keys: string[],
  options?: { exact?: boolean },
) {
  const normalizedKeys = keys.map(normalizeLookupLabel).filter(Boolean);
  return pairs.find((item) => {
    const labels = [
      localize(locale, item.key),
      localize(
        alternateLocale[locale],
        item.key as Partial<Record<Locale, string>> | undefined,
      ),
    ]
      .map(normalizeLookupLabel)
      .filter(Boolean);

    return normalizedKeys.some((key) =>
      labels.some((label) =>
        options?.exact ? label === key : label.includes(key),
      ),
    );
  });
}

function getPairValue(
  locale: Locale,
  pairs: ProductJsonPair[],
  keys: string[],
  fallback = "-",
  options?: { exact?: boolean },
) {
  return localize(locale, findPair(locale, pairs, keys, options)?.value, fallback);
}

function formatPriceRange(product: ProductJson) {
  const currency = product.pricing?.currency || "$";

  if (
    typeof product.pricing?.min === "number" &&
    typeof product.pricing?.max === "number"
  ) {
    const min = product.pricing.min.toFixed(2);
    const max = product.pricing.max.toFixed(2);
    return product.pricing.min === product.pricing.max
      ? `${currency}${min}`
      : `${currency}${min} - ${max}`;
  }

  const raw = localize("en", product.pricing?.display, "");
  return raw.replace(/^US\$/i, "$") || "-";
}

function normalizeCurrencyCode(currency?: string) {
  const normalized = (currency || "USD").trim().toUpperCase();

  if (!normalized || normalized === "$" || normalized === "US$") {
    return "USD";
  }

  return /^[A-Z]{3}$/.test(normalized) ? normalized : "USD";
}

function formatTierPrice(price: string | undefined) {
  if (!price) return "-";
  const normalized = price.replace(/^US\$/i, "").replace(/^\$/, "");
  const numeric = Number(normalized.replace(/,/g, ""));
  return Number.isFinite(numeric)
    ? `$${numeric.toFixed(2)}`
    : price.replace(/^US\$/i, "$");
}

function getPriceUnit(locale: Locale, minOrder: string) {
  const match = minOrder.trim().match(/([A-Za-z]+)$/);
  if (match?.[1]) {
    return match[1].toLowerCase();
  }
  return t(locale, { en: "unit", zh: "件" });
}

function uniqueLines(lines: string[]) {
  return Array.from(new Set(lines.map((line) => line.trim()).filter(Boolean)));
}

function formatAgeRangeValue(locale: Locale, value: string) {
  const normalized = value.trim();
  if (!normalized || normalized === "-") return "-";

  const numbers = Array.from(
    normalized.matchAll(/\d+(?:\.\d+)?/g),
    (match) => Number(match[0]),
  ).filter((number) => Number.isFinite(number));

  if (numbers.length < 2) return normalized;

  const min = Math.min(...numbers);
  const max = Math.max(...numbers);
  const suffix = locale === "zh" ? "岁" : "years";

  return `${min}-${max} ${suffix}`;
}

function formatLeadTimeQuantityRange(
  locale: Locale,
  minQuantity?: string,
  maxQuantity?: string,
) {
  const range = [minQuantity, maxQuantity]
    .map((value) => value?.trim())
    .filter(Boolean)
    .join(" - ");

  if (!range) return "-";

  return locale === "zh" ? `${range} 箱` : `${range} boxes`;
}

function formatLeadTimeDescription(
  locale: Locale,
  days?: number,
) {
  if (days == null) return "-";

  return locale === "zh"
    ? `预计交付周期约 ${days} 天`
    : `Estimated lead time: ${days} days`;
}

function copy(locale: Locale, title: string, minOrder: string) {
  return {
    bestSeller: t(locale, { en: "Best Seller", zh: "Best Seller" }),
    home: t(locale, { en: "Home", zh: "首页" }),
    products: t(locale, { en: "Products", zh: "产品" }),
    priceLabel: t(locale, {
      en: "Price (FOB Reference)",
      zh: "价格（FOB 参考）",
    }),
    minOrderLabel: t(locale, {
      en: `Minimum Order Quantity: ${minOrder}`,
      zh: `Minimum Order Quantity: ${minOrder}`,
    }),
    quantityBoxes: t(locale, {
      en: "Quantity (boxes)",
      zh: "数量（箱）",
    }),
    priceDollar: t(locale, { en: "Price ($)", zh: "Price ($)" }),
    getLatestPrice: t(locale, { en: "Get Latest Price", zh: "获取最新报价" }),
    chatNow: t(locale, { en: "Chat Now", zh: "立即咨询" }),
    highlights: t(locale, { en: "Product Highlights", zh: "产品亮点" }),
    productDetails: t(locale, { en: "Product Details", zh: "产品详情" }),
    highlightImageAlt: t(locale, {
      en: `${title} lifestyle visual`,
      zh: `${title} 场景图`,
    }),
    attributes: t(locale, { en: "Product Attributes", zh: "产品属性" }),
    ageRange: "Age Range",
    material: "Material",
    service: "Service",
    package: "Package",
    gender: "Gender",
    type: "Type",
    modelNumber: "Model Number",
    placeOfOrigin: "Place of Origin",
    customization: t(locale, { en: "Customization Options", zh: "定制选项" }),
    customizationOnRequest: t(locale, {
      en: "Customization on Request",
      zh: "按需定制",
    }),
    customizationHelp: t(locale, {
      en: "Please contact our team to confirm branding, packaging, and specification needs.",
      zh: "请联系团队确认品牌、包装与规格需求。",
    }),
    packagingShipping: t(locale, {
      en: "Packaging & Shipping",
      zh: "包装与运输",
    }),
    leadTime: t(locale, { en: "Lead Time", zh: "交期" }),
    leadTimeDays: t(locale, { en: "Lead Time (days)", zh: "交期（天）" }),
    leadTimeFallback: t(locale, {
      en: "Lead time will be confirmed based on order quantity and customization scope.",
      zh: "交期需根据数量与定制要求进一步确认。",
    }),
    previousProduct: t(locale, { en: "Previous Product", zh: "上一产品" }),
    nextProduct: t(locale, { en: "Next Product", zh: "下一产品" }),
    backToProducts: t(locale, { en: "Back to Products", zh: "返回产品列表" }),
    browseMoreProducts: t(locale, {
      en: "Browse More Products",
      zh: "浏览更多产品",
    }),
  };
}

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    products
      .filter((item) => Boolean(item.productId))
      .map((item) => ({ locale, slug: item.productId })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const locale = await getLocaleFromParams(
    params as Promise<{ locale: string }>,
  );
  const { slug } = await params;
  const product = findProduct(slug);

  if (!product) {
    return buildMetadata(
      locale,
      t(locale, { en: "Product Detail", zh: "产品详情" }),
      t(locale, {
        en: "yaoshun toys product detail",
        zh: "yaoshun toys 产品详情",
      }),
      `products/${slug}`,
    );
  }

  const productTitle = localize(locale, product.title, slug);
  const descriptionList = product.description || { en: [], zh: [] };
  const productDescription =
    descriptionList[locale]?.[0] ||
    descriptionList.en?.[0] ||
    descriptionList.zh?.[0] ||
    productTitle;
  const title = applyProductSeoTemplate(
    t(locale, productsPageContent.seo.detailTitleTemplate),
    productTitle,
  );
  const description = applyProductSeoTemplate(
    t(locale, productsPageContent.seo.detailDescriptionTemplate),
    productTitle,
  );
  return buildMetadata(
    locale,
    title,
    description || productDescription,
    `products/${slug}`,
    [
      ...getProductSeoKeywords(locale, product),
      productTitle,
    ],
  );
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const locale = await getLocaleFromParams(
    params as Promise<{ locale: string }>,
  );
  const { slug } = await params;
  const product = findProduct(slug);

  if (!product) {
    notFound();
  }

  const showcase = findShowcaseProduct(slug);
  const adjacentProducts = getAdjacentShowcaseProducts(slug);
  const title = localize(locale, product.title, slug);
  const allImages = product.images || [];
  const allVideos = product.videos || [];
  const attributes = getPrimaryAttributes(product, 20);
  const packaging = getPackagingAttributes(product, 6);
  const descriptionList = product.description || { en: [], zh: [] };
  const descriptionLines =
    descriptionList[locale] || descriptionList.en || descriptionList.zh || [];
  const categoryTrail = getProductBusinessCategories(locale, product);
  const minOrder = localize(locale, product.pricing?.minOrder, "");
  const priceUnit = getPriceUnit(locale, minOrder);
  const ageRange = formatAgeRangeValue(
    locale,
    getPairValue(locale, attributes, ["age range", "age"], "-", { exact: true }),
  );
  const material = getPairValue(locale, attributes, ["material"]);
  const gender = getPairValue(locale, attributes, ["gender"]);
  const typeValue =
    getPairValue(locale, attributes, ["type"], "-", { exact: true }) !== "-"
      ? getPairValue(locale, attributes, ["type"], "-", { exact: true })
      : getPairValue(locale, attributes, ["style"]);
  const modelNumber = getPairValue(locale, attributes, [
    "model number",
    "model",
  ]);
  const origin = getPairValue(locale, attributes, [
    "place of origin",
    "origin",
  ]);
  const functionPair = findPair(locale, attributes, ["function"]);
  const servicePair = findPair(locale, attributes, ["service", "oem", "odm"]);
  const featurePair = findPair(locale, attributes, ["feature"]);
  const packagePair = findPair(locale, attributes, ["package", "packing"]);
  const weightPair = findPair(locale, attributes, ["weight", "gross weight"]);
  const sizePair = findPair(
    locale,
    [...attributes, ...packaging],
    ["single package size", "packing size", "unit size", "size"],
  );
  const colorPair = findPair(locale, attributes, ["color"]);
  const highlightImage =
    allImages[4] || allImages[3] || allImages[1] || allImages[0] || "";
  const mediaImages =
    allImages.length > 0 ? allImages : highlightImage ? [highlightImage] : [];
  const customizationOptions = product.customizationOptions || [];
  const text = copy(locale, title, minOrder);
  const featureCards = [
    { icon: ShieldCheck, label: text.material, value: material },
    { icon: Sparkles, label: text.ageRange, value: ageRange },
    {
      icon: Palette,
      label: text.service,
      value: localize(locale, servicePair?.value, "-"),
    },
    {
      icon: Puzzle,
      label: text.package,
      value: localize(locale, packagePair?.value, "-"),
    },
  ];
  const highlightBullets = uniqueLines([
    descriptionLines[0] || "",
    functionPair
      ? `${localize(locale, functionPair.key)}: ${localize(locale, functionPair.value)}`
      : "",
    featurePair
      ? `${localize(locale, featurePair.key)}: ${localize(locale, featurePair.value)}`
      : "",
    servicePair
      ? `${localize(locale, servicePair.key)}: ${localize(locale, servicePair.value)}`
      : "",
    sizePair
      ? `${localize(locale, sizePair.key)}: ${localize(locale, sizePair.value)}`
      : "",
    weightPair
      ? `${localize(locale, weightPair.key)}: ${localize(locale, weightPair.value)}`
      : "",
  ]).slice(0, 5);
  const detailSections = (product.productDetails || [])
    .map((item, index) => ({
      id: `${slug}-detail-${index}`,
      image: item.image,
      title: localize(locale, item.sectionTitle, ""),
      text: localize(locale, item.text, ""),
    }))
    .filter((item) => item.text);
  const detailVisuals = [
    ...mediaImages.filter((image) => image !== highlightImage),
    ...(highlightImage ? [highlightImage] : []),
  ];
  const detailArticleSections = detailSections.map((item, index) => ({
    ...item,
    image:
      item.image ||
      detailVisuals[index % Math.max(detailVisuals.length, 1)] ||
      highlightImage,
  }));
  const attributePairs = (product.attributePairs || [
    ...(product.productAttributes || []),
    ...(product.specifications || []),
  ])
    .map((item) => ({
      label: localize(locale, item.key, ""),
      value: localize(locale, item.value, ""),
    }))
    .filter((item) => item.label && item.value)
    .filter((item, index, list) => {
      const normalizedLabel = normalizeLookupLabel(item.label);
      return (
        list.findIndex(
          (candidate) =>
            normalizeLookupLabel(candidate.label) === normalizedLabel,
        ) === index
      );
    });
  const attributeRows = Array.from(
    { length: Math.ceil(attributePairs.length / 2) },
    (_, index) => attributePairs.slice(index * 2, index * 2 + 2),
  );
  const customizationItems =
    customizationOptions.length > 0
      ? customizationOptions.map((item, index) => ({
          key: `${localize(locale, item.label)}-${index}`,
          title: localize(locale, item.label),
          text: localize(locale, item.minOrder, ""),
        }))
      : [
          servicePair
            ? {
                key: "service",
                title: localize(locale, servicePair.key),
                text: localize(locale, servicePair.value),
              }
            : null,
          colorPair
            ? {
                key: "color",
                title: localize(locale, colorPair.key),
                text: localize(locale, colorPair.value),
              }
            : null,
          packagePair
            ? {
                key: "packing",
                title: localize(locale, packagePair.key),
                text: localize(locale, packagePair.value),
              }
            : null,
        ].filter((item): item is { key: string; title: string; text: string } =>
          Boolean(item),
        );
  const fallbackPackagingItems = [sizePair, weightPair].filter(
    (item): item is ProductJsonPair => Boolean(item),
  );
  const packagingItems = (
    packaging.length > 0 ? packaging : fallbackPackagingItems
  ).slice(0, 4);
  const leadTime = product.leadTime?.tiers || [];
  const topBadges = uniqueLines([
    minOrder ? `MOQ ${minOrder}` : "",
    showcase?.bestseller ? text.bestSeller : "",
  ]).slice(0, 2);
  const productUrl = toAbsoluteUrl(`/${locale}/products/${slug}`);
  const productDescription = uniqueLines(descriptionLines).join(" ").trim() || title;
  const categoryNames = categoryTrail;
  const structuredImages = mediaImages.slice(0, 8).map((image) => toAbsoluteUrl(image));
  const currencyCode = normalizeCurrencyCode(product.pricing?.currency);
  const hasMinPrice = typeof product.pricing?.min === "number";
  const hasMaxPrice = typeof product.pricing?.max === "number";
  const structuredOffer =
    hasMinPrice || hasMaxPrice
      ? product.pricing?.isRange ||
        (hasMinPrice &&
          hasMaxPrice &&
          product.pricing?.min !== product.pricing?.max)
        ? {
            "@type": "AggregateOffer",
            lowPrice: product.pricing?.min ?? product.pricing?.max,
            highPrice: product.pricing?.max ?? product.pricing?.min,
            priceCurrency: currencyCode,
            availability: "https://schema.org/InStock",
            url: productUrl,
            seller: {
              "@type": "Organization",
              name: "Dongguan Yaoshun Technology Co., Ltd.",
            },
          }
        : {
            "@type": "Offer",
            price: product.pricing?.min ?? product.pricing?.max,
            priceCurrency: currencyCode,
            availability: "https://schema.org/InStock",
            url: productUrl,
            seller: {
              "@type": "Organization",
              name: "Dongguan Yaoshun Technology Co., Ltd.",
            },
          }
      : undefined;
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: text.home,
          item: toAbsoluteUrl(`/${locale}`),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: text.products,
          item: toAbsoluteUrl(`/${locale}/products`),
        },
        {
          "@type": "ListItem",
          position: 3,
          name: title,
          item: productUrl,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: title,
      description: productDescription,
      sku: product.productId,
      mpn: modelNumber !== "-" ? modelNumber : undefined,
      category: categoryNames.join(" / ") || undefined,
      image: structuredImages.length > 0 ? structuredImages : undefined,
      brand: {
        "@type": "Brand",
        name: "yaoshun toys",
      },
      manufacturer: {
        "@type": "Organization",
        name: "Dongguan Yaoshun Technology Co., Ltd.",
      },
      material: material !== "-" ? material : undefined,
      offers: structuredOffer,
      additionalProperty: attributePairs.slice(0, 12).map((item) => ({
        "@type": "PropertyValue",
        name: item.label,
        value: item.value,
      })),
    },
  ];

  return (
    <div className="site-container grid gap-7 pb-4 pt-4 sm:pt-6 lg:gap-10">
      <StructuredData data={structuredData} />

      <nav
        aria-label="Breadcrumb"
        className="flex min-h-[3.25rem] items-center gap-2 overflow-x-auto rounded-[1rem] border border-[rgba(24,56,138,0.08)] bg-white px-3 py-3 text-[0.8rem] leading-6 text-[#6f7ea9] shadow-[0_14px_34px_-32px_rgba(18,41,103,0.18)] sm:px-4"
      >
        <Link
          className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full px-3 transition hover:bg-[#2563ff]/8 hover:text-[#2563ff]"
          data-track-destination={`/${locale}`}
          data-track-event="breadcrumb_click"
          data-track-label={text.home}
          data-track-location="product_detail_breadcrumbs"
          href={`/${locale}`}
        >
          {text.home}
        </Link>
        <span className="shrink-0">/</span>
        <Link
          className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full px-3 transition hover:bg-[#2563ff]/8 hover:text-[#2563ff]"
          data-track-destination={`/${locale}/products`}
          data-track-event="breadcrumb_click"
          data-track-label={text.products}
          data-track-location="product_detail_breadcrumbs"
          href={`/${locale}/products`}
        >
          {text.products}
        </Link>
        {categoryTrail.map((category, index) => (
          <div
            className="flex min-w-0 shrink items-center gap-2"
            key={`${category}-${index}`}
          >
            <span className="shrink-0">/</span>
            <span className="truncate">{category}</span>
          </div>
        ))}
        <span className="shrink-0">/</span>
        <span className="min-w-0 truncate font-semibold text-[#17306e]">
          {title}
        </span>
      </nav>

      <section className="grid min-w-0 items-start gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-8">
        <ProductGallery
          images={allImages}
          key={allImages.join("|")}
          locale={locale}
          title={title}
        />

        <div className="grid min-w-0 content-start gap-4 lg:gap-5">
          <div className="grid gap-3">
            <h1 className="m-0 break-words font-display text-[1.9rem] font-semibold leading-[1.14] text-[#17306e] sm:text-[2.35rem] lg:text-[3rem]">
              {title}
            </h1>
            {topBadges.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {topBadges.map((badge) => (
                  <span
                    className="inline-flex min-h-8 items-center rounded-full bg-[rgba(37,99,255,0.08)] px-3 text-[0.8rem] font-bold text-[#2563ff]"
                    key={badge}
                  >
                    {badge}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <div className="grid gap-4 rounded-[1.55rem] border border-[rgba(24,56,138,0.08)] bg-white p-5 shadow-[0_18px_44px_-34px_rgba(18,41,103,0.16)] sm:p-6">
            <div className="grid gap-2">
              <p className="m-0 text-[0.96rem] font-medium text-[#6f7ea9]">
                {text.priceLabel}
              </p>
              <div className="font-display text-[1.8rem] font-extrabold leading-none text-[#ff7e1f] sm:text-[2.35rem]">
                {formatPriceRange(product)}
                <span className="ml-2 inline-block text-[0.95rem] font-semibold text-[#6f7ea9]">
                  / {priceUnit}
                </span>
              </div>
              {minOrder ? (
                <strong className="text-[0.98rem] font-semibold text-[#4d608b]">
                  {text.minOrderLabel}
                </strong>
              ) : null}
            </div>

            {product.pricing?.tiers?.length ? (
              <div className="overflow-hidden rounded-[1.2rem] border border-[rgba(24,56,138,0.08)]">
                <table className="w-full border-collapse bg-white">
                  <thead>
                    <tr className="bg-[#f8fbff]">
                      <th className="border-b border-[rgba(24,56,138,0.08)] px-4 py-3 text-left text-[0.82rem] font-bold text-[#6f7ea9]">
                        {text.quantityBoxes}
                      </th>
                      <th className="border-b border-[rgba(24,56,138,0.08)] px-4 py-3 text-left text-[0.82rem] font-bold text-[#6f7ea9]">
                        {text.priceDollar}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.pricing.tiers.map((tier, index) => (
                      <tr key={`${tier.price}-${index}`}>
                        <td className="border-b border-[rgba(24,56,138,0.08)] px-4 py-3 text-[0.95rem] text-[#17306e]">
                          {localize(locale, tier.quantity, "-")}
                        </td>
                        <td className="border-b border-[rgba(24,56,138,0.08)] px-4 py-3 text-[0.95rem] font-semibold text-[#17306e]">
                          {formatTierPrice(tier.price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}

            <div className="flex flex-wrap gap-3">
              <Link
                className="inline-flex min-h-[3.2rem] w-full items-center justify-center gap-2 rounded-full border border-transparent bg-[linear-gradient(135deg,#2563ff_0%,#1a43c9_100%)] px-6 text-[0.98rem] font-bold text-[#fff] shadow-[0_18px_40px_-20px_rgba(37,99,255,0.68)] transition hover:-translate-y-0.5 hover:text-[#fff] sm:w-auto"
                data-track-destination={contactFormPath(locale)}
                data-track-event="cta_click"
                data-track-label="get_latest_price"
                data-track-location="product_detail_quote"
                href={contactFormPath(locale)}
              >
                <span className="text-[#fff]">{text.getLatestPrice}</span>
                <ArrowRight
                  className="text-[#fff]"
                  size={16}
                  strokeWidth={2.1}
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="grid overflow-hidden rounded-[1.3rem] border border-[rgba(24,56,138,0.08)] bg-white shadow-[0_18px_44px_-34px_rgba(18,41,103,0.16)] sm:rounded-[1.6rem] md:grid-cols-2 xl:grid-cols-4">
        {featureCards.map((item, index) => {
          const Icon = item.icon;
          return (
            <article
              className={`flex gap-3 px-4 py-4 text-[#2563ff] sm:gap-4 sm:px-6 sm:py-5 ${index > 0 ? "border-t border-[rgba(24,56,138,0.08)] md:border-l md:border-t-0 xl:border-l" : ""}`}
              key={item.label}
            >
              <Icon className="mt-0.5 shrink-0" size={26} strokeWidth={1.8} />
              <div className="grid gap-1">
                <h2 className="m-0 text-[1rem] font-semibold text-[#17306e]">
                  {item.label}
                </h2>
                <p className="m-0 text-[0.95rem] leading-7 text-[#50638f]">
                  {item.value || "-"}
                </p>
              </div>
            </article>
          );
        })}
      </section>

      <section className="grid overflow-hidden rounded-[1.4rem] border border-[rgba(24,56,138,0.08)] bg-[linear-gradient(135deg,#eef5ff_0%,#ffffff_100%)] shadow-[0_18px_44px_-34px_rgba(18,41,103,0.16)] sm:rounded-[1.7rem] lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="grid content-start gap-4 px-5 py-5 sm:gap-5 sm:px-8 sm:py-8">
          <h2 className="m-0 font-display text-[1.5rem] font-semibold text-[#17306e] sm:text-[1.7rem]">
            {text.highlights}
          </h2>
          <ul className="m-0 grid gap-3 p-0">
            {highlightBullets.map((item) => (
              <li
              className="flex gap-3 list-none text-[0.95rem] leading-7 text-[#50638f] sm:text-[0.98rem] sm:leading-8"
                key={item}
              >
                <span className="mt-[0.7rem] inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-[#2563ff]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative aspect-[4/3] min-h-0 overflow-hidden bg-[#f8fbff] lg:aspect-auto lg:h-full lg:min-h-[13.5rem] lg:w-[clamp(14rem,22vw,19rem)]">
          {highlightImage ? (
            <Image
              alt={text.highlightImageAlt}
              className="object-contain object-center"
              fill
              sizes="(min-width: 1024px) 19rem, 100vw"
              src={highlightImage}
            />
          ) : null}
        </div>
      </section>

      <section className="rounded-[1.4rem] border border-[rgba(24,56,138,0.08)] bg-white p-4 shadow-[0_18px_44px_-34px_rgba(18,41,103,0.16)] sm:rounded-[1.7rem] sm:p-6">
        <h2 className="m-0 font-display text-[1.45rem] font-semibold text-[#17306e] sm:text-[1.55rem]">
          {text.attributes}
        </h2>
        <div className="mt-5 grid gap-2 sm:hidden">
          {attributePairs.map((item) => (
            <article
              className="grid gap-1 rounded-[1rem] border border-[rgba(24,56,138,0.08)] bg-[#f8fbff] px-4 py-3"
              key={`${item.label}-${item.value}`}
            >
              <h3 className="m-0 text-[0.78rem] font-bold uppercase tracking-[0.08em] text-[#6f7ea9]">
                {item.label}
              </h3>
              <p className="m-0 break-words text-[0.95rem] leading-7 text-[#17306e]">
                {item.value}
              </p>
            </article>
          ))}
        </div>
        <div className="mt-5 hidden overflow-x-auto rounded-[1.2rem] border border-[rgba(24,56,138,0.08)] sm:block">
          <table className="w-full min-w-[720px] border-collapse bg-white">
            <tbody>
              {attributeRows.map((row, index) => (
                <tr key={`attribute-row-${index}`}>
                  <th className="w-[20%] border-b border-[rgba(24,56,138,0.08)] bg-[#f8fbff] px-4 py-3 text-left text-[0.84rem] font-bold text-[#6f7ea9]">
                    {row[0]?.label || "-"}
                  </th>
                  <td className="w-[30%] border-b border-[rgba(24,56,138,0.08)] px-4 py-3 text-[0.95rem] text-[#17306e]">
                    {row[0]?.value || "-"}
                  </td>
                  <th className="w-[20%] border-b border-[rgba(24,56,138,0.08)] bg-[#f8fbff] px-4 py-3 text-left text-[0.84rem] font-bold text-[#6f7ea9]">
                    {row[1]?.label || ""}
                  </th>
                  <td className="w-[30%] border-b border-[rgba(24,56,138,0.08)] px-4 py-3 text-[0.95rem] text-[#17306e]">
                    {row[1]?.value || ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-[1.4rem] border border-[rgba(24,56,138,0.08)] bg-white p-4 shadow-[0_18px_44px_-34px_rgba(18,41,103,0.16)] sm:rounded-[1.7rem] sm:p-6">
          <h2 className="m-0 font-display text-[1.35rem] font-semibold text-[#17306e] sm:text-[1.55rem]">
            {text.customization}
          </h2>
          <div className="mt-5 grid gap-5">
            {customizationItems.length > 0 ? (
              customizationItems.map((item, index) => (
                <div className="flex gap-4 text-[#2563ff]" key={item.key}>
                  {index === 0 ? (
                    <Palette size={22} strokeWidth={1.85} />
                  ) : index === 1 ? (
                    <Boxes size={22} strokeWidth={1.85} />
                  ) : (
                    <Sparkles size={22} strokeWidth={1.85} />
                  )}
                  <div className="grid gap-1">
                    <h3 className="m-0 text-[1rem] font-semibold text-[#17306e]">
                      {item.title}
                    </h3>
                    <p className="m-0 text-[0.95rem] leading-7 text-[#50638f]">
                      {item.text || "-"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex gap-4 text-[#2563ff]">
                <Palette size={22} strokeWidth={1.85} />
                <div className="grid gap-1">
                  <h3 className="m-0 text-[1rem] font-semibold text-[#17306e]">
                    {text.customizationOnRequest}
                  </h3>
                  <p className="m-0 text-[0.95rem] leading-7 text-[#50638f]">
                    {text.customizationHelp}
                  </p>
                </div>
              </div>
            )}
          </div>
        </article>

        <article className="rounded-[1.4rem] border border-[rgba(24,56,138,0.08)] bg-white p-4 shadow-[0_18px_44px_-34px_rgba(18,41,103,0.16)] sm:rounded-[1.7rem] sm:p-6">
          <h2 className="m-0 font-display text-[1.35rem] font-semibold text-[#17306e] sm:text-[1.55rem]">
            {text.packagingShipping}
          </h2>
          <div className="mt-5 grid gap-5">
            {packagingItems.map((item, index) => (
              <div
                className="flex gap-4 text-[#2563ff]"
                key={`${localize(locale, item.key)}-${index}`}
              >
                {index === 0 ? (
                  <Ruler size={22} strokeWidth={1.85} />
                ) : index === 1 ? (
                  <Package2 size={22} strokeWidth={1.85} />
                ) : (
                  <Boxes size={22} strokeWidth={1.85} />
                )}
                <div className="grid gap-1">
                  <h3 className="m-0 text-[1rem] font-semibold text-[#17306e]">
                    {localize(locale, item.key, "-")}
                  </h3>
                  <p className="m-0 text-[0.95rem] leading-7 text-[#50638f]">
                    {localize(locale, item.value, "-")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[1.4rem] border border-[rgba(24,56,138,0.08)] bg-white p-4 shadow-[0_18px_44px_-34px_rgba(18,41,103,0.16)] sm:rounded-[1.7rem] sm:p-6">
          <h2 className="m-0 font-display text-[1.35rem] font-semibold text-[#17306e] sm:text-[1.55rem]">
            {text.leadTime}
          </h2>
          {leadTime.length > 0 ? (
            <div className="mt-5 grid gap-5">
              {leadTime.map((item, index) => (
                <div
                  className="flex gap-4 text-[#2563ff]"
                  key={`${item.minQuantity}-${index}`}
                >
                  {index % 3 === 0 ? (
                    <Clock3 size={22} strokeWidth={1.85} />
                  ) : index % 3 === 1 ? (
                    <Truck size={22} strokeWidth={1.85} />
                  ) : (
                    <PackageCheck size={22} strokeWidth={1.85} />
                  )}
                  <div className="grid gap-1">
                    <h3 className="m-0 text-[1rem] font-semibold text-[#17306e]">
                      {formatLeadTimeQuantityRange(
                        locale,
                        item.minQuantity,
                        item.maxQuantity,
                      )}
                    </h3>
                    <p className="m-0 text-[0.95rem] leading-7 text-[#50638f]">
                      {formatLeadTimeDescription(
                        locale,
                        item.processPeriodDays,
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-5 text-[0.95rem] leading-7 text-[#50638f]">
              {text.leadTimeFallback}
            </div>
          )}
        </article>
      </section>

      {detailSections.length > 0 ? (
        <section className="overflow-hidden rounded-[1.4rem] border border-[rgba(24,56,138,0.08)] bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_34%)] p-4 shadow-[0_18px_44px_-34px_rgba(18,41,103,0.16)] sm:rounded-[1.7rem] sm:p-6">
          <div className="grid gap-3 border-b border-[rgba(24,56,138,0.08)] pb-5">
            <div className="grid gap-2">
              <span className="inline-flex w-fit items-center rounded-full bg-[rgba(37,99,255,0.08)] px-3 py-1 text-[0.78rem] font-bold uppercase tracking-[0.12em] text-[#2563ff]">
                {text.productDetails}
              </span>
              <h2 className="m-0 max-w-[48rem] font-display text-[1.45rem] font-semibold leading-tight text-[#17306e] sm:text-[1.85rem]">
                {title}
              </h2>
            </div>
            <p className="m-0 max-w-[58rem] text-[0.95rem] leading-7 text-[#50638f] sm:text-[1rem] sm:leading-8">
              {descriptionLines[0] || productDescription}
            </p>
          </div>

          <div className="mt-5 grid overflow-hidden rounded-[1.25rem] border border-[rgba(24,56,138,0.08)] bg-white">
            {detailArticleSections.map((item, index) => {
              const reverse = index % 2 === 1;
              return (
                <article
                  className={`group grid gap-0 border-b border-[rgba(24,56,138,0.08)] last:border-b-0 ${
                    reverse
                      ? "lg:grid-cols-[minmax(0,1fr)_auto]"
                      : "lg:grid-cols-[auto_minmax(0,1fr)]"
                  }`}
                  key={item.id}
                >
                  <div
                    className={`relative aspect-[4/3] overflow-hidden bg-[linear-gradient(135deg,#f7faff_0%,#ffffff_100%)] lg:aspect-auto lg:h-full lg:min-h-[13.5rem] lg:w-[clamp(14rem,22vw,19rem)] ${
                      reverse ? "lg:order-2" : ""
                    }`}
                  >
                    {item.image ? (
                      <Image
                        alt={`${item.title || title} ${index + 1}`}
                        className="object-contain object-center"
                        fill
                        sizes="(min-width: 1024px) 19rem, 100vw"
                        src={item.image}
                      />
                    ) : null}
                  </div>
                  <div
                    className={`grid content-center gap-3 p-5 transition duration-200 group-hover:bg-[#fbfdff] sm:p-6 lg:min-h-[13.5rem] lg:px-8 ${
                      reverse ? "lg:order-1" : ""
                    }`}
                  >
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(37,99,255,0.08)] text-[0.78rem] font-extrabold text-[#2563ff]">
                      {(index + 1).toString().padStart(2, "0")}
                    </span>
                    <h3 className="m-0 font-display text-[1.18rem] font-semibold leading-tight text-[#17306e] sm:text-[1.35rem]">
                      {item.title || text.productDetails}
                    </h3>
                    <p className="m-0 text-[0.96rem] leading-7 text-[#50638f] sm:text-[1rem] sm:leading-8">
                      {item.text}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ) : null}

      <ProductMediaStrip
        images={mediaImages}
        locale={locale}
        title={title}
        videos={allVideos}
      />

      <section className="grid gap-4 md:grid-cols-2">
        <Link
          className="grid gap-3 rounded-[1.5rem] border border-[rgba(24,56,138,0.08)] bg-white p-5 shadow-[0_18px_44px_-34px_rgba(18,41,103,0.16)] transition hover:-translate-y-1 hover:border-[rgba(37,99,255,0.14)] hover:shadow-[0_26px_56px_-34px_rgba(18,41,103,0.22)] sm:p-6"
          data-track-destination={
            adjacentProducts.previous
              ? `/${locale}/products/${adjacentProducts.previous.product.productId}`
              : `/${locale}/products`
          }
          data-track-event={adjacentProducts.previous ? "product_card_click" : "nav_click"}
          data-track-label={adjacentProducts.previous?.product.productId ?? "back_to_products"}
          data-track-location="product_detail_adjacent"
          href={
            adjacentProducts.previous
              ? `/${locale}/products/${adjacentProducts.previous.product.productId}`
              : `/${locale}/products`
          }
          prefetch={false}
        >
          <span className="text-[0.82rem] font-bold uppercase tracking-[0.12em] text-[#2563ff]">
            {text.previousProduct}
          </span>
          <strong className="font-display text-[1.28rem] leading-[1.2] tracking-[-0.04em] text-[#17306e]">
            {adjacentProducts.previous
              ? t(locale, adjacentProducts.previous.label)
              : text.backToProducts}
          </strong>
          <p className="m-0 text-[0.94rem] leading-7 text-[#6d7ca7]">
            {adjacentProducts.previous
              ? t(locale, adjacentProducts.previous.summary)
              : text.priceLabel}
          </p>
        </Link>

        <Link
          className="grid gap-3 rounded-[1.5rem] border border-[rgba(24,56,138,0.08)] bg-white p-5 text-right shadow-[0_18px_44px_-34px_rgba(18,41,103,0.16)] transition hover:-translate-y-1 hover:border-[rgba(37,99,255,0.14)] hover:shadow-[0_26px_56px_-34px_rgba(18,41,103,0.22)] sm:p-6"
          data-track-destination={
            adjacentProducts.next
              ? `/${locale}/products/${adjacentProducts.next.product.productId}`
              : `/${locale}/products`
          }
          data-track-event={adjacentProducts.next ? "product_card_click" : "nav_click"}
          data-track-label={adjacentProducts.next?.product.productId ?? "browse_more_products"}
          data-track-location="product_detail_adjacent"
          href={
            adjacentProducts.next
              ? `/${locale}/products/${adjacentProducts.next.product.productId}`
              : `/${locale}/products`
          }
          prefetch={false}
        >
          <span className="text-[0.82rem] font-bold uppercase tracking-[0.12em] text-[#2563ff]">
            {text.nextProduct}
          </span>
          <strong className="font-display text-[1.28rem] leading-[1.2] tracking-[-0.04em] text-[#17306e]">
            {adjacentProducts.next
              ? t(locale, adjacentProducts.next.label)
              : text.browseMoreProducts}
          </strong>
          <p className="m-0 text-[0.94rem] leading-7 text-[#6d7ca7]">
            {adjacentProducts.next
              ? t(locale, adjacentProducts.next.summary)
              : text.products}
          </p>
        </Link>
      </section>
    </div>
  );
}
