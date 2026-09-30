"use client";

import {ChevronDown, ChevronUp} from "lucide-react";
import {useState} from "react";

import Image from "@/components/media/smart-image";
import type {Locale} from "@/lib/i18n";

import styles from "./company-showcase.module.css";

type PartnerItem = {
  label: Readonly<Record<Locale, string>>;
  image: string;
};

export function CooperationPartnersSection({
  collapseLabel,
  collapsibleOnMobile = false,
  description,
  eyebrow,
  expandLabel,
  id,
  items,
  locale,
  title,
}: {
  collapseLabel?: string;
  collapsibleOnMobile?: boolean;
  description: string;
  eyebrow: string;
  expandLabel?: string;
  id: string;
  items: readonly PartnerItem[];
  locale: Locale;
  title: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const titleId = `${id}-title`;
  const gridId = `${id}-grid`;
  const hasMoreItems = collapsibleOnMobile && items.length > 4;

  return (
    <section aria-labelledby={titleId} className={styles.section} id={id}>
      <div className={styles.heading}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h2 className={styles.title} id={titleId}>
          {title}
        </h2>
      </div>
      <p className={styles.description}>{description}</p>
      <div
        className={styles.partnerGrid}
        data-collapsible={collapsibleOnMobile}
        data-expanded={isExpanded}
        id={gridId}
      >
        {items.map((item) => (
          <article className={styles.partnerCard} key={item.image}>
            <div className={styles.partnerLogoWrap}>
              <Image
                alt={item.label[locale]}
                className={styles.partnerLogo}
                fill
                sizes="(min-width: 1024px) 13vw, (min-width: 768px) 22vw, 42vw"
                src={item.image}
                unoptimized={item.image.endsWith(".svg")}
              />
            </div>
          </article>
        ))}
      </div>
      {hasMoreItems ? (
        <button
          aria-controls={gridId}
          aria-expanded={isExpanded}
          aria-label={
            isExpanded
              ? collapseLabel || (locale === "zh" ? "收起" : "Show less")
              : expandLabel || (locale === "zh" ? "显示更多" : "Show more")
          }
          className={styles.partnerToggle}
          onClick={() => setIsExpanded((current) => !current)}
          type="button"
        >
          <span>
            {isExpanded
              ? collapseLabel || (locale === "zh" ? "收起" : "Show less")
              : `${expandLabel || (locale === "zh" ? "显示更多" : "Show more")} (${items.length - 4})`}
          </span>
          {isExpanded ? (
            <ChevronUp aria-hidden="true" size={17} strokeWidth={2.1} />
          ) : (
            <ChevronDown aria-hidden="true" size={17} strokeWidth={2.1} />
          )}
        </button>
      ) : null}
    </section>
  );
}
