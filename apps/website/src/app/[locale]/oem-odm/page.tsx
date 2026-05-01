import {getLocaleFromParams} from "@/lib/i18n";
import {redirect} from "next/navigation";

export default async function OemOdmPage({params}: {params: Promise<{locale: string}>}) {
  const locale = await getLocaleFromParams(params);
  redirect(`/${locale}/solutions`);
}
