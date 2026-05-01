"use client";

import {X} from "lucide-react";
import Image, {type StaticImageData} from "@/components/smart-image";
import {useEffect, useState} from "react";

type CertificateItem = {
  code: string;
  title: string;
  image: string | StaticImageData;
};

export function AboutCertificateGallery({
  items,
  dialogLabel,
  closeLabel,
}: {
  items: readonly CertificateItem[];
  dialogLabel: string;
  closeLabel: string;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeItem = activeIndex === null ? null : items[activeIndex];

  useEffect(() => {
    if (activeItem === null) {
      document.body.style.overflow = "";
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveIndex(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeItem]);

  return (
    <>
      <div className="about-certificate-gallery">
        <div className="about-certificate-row">
          {items.map((item, index) => (
            <button
              aria-label={`${dialogLabel}: ${item.code} ${item.title}`}
              className="about-certificate-card"
              key={item.code + item.title + index}
              type="button"
              onClick={() => setActiveIndex(index)}
            >
              <span className="about-certificate-frame">
                <span className="about-certificate-paper">
                  <Image
                    alt={`${item.code} ${item.title}`}
                    className="about-certificate-image"
                    fill
                    sizes="(min-width: 1024px) 12.25rem, (min-width: 768px) 20vw, 31vw"
                    src={item.image}
                  />
                </span>
              </span>
            </button>
          ))}
        </div>
        <div className="about-certificate-shelf" />
      </div>

      {activeItem ? (
        <div
          aria-label={dialogLabel}
          aria-modal="true"
          className="about-certificate-modal"
          role="dialog"
        >
          <button
            aria-label={closeLabel}
            className="about-certificate-modal-backdrop"
            type="button"
            onClick={() => setActiveIndex(null)}
          />
          <div className="about-certificate-modal-panel">
            <div className="about-certificate-modal-head">
              <div className="about-certificate-modal-copy">
                <strong>{activeItem.code}</strong>
                <span>{activeItem.title}</span>
              </div>
              <button
                aria-label={closeLabel}
                className="about-certificate-modal-close"
                type="button"
                onClick={() => setActiveIndex(null)}
              >
                <X size={18} strokeWidth={2.2} />
              </button>
            </div>

            <div className="about-certificate-modal-image-wrap">
              <Image
                alt={`${activeItem.code} ${activeItem.title}`}
                className="about-certificate-modal-image"
                fill
                sizes="(min-width: 1024px) 70vw, 94vw"
                src={activeItem.image}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
