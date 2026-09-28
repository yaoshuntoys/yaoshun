import Image from "@/components/media/smart-image";
import type {Locale} from "@/lib/i18n";

import styles from "./company-showcase.module.css";

type FactoryItem = {
  title: Readonly<Record<Locale, string>>;
  image: string;
};

export function SourceFactorySection({
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
  items: readonly FactoryItem[];
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
      <div className={styles.factoryGrid}>
        {items.map((item) => (
          <article className={styles.factoryCard} key={item.title.en}>
            <div className={styles.factoryImageWrap}>
              <Image
                alt={item.title[locale]}
                className={styles.factoryImage}
                fill
                preview
                sizes="(min-width: 1024px) 26vw, (min-width: 768px) 42vw, 100vw"
                src={item.image}
                unoptimized={item.image.startsWith("http")}
              />
            </div>
            <div className={styles.factoryLabel}>{item.title[locale]}</div>
          </article>
        ))}
      </div>
    </section>
  );
}
