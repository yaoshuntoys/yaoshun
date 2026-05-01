"use client";

import Image from "@/components/smart-image";
import {useState} from "react";
import {ChevronLeft, ChevronRight, Search} from "lucide-react";

export function ProductGallery({
  title,
  images,
}: {
  title: string;
  images: string[];
}) {
  const normalized = images.filter(Boolean);
  const [active, setActive] = useState(0);
  const current = normalized[active] || normalized[0] || "";
  const visibleCount = 5;
  const maxStart = Math.max(0, normalized.length - visibleCount);
  const start = Math.min(Math.max(active - 2, 0), maxStart);
  const visible = normalized.slice(start, start + visibleCount);

  if (!current) {
    return null;
  }

  return (
    <div className="product-gallery grid min-w-0 gap-4">
      <div className="relative overflow-hidden rounded-[1.35rem] border border-[rgba(24,56,138,0.08)] bg-[radial-gradient(circle_at_top,rgba(37,99,255,0.06),transparent_42%),linear-gradient(180deg,#f7faff_0%,#ffffff_100%)] shadow-[0_18px_44px_-34px_rgba(18,41,103,0.16)] sm:rounded-[1.7rem]">
        <div className="relative aspect-[4/3] w-full">
          <Image
            alt={title}
            className="object-contain object-center"
            fill
            priority
            sizes="(min-width: 1024px) 55vw, 100vw"
            src={current}
          />
        </div>
        <button
          aria-label="Open full image"
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
            aria-label="Previous image"
            className="hidden h-11 w-11 items-center justify-center rounded-full border border-[rgba(37,99,255,0.12)] bg-white text-[#2563ff] shadow-[0_14px_30px_-24px_rgba(18,41,103,0.18)] transition duration-200 hover:-translate-y-0.5 hover:border-transparent hover:bg-[linear-gradient(135deg,#2563ff_0%,#1a43c9_100%)] hover:text-white hover:shadow-[0_18px_38px_-24px_rgba(37,99,255,0.62)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:border-[rgba(37,99,255,0.12)] disabled:hover:bg-white disabled:hover:text-[#2563ff] disabled:hover:shadow-[0_14px_30px_-24px_rgba(18,41,103,0.18)] sm:inline-flex"
            disabled={active === 0}
            type="button"
            onClick={() => setActive((value) => Math.max(0, value - 1))}
          >
            <ChevronLeft size={18} strokeWidth={2.15} />
          </button>

          <div className="flex min-w-0 gap-2 overflow-x-auto pb-1 sm:grid sm:grid-cols-5 sm:gap-3 sm:overflow-visible sm:pb-0">
            {visible.map((image, index) => {
              const actualIndex = start + index;
              return (
                <button
                  key={`${image}-${actualIndex}`}
                  className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-[1rem] border bg-white transition sm:aspect-square sm:h-auto sm:w-auto ${
                    actualIndex === active
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
            aria-label="Next image"
            className="hidden h-11 w-11 items-center justify-center rounded-full border border-[rgba(37,99,255,0.12)] bg-white text-[#2563ff] shadow-[0_14px_30px_-24px_rgba(18,41,103,0.18)] transition duration-200 hover:-translate-y-0.5 hover:border-transparent hover:bg-[linear-gradient(135deg,#2563ff_0%,#1a43c9_100%)] hover:text-white hover:shadow-[0_18px_38px_-24px_rgba(37,99,255,0.62)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:border-[rgba(37,99,255,0.12)] disabled:hover:bg-white disabled:hover:text-[#2563ff] disabled:hover:shadow-[0_14px_30px_-24px_rgba(18,41,103,0.18)] sm:inline-flex"
            disabled={active >= normalized.length - 1}
            type="button"
            onClick={() => setActive((value) => Math.min(normalized.length - 1, value + 1))}
          >
            <ChevronRight size={18} strokeWidth={2.15} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
