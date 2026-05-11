import {permanentRedirect} from "next/navigation";

import {getLocaleFromParams} from "@/lib/i18n";
import {localizedPath} from "@/lib/routes";

export default async function ComplianceRedirect({params}: {params: Promise<{locale: string}>}) {
  const locale = await getLocaleFromParams(params);
  permanentRedirect(localizedPath(locale, "about"));
}
