import type { Metadata } from "next";
import "@/styles/pages/news.css";
import {
  ArrowRight,
  Building2,
  ClipboardCheck,
  Newspaper,
  PackageCheck,
} from "lucide-react";
import Image from "@/components/media/smart-image";
import Link from "next/link";

import { NewsListClient } from "@/components/news/news-list-client";
import { StructuredData } from "@/components/seo/structured-data";
import { newsContent } from "@/content/site";
import { buildPageMetadata } from "@/lib/metadata";
import { getNewsList } from "@/lib/site-data";
import { getLocaleFromParams, t, type Locale } from "@/lib/i18n";
import { toAbsoluteUrl } from "@/lib/site-config";
import { localizedPath, localizedUrlPath } from "@/lib/routes";

type NewsSearchParams = {
  category?: string | string[];
  page?: string | string[];
};

type NewsQuery = {
  category?: string;
  page?: string;
};

function firstSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getNewsQuery(searchParams?: NewsSearchParams): NewsQuery {
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

function localize(
  value: { en?: string; zh?: string } | undefined,
  locale: Locale,
  fallback = "",
) {
  if (!value) return fallback;
  return value[locale] || value.en || value.zh || fallback;
}

function copy(locale: Locale) {
  return {
    eyebrow: t(locale, { en: "News", zh: "新闻" }),
    heroTitleLine1: t(locale, { en: "News Center", zh: "新闻中心" }),
    heroTitleLine2Blue: t(locale, { en: "Factory", zh: "工厂" }),
    heroTitleLine2Orange: t(locale, { en: "Insights", zh: "洞察" }),
    description: t(locale, {
      en: "Follow Yaoshun's factory updates, project cases, and sourcing notes for fort building toy, fort building kit, construction toys wholesale, and toy OEM/ODM projects from review to delivery.",
      zh: "持续了解尧顺的工厂动态、项目案例、合规进展、质量控制与制造流程更新。这些内容帮助采购团队看清玩具 OEM/ODM 项目从评估到交付的推进方式。",
    }),
    browseNews: t(locale, { en: "Browse News", zh: "浏览新闻" }),
    viewSolutions: t(locale, { en: "View Solutions", zh: "查看方案" }),
    categories: t(locale, { en: "Categories", zh: "分类" }),
    readMore: t(locale, { en: "Read More", zh: "阅读全文" }),
    showMore: t(locale, { en: "Show more", zh: "显示更多" }),
    showLess: t(locale, { en: "Show less", zh: "收起" }),
  };
}

const newsHeroFeatures = [
  { icon: Building2, label: { en: "Factory Updates", zh: "工厂动态" } },
  { icon: Newspaper, label: { en: "Project Cases", zh: "项目案例" } },
  { icon: ClipboardCheck, label: { en: "Compliance Progress", zh: "合规进展" } },
  { icon: PackageCheck, label: { en: "Delivery Records", zh: "交付记录" } },
] as const;

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<NewsSearchParams>;
}): Promise<Metadata> {
  const locale = await getLocaleFromParams(params);
  const metadata = buildPageMetadata(locale, newsContent.seo, "news");
  const query = getNewsQuery(await searchParams);

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

export default async function NewsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<NewsSearchParams>;
}) {
  const locale = await getLocaleFromParams(params);
  const text = copy(locale);
  const allArticles = getNewsList();
  const query = getNewsQuery(await searchParams);
  const pageSize = 9;
  const filteredArticles = allArticles.filter(
    (article) =>
      !query.category ||
      query.category === "all" ||
      article.category === query.category,
  );
  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / pageSize));
  const currentPage = Math.min(getPageNumber(query.page), totalPages);
  const currentPageArticles = filteredArticles.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const homeHref = localizedPath(locale, "home");
  const newsHref = localizedPath(locale, "news");
  const solutionsHref = localizedPath(locale, "solutions");
  const pageUrl = toAbsoluteUrl(newsHref);
  const listArticles = allArticles.map((article) => ({
    slug: article.slug,
    category: article.category,
    title: article.title,
    excerpt: article.excerpt,
    publishedAt: article.publishedAt,
    image: article.image,
  }));
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
          name: locale === "zh" ? "新闻" : "News",
          item: pageUrl,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name:
        locale === "zh" ? "尧顺新闻中心" : "Dongguan Yaoshun Technology News",
      description: text.description,
      url: pageUrl,
      inLanguage: locale === "zh" ? "zh-CN" : "en-US",
      mainEntity: {
        "@type": "ItemList",
        itemListElement: currentPageArticles.map((article, index) => ({
          "@type": "ListItem",
          position: (currentPage - 1) * pageSize + index + 1,
          url: toAbsoluteUrl(localizedUrlPath(locale, `/news/${article.slug}`)),
          name: localize(article.title, locale, "News Article"),
        })),
      },
    },
  ];

  return (
    <div className="news-page">
      <StructuredData data={structuredData} />

      <header className="news-hero">
        <div className="news-hero-background" aria-hidden="true">
          <Image
            alt=""
            className="news-hero-background-image"
            fill
            priority
            sizes="100vw"
            src="/site/misc/new-bg.jpg"
          />
        </div>
        <div className="news-hero-inner">
          <div className="news-hero-grid">
            <div className="news-hero-copy">
              <p className="news-eyebrow">{text.eyebrow}</p>
              <h1 className="news-hero-title">
                <span>{text.heroTitleLine1}</span>
                <span>
                  <span className="hero-blue-word">{text.heroTitleLine2Blue}</span>{" "}
                  <span className="hero-orange-word">{text.heroTitleLine2Orange}</span>
                </span>
              </h1>
              <p className="news-hero-text">{text.description}</p>
              <div className="page-hero-actions">
                <Link
                  className="hero-primary-cta"
                  data-track-destination="#news-list"
                  data-track-event="cta_click"
                  data-track-label="browse_news"
                  data-track-location="news_hero"
                  href="#news-list"
                >
                  <span>{text.browseNews}</span>
                  <ArrowRight size={16} strokeWidth={2.15} />
                </Link>
                <Link
                  className="hero-secondary-cta"
                  data-track-destination={solutionsHref}
                  data-track-event="cta_click"
                  data-track-label="view_solutions"
                  data-track-location="news_hero"
                  href={solutionsHref}
                >
                  <span>{text.viewSolutions}</span>
                  <span className="hero-secondary-dot" />
                </Link>
              </div>
              <div className="hero-feature-strip">
                {newsHeroFeatures.map((item) => {
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

      <NewsListClient
        articles={listArticles}
        locale={locale}
        text={{
          categories: text.categories,
          readMore: text.readMore,
          showLess: text.showLess,
          showMore: text.showMore,
        }}
        initialQuery={query}
      />
    </div>
  );
}
