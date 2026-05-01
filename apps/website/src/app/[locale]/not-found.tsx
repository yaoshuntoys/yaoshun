import Link from "next/link";

import {SectionTitle} from "@/components/marketing";
import {localeRegistry, type Locale} from "@/lib/i18n";
import {primaryButtonClass} from "@/lib/ui";

export default async function LocaleNotFound({
  params,
}: {
  params?: Promise<{locale?: string}> | undefined;
}) {
  const {locale} = (await params) ?? {};
  const safeLocale: Locale = locale && locale in localeRegistry ? (locale as Locale) : "en";

  return (
    <div className="page-shell">
      <section className="section-panel text-center">
        <SectionTitle
          description={{
            en: "The page you were looking for does not exist or has moved to a new location.",
            zh: "你访问的页面不存在，或已经迁移到新的地址。",
          }}
          locale={safeLocale}
          title={{en: "Page Not Found", zh: "页面未找到"}}
        />
        <p className="mt-4">
          <Link className={primaryButtonClass} href={`/${safeLocale}`}>
            {safeLocale === "zh" ? "返回首页" : "Back to Home"}
          </Link>
        </p>
      </section>
    </div>
  );
}
