import {SiteStructuredData} from '@/components/seo/structured-data';
import {SiteShell} from '@/components/layout/site-shell';
import {getLocaleFromParams, localeRegistry, locales} from '@/lib/i18n';

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const locale = await getLocaleFromParams(params);

  return (
    <>
      <SiteStructuredData locale={locale} />
      <div lang={localeRegistry[locale].htmlLang}>
        <SiteShell locale={locale}>{children}</SiteShell>
      </div>
    </>
  );
}
