import {SiteShell} from "@/components/layout/site-shell";
import {FallbackPage} from "@/components/sections/fallback-page";
import {defaultLocale} from "@/lib/i18n";

export default function RootLoading() {
  return (
    <SiteShell locale={defaultLocale}>
      <FallbackPage
        description={{
          en: "We are preparing the next view and checking the content needed for this request.",
          zh: "我们正在准备下一个视图，并加载本次请求所需内容。",
        }}
        eyebrow={{en: "Loading", zh: "加载中"}}
        isLoading
        locale={defaultLocale}
        statusLabel="Loading"
        suggestions={[]}
        title={{en: "Preparing Your Page", zh: "正在准备页面"}}
      />
    </SiteShell>
  );
}
