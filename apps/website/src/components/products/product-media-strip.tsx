"use client";

import Image from "@/components/media/smart-image";
import {PlayCircle} from "lucide-react";
import {useMemo, useState} from "react";

import {t} from "@/lib/i18n";

type ProductMediaStripProps = {
  locale: "en" | "zh";
  images: string[];
  title: string;
  videos: string[];
};

export function ProductMediaStrip({locale, images, title, videos}: ProductMediaStripProps) {
  const imageItems = useMemo(() => images.filter(Boolean).slice(0, 6), [images]);
  const videoItems = useMemo(() => videos.filter(Boolean), [videos]);
  const [tab, setTab] = useState<"images" | "videos">("images");
  const text = {
    heading: t(locale, {en: "Product Media", zh: "产品媒体"}),
    images: t(locale, {en: `Images (${images.length})`, zh: `图片 (${images.length})`}),
    videos: t(locale, {en: `Videos (${videoItems.length})`, zh: `视频 (${videoItems.length})`}),
    videoTitle: (index: number) => t(locale, {en: `Product Video ${index + 1}`, zh: `产品视频 ${index + 1}`}),
  };

  return (
    <section className="rounded-[1.7rem] border border-[rgba(24,56,138,0.08)] bg-white p-5 shadow-[0_18px_44px_-34px_rgba(18,41,103,0.16)] sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="m-0 font-display text-[1.55rem] font-semibold tracking-[-0.05em] text-[#17306e]">
          {text.heading}
        </h2>
        <div className="flex flex-wrap gap-3">
          <button
            className={`inline-flex min-h-11 items-center rounded-full px-4 text-[0.84rem] font-bold transition ${
              tab === "images"
                ? "bg-[#2563ff] text-white"
                : "bg-[rgba(37,99,255,0.08)] text-[#6f7ea9] hover:bg-[rgba(37,99,255,0.12)]"
            }`}
            type="button"
            onClick={() => setTab("images")}
          >
            {text.images}
          </button>
          {videoItems.length > 0 ? (
            <button
              className={`inline-flex min-h-11 items-center rounded-full px-4 text-[0.84rem] font-bold transition ${
                tab === "videos"
                  ? "bg-[#2563ff] text-white"
                  : "bg-[rgba(37,99,255,0.08)] text-[#6f7ea9] hover:bg-[rgba(37,99,255,0.12)]"
              }`}
              type="button"
              onClick={() => setTab("videos")}
            >
              {text.videos}
            </button>
          ) : null}
        </div>
      </div>

      {tab === "images" ? (
        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          {imageItems.map((image, index) => (
            <a
              className="group relative block aspect-[4/3] overflow-hidden rounded-[1rem] border border-[rgba(24,56,138,0.08)] bg-[#f8fbff] transition hover:border-[rgba(37,99,255,0.18)]"
              href={image}
              key={`${image}-${index}`}
              rel="noreferrer"
              target="_blank"
            >
              <Image
                alt={`${title} ${index + 1}`}
                className="object-contain object-center transition duration-200"
                fill
                sizes="(min-width: 1280px) 12rem, (min-width: 768px) 20vw, 44vw"
                src={image}
              />
            </a>
          ))}
        </div>
      ) : (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {videoItems.map((video, index) => (
            <article
              className="overflow-hidden rounded-[1.2rem] border border-[rgba(24,56,138,0.08)] bg-[#f8fbff]"
              key={`${video}-${index}`}
            >
              <div className="relative aspect-[16/10]">
                <video className="h-full w-full object-cover" controls preload="metadata" src={video} />
              </div>
              <div className="flex items-center gap-2 px-4 py-3 text-[0.92rem] font-semibold text-[#17306e]">
                <PlayCircle size={18} strokeWidth={2} />
                <span>{text.videoTitle(index)}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
