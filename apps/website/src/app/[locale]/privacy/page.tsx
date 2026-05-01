import type {Metadata} from "next";

import {Breadcrumbs, SectionTitle} from "@/components/marketing";
import {buildMetadata} from "@/lib/metadata";
import {getLocaleFromParams} from "@/lib/i18n";

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const locale = await getLocaleFromParams(params);
  return buildMetadata(locale, "Privacy Policy | yaoshun toys", "Privacy policy for the yaoshun toys website.", "privacy");
}

export default async function PrivacyPage({params}: {params: Promise<{locale: string}>}) {
  const locale = await getLocaleFromParams(params);
  const copy = {
    title: {en: "Privacy Policy", zh: "隐私政策"},
    body: {
      en: "We only collect the information necessary to respond to inquiries, maintain analytics, and improve the website experience. Contact form submissions are used solely for business follow-up and are not sold to third parties.",
      zh: "我们仅收集回复咨询、进行基础分析和改善网站体验所必需的信息。联系表单提交的信息仅用于业务跟进，不会出售给第三方。",
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
