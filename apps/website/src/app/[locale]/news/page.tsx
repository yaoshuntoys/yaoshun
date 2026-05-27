import type { Metadata } from "next";
import "@/styles/pages/news.css";
import {
  ArrowRight,
  Building2,
  ClipboardCheck,
  Newspaper,
  PackageCheck,
} from "lucide-react";
import Link from "next/link";

import { NewsListClient } from "@/components/news/news-list-client";
import { PageHero } from "@/components/sections/page-hero";
import { StructuredData } from "@/components/seo/structured-data";
import { newsContent } from "@/content/site";
import { buildPageMetadata } from "@/lib/metadata";
import { getNewsList } from "@/lib/site-data";
import { getLocaleFromParams, t, type Locale } from "@/lib/i18n";
import { toAbsoluteUrl } from "@/lib/site-config";
import { localizedPath, localizedUrlPath } from "@/lib/routes";

export const dynamic = "force-static";

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
    eyebrow: t(locale, { en: "NEWS", zh: "新闻" }),
    titleLine1: t(locale, {
      en: "News Center",
      zh: "新闻中心",
    }),
    titleLine2: t(locale, {
      en: "Factory & Project Insights",
      zh: "工厂与项目洞察",
    }),
    titleBlue: t(locale, { en: "Factory", zh: "工厂" }),
    titleOrange: t(locale, { en: "Insights", zh: "洞察" }),
    heroAlt: t(locale, {
      en: "yaoshun toys news hero visual",
      zh: "yaoshun toys 新闻页主视觉",
    }),
    description: t(locale, {
      en: "Follow Yaoshun's factory updates, project cases, and sourcing notes for fort building kit, connector ball tent, ball and rod tent, kids tent building kit, and make a fort toy OEM/ODM projects from review to delivery.",
      zh: "持续了解尧顺的工厂动态、项目案例、合规进展、质量控制与制造流程更新。这些内容帮助采购团队看清玩具 OEM/ODM 项目从评估到交付的推进方式。",
    }),
    categories: t(locale, { en: "Categories", zh: "分类" }),
    browseNews: t(locale, { en: "Browse News", zh: "浏览新闻" }),
    viewSolutions: t(locale, { en: "View Solutions", zh: "查看方案" }),
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
  return buildPageMetadata(locale, newsContent.seo, "news");
}

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await getLocaleFromParams(params);
  const text = copy(locale);
  const allArticles = getNewsList();
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
        itemListElement: allArticles.map((article, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: toAbsoluteUrl(localizedUrlPath(locale, `/news/${article.slug}`)),
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
        backgroundSrc="/site/misc/new-bg.jpg"
        copyClassName="news-hero-copy"
        gridClassName="news-hero-grid"
        innerClassName="news-hero-inner"
        sectionClassName="news-hero"
      >
        <p className="news-eyebrow">{text.eyebrow}</p>
        <h1 className="news-hero-title">
          <span>{text.titleLine1}</span>
          <span>
            <span className="hero-blue-word">{text.titleBlue}</span>{" "}
            <span className="hero-orange-word">{text.titleOrange}</span>
          </span>
        </h1>
        <p className="news-hero-text">{text.description}</p>
        <div className="page-hero-actions">
          <Link className="hero-primary-cta" href={`${newsHref}#news-list`}>
            <span>{text.browseNews}</span>
            <ArrowRight size={16} strokeWidth={2.25} />
          </Link>
          <Link className="hero-secondary-cta" href={solutionsHref}>
            <span>{text.viewSolutions}</span>
            <span className="hero-secondary-dot" />
          </Link>
        </div>
        <div className="hero-feature-strip">
          {[
            {
              icon: Building2,
              label: { en: "Factory Updates", zh: "工厂动态" },
            },
            { icon: Newspaper, label: { en: "Project Cases", zh: "项目案例" } },
            {
              icon: ClipboardCheck,
              label: { en: "Compliance Progress", zh: "合规进展" },
            },
            {
              icon: PackageCheck,
              label: { en: "Delivery Notes", zh: "交付记录" },
            },
          ].map((item) => {
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
