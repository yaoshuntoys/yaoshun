import {getLocaleFromParams} from "@/lib/i18n";
import {localizedPath} from "@/lib/routes";
import {permanentRedirect} from "next/navigation";

export default async function OemOdmPage({params}: {params: Promise<{locale: string}>}) {
  const locale = await getLocaleFromParams(params);
  permanentRedirect(localizedPath(locale, "solutions"));
}
