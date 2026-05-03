import type {Metadata} from "next";

import {LegalDocumentPage} from "@/components/sections/legal-document-page";
import {privacyContent} from "@/content/site";
import {buildPageMetadata} from "@/lib/metadata";
import {getLocaleFromParams} from "@/lib/i18n";

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const locale = await getLocaleFromParams(params);
  return buildPageMetadata(locale, privacyContent.seo, "privacy");
}

export default async function PrivacyPage({params}: {params: Promise<{locale: string}>}) {
  const locale = await getLocaleFromParams(params);

  return (
    <LegalDocumentPage
      content={privacyContent}
      currentLabel={privacyContent.hero.title}
      locale={locale}
    />
  );
}
