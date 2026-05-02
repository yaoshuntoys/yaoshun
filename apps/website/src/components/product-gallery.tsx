"use client";

import Image from "@/components/smart-image";
import {useState} from "react";
import {ChevronLeft, ChevronRight, Search} from "lucide-react";

import {t, type Locale} from "@/lib/i18n";

function wrapIndex(index: number, length: number) {
  return ((index % length) + length) % length;
}

export function ProductGallery({
  locale,
  title,
  images,
}: {
  locale: Locale;
  title: string;
  images: string[];
}) {
  const normalized = images.filter(Boolean);
  const [active, setActive] = useState(0);
  const activeIndex = normalized.length ? wrapIndex(active, normalized.length) : 0;
  const current = normalized[activeIndex] || normalized[0] || "";
  const visibleCount = 5;
  const maxStart = Math.max(0, normalized.length - visibleCount);
  const start = Math.min(Math.max(activeIndex - 2, 0), maxStart);
  const visible = normalized.slice(start, start + visibleCount);
  const text = {
    open: t(locale, {en: "Open full image", zh: "打开大图"}),
    previous: t(locale, {en: "Previous image", zh: "上一张图片"}),
    next: t(locale, {en: "Next image", zh: "下一张图片"}),
    showImage: (index: number) =>
      t(locale, {
        en: `Show image ${index + 1}`,
        zh: `查看第 ${index + 1} 张图片`,
      }),
  };

  function showPrevious() {
    setActive((value) => wrapIndex(value - 1, normalized.length));
  }

  function showNext() {
    setActive((value) => wrapIndex(value + 1, normalized.length));
  }

  if (!current) {
    return null;
  }

  return (
    <div className="product-gallery grid min-w-0 gap-4">
      <div className="relative overflow-hidden rounded-[1.35rem] border border-[rgba(24,56,138,0.08)] bg-[radial-gradient(circle_at_top,rgba(37,99,255,0.06),transparent_42%),linear-gradient(180deg,#f7faff_0%,#ffffff_100%)] shadow-[0_18px_44px_-34px_rgba(18,41,103,0.16)] sm:rounded-[1.7rem]">
        <button
          aria-label={normalized.length > 1 ? text.next : text.open}
          className={`relative block aspect-[4/3] w-full overflow-hidden border-0 bg-transparent p-0 text-left ${
            normalized.length > 1 ? "cursor-pointer" : "cursor-zoom-in"
          }`}
          type="button"
          onClick={() => {
            if (normalized.length > 1) {
              showNext();
              return;
            }

            window.open(current, "_blank", "noopener,noreferrer");
          }}
        >
          <Image
            alt={`${title} ${activeIndex + 1}`}
            className="object-contain object-center"
            fill
            priority
            sizes="(min-width: 1024px) 55vw, 100vw"
            src={current}
          />
        </button>
        {normalized.length > 1 ? (
          <>
            <button
              aria-label={text.previous}
              className="absolute left-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[rgba(37,99,255,0.12)] bg-white/92 text-[#2563ff] shadow-[0_16px_34px_-24px_rgba(18,41,103,0.22)] backdrop-blur transition duration-200 hover:-translate-y-[calc(50%+1px)] hover:border-transparent hover:bg-[linear-gradient(135deg,#2563ff_0%,#1a43c9_100%)] hover:text-white sm:left-4 sm:h-11 sm:w-11"
              type="button"
              onClick={showPrevious}
            >
              <ChevronLeft size={18} strokeWidth={2.15} />
            </button>
            <button
              aria-label={text.next}
              className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[rgba(37,99,255,0.12)] bg-white/92 text-[#2563ff] shadow-[0_16px_34px_-24px_rgba(18,41,103,0.22)] backdrop-blur transition duration-200 hover:-translate-y-[calc(50%+1px)] hover:border-transparent hover:bg-[linear-gradient(135deg,#2563ff_0%,#1a43c9_100%)] hover:text-white sm:right-4 sm:h-11 sm:w-11"
              type="button"
              onClick={showNext}
            >
              <ChevronRight size={18} strokeWidth={2.15} />
            </button>
          </>
        ) : null}
        <button
          aria-label={text.open}
          className="absolute bottom-4 right-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(37,99,255,0.12)] bg-white text-[#2563ff] shadow-[0_16px_34px_-24px_rgba(18,41,103,0.18)] transition duration-200 hover:-translate-y-0.5 hover:border-transparent hover:bg-[linear-gradient(135deg,#2563ff_0%,#1a43c9_100%)] hover:text-white hover:shadow-[0_18px_38px_-24px_rgba(37,99,255,0.62)]"
          type="button"
          onClick={() => window.open(current, "_blank", "noopener,noreferrer")}
        >
          <Search size={18} strokeWidth={2.1} />
        </button>
      </div>

      {normalized.length > 1 ? (
        <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-3 sm:grid-cols-[auto_minmax(0,1fr)_auto]">
          <button
            aria-label={text.previous}
            className="hidden h-11 w-11 items-center justify-center rounded-full border border-[rgba(37,99,255,0.12)] bg-white text-[#2563ff] shadow-[0_14px_30px_-24px_rgba(18,41,103,0.18)] transition duration-200 hover:-translate-y-0.5 hover:border-transparent hover:bg-[linear-gradient(135deg,#2563ff_0%,#1a43c9_100%)] hover:text-white hover:shadow-[0_18px_38px_-24px_rgba(37,99,255,0.62)] sm:inline-flex"
            type="button"
            onClick={showPrevious}
          >
            <ChevronLeft size={18} strokeWidth={2.15} />
          </button>

          <div className="flex min-w-0 gap-2 overflow-x-auto pb-1 sm:grid sm:grid-cols-5 sm:gap-3 sm:overflow-visible sm:pb-0">
            {visible.map((image, index) => {
              const actualIndex = start + index;
              return (
                <button
                  key={`${image}-${actualIndex}`}
                  aria-current={actualIndex === activeIndex ? "true" : undefined}
                  aria-label={text.showImage(actualIndex)}
                  className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-[1rem] border bg-white transition sm:aspect-square sm:h-auto sm:w-auto ${
                    actualIndex === activeIndex
                      ? "border-[#2563ff] shadow-[0_0_0_2px_rgba(37,99,255,0.12)]"
                      : "border-[rgba(24,56,138,0.08)] hover:border-[rgba(37,99,255,0.18)]"
                  }`}
                  type="button"
                  onClick={() => setActive(actualIndex)}
                >
                  <Image
                    alt={`${title} ${actualIndex + 1}`}
                    className="object-contain object-center"
                    fill
                    sizes="(min-width: 1024px) 96px, 20vw"
                    src={image}
                  />
                </button>
              );
            })}
          </div>

          <button
            aria-label={text.next}
            className="hidden h-11 w-11 items-center justify-center rounded-full border border-[rgba(37,99,255,0.12)] bg-white text-[#2563ff] shadow-[0_14px_30px_-24px_rgba(18,41,103,0.18)] transition duration-200 hover:-translate-y-0.5 hover:border-transparent hover:bg-[linear-gradient(135deg,#2563ff_0%,#1a43c9_100%)] hover:text-white hover:shadow-[0_18px_38px_-24px_rgba(37,99,255,0.62)] sm:inline-flex"
            type="button"
            onClick={showNext}
          >
            <ChevronRight size={18} strokeWidth={2.15} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
