import {Breadcrumbs} from "@/components/ui/marketing";
import type {LocalizedText} from "@/content/types";
import {t, type Locale} from "@/lib/i18n";
import {localizedPath} from "@/lib/routes";

type LegalLink = {
  href: string;
  label: LocalizedText;
};

type LegalSection = {
  title: LocalizedText;
  paragraphs: ReadonlyArray<LocalizedText>;
  links?: ReadonlyArray<LegalLink>;
};

type LegalDocumentContent = {
  hero: {
    eyebrow: LocalizedText;
    title: LocalizedText;
    description: LocalizedText;
  };
  policyMeta: {
    effectiveDateLabel: LocalizedText;
    updatedDateLabel: LocalizedText;
    effectiveDate: LocalizedText;
    updatedDate: LocalizedText;
  };
  sections: ReadonlyArray<LegalSection>;
};

export function LegalDocumentPage({
  content,
  currentLabel,
  locale,
}: {
  content: LegalDocumentContent;
  currentLabel: LocalizedText;
  locale: Locale;
}) {
  return (
    <div className="page-shell pt-4 md:pt-6 lg:pt-8">
      <section className="section-panel min-w-0">
        <Breadcrumbs
          items={[
            {href: localizedPath(locale, "home"), label: {en: "Home", zh: "首页"}},
            {label: currentLabel},
          ]}
          locale={locale}
        />

        <div className="mt-5 max-w-4xl">
          <p className="section-eyebrow">{t(locale, content.hero.eyebrow)}</p>
          <h1 className="section-title">{t(locale, content.hero.title)}</h1>
          <p className="section-copy">{t(locale, content.hero.description)}</p>
        </div>

        <p className="mt-5 text-sm font-semibold leading-6 text-[#6f7ea9]">
          <span className="text-[#132968]">
            {t(locale, content.policyMeta.effectiveDateLabel)}
          </span>
          : {t(locale, content.policyMeta.effectiveDate)}
          <span className="mx-2 text-[#b8c3dd]">/</span>
          <span className="text-[#132968]">
            {t(locale, content.policyMeta.updatedDateLabel)}
          </span>
          : {t(locale, content.policyMeta.updatedDate)}
        </p>

        <article className="mt-8 max-w-4xl border-t border-[rgba(32,62,143,0.08)] pt-6">
          {content.sections.map((section) => (
            <section
              className="border-b border-[rgba(32,62,143,0.08)] py-6 first:pt-0 last:border-b-0 last:pb-0"
              key={t(locale, section.title)}
            >
              <h2 className="font-display text-[1.16rem] font-bold leading-tight tracking-normal text-[#132968]">
                {t(locale, section.title)}
              </h2>
              <div className="mt-3 grid gap-3">
                {section.paragraphs.map((paragraph) => (
                  <p
                    className="m-0 text-[0.98rem] leading-8 text-[#6f7ea9]"
                    key={t(locale, paragraph)}
                  >
                    {t(locale, paragraph)}
                  </p>
                ))}
              </div>
              {section.links?.length ? (
                <ul className="mt-4 grid gap-2 text-[0.95rem] leading-7 text-[#2563ff]">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <a
                        className="font-semibold transition hover:text-[#0e2f9a]"
                        href={link.href}
                        rel="noreferrer"
                        target="_blank"
                      >
                        {t(locale, link.label)}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </article>
      </section>
    </div>
  );
}
