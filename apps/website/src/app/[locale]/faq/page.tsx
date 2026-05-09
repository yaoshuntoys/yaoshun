import type {Metadata} from "next";
import "@/styles/pages/faq.css";
import {FaqAccordionItem} from "@/components/sections/faq-accordion-item";
import {Breadcrumbs} from "@/components/ui/marketing";
import {StructuredData} from "@/components/seo/structured-data";
import {faqContent} from "@/content/site";
import {buildPageMetadata} from "@/lib/metadata";
import {getLocaleFromParams, t} from "@/lib/i18n";
import {toAbsoluteUrl} from "@/lib/site-config";
import {faqItems} from "@/content/pages/faq";

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const locale = await getLocaleFromParams(params);
  return buildPageMetadata(locale, faqContent.seo, "faq");
}

function copy(locale: "en" | "zh") {
  return {
    sectionTitle: t(locale, {en: "Toy OEM/ODM FAQ", zh: "玩具 OEM/ODM 常见问题"}),
    sectionText: t(locale, {
      en: "Quick answers for MOQ, sampling, packaging, lead time, quality checks, and export handoff before production starts.",
      zh: "快速了解起订量、打样、包装、交期、质检与出口交接等量产前关键问题。",
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
          trackingLocation="faq_breadcrumbs"
        />
      </div>

      <section className="faq-content-grid">
        <div className="faq-main-panel">
          <div className="faq-section-head">
            <h1>{text.sectionTitle}</h1>
            <p>{text.sectionText}</p>
          </div>

          <div className="faq-accordion-list">
            {faqItems.map((item, index) => (
              <FaqAccordionItem
                answer={item.answer[locale]}
                defaultOpen={index === 0}
                key={item.question.en}
                locale={locale}
                question={item.question[locale]}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
