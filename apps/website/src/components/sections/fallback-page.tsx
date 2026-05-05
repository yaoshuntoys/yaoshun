"use client";

import Link from "next/link";
import {
  ArrowRight,
  Home,
  Mail,
  Newspaper,
  PackageSearch,
  RefreshCw,
  Search,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import type {LocalizedText} from "@/content/types";
import {t, type Locale} from "@/lib/i18n";
import {contactFormPath, localizedPath, type RouteKey} from "@/lib/routes";
import {primaryButtonClass, secondaryButtonClass} from "@/lib/ui";

type FallbackIconKey =
  | "contact"
  | "home"
  | "news"
  | "products"
  | "retry"
  | "search"
  | "solutions";

type FallbackAction = {
  href?: string;
  icon: FallbackIconKey;
  label: LocalizedText;
  onClick?: () => void;
  variant?: "primary" | "secondary";
};

type FallbackSuggestion = {
  description: LocalizedText;
  icon: FallbackIconKey;
  label: LocalizedText;
  route: RouteKey;
};

type FallbackPageProps = {
  actions?: FallbackAction[];
  description: LocalizedText;
  eyebrow: LocalizedText;
  isLoading?: boolean;
  locale: Locale;
  statusLabel: string;
  suggestions?: FallbackSuggestion[];
  supportText?: LocalizedText;
  technicalDetails?: string;
  title: LocalizedText;
};

const iconMap: Record<FallbackIconKey, LucideIcon> = {
  contact: Mail,
  home: Home,
  news: Newspaper,
  products: PackageSearch,
  retry: RefreshCw,
  search: Search,
  solutions: Wrench,
};

const defaultSuggestions: FallbackSuggestion[] = [
  {
    description: {
      en: "Browse building toy sets, accessories, and custom-ready product lines.",
      zh: "浏览拼搭玩具套装、配件和可定制产品线。",
    },
    icon: "products",
    label: {en: "View Products", zh: "查看产品"},
    route: "products",
  },
  {
    description: {
      en: "See how OEM/ODM projects move from drawings and samples to production.",
      zh: "了解 OEM/ODM 项目如何从图纸样品推进到生产。",
    },
    icon: "solutions",
    label: {en: "Explore Solutions", zh: "探索方案"},
    route: "solutions",
  },
  {
    description: {
      en: "Send your project details and receive a practical factory reply.",
      zh: "提交项目需求，获取务实的工厂回复。",
    },
    icon: "contact",
    label: {en: "Contact Factory", zh: "联系工厂"},
    route: "contact",
  },
];

function FallbackIcon({icon}: {icon: FallbackIconKey}) {
  const Icon = iconMap[icon];
  return <Icon aria-hidden="true" size={17} strokeWidth={2.2} />;
}

function resolveSuggestionHref(locale: Locale, route: RouteKey) {
  return route === "contact" ? contactFormPath(locale) : localizedPath(locale, route);
}

export function FallbackPage({
  actions = [],
  description,
  eyebrow,
  isLoading = false,
  locale,
  statusLabel,
  suggestions = defaultSuggestions,
  supportText,
  technicalDetails,
  title,
}: FallbackPageProps) {
  return (
    <div className="site-container-narrow grid gap-[1.2rem] pt-[clamp(3.75rem,8vw,6.5rem)] max-md:pt-12">
      <section
        aria-live={isLoading ? "polite" : undefined}
        className="grid justify-items-center overflow-hidden rounded-[1.5rem] border border-[rgba(32,62,143,0.1)] bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(247,250,255,0.96))] px-[clamp(1.35rem,6vw,4.8rem)] py-[clamp(1.35rem,6vw,4.8rem)] text-center shadow-[0_26px_54px_-42px_rgba(20,44,119,0.28)] max-md:rounded-[1.2rem]"
      >
        <div className="mb-4 inline-flex min-h-10 items-center justify-center gap-[0.55rem] rounded-full border border-[rgba(37,99,255,0.13)] bg-[rgba(37,99,255,0.07)] px-[0.85rem] text-[0.82rem] font-extrabold uppercase leading-none text-[#0e2f9a]">
          {isLoading ? <span aria-hidden="true" className="h-[0.82rem] w-[0.82rem] animate-spin rounded-full border-2 border-[rgba(37,99,255,0.22)] border-t-[#2563ff]" /> : null}
          <span>{statusLabel}</span>
        </div>
        <p className="section-eyebrow">{t(locale, eyebrow)}</p>
        <h1 className="m-0 max-w-[760px] font-display text-[clamp(1.8rem,5vw,4rem)] font-extrabold leading-[0.98] tracking-[-0.06em] text-[#132968] max-md:leading-[1.02]">
          {t(locale, title)}
        </h1>
        <p className="mt-4 max-w-[680px] text-[1rem] leading-[1.8] text-[#6f7ea9] max-md:text-[0.94rem] max-md:leading-[1.72]">
          {t(locale, description)}
        </p>

        {actions.length ? (
          <div className="mt-[1.35rem] flex flex-wrap justify-center gap-[0.8rem] max-md:w-full max-md:flex-col">
            {actions.map((action) => {
              const className = action.variant === "secondary" ? secondaryButtonClass : primaryButtonClass;
              const content = (
                <>
                  <span>{t(locale, action.label)}</span>
                  <FallbackIcon icon={action.icon} />
                </>
              );

              if (action.href) {
                return (
                  <Link className={className} href={action.href} key={`${action.href}-${t(locale, action.label)}`}>
                    {content}
                  </Link>
                );
              }

              return (
                <button
                  className={className}
                  key={`button-${t(locale, action.label)}`}
                  type="button"
                  onClick={action.onClick}
                >
                  {content}
                </button>
              );
            })}
          </div>
        ) : null}

        {supportText ? (
          <p className="mt-4 max-w-[600px] text-[0.9rem] leading-[1.7] text-[#7b89af]">
            {t(locale, supportText)}
          </p>
        ) : null}
        {technicalDetails ? (
          <p className="mt-3 max-w-full rounded-xl bg-[rgba(19,41,104,0.05)] px-3 py-2 font-mono text-[0.78rem] text-[#6f7ea9] [overflow-wrap:anywhere]">
            {technicalDetails}
          </p>
        ) : null}
      </section>

      {suggestions.length ? (
        <section
          aria-label={t(locale, {en: "Suggested pages", zh: "推荐页面"})}
          className="grid gap-[0.9rem] min-[900px]:grid-cols-3"
        >
          {suggestions.map((item) => (
            <Link
              className="grid min-h-[5.25rem] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-[0.95rem] rounded-[1.05rem] border border-[rgba(32,62,143,0.09)] bg-[rgba(255,255,255,0.88)] p-4 shadow-[0_18px_36px_-34px_rgba(20,44,119,0.2)] transition hover:-translate-y-px hover:border-[rgba(37,99,255,0.18)] hover:shadow-[0_24px_44px_-34px_rgba(20,44,119,0.26)] min-[900px]:min-h-[11.5rem] min-[900px]:grid-cols-1 min-[900px]:items-start"
              href={resolveSuggestionHref(locale, item.route)}
              key={item.route}
            >
              <span className="inline-flex h-[2.55rem] w-[2.55rem] items-center justify-center rounded-[0.9rem] bg-[rgba(37,99,255,0.09)] text-[#2563ff]">
                <FallbackIcon icon={item.icon} />
              </span>
              <span className="grid gap-1 text-left min-[900px]:text-left">
                <strong className="font-display text-[1rem] leading-[1.2] text-[#132968]">
                  {t(locale, item.label)}
                </strong>
                <span className="text-[0.9rem] leading-[1.55] text-[#6f7ea9]">
                  {t(locale, item.description)}
                </span>
              </span>
              <ArrowRight
                aria-hidden="true"
                className="text-[#2563ff] min-[900px]:self-end"
                size={17}
                strokeWidth={2.2}
              />
            </Link>
          ))}
        </section>
      ) : null}
    </div>
  );
}
