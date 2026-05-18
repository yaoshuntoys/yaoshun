import type {Metadata} from "next";

import {LegalDocumentPage} from "@/components/sections/legal-document-page";
import {refundReturnContent} from "@/content/site";
import {getLocaleFromParams} from "@/lib/i18n";
import {buildPageMetadata} from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const locale = await getLocaleFromParams(params);
  return buildPageMetadata(locale, refundReturnContent.seo, "refund-return");
}

export default async function RefundReturnPage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const locale = await getLocaleFromParams(params);

  return (
    <LegalDocumentPage
      content={refundReturnContent}
      currentLabel={refundReturnContent.hero.title}
      locale={locale}
    />
  );
}
