"use client";

import Image, {type StaticImageData} from "@/components/media/smart-image";

type CertificateItem = {
  code: string;
  title: string;
  image: string | StaticImageData;
};

function getPreviewSource(image: CertificateItem["image"]) {
  return typeof image === "string" ? image : image.src;
}

export function AboutCertificateGallery({
  items,
  dialogLabel,
}: {
  items: readonly CertificateItem[];
  dialogLabel: string;
}) {
  return (
    <div className="about-certificate-gallery">
      <div className="about-certificate-row">
        {items.map((item, index) => (
          <button
            aria-label={`${dialogLabel}: ${item.code} ${item.title}`}
            className="about-certificate-card"
            data-image-preview-alt={`${item.code} ${item.title}`}
            data-image-preview-src={getPreviewSource(item.image)}
            data-image-preview-trigger
            key={item.code + item.title + index}
            type="button"
          >
            <span className="about-certificate-frame">
              <span className="about-certificate-paper">
                <Image
                  alt={`${item.code} ${item.title}`}
                  className="about-certificate-image"
                  fill
                  preview
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
  );
}
