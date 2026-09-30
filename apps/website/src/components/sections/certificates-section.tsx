"use client";

import {ChevronDown, ChevronUp, FileText} from "lucide-react";
import {useState} from "react";

import Image, {type StaticImageData} from "@/components/media/smart-image";

import styles from "./certificates-section.module.css";

type CertificateItem = {
  code: string;
  title: string;
  image: string | StaticImageData;
  documentUrl?: string;
};

const MOBILE_INITIAL_VISIBLE_COUNT = 4;
const DESKTOP_INITIAL_VISIBLE_COUNT = 12;

function getPreviewSource(image: CertificateItem["image"]) {
  return typeof image === "string" ? image : image.src;
}

export function CertificatesSection({
  collapseLabel,
  description,
  documentLabel,
  dialogLabel,
  expandLabel,
  eyebrow,
  id,
  items,
  limitToTwoRowsOnMobile = false,
  previewOnlyLabel,
  title,
}: {
  collapseLabel: string;
  description: string;
  documentLabel: string;
  dialogLabel: string;
  expandLabel: string;
  eyebrow: string;
  id: string;
  items: readonly CertificateItem[];
  limitToTwoRowsOnMobile?: boolean;
  previewOnlyLabel: string;
  title: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const mobileInitialVisibleCount = limitToTwoRowsOnMobile
    ? MOBILE_INITIAL_VISIBLE_COUNT
    : DESKTOP_INITIAL_VISIBLE_COUNT;
  const hasMoreItems = items.length > mobileInitialVisibleCount;
  const galleryId = `${id}-gallery`;
  const titleId = `${id}-title`;

  return (
    <section aria-labelledby={titleId} className={styles.section} id={id}>
      <div className={styles.copy}>
        <div className={styles.heading}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h2 className={styles.title} id={titleId}>
            {title}
          </h2>
        </div>
        <p className={styles.description}>{description}</p>
      </div>

      <div className={styles.gallery}>
        <div
          className={styles.row}
          data-limit-mobile={limitToTwoRowsOnMobile}
          data-expanded={isExpanded}
          id={galleryId}
        >
          {items.map((item) => {
            const previewSource = getPreviewSource(item.image);
            const accessibleTitle = `${item.code} ${item.title}`;

            return (
              <div className={styles.item} key={previewSource}>
                <button
                  aria-label={`${dialogLabel}: ${accessibleTitle}`}
                  className={styles.card}
                  data-image-preview-alt={accessibleTitle}
                  data-image-preview-src={previewSource}
                  data-image-preview-trigger
                  type="button"
                >
                  <span className={styles.frame}>
                    <span className={styles.paper}>
                      <Image
                        alt={accessibleTitle}
                        className={styles.image}
                        fill
                        preview
                        sizes="(min-width: 768px) 12.25rem, 44vw"
                        src={item.image}
                      />
                    </span>
                  </span>
                </button>
                <div className={styles.meta}>
                  <span className={styles.code}>{item.code}</span>
                  <span className={styles.itemTitle}>{item.title}</span>
                </div>
                {item.documentUrl ? (
                  <a
                    className={styles.documentLink}
                    href={item.documentUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <FileText aria-hidden="true" size={13} strokeWidth={2} />
                    {documentLabel}
                  </a>
                ) : (
                  <span className={styles.documentUnavailable}>
                    {previewOnlyLabel}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {hasMoreItems ? (
          <button
            aria-controls={galleryId}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? collapseLabel : expandLabel}
            className={styles.toggle}
            onClick={() => setIsExpanded((current) => !current)}
            type="button"
          >
            <span>
              {isExpanded ? (
                collapseLabel
              ) : (
                <>
                  {expandLabel} (
                  <span className={styles.mobileRemainingCount}>
                    {items.length - mobileInitialVisibleCount}
                  </span>
                  <span className={styles.desktopRemainingCount}>
                    {items.length - DESKTOP_INITIAL_VISIBLE_COUNT}
                  </span>
                  )
                </>
              )}
            </span>
            {isExpanded ? (
              <ChevronUp aria-hidden="true" size={17} strokeWidth={2.1} />
            ) : (
              <ChevronDown aria-hidden="true" size={17} strokeWidth={2.1} />
            )}
          </button>
        ) : null}
      </div>
    </section>
  );
}
