import Image from "@/components/media/smart-image";
import Link from "next/link";
import {ChevronRight} from "lucide-react";

import type {LocalizedText} from "@/content/types";
import {t, type Locale} from "@/lib/i18n";

export function BrandMark({compact = false}: {compact?: boolean}) {
  const iconSize = compact ? 32 : 40;

  return (
    <div
      className={`inline-flex items-center whitespace-nowrap font-display font-extrabold leading-none tracking-[-0.06em] ${
        compact ? "gap-1.5 text-[1.28rem]" : "gap-2 text-[clamp(1.45rem,2vw,1.95rem)]"
      }`}
    >
      <Image
        alt="yaoshun toys"
        className={`shrink-0 ${compact ? "h-8 w-8" : "h-10 w-10"}`}
        height={iconSize}
        src="/favicon-rounded-192.png"
        width={iconSize}
      />
      <span className="text-[#2563ff]">yaoshun</span>
      <span className="text-[#ff9700]">toys</span>
    </div>
  );
}

export function SectionTitle({
  locale,
  eyebrow,
  title,
  description,
  align = "left",
}: {
  locale: Locale;
  eyebrow?: LocalizedText;
  title: LocalizedText;
  description?: LocalizedText;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      {eyebrow ? <p className="section-eyebrow">{t(locale, eyebrow)}</p> : null}
      <h2 className="section-title">{t(locale, title)}</h2>
      {description ? <p className="section-copy">{t(locale, description)}</p> : null}
    </div>
  );
}

export function Breadcrumbs({
  locale,
  items,
  className,
  separator = "slash",
  trackingLocation = "breadcrumbs",
}: {
  locale: Locale;
  items: Array<{label: LocalizedText; href?: string}>;
  className?: string;
  separator?: "chevron" | "slash";
  trackingLocation?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={className ? `breadcrumbs ${className}` : "breadcrumbs"}>
      {items.map((item, index) => {
        const content = item.href ? (
          <Link
            className="breadcrumbs-link"
            data-track-destination={item.href}
            data-track-event="breadcrumb_click"
            data-track-label={t(locale, item.label)}
            data-track-location={trackingLocation}
            href={item.href}
          >
            {t(locale, item.label)}
          </Link>
        ) : (
          <span className="breadcrumbs-current">{t(locale, item.label)}</span>
        );

        return (
          <span key={`${t(locale, item.label)}-${index}`} className="breadcrumbs-item">
            {content}
            {index < items.length - 1 ? (
              separator === "slash" ? (
                <span aria-hidden="true" className="breadcrumbs-separator">
                  /
                </span>
              ) : (
                <ChevronRight size={14} strokeWidth={2.25} />
              )
            ) : null}
          </span>
        );
      })}
    </nav>
  );
}
