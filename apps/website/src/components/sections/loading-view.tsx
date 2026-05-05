import type {LocalizedText} from "@/content/types";
import {t, type Locale} from "@/lib/i18n";

export function LoadingView({
  description,
  locale,
  title,
}: {
  description: LocalizedText;
  locale: Locale;
  title: LocalizedText;
}) {
  return (
    <section
      aria-live="polite"
      className="mx-auto flex min-h-[42vh] w-[min(1260px,calc(100%-32px))] items-center justify-center py-10 md:min-h-[48vh] md:py-14"
    >
      <div className="flex w-full max-w-[280px] flex-col items-center gap-4 text-center">
        <div className="relative flex h-11 w-11 items-center justify-center">
          <span className="absolute inset-0 rounded-full border-2 border-[rgba(37,99,255,0.14)]" />
          <span className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#2563ff] animate-spin" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#2563ff]" />
        </div>
        <div className="space-y-1">
          <h1 className="font-display text-[1.05rem] font-bold leading-tight tracking-normal text-[#132968]">
            {t(locale, title)}
          </h1>
          <p className="text-[0.88rem] leading-6 text-[#6f7ea9]">
            {t(locale, description)}
          </p>
        </div>
      </div>
    </section>
  );
}
