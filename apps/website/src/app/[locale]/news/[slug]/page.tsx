import type { Metadata } from "next";
import "@/styles/pages/news-article.css";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock3,
} from "lucide-react";
import Image from "@/components/media/smart-image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { StructuredData } from "@/components/seo/structured-data";
import { Breadcrumbs } from "@/components/ui/marketing";
import { buildMetadata } from "@/lib/metadata";
import {
  findNewsArticle,
  formatPublishedDate,
  getAdjacentNews,
  getNewsCategoryLabel,
  getRecentNews,
} from "@/lib/site-data";
import { getLocaleFromParams, locales, t, type Locale } from "@/lib/i18n";
import { toAbsoluteUrl } from "@/lib/site-config";
import { newsArticles } from "@/content/pages/news";
import { localizedPath, localizedUrlPath } from "@/lib/routes";

function copy(locale: Locale) {
  return {
    recentNews: t(locale, { en: "Recent News", zh: "最新新闻" }),
    backToNews: t(locale, { en: "Back to News", zh: "返回新闻列表" }),
    previousArticle: t(locale, { en: "Previous Article", zh: "上一篇" }),
    nextArticle: t(locale, { en: "Next Article", zh: "下一篇" }),
    previousFallback: t(locale, { en: "Back to News", zh: "返回新闻" }),
    nextFallback: t(locale, { en: "Browse More News", zh: "浏览更多新闻" }),
    publishedOn: t(locale, { en: "Published", zh: "发布时间" }),
    readingTime: (minutes: number) =>
      t(locale, {
        en: `${minutes} min read`,
        zh: `约 ${minutes} 分钟阅读`,
      }),
  };
}

function localize(
  value: { en?: string; zh?: string } | undefined,
  locale: Locale,
  fallback = "",
) {
  if (!value) return fallback;
  return value[locale] || value.en || value.zh || fallback;
}

function localizeList(
  value: { en?: string[]; zh?: string[] } | undefined,
  locale: Locale,
) {
  if (!value) return [];
  return value[locale] || value.en || value.zh || [];
}

function getReadingMinutes(article: NonNullable<ReturnType<typeof findNewsArticle>>) {
  const rawText = [article.body.en, article.body.zh]
    .join(" ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-zA-Z0-9#]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const approximateUnits = rawText.length / 5;
  return Math.max(3, Math.round(approximateUnits / 180));
}

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    newsArticles.map((article) => ({ locale, slug: article.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const locale = await getLocaleFromParams(params as Promise<{ locale: string }>);
  const { slug } = await params;
  const article = findNewsArticle(slug);

  if (!article) {
    notFound();
  }

  const articleTitle = localize(
    article.title,
    locale,
    t(locale, { en: "Yaoshun News", zh: "尧顺新闻" }),
  );
  const articleDescription = localize(
    article.excerpt,
    locale,
    t(locale, {
      en: "Toy manufacturing and project delivery updates from Yaoshun.",
      zh: "尧顺玩具制造与项目交付动态。",
    }),
  );
  const baseMetadata = buildMetadata(
    locale,
    articleTitle,
    articleDescription,
    `news/${slug}`,
    [
      article.title.en || "",
      getNewsCategoryLabel(locale, article),
      "toy manufacturing news",
      "quality and compliance updates",
      ...localizeList(article.seoKeywords, locale),
    ],
    article.image
      ? {
          image: {
            url: article.image,
            width: 1200,
            height: 630,
            alt: articleTitle,
          },
        }
      : undefined,
  );

  return {
    ...baseMetadata,
    openGraph: {
      ...baseMetadata.openGraph,
      type: "article",
      publishedTime: `${article.publishedAt}T00:00:00Z`,
      modifiedTime: `${article.publishedAt}T00:00:00Z`,
      section: getNewsCategoryLabel(locale, article),
      authors: ["Dongguan Yaoshun Technology Co., Ltd."],
      images: article.image
        ? [
            {
              url: toAbsoluteUrl(article.image),
              width: 1200,
              height: 630,
              alt: articleTitle,
            },
          ]
        : baseMetadata.openGraph?.images,
    },
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const locale = await getLocaleFromParams(params as Promise<{ locale: string }>);
  const text = copy(locale);
  const { slug } = await params;
  const article = findNewsArticle(slug);

  if (!article) {
    notFound();
  }

  const recentNews = getRecentNews(slug, 3);
  const adjacent = getAdjacentNews(slug);
  const homeHref = localizedPath(locale, "home");
  const newsHref = localizedPath(locale, "news");
  const articleHref = localizedUrlPath(locale, `/news/${slug}`);
  const previousArticleHref = adjacent.previous
    ? localizedUrlPath(locale, `/news/${adjacent.previous.slug}`)
    : newsHref;
  const nextArticleHref = adjacent.next
    ? localizedUrlPath(locale, `/news/${adjacent.next.slug}`)
    : newsHref;
  const articleUrl = toAbsoluteUrl(articleHref);
  const articleTitle = localize(
    article.title,
    locale,
    t(locale, { en: "Yaoshun News", zh: "尧顺新闻" }),
  );
  const articleDescription = localize(article.excerpt, locale);
  const categoryLabel = getNewsCategoryLabel(locale, article);
  const readingMinutes = getReadingMinutes(article);
  const breadcrumbData = {
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
        item: toAbsoluteUrl(newsHref),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: articleTitle,
        item: articleUrl,
      },
    ],
  };

  const articleData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: articleTitle,
    description: articleDescription,
    articleSection: categoryLabel,
    datePublished: `${article.publishedAt}T00:00:00Z`,
    dateModified: `${article.publishedAt}T00:00:00Z`,
    mainEntityOfPage: articleUrl,
    inLanguage: locale === "zh" ? "zh-CN" : "en-US",
    image: article.image ? [toAbsoluteUrl(article.image)] : undefined,
    author: {
      "@type": "Organization",
      name: "Dongguan Yaoshun Technology Co., Ltd.",
    },
    publisher: {
      "@type": "Organization",
      name: "Dongguan Yaoshun Technology Co., Ltd.",
      logo: {
        "@type": "ImageObject",
        url: toAbsoluteUrl("/favicon-rounded-192.png"),
      },
    },
  };

  return (
    <div className="news-article-page">
      <StructuredData data={[breadcrumbData, articleData]} />

      <Breadcrumbs
        items={[
          { href: homeHref, label: { en: "Home", zh: "首页" } },
          { href: newsHref, label: { en: "News", zh: "新闻" } },
          { label: { en: articleTitle, zh: articleTitle } },
        ]}
        locale={locale}
        trackingLocation="news_article_breadcrumbs"
      />

      <article className="news-article-shell">
        <header className="news-article-header">
          <Link
            className="news-article-back"
            data-track-destination={newsHref}
            data-track-event="nav_click"
            data-track-label="back_to_news"
            data-track-location="news_article_header"
            href={newsHref}
          >
            <ArrowLeft size={16} strokeWidth={2.1} />
            <span>{text.backToNews}</span>
          </Link>

          <div className="news-article-kicker">
            <span>{categoryLabel}</span>
            <span>{formatPublishedDate(locale, article.publishedAt)}</span>
          </div>
          <h1 className="news-article-title">{articleTitle}</h1>
          <p className="news-article-lead">{articleDescription}</p>

          <div className="news-article-meta">
            <span>
              <CalendarDays size={15} strokeWidth={2.05} /> {text.publishedOn}:{" "}
              {formatPublishedDate(locale, article.publishedAt)}
            </span>
            <span>
              <Clock3 size={15} strokeWidth={2.05} /> {text.readingTime(readingMinutes)}
            </span>
          </div>
        </header>

        <div
          className="news-article-body"
          dangerouslySetInnerHTML={{ __html: localize(article.body, locale) }}
        />
      </article>

      <section className="news-article-more">
        <div className="news-article-more-head">
          <div className="about-section-heading">
            <p className="about-section-eyebrow">{categoryLabel}</p>
            <h2>{text.recentNews}</h2>
          </div>
          <Link
            className="news-inline-link"
            data-track-destination={newsHref}
            data-track-event="nav_click"
            data-track-label="back_to_news"
            data-track-location="news_article_more"
            href={newsHref}
          >
            <span>{text.backToNews}</span>
            <ArrowRight size={15} strokeWidth={2.05} />
          </Link>
        </div>

        <div className="news-article-recent-grid">
          {recentNews.map((item) => (
            <Link
              className="news-article-recent-card"
              data-track-category={item.category}
              data-track-destination={localizedUrlPath(locale, `/news/${item.slug}`)}
              data-track-event="news_card_click"
              data-track-label={item.slug}
              data-track-location="news_article_recent"
              href={localizedUrlPath(locale, `/news/${item.slug}`)}
              key={item.slug}
              prefetch={false}
            >
              <div className="news-article-recent-image-frame">
                <Image
                  alt={localize(item.title, locale)}
                  className="news-article-recent-thumb"
                  height={900}
                  quality={100}
                  sizes="(max-width: 767px) 100vw, 360px"
                  src={item.image}
                  width={1200}
                />
              </div>
              <div className="news-article-recent-card-copy">
                <p>{formatPublishedDate(locale, item.publishedAt)}</p>
                <h3>{localize(item.title, locale)}</h3>
                <span>{localize(item.excerpt, locale)}</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="news-article-adjacent">
          <Link
            className="news-article-adjacent-card"
            data-track-destination={previousArticleHref}
            data-track-event={adjacent.previous ? "news_card_click" : "nav_click"}
            data-track-label={adjacent.previous?.slug ?? "back_to_news"}
            data-track-location="news_article_adjacent"
            href={previousArticleHref}
            prefetch={false}
          >
            <span>{text.previousArticle}</span>
            <strong>
              {adjacent.previous ? localize(adjacent.previous.title, locale) : text.previousFallback}
            </strong>
          </Link>
          <Link
            className="news-article-adjacent-card"
            data-track-destination={nextArticleHref}
            data-track-event={adjacent.next ? "news_card_click" : "nav_click"}
            data-track-label={adjacent.next?.slug ?? "browse_more_news"}
            data-track-location="news_article_adjacent"
            href={nextArticleHref}
            prefetch={false}
          >
            <span>{text.nextArticle}</span>
            <strong>{adjacent.next ? localize(adjacent.next.title, locale) : text.nextFallback}</strong>
          </Link>
        </div>
      </section>
    </div>
  );
}
