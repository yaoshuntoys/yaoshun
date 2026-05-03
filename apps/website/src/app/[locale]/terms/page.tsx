import type {Metadata} from "next";

import {LegalDocumentPage} from "@/components/sections/legal-document-page";
import {termsContent} from "@/content/site";
import {buildPageMetadata} from "@/lib/metadata";
import {getLocaleFromParams} from "@/lib/i18n";

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const locale = await getLocaleFromParams(params);
  return buildPageMetadata(locale, termsContent.seo, "terms");
}

export default async function TermsPage({params}: {params: Promise<{locale: string}>}) {
  const locale = await getLocaleFromParams(params);

  return (
    <LegalDocumentPage
      content={termsContent}
      currentLabel={termsContent.hero.title}
      locale={locale}
    />
  );
}
