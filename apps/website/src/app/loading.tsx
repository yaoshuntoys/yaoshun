import {SiteShell} from "@/components/layout/site-shell";
import {LoadingView} from "@/components/sections/loading-view";
import {defaultLocale} from "@/lib/i18n";

export default function RootLoading() {
  return (
    <SiteShell locale={defaultLocale}>
      <LoadingView
        description={{
          en: "Loading the next page.",
          zh: "正在加载页面。",
        }}
        locale={defaultLocale}
        title={{en: "Loading", zh: "加载中"}}
      />
    </SiteShell>
  );
}
