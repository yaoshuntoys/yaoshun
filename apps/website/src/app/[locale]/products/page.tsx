import type { Metadata } from "next";
import {
  ArrowRight,
  Gift,
  Package2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Image from "@/components/media/smart-image";
import Link from "next/link";

import { PageHero } from "@/components/sections/page-hero";
import { ProductsFeaturedCarousel } from "@/components/products/products-featured-carousel";
import { productsPageContent } from "@/content/site";
import { buildPageMetadata } from "@/lib/metadata";
import { getLocaleFromParams, t } from "@/lib/i18n";
import {
  getProductPiecesLabel,
  getProductPriceLabel,
  getProductsFeaturedRailCatalog,
  getShowcaseCatalog,
} from "@/lib/site-data";
import { productCollections, productsPageAssets } from "@/content/pages/products";

type SearchParamMap = {
  category?: string;
  page?: string;
};

function copy(locale: "en" | "zh") {
  return {
    heroEyebrow: t(locale, { en: "Products", zh: "产品" }),
    heroTitle: t(locale, {
      en: "Our DIY Building Toys Collection",
      zh: "我们的 DIY 拼搭玩具系列",
    }),
    heroText: t(locale, {
      en: "Explore educational building toys, interlocking sets, and custom-ready product lines supported by safe materials, OEM/ODM development, and stable manufacturing execution.",
      zh: "浏览益智拼搭玩具、拼接套装与可定制产品系列，背后由安全材料方案、OEM/ODM 开发能力和稳定制造体系提供支持。",
    }),
    heroAlt: t(locale, {
      en: "yaoshun toys product collection hero visual",
      zh: "yaoshun toys 产品系列主视觉",
    }),
    featuredEyebrow: t(locale, { en: "FEATURED COLLECTION", zh: "精选系列" }),
    featuredTitle: t(locale, {
      en: "Our Best-Selling DIY Sets",
      zh: "我们的热销 DIY 套装",
    }),
    categories: t(locale, { en: "Categories", zh: "分类" }),
    allProducts: t(locale, { en: "All Products", zh: "全部产品" }),
    viewDetails: t(locale, { en: "View details", zh: "查看详情" }),
    customTitle: t(locale, {
      en: "Looking for Custom Solutions?",
      zh: "正在寻找定制化方案？",
    }),
    customText: t(locale, {
      en: "We provide custom building toy solutions tailored to your brand and market.",
      zh: "我们提供面向品牌与市场的定制化拼搭玩具解决方案。",
    }),
    customAction: t(locale, { en: "Learn More", zh: "了解更多" }),
    showingText: (start: number, end: number, total: number) =>
      t(locale, {
        en: `Showing ${start}-${end} of ${total} products`,
        zh: `显示 ${start}-${end} / ${total} 个产品`,
      }),
  };
}

function buildQueryString(
  current: SearchParamMap,
  next: Partial<SearchParamMap>,
) {
  const params = new URLSearchParams();
  const merged = { ...current, ...next };

  for (const [key, value] of Object.entries(merged)) {
    if (value) {
      params.set(key, value);
    }
  }

  const query = params.toString();
  return query ? `?${query}` : "";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await getLocaleFromParams(params);
  return buildPageMetadata(locale, productsPageContent.seo, "products");
}

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<SearchParamMap>;
}) {
  const locale = await getLocaleFromParams(params);
  const text = copy(locale);
  const query = await searchParams;
  const catalog = getShowcaseCatalog();

  const filtered = catalog
    .filter((item) => !query.category || item.collection === query.category)
    .sort((a, b) => Number(b.bestseller) - Number(a.bestseller));
  const pageSize = 6;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(
    Math.max(Number(query.page || "1"), 1),
    totalPages,
  );

  const featuredRail = getProductsFeaturedRailCatalog();
  const featuredRailItems = featuredRail.map((item) => ({
    id: item.product.productId,
    href: `/${locale}/products/${item.product.productId}`,
    image: item.images[0] || productsPageAssets.fallbackImage,
    label: item.label,
    summary: item.summary,
    bestseller: item.bestseller,
  }));
  const gridProducts = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const currentQuery = {
    category: query.category,
    page: query.page,
  };

  return (
    <div className="products-page">
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
        <h1 className="products-hero-title">{text.heroTitle}</h1>
        <p className="products-hero-text">{text.heroText}</p>

        <div className="products-hero-features">
          {[
            {
              title: { en: "Safe & Durable", zh: "安全耐用" },
              text: {
                en: "Premium non-toxic materials",
                zh: "优质无毒材质",
              },
              icon: ShieldCheck,
            },
            {
              title: { en: "Build Creativity", zh: "激发创造力" },
              text: {
                en: "Encourage imagination and STEM learning",
                zh: "鼓励想象力与 STEM 学习",
              },
              icon: Sparkles,
            },
            {
              title: { en: "Perfect Gift", zh: "理想礼物" },
              text: {
                en: "Ideal for birthdays, holidays & more",
                zh: "适合生日、节日等礼赠场景",
              },
              icon: Gift,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title.en} className="products-hero-feature">
                <div className="products-hero-feature-icon">
                  <Icon size={21} strokeWidth={1.95} />
                </div>
                <h3>{t(locale, item.title)}</h3>
                <p>{t(locale, item.text)}</p>
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

      <section className="products-catalog-layout">
        <aside className="products-sidebar">
          <div className="products-sidebar-sticky">
            <div className="products-sidebar-group">
              <h3>{text.categories}</h3>
              <div className="products-category-list">
                <Link
                  className={
                    !query.category
                      ? "products-category-link active"
                      : "products-category-link"
                  }
                  href={`/${locale}/products${buildQueryString(currentQuery, { category: undefined, page: undefined })}`}
                  scroll={false}
                >
                  {text.allProducts}
                </Link>
                {productCollections.map((collection) => (
                  <Link
                    key={collection.key}
                    className={
                      query.category === collection.key
                        ? "products-category-link active"
                        : "products-category-link"
                    }
                    href={`/${locale}/products${buildQueryString(currentQuery, { category: collection.key, page: undefined })}`}
                    scroll={false}
                  >
                    {collection.label[locale]}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div className="products-catalog-main">
          <div className="products-catalog-head products-catalog-head-sticky">
            <p className="products-catalog-count">
              {text.showingText(
                filtered.length ? (currentPage - 1) * pageSize + 1 : 0,
                filtered.length
                  ? Math.min(currentPage * pageSize, filtered.length)
                  : 0,
                filtered.length,
              )}
            </p>
          </div>

          <div className="products-grid-custom">
            {gridProducts.map((item) => (
              <Link
                className="products-grid-card"
                data-track-event="product_card_click"
                data-track-label={item.product.productId}
                data-track-location="products_grid"
                href={`/${locale}/products/${item.product.productId}`}
                key={item.product.productId}
              >
                <div className="products-grid-image-wrap">
                  <Image
                    alt={t(locale, item.label)}
                    className="products-grid-image"
                    fill
                    sizes="(min-width: 1024px) 24vw, 100vw"
                    src={item.images[0] || productsPageAssets.fallbackImage}
                  />
                </div>
                <div className="products-grid-body">
                  <h3>{t(locale, item.label)}</h3>
                  <p>{t(locale, item.summary)}</p>
                  <div className="products-grid-meta">
                    <span>
                      <Package2 size={14} strokeWidth={2} />
                      {getProductPiecesLabel(item)}
                    </span>
                  </div>
                  <div className="products-grid-footer">
                    <strong>{getProductPriceLabel(item)}</strong>
                    <span aria-hidden="true" className="products-grid-cart">
                      <ArrowRight size={16} strokeWidth={2.1} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="products-pagination">
            {currentPage > 1 ? (
              <Link
                aria-label="Previous page"
                href={`/${locale}/products${buildQueryString(currentQuery, { page: String(currentPage - 1) === "1" ? undefined : String(currentPage - 1) })}`}
                scroll={false}
              >
                ‹
              </Link>
            ) : (
              <span aria-disabled="true">‹</span>
            )}

            {Array.from({ length: totalPages }, (_, index) => {
              const page = String(index + 1);
              const href = `/${locale}/products${buildQueryString(currentQuery, { page: page === "1" ? undefined : page })}`;
              const active = String(currentPage) === page;

              return active ? (
                <span className="active" key={page}>
                  {page}
                </span>
              ) : (
                <Link href={href} key={page} scroll={false}>
                  {page}
                </Link>
              );
            })}

            {currentPage < totalPages ? (
              <Link
                aria-label="Next page"
                href={`/${locale}/products${buildQueryString(currentQuery, { page: String(currentPage + 1) })}`}
                scroll={false}
              >
                ›
              </Link>
            ) : (
              <span aria-disabled="true">›</span>
            )}
          </div>
        </div>
      </section>

      <section className="products-oem-banner">
        <div className="products-oem-copy">
          <h2>{text.customTitle}</h2>
          <p>{text.customText}</p>
          <Link
            className="products-oem-link products-oem-cta"
            href={`/${locale}/solutions`}
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
