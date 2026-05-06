import type { Metadata } from "next";
import "@/styles/pages/news-article.css";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock3,
  FileText,
  Share2,
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

function copy(locale: Locale) {
  return {
    recentNews: t(locale, { en: "Recent News", zh: "最新新闻" }),
    backToNews: t(locale, { en: "Back to News", zh: "返回新闻列表" }),
    closing: t(locale, {
      en: "We will continue improving document readiness, quality communication, and project support for customers worldwide.",
      zh: "我们将继续完善资料准备、品质沟通与项目支持能力，为全球客户提供更稳定的协作体验。",
    }),
    previousArticle: t(locale, { en: "Previous Article", zh: "上一篇" }),
    nextArticle: t(locale, { en: "Next Article", zh: "下一篇" }),
    previousFallback: t(locale, { en: "Back to News", zh: "返回新闻" }),
    nextFallback: t(locale, { en: "Browse More News", zh: "浏览更多新闻" }),
    articleOverview: t(locale, { en: "Article Overview", zh: "文章导读" }),
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

function getReadingMinutes(article: NonNullable<ReturnType<typeof findNewsArticle>>) {
  const rawText = [
    article.excerpt.en,
    article.excerpt.zh,
    ...article.body.flatMap((section) => [
      section.heading.en,
      section.heading.zh,
      ...section.paragraphs.map((paragraph) => `${paragraph.en || ""} ${paragraph.zh || ""}`),
    ]),
  ]
    .join(" ")
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
    return buildMetadata(locale, "News Detail", "yaoshun toys news detail", `news/${slug}`);
  }

  const articleTitle = localize(article.title, locale, "News Detail");
  const articleDescription = localize(article.excerpt, locale, "yaoshun toys news detail");
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
    ],
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
  const articleUrl = toAbsoluteUrl(`/${locale}/news/${slug}`);
  const articleTitle = localize(article.title, locale, "News Detail");
  const articleDescription = localize(article.excerpt, locale);
  const categoryLabel = getNewsCategoryLabel(locale, article);
  const readingMinutes = getReadingMinutes(article);
  const overviewItems = article.body
    .slice(0, 3)
    .map((section) => localize(section.heading, locale))
    .filter(Boolean);

  const breadcrumbData = {
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
        item: toAbsoluteUrl(`/${locale}/news`),
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
          { href: `/${locale}`, label: { en: "Home", zh: "首页" } },
          { href: `/${locale}/news`, label: { en: "News", zh: "新闻" } },
          { label: { en: articleTitle, zh: articleTitle } },
        ]}
        locale={locale}
        trackingLocation="news_article_breadcrumbs"
      />

      <article className="news-article-shell">
        <header className="news-article-header">
          <Link
            className="news-article-back"
            data-track-destination={`/${locale}/news`}
            data-track-event="nav_click"
            data-track-label="back_to_news"
            data-track-location="news_article_header"
            href={`/${locale}/news`}
          >
            <ArrowLeft size={16} strokeWidth={2.1} />
            <span>{text.backToNews}</span>
          </Link>

          <span className="news-article-pill">{categoryLabel}</span>
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
            <span>
              <FileText size={15} strokeWidth={2.05} /> {categoryLabel}
            </span>
          </div>
        </header>

        {article.image ? (
          <div className="news-article-image-frame news-article-hero-placeholder">
            <Image
              alt={articleTitle}
              className="news-article-detail-image"
              fill
              priority
              sizes="(max-width: 767px) 100vw, 1100px"
              src={article.image}
            />
          </div>
        ) : null}

        <div className="news-article-outline">
          <p className="news-article-outline-title">{text.articleOverview}</p>
          <div className="news-article-outline-list">
            {overviewItems.map((item) => (
              <span className="news-article-outline-item" key={item}>
                <Share2 size={14} strokeWidth={2.05} />
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="news-article-body">
          {article.body.map((section, index) => {
            const previousSectionImage =
              index > 0 ? article.body[index - 1]?.image : undefined;
            const sectionImage =
              section.image &&
              section.image !== article.image &&
              section.image !== previousSectionImage
                ? section.image
                : undefined;

            return (
              <section className="news-article-section" key={`${section.heading.en}-${index}`}>
                <div className="news-article-section-copy">
                  <h2>{localize(section.heading, locale)}</h2>
                  {section.paragraphs.map((paragraph, paragraphIndex) => (
                    <p key={`${section.heading.en}-${paragraphIndex}`}>
                      {localize(paragraph, locale)}
                    </p>
                  ))}
                </div>

                {sectionImage ? (
                  <figure className="news-article-inline-media">
                    <div className="news-article-image-frame news-article-inline-placeholder">
                      <Image
                        alt={localize(section.heading, locale, articleTitle)}
                        className="news-article-detail-image"
                        fill
                        sizes="(max-width: 767px) 100vw, 520px"
                        src={sectionImage}
                      />
                    </div>
                  </figure>
                ) : null}
              </section>
            );
          })}

          <p className="news-article-closing">{text.closing}</p>
        </div>
      </article>

      <section className="news-article-more">
        <div className="news-article-more-head">
          <div className="about-section-heading">
            <p className="about-section-eyebrow">{categoryLabel}</p>
            <h2>{text.recentNews}</h2>
          </div>
          <Link
            className="news-inline-link"
            data-track-destination={`/${locale}/news`}
            data-track-event="nav_click"
            data-track-label="back_to_news"
            data-track-location="news_article_more"
            href={`/${locale}/news`}
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
              data-track-destination={`/${locale}/news/${item.slug}`}
              data-track-event="news_card_click"
              data-track-label={item.slug}
              data-track-location="news_article_recent"
              href={`/${locale}/news/${item.slug}`}
              key={item.slug}
              prefetch={false}
            >
              <div className="news-article-recent-image-frame">
                <Image
                  alt={localize(item.title, locale)}
                  className="news-article-recent-thumb"
                  fill
                  sizes="(max-width: 767px) 100vw, 360px"
                  src={item.image}
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
            data-track-destination={
              adjacent.previous ? `/${locale}/news/${adjacent.previous.slug}` : `/${locale}/news`
            }
            data-track-event={adjacent.previous ? "news_card_click" : "nav_click"}
            data-track-label={adjacent.previous?.slug ?? "back_to_news"}
            data-track-location="news_article_adjacent"
            href={adjacent.previous ? `/${locale}/news/${adjacent.previous.slug}` : `/${locale}/news`}
            prefetch={false}
          >
            <span>{text.previousArticle}</span>
            <strong>
              {adjacent.previous ? localize(adjacent.previous.title, locale) : text.previousFallback}
            </strong>
          </Link>
          <Link
            className="news-article-adjacent-card"
            data-track-destination={
              adjacent.next ? `/${locale}/news/${adjacent.next.slug}` : `/${locale}/news`
            }
            data-track-event={adjacent.next ? "news_card_click" : "nav_click"}
            data-track-label={adjacent.next?.slug ?? "browse_more_news"}
            data-track-location="news_article_adjacent"
            href={adjacent.next ? `/${locale}/news/${adjacent.next.slug}` : `/${locale}/news`}
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
