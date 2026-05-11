"use client";

import {useEffect, useMemo, useState} from "react";
import type {MouseEvent} from "react";
import {ArrowRight, Package2} from "lucide-react";
import Image from "@/components/media/smart-image";
import Link from "next/link";

import {productCollections, productsPageAssets} from "@/content/pages/products";
import {t, type Locale} from "@/lib/i18n";
import {localizedPath, productPath} from "@/lib/routes";

type SearchParamMap = {
  category?: string;
  page?: string;
};

export type ProductsCatalogClientItem = {
  productId: string;
  label: {en?: string; zh?: string};
  summary: {en?: string; zh?: string};
  collection: string;
  images: string[];
  piecesLabel: string;
  priceLabel: string;
  bestseller?: boolean;
};

type ProductsCatalogClientProps = {
  catalog: ProductsCatalogClientItem[];
  locale: Locale;
  text: {
    allProducts: string;
    categories: string;
  };
};

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
    if (value) {
      params.set(key, value);
    }
  }

  const query = params.toString();
  return query ? `?${query}` : "";
}

function formatShowingText(
  locale: Locale,
  start: number,
  end: number,
  total: number,
) {
  return t(locale, {
    en: `Showing ${start}-${end} of ${total} products`,
    zh: `显示 ${start}-${end} / ${total} 个产品`,
  });
}

export function ProductsCatalogClient({
  catalog,
  locale,
  text,
}: ProductsCatalogClientProps) {
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

  const sortedCatalog = useMemo(
    () =>
      [...catalog].sort(
        (a, b) => Number(b.bestseller) - Number(a.bestseller),
      ),
    [catalog],
  );
  const filtered = useMemo(
    () =>
      sortedCatalog.filter(
        (item) => !query.category || item.collection === query.category,
      ),
    [query.category, sortedCatalog],
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const productsHref = localizedPath(locale, "products");
  const currentPage = Math.min(
    Math.max(Number(query.page || "1"), 1),
    totalPages,
  );
  const gridProducts = filtered.slice(
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
    const href = `${productsHref}${buildQueryString(query, next)}`;
    window.history.pushState(null, "", href);
    setQuery(nextQuery);
  }

  const currentQuery = {
    category: query.category,
    page: query.page,
  };

  return (
    <section className="products-catalog-layout" id="products-catalog">
      <aside className="products-sidebar">
        <div className="products-sidebar-sticky">
          <div className="products-sidebar-group">
            <h3>{text.categories}</h3>
            <div className="products-category-list">
              <a
                className={
                  !query.category
                    ? "products-category-link active"
                    : "products-category-link"
                }
                data-track-category="all"
                data-track-destination={productsHref}
                data-track-event="filter_select"
                data-track-label="all_products"
                data-track-location="products_category_filter"
                href={productsHref}
                onClick={(event) =>
                  navigate(event, {category: undefined, page: undefined})
                }
              >
                {text.allProducts}
              </a>
              {productCollections.map((collection) => {
                const href = `${productsHref}${buildQueryString(currentQuery, {
                  category: collection.key,
                  page: undefined,
                })}`;

                return (
                  <a
                    key={collection.key}
                    className={
                      query.category === collection.key
                        ? "products-category-link active"
                        : "products-category-link"
                    }
                    data-track-category={collection.key}
                    data-track-destination={href}
                    data-track-event="filter_select"
                    data-track-label={collection.key}
                    data-track-location="products_category_filter"
                    href={href}
                    onClick={(event) =>
                      navigate(event, {
                        category: collection.key,
                        page: undefined,
                      })
                    }
                  >
                    {collection.label[locale]}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </aside>

      <div className="products-catalog-main">
        <div className="products-catalog-head products-catalog-head-sticky">
          <p className="products-catalog-count">
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

        <div className="products-grid-custom">
          {gridProducts.map((item) => (
            <Link
              className="products-grid-card"
              data-track-event="product_card_click"
              data-track-label={item.productId}
              data-track-location="products_grid"
              href={productPath(locale, item.productId)}
              key={item.productId}
              prefetch={false}
            >
              <div className="products-grid-image-wrap">
                <Image
                  alt={t(locale, item.label)}
                  className="products-grid-image"
                  fill
                  preview
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
                    {item.piecesLabel}
                  </span>
                </div>
                <div className="products-grid-footer">
                  <strong>{item.priceLabel}</strong>
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
            <a
              aria-label="Previous page"
              data-track-destination={`${productsHref}${buildQueryString(currentQuery, {page: String(currentPage - 1) === "1" ? undefined : String(currentPage - 1)})}`}
              data-track-event="pagination_click"
              data-track-label="previous"
              data-track-location="products_pagination"
              href={`${productsHref}${buildQueryString(currentQuery, {page: String(currentPage - 1) === "1" ? undefined : String(currentPage - 1)})}`}
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
            const href = `${productsHref}${buildQueryString(currentQuery, {
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
                data-track-location="products_pagination"
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
              data-track-destination={`${productsHref}${buildQueryString(currentQuery, {page: String(currentPage + 1)})}`}
              data-track-event="pagination_click"
              data-track-label="next"
              data-track-location="products_pagination"
              href={`${productsHref}${buildQueryString(currentQuery, {page: String(currentPage + 1)})}`}
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
