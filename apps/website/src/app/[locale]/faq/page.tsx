import type {Metadata} from "next";
import {Breadcrumbs} from "@/components/marketing";
import {StructuredData} from "@/components/structured-data";
import {buildMetadata} from "@/lib/metadata";
import {getLocaleFromParams, t} from "@/lib/i18n";
import {toAbsoluteUrl} from "@/lib/site-config";
import {faqItems} from "./data";

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const locale = await getLocaleFromParams(params);
  return buildMetadata(
    locale,
    "FAQ | Educational Toy OEM/ODM Manufacturer",
    "Answers about educational toy manufacturing, in-house mold development, custom plastic production, quality control, compliance files, and export support from Dongguan Yaoshun Technology.",
    "faq",
    [
      "educational toy manufacturer faq",
      "oem odm toy supplier questions",
      "custom plastic manufacturer faq",
      "in-house mold development manufacturer",
      "toy compliance and qc support",
    ],
  );
}

function copy(locale: "en" | "zh") {
  return {
    sectionTitle: t(locale, {en: "Frequently Asked Questions", zh: "常见问题"}),
    sectionText: t(locale, {
      en: "Start here for the questions buyers ask most often before sampling, packaging approval, and mass production.",
      zh: "从这里快速了解买家在打样、包装确认和量产前最常关注的问题。",
    }),
  };
}

export default async function FaqPage({params}: {params: Promise<{locale: string}>}) {
  const locale = await getLocaleFromParams(params);
  const text = copy(locale);
  const pageUrl = toAbsoluteUrl(`/${locale}/faq`);
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: locale === "zh" ? "首页" : "Home",
          item: toAbsoluteUrl(`/${locale}`),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: locale === "zh" ? "常见问题" : "FAQ",
          item: pageUrl,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      url: pageUrl,
      inLanguage: locale === "zh" ? "zh-CN" : "en-US",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question[locale],
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer[locale],
        },
      })),
    },
  ];

  return (
    <div className="faq-page">
      <StructuredData data={structuredData} />
      <div className="faq-breadcrumb-wrap">
        <Breadcrumbs
          items={[
            {href: `/${locale}`, label: {en: "Home", zh: "首页"}},
            {label: {en: "FAQ", zh: "常见问题"}},
          ]}
          locale={locale}
        />
      </div>

      <section className="faq-content-grid">
        <div className="faq-main-panel">
          <div className="faq-section-head">
            <h2>{text.sectionTitle}</h2>
            <p>{text.sectionText}</p>
          </div>

          <div className="faq-accordion-list">
            {faqItems.map((item, index) => (
              <details className="faq-accordion-item" key={item.question.en} open={index === 0}>
                <summary>
                  <span>{item.question[locale]}</span>
                  <span className="faq-accordion-icon" aria-hidden="true">+</span>
                </summary>
                <p className="faq-accordion-answer">{item.answer[locale]}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
