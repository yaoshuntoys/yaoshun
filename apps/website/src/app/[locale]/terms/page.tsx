import type {Metadata} from "next";

import {Breadcrumbs, SectionTitle} from "@/components/marketing";
import {termsContent} from "@/content/site";
import {buildPageMetadata} from "@/lib/metadata";
import {getLocaleFromParams} from "@/lib/i18n";

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const locale = await getLocaleFromParams(params);
  return buildPageMetadata(locale, termsContent.seo, "terms");
}

export default async function TermsPage({params}: {params: Promise<{locale: string}>}) {
  const locale = await getLocaleFromParams(params);
  const copy = {
    title: {en: "Terms of Use", zh: "使用条款"},
    body: {
      en: "The information on this website is provided for business communication and product reference. Product availability, pricing, and customization scope remain subject to final confirmation between both parties.",
      zh: "本网站内容用于业务沟通与产品参考。具体产品可用性、价格以及定制范围，以双方最终确认结果为准。",
    },
  };

  return (
    <div className="page-shell">
      <section className="section-panel">
        <Breadcrumbs
          items={[
            {href: `/${locale}`, label: {en: "Home", zh: "首页"}},
            {label: copy.title},
          ]}
          locale={locale}
        />
        <div style={{marginTop: "1.2rem"}}>
          <SectionTitle locale={locale} title={copy.title} />
          <p className="section-copy">{copy.body[locale]}</p>
        </div>
      </section>
    </div>
  );
}
