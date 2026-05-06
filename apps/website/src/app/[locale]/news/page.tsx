import type {Metadata} from "next";
import "@/styles/pages/news.css";

import {NewsListClient} from "@/components/news/news-list-client";
import {PageHero} from "@/components/sections/page-hero";
import {StructuredData} from "@/components/seo/structured-data";
import {newsContent} from "@/content/site";
import {buildPageMetadata} from "@/lib/metadata";
import {getNewsList} from "@/lib/site-data";
import {getLocaleFromParams, t, type Locale} from "@/lib/i18n";
import {toAbsoluteUrl} from "@/lib/site-config";

export const dynamic = "force-static";

function localize(
  value: {en?: string; zh?: string} | undefined,
  locale: Locale,
  fallback = "",
) {
  if (!value) return fallback;
  return value[locale] || value.en || value.zh || fallback;
}

function copy(locale: Locale) {
  return {
    eyebrow: t(locale, {en: "NEWS", zh: "新闻"}),
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
    categories: t(locale, {en: "Categories", zh: "分类"}),
    readMore: t(locale, {en: "Read More", zh: "阅读全文"}),
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
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const locale = await getLocaleFromParams(params);
  return buildPageMetadata(locale, newsContent.seo, "news");
}

export default async function NewsPage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const locale = await getLocaleFromParams(params);
  const text = copy(locale);
  const allArticles = getNewsList();
  const pageUrl = toAbsoluteUrl(`/${locale}/news`);
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
      name:
        locale === "zh"
          ? "尧顺新闻中心"
          : "Dongguan Yaoshun Technology News",
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
        backgroundSrc="/site/misc/new-bg.webp"
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

      <NewsListClient
        articles={listArticles}
        locale={locale}
        text={{
          categories: text.categories,
          readMore: text.readMore,
        }}
      />
    </div>
  );
}
