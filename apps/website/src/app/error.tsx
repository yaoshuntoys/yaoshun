"use client";

import {useEffect} from "react";

import {SiteShell} from "@/components/layout/site-shell";
import {FallbackPage} from "@/components/sections/fallback-page";
import {defaultLocale} from "@/lib/i18n";
import {contactFormPath, localizedPath} from "@/lib/routes";

export default function RootError({
  error,
  reset,
}: {
  error: Error & {digest?: string};
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <SiteShell locale={defaultLocale}>
      <FallbackPage
        actions={[
          {
            icon: "retry",
            label: {en: "Try Again", zh: "重试"},
            onClick: reset,
          },
          {
            href: localizedPath(defaultLocale, "home"),
            icon: "home",
            label: {en: "Back to Home", zh: "返回首页"},
            variant: "secondary",
          },
          {
            href: contactFormPath(defaultLocale),
            icon: "contact",
            label: {en: "Contact Us", zh: "联系我们"},
            variant: "secondary",
          },
        ]}
        description={{
          en: "Something interrupted this page before it could finish loading. You can retry the request or return to a stable entry point.",
          zh: "页面加载过程中被意外中断。你可以重试请求，或返回稳定入口继续浏览。",
        }}
        eyebrow={{en: "Runtime Fallback", zh: "运行兜底"}}
        locale={defaultLocale}
        statusLabel="500"
        supportText={{
          en: "If this keeps happening, send us the page URL and reference code so we can investigate faster.",
          zh: "如果问题持续出现，请把页面地址和参考编号发给我们，便于更快排查。",
        }}
        technicalDetails={error.digest ? `Reference: ${error.digest}` : undefined}
        title={{en: "We Hit A Temporary Issue", zh: "页面暂时遇到问题"}}
      />
    </SiteShell>
  );
}
