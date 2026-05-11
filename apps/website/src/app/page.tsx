import {SiteShell} from "@/components/layout/site-shell";
import {SiteStructuredData} from "@/components/seo/structured-data";
import {defaultLocale, localeRegistry} from "@/lib/i18n";

import HomePage from "./[locale]/page";

export default async function RootPage() {
  return (
    <>
      <SiteStructuredData locale={defaultLocale} />
      <div lang={localeRegistry[defaultLocale].htmlLang}>
        <SiteShell locale={defaultLocale}>
          {await HomePage({
            params: Promise.resolve({locale: defaultLocale}),
          })}
        </SiteShell>
      </div>
    </>
  );
}
