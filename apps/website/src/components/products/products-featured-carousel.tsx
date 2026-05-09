"use client";

import {startTransition, useState} from "react";
import {ArrowRight, ChevronLeft, ChevronRight} from "lucide-react";
import Image from "@/components/media/smart-image";
import Link from "next/link";

import {t, type Locale} from "@/lib/i18n";

type FeaturedCarouselItem = {
  id: string;
  href: string;
  image: string;
  label: {en?: string; zh?: string};
  summary: {en?: string; zh?: string};
  bestseller?: boolean;
};

function wrapIndex(index: number, length: number) {
  return ((index % length) + length) % length;
}

function getRelativeIndex(index: number, activeIndex: number, length: number) {
  let diff = index - activeIndex;

  if (diff > length / 2) {
    diff -= length;
  }

  if (diff < -length / 2) {
    diff += length;
  }

  return diff;
}

export function ProductsFeaturedCarousel({
  items,
  locale,
}: {
  items: FeaturedCarouselItem[];
  locale: Locale;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const text = {
    previous: t(locale, {en: "Previous featured product", zh: "上一个精选产品"}),
    next: t(locale, {en: "Next featured product", zh: "下一个精选产品"}),
    dotLabel: (index: number) =>
      t(locale, {
        en: `Go to product ${index + 1}`,
        zh: `切换到第 ${index + 1} 个产品`,
      }),
  };

  if (!items.length) {
    return null;
  }

  return (
    <>
      <div className="products-featured-stage">
        <button
          aria-label={text.previous}
          className="products-rail-nav products-rail-nav-prev"
          onClick={() => {
            startTransition(() => {
              setActiveIndex((current) => wrapIndex(current - 1, items.length));
            });
          }}
          type="button"
        >
          <ChevronLeft size={20} strokeWidth={2.1} />
        </button>

        <div className="products-featured-rail">
          {items.map((item, index) => {
            const relativeIndex = getRelativeIndex(index, activeIndex, items.length);
            const state =
              relativeIndex === 0
                ? "is-center"
                : relativeIndex === -1
                  ? "is-left"
                  : relativeIndex === 1
                    ? "is-right"
                    : relativeIndex === -2
                      ? "is-far-left"
                      : relativeIndex === 2
                        ? "is-far-right"
                        : "is-hidden";

            return (
              <Link
                className={`products-featured-card ${state}`}
                data-track-event="product_card_click"
                data-track-label={item.id}
                data-track-location="products_featured_carousel"
                href={item.href}
                key={item.id}
                prefetch={false}
              >
                <div className="products-featured-image-wrap">
                  <Image
                    alt={t(locale, item.label)}
                    className="products-featured-image"
                    fill
                    preview
                    sizes="(min-width: 1024px) 28rem, 100vw"
                    src={item.image}
                  />
                </div>
                <div className="products-featured-body">
                  <h3>{t(locale, item.label)}</h3>
                  <p>{t(locale, item.summary)}</p>
                  <span aria-hidden="true" className="products-featured-link">
                    <ArrowRight size={18} strokeWidth={2.1} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <button
          aria-label={text.next}
          className="products-rail-nav products-rail-nav-next"
          onClick={() => {
            startTransition(() => {
              setActiveIndex((current) => wrapIndex(current + 1, items.length));
            });
          }}
          type="button"
        >
          <ChevronRight size={20} strokeWidth={2.1} />
        </button>
      </div>

      <div className="products-rail-dots">
        {items.map((item, index) => (
          <button
            aria-label={text.dotLabel(index)}
            className={index === activeIndex ? "active" : ""}
            key={item.id}
            onClick={() => {
              startTransition(() => {
                setActiveIndex(index);
              });
            }}
            type="button"
          />
        ))}
      </div>
    </>
  );
}
