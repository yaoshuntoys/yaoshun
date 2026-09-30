import type { Metadata } from "next";
import "@/styles/pages/news.css";
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
    eyebrow: t(locale, { en: "Sourcing & Manufacturing Insights", zh: "采购与制造洞察" }),
    heroTitle: t(locale, { en: "Toy Industry News & Buyer Guides", zh: "玩具行业资讯与采购指南" }),
    description: t(locale, {
      en: "Follow Yaoshun's factory updates, project cases, and sourcing notes for fort building toy, fort building kit, construction toys wholesale, and toy OEM/ODM projects from review to delivery.",
      zh: "持续了解尧顺的工厂动态、项目案例、合规进展、质量控制与制造流程更新。这些内容帮助采购团队看清玩具 OEM/ODM 项目从评估到交付的推进方式。",
    }),
    categories: t(locale, { en: "Categories", zh: "分类" }),
    readMore: t(locale, { en: "Read More", zh: "阅读全文" }),
    resourcesTitle: t(locale, { en: "Buyer Resource Hubs", zh: "采购主题指南" }),
    resourcesText: t(locale, {
      en: "Start with these in-depth guides on sourcing, safety, quality control, and OEM/ODM manufacturing, then explore the latest factory and product updates below.",
      zh: "先从采购、安全、质量控制和 OEM/ODM 制造主题指南开始，再浏览下方最新的工厂与产品动态。",
    }),
  };
}

const resourceGuideSlugs = [
  "private-label-fort-building-kits-sourcing-guide-for-oem-odm-buyers",
  "toy-safety-and-astm-f963-what-fort-building-kit-buyers-should-check",
  "from-raw-material-review-to-final-qc-how-yaoshun-controls-production",
  "one-stop-fort-building-kit-oem-odm-manufacturing-for-global-toy-brands",
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
  const resourceArticles = resourceGuideSlugs.flatMap((slug) => {
    const article = allArticles.find((item) => item.slug === slug);
    return article ? [article] : [];
  });
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
            src="/site/misc/new-bg.webp"
          />
        </div>
        <div className="news-hero-inner">
          <div className="news-hero-grid">
            <div className="news-hero-copy">
              <p className="news-eyebrow">{text.eyebrow}</p>
              <h1 className="news-hero-title">{text.heroTitle}</h1>
              <p className="news-hero-text">{text.description}</p>
            </div>
          </div>
        </div>
      </header>

      <section className="news-resource-hub" aria-labelledby="buyer-resource-hubs">
        <div className="news-resource-heading">
          <h2 id="buyer-resource-hubs">{text.resourcesTitle}</h2>
          <p>{text.resourcesText}</p>
        </div>
        <div className="news-resource-grid">
          {resourceArticles.map((article) => (
            <Link
              className="news-resource-card"
              href={localizedUrlPath(locale, `/news/${article.slug}`)}
              key={article.slug}
            >
              <h3>{localize(article.title, locale, "Buyer guide")}</h3>
              <p>{localize(article.excerpt, locale)}</p>
              <span>{text.readMore}</span>
            </Link>
          ))}
        </div>
      </section>

      <NewsListClient
        articles={listArticles}
        locale={locale}
        text={{
          categories: text.categories,
          readMore: text.readMore,
        }}
        initialQuery={query}
      />
    </div>
  );
}
