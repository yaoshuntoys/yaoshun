import type { LocalizedText } from "@/content/site";
import { t, type Locale } from "@/lib/i18n";

type SectionHeadingProps = {
  locale: Locale;
  eyebrow?: LocalizedText;
  title: LocalizedText;
  description?: LocalizedText;
  invert?: boolean;
  align?: "left" | "center";
};

export function SectionHeading({
  locale,
  eyebrow,
  title,
  description,
  invert = false,
  align = "left",
}: SectionHeadingProps) {
  const textAlign = align === "center" ? "text-center mx-auto" : "text-left";
  const titleColor = invert ? "text-white" : "text-primary";
  const descriptionColor = invert ? "text-white/70" : "text-on-surface-variant";

  return (
    <div className={textAlign}>
      {eyebrow ? (
        <p
          className={`font-label text-[11px] font-bold uppercase tracking-[0.22em] sm:text-xs ${invert ? "text-secondary-fixed-dim" : "text-secondary"}`}
        >
          {t(locale, eyebrow)}
        </p>
      ) : null}
      <h2
        className={`mt-3 font-headline text-3xl font-extrabold tracking-tighter sm:mt-4 sm:text-4xl ${titleColor}`}
      >
        {t(locale, title)}
      </h2>
      {description ? (
        <p
          className={`mt-3 max-w-3xl text-base leading-relaxed sm:mt-4 sm:text-lg ${descriptionColor}`}
        >
          {t(locale, description)}
        </p>
      ) : null}
    </div>
  );
}
