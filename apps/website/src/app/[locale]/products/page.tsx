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

const PRODUCTS_PAGE_SIZE = 9;

type ProductsSearchParams = {
  category?: string | string[];
  page?: string | string[];
};

type ProductsQuery = {
  category?: string;
  page?: string;
};

function firstSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getProductsQuery(searchParams?: ProductsSearchParams): ProductsQuery {
  const category = firstSearchParam(searchParams?.category);
  const page = firstSearchParam(searchParams?.page);

  return {
    category: category || undefined,
    page: page || undefined,
  };
}

function getPageNumber(value: string | undefined) {
  const parsed = Number(value || "1");
  return Number.isFinite(parsed) ? Math.max(Math.floor(parsed), 1) : 1;
}

function copy(locale: "en" | "zh") {
  return {
    heroEyebrow: t(locale, {
      en: "Yaoshun Source Factory Products",
      zh: "尧顺源头工厂产品",
    }),
    heroTitleLine1: t(locale, {
      en: "Fort Building",
      zh: "堡垒拼搭",
    }),
    heroTitleLine2Blue: t(locale, {
      en: "Kit",
      zh: "套装",
    }),
    heroTitleLine2Orange: t(locale, {
      en: "Product Catalog",
      zh: "产品目录",
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

const productsHeroFeatures = [
  { icon: ShieldCheck, label: { en: "Safe Materials Available", zh: "安全材料可选" } },
  { icon: Boxes, label: { en: "OEM/ODM Catalog Review", zh: "OEM/ODM 目录评估" } },
  { icon: Wrench, label: { en: "Packaging & Sampling Support", zh: "包装与打样支持" } },
  { icon: PackageCheck, label: { en: "Bulk Delivery Planning", zh: "批量交付规划" } },
] as const;

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<ProductsSearchParams>;
}): Promise<Metadata> {
  const locale = await getLocaleFromParams(params);
  const metadata = buildPageMetadata(
    locale,
    productsPageContent.seo,
    "products",
    getCatalogSeoKeywords(locale),
  );
  const query = getProductsQuery(await searchParams);

  if (!query.category && !query.page) {
    return metadata;
  }

  return {
    ...metadata,
    robots: {
      index: false,
      follow: true,
      googleBot: {
        index: false,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<ProductsSearchParams>;
}) {
  const locale = await getLocaleFromParams(params);
  const text = copy(locale);
  const catalog = getShowcaseCatalog();
  const query = getProductsQuery(await searchParams);
  const pageSize = PRODUCTS_PAGE_SIZE;
  const sortedCatalog = [...catalog].sort(
    (a, b) => Number(b.bestseller) - Number(a.bestseller),
  );
  const filteredCatalog = sortedCatalog.filter(
    (item) => !query.category || item.collection === query.category,
  );
  const totalPages = Math.max(1, Math.ceil(filteredCatalog.length / pageSize));
  const currentPage = Math.min(getPageNumber(query.page), totalPages);
  const currentPageCatalog = filteredCatalog.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

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
      name: `${text.heroTitleLine1} ${text.heroTitleLine2Blue} ${text.heroTitleLine2Orange}`,
      description: text.heroText,
      url: pageUrl,
      inLanguage: locale === "zh" ? "zh-CN" : "en-US",
      mainEntity: {
        "@type": "ItemList",
        itemListElement: currentPageCatalog.map((item, index) => ({
          "@type": "ListItem",
          position: (currentPage - 1) * pageSize + index + 1,
          url: toAbsoluteUrl(productPath(locale, item.product.productId)),
          name: t(locale, item.label),
        })),
      },
    },
  ];

  return (
    <div className="products-page">
      <StructuredData data={structuredData} />

      <header className="products-hero">
        <div className="products-hero-background" aria-hidden="true">
          <Image
            alt=""
            className="products-hero-background-image"
            fill
            priority
            sizes="100vw"
            src="/site/misc/product-bg.webp"
          />
        </div>
        <div className="products-hero-inner">
          <div className="products-hero-grid">
            <div className="products-hero-copy">
              <p className="products-hero-eyebrow">{text.heroEyebrow}</p>
              <h1 className="products-hero-title">
                <span>{text.heroTitleLine1}</span>
                <span>
                  <span className="hero-blue-word">{text.heroTitleLine2Blue}</span>{" "}
                  <span className="hero-orange-word">{text.heroTitleLine2Orange}</span>
                </span>
              </h1>
              <p className="products-hero-text">{text.heroText}</p>
              <div className="page-hero-actions">
                <Link
                  className="hero-primary-cta"
                  data-track-destination="#products-catalog"
                  data-track-event="cta_click"
                  data-track-label="browse_catalog"
                  data-track-location="products_hero"
                  href="#products-catalog"
                >
                  <span>{t(locale, { en: "Browse Catalog", zh: "浏览目录" })}</span>
                  <ArrowRight size={16} strokeWidth={2.15} />
                </Link>
                <Link
                  className="hero-secondary-cta"
                  data-track-destination={solutionsHref}
                  data-track-event="cta_click"
                  data-track-label="custom_service"
                  data-track-location="products_hero"
                  href={solutionsHref}
                >
                  <span>
                    {t(locale, {
                      en: "Fort Building Kit Customization",
                      zh: "堡垒拼搭套装定制服务",
                    })}
                  </span>
                  <span className="hero-secondary-dot" />
                </Link>
              </div>
              <div className="hero-feature-strip">
                {productsHeroFeatures.map((item) => {
                  const Icon = item.icon;
                  return (
                    <article className="hero-feature-item" key={item.label.en}>
                      <div className="hero-feature-icon">
                        <Icon size={21} strokeWidth={1.95} />
                      </div>
                      <p>{t(locale, item.label)}</p>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </header>

      <ProductsCatalogClient
        catalog={catalogItems}
        locale={locale}
        text={{
          allProducts: text.allProducts,
          categories: text.categories,
        }}
        initialQuery={query}
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
