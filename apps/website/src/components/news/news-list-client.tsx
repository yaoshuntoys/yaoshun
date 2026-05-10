"use client";

import {useEffect, useMemo, useState} from "react";
import type {MouseEvent} from "react";
import {
  ArrowRight,
  Award,
  Building2,
  Grid2x2,
  Package2,
  Sparkles,
  TentTree,
} from "lucide-react";
import Image from "@/components/media/smart-image";
import Link from "next/link";

import type {NewsCategoryKey} from "@/content/types";
import {t, type Locale} from "@/lib/i18n";

type SearchParamMap = {
  category?: string;
  page?: string;
};

export type NewsListClientArticle = {
  slug: string;
  category: NewsCategoryKey;
  title: {en?: string; zh?: string};
  excerpt: {en?: string; zh?: string};
  publishedAt: string;
  image: string;
};

type NewsListClientProps = {
  articles: NewsListClientArticle[];
  locale: Locale;
  text: {
    categories: string;
    readMore: string;
  };
};

const categoryItems = [
  {key: "all", label: {en: "All News", zh: "全部新闻"}},
  {key: "company", label: {en: "Factory & Delivery", zh: "工厂与交付"}},
  {key: "product", label: {en: "Products & Customization", zh: "产品与定制"}},
  {key: "events", label: {en: "Events & Exhibitions", zh: "活动与展会"}},
  {key: "insights", label: {en: "Industry Insights", zh: "行业洞察"}},
  {key: "awards", label: {en: "Qualifications & Honors", zh: "资质与荣誉"}},
] as const;

const categoryIcons = {
  all: Grid2x2,
  company: Building2,
  product: Package2,
  events: TentTree,
  insights: Sparkles,
  awards: Award,
} as const;

const categoryTones = {
  all: 0,
  company: 0,
  product: 1,
  events: 2,
  insights: 3,
  awards: 0,
} as const;

const categoryLabels: Record<NewsCategoryKey, {en: string; zh: string}> = {
  all: {en: "All News", zh: "全部新闻"},
  company: {en: "Factory & Delivery", zh: "工厂与交付"},
  product: {en: "Products & Customization", zh: "产品与定制"},
  events: {en: "Events & Exhibitions", zh: "活动与展会"},
  insights: {en: "Industry Insights", zh: "行业洞察"},
  awards: {en: "Qualifications & Honors", zh: "资质与荣誉"},
};

function localize(
  value: {en?: string; zh?: string} | undefined,
  locale: Locale,
  fallback = "",
) {
  if (!value) return fallback;
  return value[locale] || value.en || value.zh || fallback;
}

function parseSearchParams(search: string): SearchParamMap {
  const params = new URLSearchParams(search);
  const category = params.get("category") || undefined;
  const page = params.get("page") || undefined;

  return {category, page};
}

function buildQueryString(
  current: SearchParamMap,
  next: Partial<SearchParamMap>,
) {
  const params = new URLSearchParams();
  const merged = {...current, ...next};

  for (const [key, value] of Object.entries(merged)) {
    if (value) params.set(key, value);
  }

  const query = params.toString();
  return query ? `?${query}` : "";
}

function formatPublishedDate(locale: Locale, publishedAt: string) {
  const dateFormats: Record<
    Locale,
    Intl.DateTimeFormatOptions & {localeCode: string}
  > = {
    en: {localeCode: "en-US", month: "short", day: "numeric", year: "numeric"},
    zh: {localeCode: "zh-CN", month: "numeric", day: "numeric", year: "numeric"},
  };
  const {localeCode, ...formatOptions} = dateFormats[locale];

  return new Intl.DateTimeFormat(localeCode, {
    ...formatOptions,
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${publishedAt}T00:00:00Z`));
}

function formatShowingText(
  locale: Locale,
  start: number,
  end: number,
  total: number,
) {
  return t(locale, {
    en: `Showing ${start}-${end} of ${total} news`,
    zh: `显示 ${start}-${end} / ${total} 条新闻`,
  });
}

export function NewsListClient({articles, locale, text}: NewsListClientProps) {
  const [query, setQuery] = useState<SearchParamMap>({});
  const pageSize = 6;

  useEffect(() => {
    const syncFromUrl = () => {
      setQuery(parseSearchParams(window.location.search));
    };

    syncFromUrl();
    window.addEventListener("popstate", syncFromUrl);

    return () => {
      window.removeEventListener("popstate", syncFromUrl);
    };
  }, []);

  const filtered = useMemo(
    () =>
      articles.filter(
        (article) =>
          !query.category ||
          query.category === "all" ||
          article.category === query.category,
      ),
    [articles, query.category],
  );
  const availableCategoryItems = useMemo(
    () =>
      categoryItems.filter(
        (category) =>
          category.key === "all" ||
          articles.some((article) => article.category === category.key),
      ),
    [articles],
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(
    Math.max(Number(query.page || "1"), 1),
    totalPages,
  );
  const paged = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  function navigate(
    event: MouseEvent<HTMLAnchorElement>,
    next: Partial<SearchParamMap>,
  ) {
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }

    event.preventDefault();

    const nextQuery = {...query, ...next};
    const href = `/${locale}/news${buildQueryString(query, next)}`;
    window.history.pushState(null, "", href);
    setQuery(nextQuery);
  }

  return (
    <section className="news-content-grid" id="news-list">
      <aside className="news-sidebar">
        <div className="news-sidebar-sticky">
          <article className="news-sidebar-card">
            <h2>{text.categories}</h2>
            <div className="news-category-list">
              {availableCategoryItems.map((category) => {
                const Icon =
                  categoryIcons[category.key as keyof typeof categoryIcons];
                const href = `/${locale}/news${buildQueryString({}, {
                  category:
                    category.key === "all" ? undefined : category.key,
                  page: undefined,
                })}`;

                return (
                  <a
                    className={
                      (query.category || "all") === category.key
                        ? "news-category-link active"
                        : "news-category-link"
                    }
                    data-track-category={category.key}
                    data-track-destination={href}
                    data-track-event="filter_select"
                    data-track-label={category.key}
                    data-track-location="news_category_filter"
                    href={href}
                    key={category.key}
                    onClick={(event) =>
                      navigate(event, {
                        category:
                          category.key === "all"
                            ? undefined
                            : category.key,
                        page: undefined,
                      })
                    }
                  >
                    <Icon size={15} strokeWidth={1.95} />
                    <span>{category.label[locale]}</span>
                  </a>
                );
              })}
            </div>
          </article>
        </div>
      </aside>

      <div className="news-main">
        <div className="news-toolbar news-toolbar-sticky">
          <p className="news-count">
            {formatShowingText(
              locale,
              filtered.length ? (currentPage - 1) * pageSize + 1 : 0,
              filtered.length
                ? Math.min(currentPage * pageSize, filtered.length)
                : 0,
              filtered.length,
            )}
          </p>
        </div>

        <div className="news-card-grid">
          {paged.map((article) => {
            const tone =
              categoryTones[article.category as keyof typeof categoryTones] ??
              0;

            return (
              <Link
                aria-label={localize(article.title, locale, "News Article")}
                className="news-card"
                data-track-category={article.category}
                data-track-destination={`/${locale}/news/${article.slug}`}
                data-track-event="news_card_click"
                data-track-label={article.slug}
                data-track-location="news_grid"
                href={`/${locale}/news/${article.slug}`}
                key={article.slug}
                prefetch={false}
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
                    {t(locale, categoryLabels[article.category])}
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
            <a
              aria-label="Previous page"
              data-track-destination={`/${locale}/news${buildQueryString(query, {page: String(currentPage - 1) === "1" ? undefined : String(currentPage - 1)})}`}
              data-track-event="pagination_click"
              data-track-label="previous"
              data-track-location="news_pagination"
              href={`/${locale}/news${buildQueryString(query, {page: String(currentPage - 1) === "1" ? undefined : String(currentPage - 1)})}`}
              onClick={(event) =>
                navigate(event, {
                  page:
                    String(currentPage - 1) === "1"
                      ? undefined
                      : String(currentPage - 1),
                })
              }
            >
              ‹
            </a>
          ) : (
            <span aria-disabled="true">‹</span>
          )}

          {Array.from({length: totalPages}, (_, index) => {
            const page = String(index + 1);
            const href = `/${locale}/news${buildQueryString(query, {
              page: page === "1" ? undefined : page,
            })}`;
            const active = String(currentPage) === page;

            return active ? (
              <span className="active" key={page}>
                {page}
              </span>
            ) : (
              <a
                data-track-destination={href}
                data-track-event="pagination_click"
                data-track-label={page}
                data-track-location="news_pagination"
                href={href}
                key={page}
                onClick={(event) =>
                  navigate(event, {page: page === "1" ? undefined : page})
                }
              >
                {page}
              </a>
            );
          })}

          {currentPage < totalPages ? (
            <a
              aria-label="Next page"
              data-track-destination={`/${locale}/news${buildQueryString(query, {page: String(currentPage + 1)})}`}
              data-track-event="pagination_click"
              data-track-label="next"
              data-track-location="news_pagination"
              href={`/${locale}/news${buildQueryString(query, {page: String(currentPage + 1)})}`}
              onClick={(event) =>
                navigate(event, {page: String(currentPage + 1)})
              }
            >
              ›
            </a>
          ) : (
            <span aria-disabled="true">›</span>
          )}
        </div>
      </div>
    </section>
  );
}
