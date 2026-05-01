import type { Metadata } from "next";
import {
  ArrowRight,
  Award,
  Building2,
  FileText,
  Grid2x2,
  Package2,
  Sparkles,
  TentTree,
} from "lucide-react";
import Image from "@/components/smart-image";
import Link from "next/link";

import { PageHero } from "@/components/page-hero";
import { StructuredData } from "@/components/structured-data";
import { buildMetadata } from "@/lib/metadata";
import {
  formatPublishedDate,
  getNewsCategoryLabel,
  getNewsList,
} from "@/lib/relaunch-data";
import { getLocaleFromParams, t } from "@/lib/i18n";
import { toAbsoluteUrl } from "@/lib/site-config";

type SearchParamMap = {
  category?: string;
  page?: string;
};

const categoryItems = [
  { key: "all", label: { en: "All News", zh: "全部新闻" } },
  { key: "company", label: { en: "Company News", zh: "企业新闻" } },
  { key: "product", label: { en: "Product Updates", zh: "产品更新" } },
  { key: "events", label: { en: "Events & Exhibitions", zh: "活动与展会" } },
  { key: "insights", label: { en: "Industry Insights", zh: "行业洞察" } },
  { key: "awards", label: { en: "Awards & Recognition", zh: "奖项与荣誉" } },
  { key: "press", label: { en: "Press Releases", zh: "新闻稿" } },
] as const;

const categoryIcons = {
  all: Grid2x2,
  company: Building2,
  product: Package2,
  events: TentTree,
  insights: Sparkles,
  awards: Award,
  press: FileText,
} as const;

const categoryTones = {
  all: 0,
  company: 0,
  product: 1,
  events: 2,
  insights: 3,
  awards: 0,
  press: 1,
} as const;

function localize(
  value: { en?: string; zh?: string } | undefined,
  locale: "en" | "zh",
  fallback = "",
) {
  if (!value) return fallback;
  return value[locale] || value.en || value.zh || fallback;
}

function buildQueryString(
  current: SearchParamMap,
  next: Partial<SearchParamMap>,
) {
  const params = new URLSearchParams();
  const merged = { ...current, ...next };

  for (const [key, value] of Object.entries(merged)) {
    if (value) params.set(key, value);
  }

  const query = params.toString();
  return query ? `?${query}` : "";
}

function copy(locale: "en" | "zh") {
  return {
    eyebrow: t(locale, { en: "NEWS", zh: "新闻" }),
    titleLine1: t(locale, {
      en: "Factory News",
      zh: "工厂新闻",
    }),
    titleLine2: t(locale, {
      en: "& OEM/ODM Insights",
      zh: "与 OEM/ODM 洞察",
    }),
    heroAlt: t(locale, {
      en: "yaoshun toys news hero visual",
      zh: "yaoshun toys 新闻页主视觉",
    }),
    description: t(locale, {
      en: "Follow Yaoshun's factory updates, OEM/ODM project insights, compliance progress, tooling improvements, quality-control practices, and export-ready delivery stories. This page is built to help buyers understand how our educational toy, interlocking toy, and custom plastic manufacturing work actually moves forward.",
      zh: "在这里持续了解尧顺的工厂动态、OEM/ODM 项目洞察、合规进展、模具能力提升、质量控制实践与出口交付故事。我们希望让客户更清楚地看到，益智玩具、拼接玩具与塑料制品制造项目在我们这里是如何真实推进的。",
    }),
    categories: t(locale, { en: "Categories", zh: "分类" }),
    readMore: t(locale, { en: "Read More", zh: "阅读全文" }),
    showingText: (start: number, end: number, total: number) =>
      t(locale, {
        en: `Showing ${start}-${end} of ${total} news`,
        zh: `显示 ${start}-${end} / ${total} 条新闻`,
      }),
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await getLocaleFromParams(params);
  return buildMetadata(
    locale,
    "News | Dongguan Yaoshun Technology",
    "Read factory updates, OEM/ODM insights, compliance progress, quality-control articles, and product news from Dongguan Yaoshun Technology.",
    "news",
    [
      "educational toy manufacturer news",
      "oem odm factory updates",
      "custom plastic production insights",
      "toy compliance and qc news",
      "dongguan yaoshun technology news",
    ],
  );
}

export default async function NewsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<SearchParamMap>;
}) {
  const locale = await getLocaleFromParams(params);
  const text = copy(locale);
  const query = await searchParams;
  const allArticles = getNewsList();
  const pageUrl = toAbsoluteUrl(`/${locale}/news`);
  const filtered = allArticles.filter((article) => {
    return (
      !query.category ||
      query.category === "all" ||
      article.category === query.category
    );
  });

  const pageSize = 6;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(
    Math.max(Number(query.page || "1"), 1),
    totalPages,
  );
  const paged = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: locale === "zh" ? "首页" : "Home",
          item: toAbsoluteUrl(`/${locale}`),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: locale === "zh" ? "新闻" : "News",
          item: pageUrl,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: locale === "zh" ? "尧顺新闻中心" : "Dongguan Yaoshun Technology News",
      description: text.description,
      url: pageUrl,
      inLanguage: locale === "zh" ? "zh-CN" : "en-US",
      mainEntity: {
        "@type": "ItemList",
        itemListElement: allArticles.map((article, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: toAbsoluteUrl(`/${locale}/news/${article.slug}`),
          name: localize(article.title, locale, "News Article"),
        })),
      },
    },
  ];
  return (
    <div className="news-page">
      <StructuredData data={structuredData} />
      <PageHero
        backgroundClassName="news-hero-background"
        backgroundImageClassName="news-hero-background-image"
        backgroundSrc="https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/site/misc/new-bg.webp"
        copyClassName="news-hero-copy"
        gridClassName="news-hero-grid"
        innerClassName="news-hero-inner"
        sectionClassName="news-hero"
      >
        <p className="news-eyebrow">{text.eyebrow}</p>
        <h1 className="news-hero-title">
          <span>{text.titleLine1}</span>
          <span>{text.titleLine2}</span>
        </h1>
        <p className="news-hero-text">{text.description}</p>
      </PageHero>

      <section className="news-content-grid">
        <aside className="news-sidebar">
          <div className="news-sidebar-sticky">
            <article className="news-sidebar-card">
              <h2>{text.categories}</h2>
              <div className="news-category-list">
                {categoryItems.map((category) => {
                  const Icon =
                    categoryIcons[category.key as keyof typeof categoryIcons];
                  return (
                    <Link
                      className={
                        (query.category || "all") === category.key
                          ? "news-category-link active"
                          : "news-category-link"
                      }
                      href={`/${locale}/news${buildQueryString({}, { category: category.key === "all" ? undefined : category.key, page: undefined })}`}
                      key={category.key}
                      scroll={false}
                    >
                      <Icon size={15} strokeWidth={1.95} />
                      <span>{category.label[locale]}</span>
                    </Link>
                  );
                })}
              </div>
            </article>
          </div>
        </aside>

        <div className="news-main">
          <div className="news-toolbar news-toolbar-sticky">
            <p className="news-count">
              {text.showingText(
                (currentPage - 1) * pageSize + 1,
                Math.min(currentPage * pageSize, filtered.length),
                filtered.length,
              )}
            </p>
          </div>

          <div className="news-card-grid">
            {paged.map((article) => {
              const tone =
                categoryTones[article.category as keyof typeof categoryTones] ?? 0;

              return (
                <Link
                  aria-label={localize(article.title, locale, "News Article")}
                  className="news-card"
                  href={`/${locale}/news/${article.slug}`}
                  key={article.slug}
                >
                  <div className={`news-card-media tone-${tone}`}>
                    {article.image ? (
                      <Image
                        alt={localize(article.title, locale, "News Article")}
                        className="news-card-thumb"
                        src={article.image}
                        width={88}
                        height={88}
                      />
                    ) : (
                      <div
                        className={`news-image-placeholder news-card-placeholder tone-${tone}`}
                      >
                        <div className="news-placeholder-mark">
                          <Building2 size={42} strokeWidth={1.55} />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="news-card-body">
                    <span className={`news-category-pill tone-${tone}`}>
                      {getNewsCategoryLabel(locale, article)}
                    </span>
                    <p className="news-card-date">
                      {formatPublishedDate(locale, article.publishedAt)}
                    </p>
                    <h3>{localize(article.title, locale, "News Article")}</h3>
                    <p>{localize(article.excerpt, locale)}</p>
                    <span className="news-inline-link">
                      <span>{text.readMore}</span>
                      <ArrowRight size={14} strokeWidth={2.05} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="news-pagination">
            {currentPage > 1 ? (
              <Link
                aria-label="Previous page"
                href={`/${locale}/news${buildQueryString(query, { page: String(currentPage - 1) === "1" ? undefined : String(currentPage - 1) })}`}
                scroll={false}
              >
                ‹
              </Link>
            ) : (
              <span aria-disabled="true">‹</span>
            )}
            {Array.from({ length: totalPages }, (_, index) => {
              const page = String(index + 1);
              const href = `/${locale}/news${buildQueryString(query, { page: page === "1" ? undefined : page })}`;
              const active = String(currentPage) === page;
              return active ? (
                <span className="active" key={page}>
                  {page}
                </span>
              ) : (
                <Link key={page} href={href} scroll={false}>
                  {page}
                </Link>
              );
            })}
            {currentPage < totalPages ? (
              <Link
                aria-label="Next page"
                href={`/${locale}/news${buildQueryString(query, { page: String(currentPage + 1) })}`}
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
    </div>
  );
}
