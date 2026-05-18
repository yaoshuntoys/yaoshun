import type { Metadata } from "next";
import "@/styles/pages/products.css";
import {
  ArrowRight,
  Boxes,
  PackageCheck,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import Image from "@/components/media/smart-image";
import Link from "next/link";

import { PageHero } from "@/components/sections/page-hero";
import { ProductsCatalogClient } from "@/components/products/products-catalog-client";
import { ProductsFeaturedCarousel } from "@/components/products/products-featured-carousel";
import { StructuredData } from "@/components/seo/structured-data";
import { productsPageContent } from "@/content/site";
import { buildPageMetadata } from "@/lib/metadata";
import { getLocaleFromParams, t } from "@/lib/i18n";
import {
  getProductPiecesLabel,
  getProductPriceLabel,
  getCatalogSeoKeywords,
  getProductsFeaturedRailCatalog,
  getShowcaseCatalog,
} from "@/lib/site-data";
import { productsPageAssets } from "@/content/pages/products";
import { toAbsoluteUrl } from "@/lib/site-config";
import { localizedPath, productPath } from "@/lib/routes";

export const dynamic = "force-static";

function copy(locale: "en" | "zh") {
  return {
    heroEyebrow: t(locale, { en: "Yaoshun Source Factory Products", zh: "尧顺源头工厂产品" }),
    heroTitle: t(locale, {
      en: "Building Toys And Custom Toys",
      zh: "搭建玩具与定制玩具",
    }),
    heroTitleLead: t(locale, {en: "Product Catalog For", zh: "搭建玩具"}),
    heroTitleBlue: t(locale, {en: "Building", zh: "产品"}),
    heroTitleOrange: t(locale, {en: "Toys", zh: "目录"}),
    heroText: t(locale, {
      en: "Explore building toys, custom toys, educational interlocking sets, and custom-ready product lines from Yaoshun, a Dongguan source factory supporting safe materials, toy OEM/ODM, custom development, and stable manufacturing execution.",
      zh: "浏览尧顺东莞源头工厂的搭建玩具、定制玩具、益智拼接套装与可定制产品系列，背后由安全材料方案、玩具 OEM/ODM、定制化开发能力和稳定制造体系提供支持。",
    }),
    heroAlt: t(locale, {
      en: "yaoshun toys product collection hero visual",
      zh: "yaoshun toys 产品系列主视觉",
    }),
    featuredEyebrow: t(locale, { en: "FEATURED COLLECTION", zh: "精选系列" }),
    featuredTitle: t(locale, {
      en: "Source-Factory DIY Building Toy Sets",
      zh: "源头工厂搭建DIY玩具套装",
    }),
    categories: t(locale, { en: "Categories", zh: "分类" }),
    allProducts: t(locale, { en: "All Products", zh: "全部产品" }),
    viewDetails: t(locale, { en: "View details", zh: "查看详情" }),
    browseCatalog: t(locale, {en: "Browse Catalog", zh: "浏览目录"}),
    customService: t(locale, {en: "Custom Service", zh: "定制服务"}),
    customTitle: t(locale, {
      en: "Looking for Custom Toys From A Source Factory?",
      zh: "正在寻找源头工厂定制玩具？",
    }),
    customText: t(locale, {
      en: "Yaoshun provides custom building toy and custom toy development tailored to your brand, market, packaging plan, and OEM/ODM delivery requirements.",
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

  const featuredRail = getProductsFeaturedRailCatalog();
  const featuredRailItems = featuredRail.map((item) => ({
    id: item.product.productId,
    href: productPath(locale, item.product.productId),
    image: item.images[0] || productsPageAssets.fallbackImage,
    label: item.label,
    summary: item.summary,
    bestseller: item.bestseller,
  }));
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
      <PageHero
        backgroundClassName="products-hero-background"
        backgroundImageClassName="products-hero-background-image"
        backgroundSrc="/site/misc/product-bg.webp"
        copyClassName="products-hero-copy"
        gridClassName="products-hero-grid"
        innerClassName="products-hero-inner"
        sectionClassName="products-hero"
      >
        <p className="products-hero-eyebrow">{text.heroEyebrow}</p>
        <h1 className="products-hero-title">
          <span>{text.heroTitleLead}</span>
          <span>
            <span className="hero-blue-word">{text.heroTitleBlue}</span>{" "}
            <span className="hero-orange-word">{text.heroTitleOrange}</span>
          </span>
        </h1>
        <p className="products-hero-text">{text.heroText}</p>

        <div className="page-hero-actions">
          <Link className="hero-primary-cta" href={`${productsHref}#products-catalog`}>
            <span>{text.browseCatalog}</span>
            <ArrowRight size={16} strokeWidth={2.25} />
          </Link>
          <Link className="hero-secondary-cta" href={solutionsHref}>
            <span>{text.customService}</span>
            <span className="hero-secondary-dot" />
          </Link>
        </div>

        <div className="hero-feature-strip">
          {[
            {
              title: { en: "Safe Material Options", zh: "安全材料可选" },
              icon: ShieldCheck,
            },
            {
              title: { en: "OEM/ODM Catalog Review", zh: "OEM/ODM 目录评估" },
              icon: Boxes,
            },
            {
              title: { en: "Packaging & Sampling", zh: "包装与打样支持" },
              icon: Wrench,
            },
            {
              title: { en: "Batch Delivery Planning", zh: "批量交付规划" },
              icon: PackageCheck,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title.en} className="hero-feature-item">
                <div className="hero-feature-icon">
                  <Icon size={21} strokeWidth={1.95} />
                </div>
                <p>{t(locale, item.title)}</p>
              </article>
            );
          })}
        </div>
      </PageHero>

      <section className="products-featured">
        <p className="products-featured-eyebrow">{text.featuredEyebrow}</p>
        <h2 className="products-featured-title">{text.featuredTitle}</h2>

        <ProductsFeaturedCarousel items={featuredRailItems} locale={locale} />
      </section>

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
