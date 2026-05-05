import {SiteShell} from "@/components/layout/site-shell";
import {LoadingView} from "@/components/sections/loading-view";
import {defaultLocale} from "@/lib/i18n";

export default function RootLoading() {
  return (
    <SiteShell locale={defaultLocale}>
      <LoadingView />
    </SiteShell>
  );
}
