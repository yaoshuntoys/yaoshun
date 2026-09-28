import Image from "@/components/media/smart-image";
import type {Locale} from "@/lib/i18n";

import styles from "./company-showcase.module.css";

type PartnerItem = {
  label: Readonly<Record<Locale, string>>;
  image: string;
};

export function CooperationPartnersSection({
  description,
  eyebrow,
  id,
  items,
  locale,
  title,
}: {
  description: string;
  eyebrow: string;
  id: string;
  items: readonly PartnerItem[];
  locale: Locale;
  title: string;
}) {
  const titleId = `${id}-title`;

  return (
    <section aria-labelledby={titleId} className={styles.section} id={id}>
      <div className={styles.heading}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h2 className={styles.title} id={titleId}>
          {title}
        </h2>
      </div>
      <p className={styles.description}>{description}</p>
      <div className={styles.partnerGrid}>
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
    </section>
  );
}
