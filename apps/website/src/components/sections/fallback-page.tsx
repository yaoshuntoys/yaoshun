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
    <div className="fallback-page">
      <section className="fallback-hero" aria-live={isLoading ? "polite" : undefined}>
        <div className="fallback-status">
          {isLoading ? <span className="fallback-spinner" aria-hidden="true" /> : null}
          <span>{statusLabel}</span>
        </div>
        <p className="section-eyebrow">{t(locale, eyebrow)}</p>
        <h1 className="fallback-title">{t(locale, title)}</h1>
        <p className="fallback-copy">{t(locale, description)}</p>

        {actions.length ? (
          <div className="fallback-actions">
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

        {supportText ? <p className="fallback-support">{t(locale, supportText)}</p> : null}
        {technicalDetails ? <p className="fallback-reference">{technicalDetails}</p> : null}
      </section>

      {suggestions.length ? (
        <section className="fallback-suggestions" aria-label={t(locale, {en: "Suggested pages", zh: "推荐页面"})}>
          {suggestions.map((item) => (
            <Link
              className="fallback-suggestion"
              href={resolveSuggestionHref(locale, item.route)}
              key={item.route}
            >
              <span className="fallback-suggestion-icon">
                <FallbackIcon icon={item.icon} />
              </span>
              <span className="fallback-suggestion-body">
                <strong>{t(locale, item.label)}</strong>
                <span>{t(locale, item.description)}</span>
              </span>
              <ArrowRight aria-hidden="true" className="fallback-suggestion-arrow" size={17} strokeWidth={2.2} />
            </Link>
          ))}
        </section>
      ) : null}
    </div>
  );
}
