import type {Metadata} from "next";

import {SiteShell} from "@/components/layout/site-shell";
import {FallbackPage} from "@/components/sections/fallback-page";
import {defaultLocale} from "@/lib/i18n";
import {contactFormPath, localizedPath} from "@/lib/routes";

export const metadata: Metadata = {
  title: "Page Not Found | yaoshun toys",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootNotFound() {
  return (
    <SiteShell locale={defaultLocale}>
      <FallbackPage
        actions={[
          {
            href: localizedPath(defaultLocale, "home"),
            icon: "home",
            label: {en: "Back to Home", zh: "返回首页"},
          },
          {
            href: contactFormPath(defaultLocale),
            icon: "contact",
            label: {en: "Contact Us", zh: "联系我们"},
            variant: "secondary",
          },
        ]}
        description={{
          en: "We could not match this address to a supported page. Start from the homepage or contact us with the link you tried to open.",
          zh: "我们无法将当前地址匹配到可访问页面。你可以从首页重新开始，或把链接发给我们协助确认。",
        }}
        eyebrow={{en: "Fallback Route", zh: "兜底页面"}}
        locale={defaultLocale}
        statusLabel="404"
        title={{en: "This Address Does Not Resolve", zh: "当前地址无法访问"}}
      />
    </SiteShell>
  );
}
