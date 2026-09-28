import type { Metadata } from "next";
import "@/styles/pages/products.css";
import { ArrowRight } from "lucide-react";
import Image from "@/components/media/smart-image";
import Link from "next/link";

import { ProductsCatalogClient } from "@/components/products/products-catalog-client";
import { StructuredData } from "@/components/seo/structured-data";
import { productsPageContent } from "@/content/site";
import { buildPageMetadata } from "@/lib/metadata";
import { getLocaleFromParams, t } from "@/lib/i18n";
import {
  getProductPiecesLabel,
  getProductPriceLabel,
  getCatalogSeoKeywords,
  getShowcaseCatalog,
} from "@/lib/site-data";
import { productsPageAssets } from "@/content/pages/products";
import { toAbsoluteUrl } from "@/lib/site-config";
import { localizedPath, productPath } from "@/lib/routes";

export const dynamic = "force-static";

function copy(locale: "en" | "zh") {
  return {
    heroTitle: t(locale, {
      en: "Fort Building Kits For Kids",
      zh: "儿童堡垒拼搭套装",
    }),
    heroText: t(locale, {
      en: "Explore fort building kits for kids in multiple piece counts, colors and packaging options. Yaoshun supplies wholesale fort building kits with OEM/ODM, private-label packaging and custom configurations for toy brands, retailers and importers.",
      zh: "浏览尧顺东莞源头工厂的搭建玩具、定制玩具、益智拼接套装与可定制产品系列，背后由安全材料方案、玩具 OEM/ODM、定制化开发能力和稳定制造体系提供支持。",
    }),
    categories: t(locale, { en: "Categories", zh: "分类" }),
    allProducts: t(locale, { en: "All Products", zh: "全部产品" }),
    viewDetails: t(locale, { en: "View details", zh: "查看详情" }),
    customTitle: t(locale, {
      en: "Looking for Custom Toys From A Source Factory?",
      zh: "正在寻找源头工厂定制玩具？",
    }),
    customText: t(locale, {
      en: "Yaoshun provides custom fort building kit development tailored to your brand, target market, packaging plan and OEM/ODM delivery requirements.",
      zh: "尧顺提供面向品牌、市场、包装方案与 OEM/ODM 交付要求的搭建玩具和定制玩具开发服务。",
    }),
    customAction: t(locale, { en: "Learn More", zh: "了解更多" }),
    showingText: (start: number, end: number, total: number) =>
      t(locale, {
        en: `Showing ${start}-${end} of ${total} products`,
        zh: `显示 ${start}-${end} / ${total} 个产品`,
      }),
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await getLocaleFromParams(params);
  return buildPageMetadata(
    locale,
    productsPageContent.seo,
    "products",
    getCatalogSeoKeywords(locale),
  );
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await getLocaleFromParams(params);
  const text = copy(locale);
  const catalog = getShowcaseCatalog();

  const catalogItems = catalog.map((item) => ({
    productId: item.product.productId,
    label: item.label,
    summary: item.summary,
    collection: item.collection,
    images: item.images,
    piecesLabel: getProductPiecesLabel(item),
    priceLabel: getProductPriceLabel(item, locale),
    bestseller: item.bestseller,
  }));
  const defaultGridProducts = [...catalog]
    .sort((a, b) => Number(b.bestseller) - Number(a.bestseller))
    .slice(0, 6);
  const homeHref = localizedPath(locale, "home");
  const productsHref = localizedPath(locale, "products");
  const solutionsHref = localizedPath(locale, "solutions");
  const pageUrl = toAbsoluteUrl(productsHref);
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: locale === "zh" ? "首页" : "Home",
          item: toAbsoluteUrl(homeHref),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: locale === "zh" ? "产品" : "Products",
          item: pageUrl,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: text.heroTitle,
      description: text.heroText,
      url: pageUrl,
      inLanguage: locale === "zh" ? "zh-CN" : "en-US",
      mainEntity: {
        "@type": "ItemList",
        itemListElement: defaultGridProducts.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: toAbsoluteUrl(productPath(locale, item.product.productId)),
          name: t(locale, item.label),
        })),
      },
    },
  ];

  return (
    <div className="products-page">
      <StructuredData data={structuredData} />

      <ProductsCatalogClient
        catalog={catalogItems}
        locale={locale}
        text={{
          allProducts: text.allProducts,
          categories: text.categories,
        }}
      />

      <section className="products-oem-banner">
        <div className="products-oem-copy">
          <h2>{text.customTitle}</h2>
          <p>{text.customText}</p>
          <Link
            className="products-oem-link products-oem-cta"
            data-track-destination={solutionsHref}
            data-track-event="cta_click"
            data-track-label="learn_more"
            data-track-location="products_oem_banner"
            href={solutionsHref}
          >
            <span>{text.customAction}</span>
            <ArrowRight size={16} strokeWidth={2.1} />
          </Link>
        </div>

        <div className="products-oem-visual">
          <div className="products-oem-visual-glow" aria-hidden="true" />
          <Image
            alt="OEM ODM support"
            className="products-oem-image"
            height={1023}
            sizes="(min-width: 1024px) 40vw, 100vw"
            src={productsPageAssets.lifestyleImage}
            width={1537}
          />
        </div>
      </section>
    </div>
  );
}
