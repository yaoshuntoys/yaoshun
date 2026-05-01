import Image from "@/components/smart-image";
import Link from "next/link";
import {ArrowRight, ChevronRight} from "lucide-react";

import type {LocalizedText} from "@/content/site-relaunch";
import {t, type Locale} from "@/lib/i18n";
import {primaryButtonClass, secondaryButtonClass} from "@/lib/ui";

export function BrandMark({compact = false}: {compact?: boolean}) {
  return (
    <div
      className={`inline-flex whitespace-nowrap font-['Outfit','Plus_Jakarta_Sans',sans-serif] font-extrabold leading-none tracking-[-0.06em] ${
        compact ? "items-end gap-1 text-[1.28rem]" : "items-end gap-1 text-[clamp(1.45rem,2vw,1.95rem)]"
      }`}
    >
      <span className="text-[#2563ff]">yaoshun</span>
      <span className="translate-y-[0.02em] text-[#ff9700]">toys</span>
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
}: {
  locale: Locale;
  items: Array<{label: LocalizedText; href?: string}>;
  className?: string;
  separator?: "chevron" | "slash";
}) {
  return (
    <nav aria-label="Breadcrumb" className={className ? `breadcrumbs ${className}` : "breadcrumbs"}>
      {items.map((item, index) => {
        const content = item.href ? (
          <Link href={item.href}>{t(locale, item.label)}</Link>
        ) : (
          <span>{t(locale, item.label)}</span>
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

export function MetricStrip({
  locale,
  items,
}: {
  locale: Locale;
  items: Array<{value: string; label: LocalizedText}>;
}) {
  return (
    <div className="metric-strip">
      {items.map((item) => (
        <div key={`${item.value}-${t(locale, item.label)}`} className="metric-item">
          <div className="metric-value">{item.value}</div>
          <div className="metric-label">{t(locale, item.label)}</div>
        </div>
      ))}
    </div>
  );
}

export function PrimaryLink({
  href,
  children,
  ghost = false,
}: {
  href: string;
  children: React.ReactNode;
  ghost?: boolean;
}) {
  return (
    <Link className={ghost ? secondaryButtonClass : primaryButtonClass} href={href}>
      <span>{children}</span>
      <ArrowRight size={16} strokeWidth={2.2} />
    </Link>
  );
}

export function NewsletterBanner({
  locale,
  title,
  description,
  placeholder,
  action,
  actionHref,
}: {
  locale: Locale;
  title: LocalizedText;
  description: LocalizedText;
  placeholder: LocalizedText;
  action: LocalizedText;
  actionHref: string;
}) {
  return (
    <section className="newsletter-banner">
      <div>
        <h3 className="newsletter-title">{t(locale, title)}</h3>
        <p className="newsletter-copy">{t(locale, description)}</p>
      </div>
      <form action={actionHref} className="newsletter-form">
        <input aria-label={t(locale, placeholder)} placeholder={t(locale, placeholder)} type="email" />
        <button type="submit">{t(locale, action)}</button>
      </form>
    </section>
  );
}

export function SpotlightCard({
  image,
  title,
  text,
  children,
}: {
  image: string;
  title: string;
  text: string;
  children?: React.ReactNode;
}) {
  return (
    <article className="spotlight-card">
      <div className="spotlight-image-wrap">
        <Image alt={title} className="spotlight-image" fill sizes="(min-width: 1024px) 30vw, 100vw" src={image} />
      </div>
      <div className="spotlight-body">
        <h3>{title}</h3>
        <p>{text}</p>
        {children}
      </div>
    </article>
  );
}
