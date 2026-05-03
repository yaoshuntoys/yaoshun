import type {Metadata} from "next";

import {FallbackPage} from "@/components/sections/fallback-page";
import {localeRegistry, type Locale} from "@/lib/i18n";
import {contactFormPath, localizedPath} from "@/lib/routes";

export const metadata: Metadata = {
  title: "Page Not Found | yaoshun toys",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LocaleNotFound({
  params,
}: {
  params?: Promise<{locale?: string}> | undefined;
}) {
  const {locale} = (await params) ?? {};
  const safeLocale: Locale = locale && locale in localeRegistry ? (locale as Locale) : "en";

  return (
    <FallbackPage
      actions={[
        {
          href: localizedPath(safeLocale, "home"),
          icon: "home",
          label: {en: "Back to Home", zh: "返回首页"},
        },
        {
          href: contactFormPath(safeLocale),
          icon: "contact",
          label: {en: "Ask for Help", zh: "寻求帮助"},
          variant: "secondary",
        },
      ]}
      description={{
        en: "The page you were looking for does not exist, has moved, or the link is no longer available.",
        zh: "你访问的页面不存在、已经迁移，或该链接已不再可用。",
      }}
      eyebrow={{en: "Fallback Route", zh: "兜底页面"}}
      locale={safeLocale}
      statusLabel="404"
      supportText={{
        en: "If you arrived from a product quote or shared link, send us the details and we will point you to the right page.",
        zh: "如果你来自产品报价或分享链接，可以把详情发给我们，我们会帮你定位正确页面。",
      }}
      title={{en: "This Page Is Not Available", zh: "当前页面不可用"}}
    />
  );
}
