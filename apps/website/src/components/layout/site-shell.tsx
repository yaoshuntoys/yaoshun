"use client";

import { Facebook, MessageCircle } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { GlobalFormFeedback } from "@/components/forms/global-form-feedback";
import { BrandMark } from "@/components/ui/marketing";
import {
  navItems,
  siteCopy,
  siteShellUi,
  socialContactLinks,
} from "@/components/layout/site-shell.data";
import { openCookieConsentManager } from "@/lib/cookie-consent-events";
import { localeRegistry, t, type Locale } from "@/lib/i18n";
import {
  contactFormPath,
  localizedPath,
  localizedUrlPath,
  replaceLocaleInPath,
  type RouteKey,
} from "@/lib/routes";

type SiteShellProps = {
  children: React.ReactNode;
  locale: Locale;
};

type FooterLink = {
  href: string;
  label: string;
  trackingLabel?: string;
};

type IconProps = {
  size?: number;
  strokeWidth?: number;
};

function IconBase({
  children,
  size = 24,
  strokeWidth = 2,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      viewBox="0 0 24 24"
      width={size}
    >
      {children}
    </svg>
  );
}

function ArrowRight(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </IconBase>
  );
}

function Globe(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 0 20" />
      <path d="M12 2a15.3 15.3 0 0 0 0 20" />
    </IconBase>
  );
}

function Mail(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect height="16" rx="2" width="20" x="2" y="4" />
      <path d="m22 7-10 6L2 7" />
    </IconBase>
  );
}

function MapPin(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </IconBase>
  );
}

function Menu(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
    </IconBase>
  );
}

function Phone(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
    </IconBase>
  );
}

function X(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </IconBase>
  );
}

const footerQuickLinkRoutes = [
  { label: { en: "Home", zh: "首页" }, route: "home" },
  { label: { en: "Products", zh: "产品目录" }, route: "products" },
  { label: { en: "Solutions", zh: "解决方案" }, route: "solutions" },
  { label: { en: "News", zh: "新闻中心" }, route: "news" },
  { label: { en: "About Us", zh: "关于我们" }, route: "about" },
] as const satisfies ReadonlyArray<{
  label: { en: string; zh: string };
  route: RouteKey;
}>;

const footerProductLinks = [
  { label: { en: "Building Toy Sets", zh: "拼搭玩具套装" } },
  { label: { en: "STEM Construction Toys", zh: "STEM 搭建玩具" } },
  { label: { en: "Toy Accessories", zh: "玩具配件" } },
  { label: { en: "All Products", zh: "全部产品" } },
] as const;

const footerSupportLinkRoutes = [
  { label: { en: "FAQ", zh: "常见问题" }, route: "faq" },
  { label: { en: "Custom Solutions", zh: "定制方案" }, route: "solutions" },
  { label: { en: "Company Capability", zh: "公司能力" }, route: "about" },
  { label: { en: "Get a Quote", zh: "获取报价" }, route: "contact" },
  { label: { en: "Privacy Policy", zh: "隐私政策" }, route: "privacy" },
  { label: { en: "Terms & Conditions", zh: "条款与条件" }, route: "terms" },
  { label: { en: "Refund / Return Policy", zh: "退款与退换货政策" }, route: "refundReturn" },
] as const satisfies ReadonlyArray<{
  label: { en: string; zh: string };
  route: RouteKey;
}>;

const navLinkBase =
  "relative text-[0.97rem] font-semibold text-[#132968] transition-colors hover:text-[#2563ff] after:absolute after:-bottom-2.5 after:left-0 after:right-0 after:h-[3px] after:origin-center after:scale-x-0 after:rounded-full after:bg-[#2563ff] after:transition-transform after:duration-200";
const navLinkActive = "text-[#2563ff] after:scale-x-100";
const localeButtonClass =
  "inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[rgba(32,62,143,0.10)] bg-white px-3.5 text-[0.92rem] font-medium text-[#132968] shadow-[0_10px_30px_-24px_rgba(20,44,119,0.2)] transition duration-200 hover:-translate-y-0.5 hover:border-[rgba(37,99,255,0.16)] hover:bg-[#f7faff] hover:text-[#2563ff]";
const headerCtaClass =
  "inline-flex h-11 items-center justify-center gap-2 rounded-full border border-transparent bg-[linear-gradient(135deg,#2563ff_0%,#1a43c9_100%)] px-4 text-[0.92rem] font-bold text-white shadow-[0_16px_34px_-20px_rgba(37,99,255,0.58)] transition duration-200 hover:-translate-y-0.5 hover:text-white hover:shadow-[0_20px_40px_-22px_rgba(37,99,255,0.66)] [&>span]:text-white [&>svg]:text-white";
const mobileHeaderCtaClass =
  "relative z-10 mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-transparent bg-[linear-gradient(135deg,#2563ff_0%,#1a43c9_100%)] px-4 text-[0.92rem] font-bold text-white shadow-[0_16px_34px_-20px_rgba(37,99,255,0.58)] transition duration-200 hover:-translate-y-0.5 hover:text-white hover:shadow-[0_20px_40px_-22px_rgba(37,99,255,0.66)] [&>span]:text-white [&>svg]:text-white";
const footerHeadingClass =
  "mb-2.5 font-display text-[0.95rem] font-semibold text-[#132968] md:mb-4 md:text-[1.02rem]";
const footerLinkClass =
  "inline-flex min-h-11 w-full items-center rounded-[0.95rem] px-2 text-[0.82rem] leading-5 text-[#6f7ea9] transition hover:bg-[#2563ff]/6 hover:text-[#2563ff] md:min-h-0 md:w-auto md:rounded-none md:px-0 md:text-[0.92rem] md:leading-7 md:hover:bg-transparent";
const footerContactClass =
  "flex min-h-10 items-center gap-2 rounded-[0.95rem] px-2 text-[0.82rem] leading-5 text-[#6f7ea9] transition hover:bg-[#2563ff]/6 hover:text-[#2563ff] md:min-h-0 md:px-0 md:text-[0.9rem] md:leading-6 md:hover:bg-transparent";
const footerSocialLinkClass =
  "inline-flex min-h-9 items-center justify-center gap-1.5 rounded-full border border-[rgba(37,99,255,0.12)] bg-white px-3 text-[0.76rem] font-semibold text-[#17306e] shadow-[0_12px_24px_-20px_rgba(18,41,103,0.16)] transition duration-200 hover:-translate-y-0.5 hover:border-[rgba(37,99,255,0.2)] hover:bg-[#f7faff] hover:text-[#2563ff] md:min-h-8 md:px-2.5 md:text-[0.78rem]";
const footerSocialPrimaryLinkClass =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-transparent bg-[#25d366] px-4 text-[0.82rem] font-bold !text-white shadow-[0_18px_34px_-18px_rgba(37,211,102,0.62)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#1ebe5d] hover:!text-white hover:shadow-[0_22px_40px_-18px_rgba(37,211,102,0.72)] md:min-h-9 md:px-3.5 md:text-[0.84rem] [&>span]:!text-white [&>svg]:!text-white";

const socialContactIcons = {
  whatsapp: MessageCircle,
  facebook: Facebook,
} as const;

function stripTrailingSlash(pathname: string) {
  return pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
}

function isActive(pathname: string, locale: Locale, href: string) {
  const currentPath = stripTrailingSlash(pathname);
  const localizedHref = stripTrailingSlash(localizedUrlPath(locale, href));

  if (href === "") {
    return currentPath === stripTrailingSlash(localizedPath(locale, "home"));
  }

  return (
    currentPath === localizedHref ||
    currentPath.startsWith(`${localizedHref}/`)
  );
}

function telephoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function getAlternateLocale(locale: Locale): Locale {
  return locale === "zh" ? "en" : "zh";
}

function useScrollRestoration(pathname: string) {
  const lastPathnameRef = useRef(pathname);

  useEffect(() => {
    if (lastPathnameRef.current === pathname) {
      return;
    }

    lastPathnameRef.current = pathname;

    const hash = window.location.hash;
    if (hash) {
      const scrollToHash = () => {
        const target = document.getElementById(
          decodeURIComponent(hash.slice(1)),
        );

        if (target) {
          target.scrollIntoView({ block: "start", behavior: "auto" });
          return;
        }

        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      };

      requestAnimationFrame(() => {
        requestAnimationFrame(scrollToHash);
      });
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);
}

function LocaleSwitcher({
  closeMenus,
  locale,
  pathname,
  trackingLocation,
}: {
  closeMenus: () => void;
  locale: Locale;
  pathname: string;
  trackingLocation: string;
}) {
  const router = useRouter();
  const targetLocale = getAlternateLocale(locale);
  const targetHref = replaceLocaleInPath(pathname, targetLocale);
  const targetLabel = localeRegistry[targetLocale].nativeLabel;

  return (
    <button
      aria-label={targetLabel}
      className={localeButtonClass}
      data-track-destination={targetHref}
      data-track-event="locale_switch"
      data-track-label={targetLocale}
      data-track-location={trackingLocation}
      type="button"
      onClick={() => {
        closeMenus();
        router.push(targetHref);
      }}
    >
      <Globe size={16} strokeWidth={2.2} />
      <span>{targetLabel}</span>
    </button>
  );
}

function SiteHeader({
  locale,
  pathname,
}: {
  locale: Locale;
  pathname: string;
}) {
  const router = useRouter();
  const contactHref = contactFormPath(locale);
  const homeHref = localizedPath(locale, "home");
  const mobileTargetLocale = getAlternateLocale(locale);
  const mobileTargetHref = replaceLocaleInPath(pathname, mobileTargetLocale);
  const mobileTargetLabel = localeRegistry[mobileTargetLocale].nativeLabel;
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuId = `site-mobile-menu-${locale}`;
  const closeMenus = () => {
    setMobileOpen(false);
  };

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    function handlePointer(event: MouseEvent) {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setMobileOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointer);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(19,41,104,0.06)] bg-white/88 shadow-[0_14px_34px_-28px_rgba(18,41,103,0.24)] backdrop-blur-[22px]">
      <div className="site-container flex min-h-[72px] items-center gap-4 md:min-h-[84px] md:gap-6">
        <Link
          aria-label="yaoshun toys"
          className="shrink-0"
          data-track-destination={homeHref}
          data-track-event="nav_click"
          data-track-label="brand_logo"
          data-track-location="header"
          href={homeHref}
          prefetch={true}
        >
          <div className="flex flex-col gap-1">
            <BrandMark />
            <span className="text-[0.62rem] font-medium leading-[1.2] text-[#6f7ea9] md:text-[0.68rem]">
              {t(locale, siteCopy.companyName)}
            </span>
          </div>
        </Link>

        <nav className="ml-auto hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.key}
              aria-current={
                isActive(pathname, locale, item.href) ? "page" : undefined
              }
              className={`${navLinkBase} ${
                isActive(pathname, locale, item.href) ? navLinkActive : ""
              }`}
              data-track-destination={localizedUrlPath(locale, item.href)}
              data-track-event="nav_click"
              data-track-label={item.key}
              data-track-location="header"
              href={localizedUrlPath(locale, item.href)}
              prefetch={true}
              onClick={closeMenus}
            >
              {t(locale, item.label)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <LocaleSwitcher
            closeMenus={closeMenus}
            locale={locale}
            pathname={pathname}
            trackingLocation="header"
          />

          <Link
            className={headerCtaClass}
            data-track-destination={contactHref}
            data-track-event="cta_click"
            data-track-label="contact_us"
            data-track-location="header"
            href={contactHref}
            prefetch={true}
            onClick={closeMenus}
          >
            <span>{t(locale, siteCopy.headerCta)}</span>
            <ArrowRight size={15} strokeWidth={2.2} />
          </Link>
        </div>

        <div className="relative ml-auto lg:hidden" ref={mobileMenuRef}>
          <button
            aria-controls={mobileMenuId}
            aria-expanded={mobileOpen}
            aria-label={t(locale, siteShellUi.mobileMenuAriaLabel)}
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-transparent bg-[linear-gradient(135deg,#2563ff_0%,#1a43c9_100%)] text-white shadow-[0_16px_34px_-20px_rgba(37,99,255,0.58)] transition duration-200 hover:-translate-y-0.5 hover:text-white hover:shadow-[0_20px_40px_-22px_rgba(37,99,255,0.66)]"
            data-track-event="nav_click"
            data-track-label={mobileOpen ? "mobile_menu_close" : "mobile_menu_open"}
            data-track-location="mobile_header"
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
          >
            {mobileOpen ? (
              <X size={18} strokeWidth={2.4} />
            ) : (
              <Menu size={18} strokeWidth={2.4} />
            )}
          </button>
          {mobileOpen ? (
            <div
              className="fixed inset-x-0 bottom-0 top-[72px] z-[70] h-[calc(100dvh-72px)] overflow-y-auto border-t border-[rgba(32,62,143,0.10)] bg-[linear-gradient(180deg,#fdfefe_0%,#f6f9ff_100%)] px-3 pb-6 pt-4 shadow-[0_28px_64px_-34px_rgba(18,41,103,0.3)]"
              id={mobileMenuId}
            >
              <div className="mx-auto grid min-h-full w-full max-w-[560px] content-between gap-4">
                <nav className="grid w-full gap-2.5">
                  {navItems.map((item) => (
                    <Link
                      key={item.key}
                      aria-current={
                        isActive(pathname, locale, item.href)
                          ? "page"
                          : undefined
                      }
                      className={`flex min-h-[3.45rem] items-center rounded-[1.25rem] border px-4 py-3 text-[1.04rem] font-medium shadow-none transition ${
                        isActive(pathname, locale, item.href)
                          ? "border-transparent bg-[linear-gradient(135deg,#2563ff_0%,#1a43c9_100%)] !text-white shadow-[0_18px_38px_-24px_rgba(37,99,255,0.54)]"
                          : "border-[rgba(37,99,255,0.10)] bg-white text-[#17306e] hover:border-[rgba(37,99,255,0.16)] hover:bg-white"
                      }`}
                      data-track-destination={localizedUrlPath(locale, item.href)}
                      data-track-event="nav_click"
                      data-track-label={item.key}
                      data-track-location="mobile_header"
                      href={localizedUrlPath(locale, item.href)}
                      prefetch={true}
                      onClick={closeMenus}
                    >
                      {t(locale, item.label)}
                    </Link>
                  ))}
                </nav>

                <div className="grid gap-4 pb-1">
                  <Link
                    className={mobileHeaderCtaClass}
                    data-track-destination={contactHref}
                    data-track-event="cta_click"
                    data-track-label="contact_us"
                    data-track-location="mobile_header"
                    href={contactHref}
                    prefetch={true}
                    onClick={closeMenus}
                  >
                    <span>{t(locale, siteCopy.headerCta)}</span>
                    <ArrowRight size={15} strokeWidth={2.2} />
                  </Link>

                  <div className="grid w-full gap-2.5 border-t border-[rgba(37,99,255,0.08)] pt-4">
                    <button
                      aria-label={mobileTargetLabel}
                      className="flex min-h-[3.1rem] items-center justify-center gap-2 rounded-[1.1rem] border border-[rgba(37,99,255,0.10)] bg-white px-4 text-[0.98rem] font-semibold text-[#17306e] shadow-none transition duration-200 hover:bg-[#2563ff]/10 hover:text-[#0e2f9a]"
                      data-track-destination={mobileTargetHref}
                      data-track-event="locale_switch"
                      data-track-label={mobileTargetLocale}
                      data-track-location="mobile_header"
                      type="button"
                      onClick={() => {
                        closeMenus();
                        router.push(mobileTargetHref);
                      }}
                    >
                      <Globe size={16} strokeWidth={2.2} />
                      <span>{mobileTargetLabel}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

function FooterLinkGroup({
  links,
  title,
  trackingLocation,
}: {
  links: FooterLink[];
  title: string;
  trackingLocation: string;
}) {
  return (
    <div className="rounded-[1.2rem] border border-[rgba(32,62,143,0.07)] bg-white/84 p-3.5 shadow-[0_16px_34px_-30px_rgba(20,44,119,0.14)] md:rounded-none md:border-0 md:bg-transparent md:p-0 md:shadow-none">
      <h4 className={footerHeadingClass}>{title}</h4>
      <div className="grid gap-1.5 md:gap-2">
        {links.map((item) => (
          <Link
            className={footerLinkClass}
            data-track-destination={item.href}
            data-track-event="nav_click"
            data-track-label={item.trackingLabel ?? item.label}
            data-track-location={trackingLocation}
            href={item.href}
            key={item.href + item.label}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function SiteFooter({ locale }: { locale: Locale }) {
  const contactHref = contactFormPath(locale);
  const quickLinks = [
    ...footerQuickLinkRoutes.map((item) => ({
      href: localizedPath(locale, item.route),
      label: t(locale, item.label),
    })),
    {
      href: contactHref,
      label: t(locale, { en: "Contact Us", zh: "联系我们" }),
    },
  ];
  const productLinks = footerProductLinks.map((item) => ({
    href: localizedPath(locale, "products"),
    label: t(locale, item.label),
  }));
  const supportLinks = footerSupportLinkRoutes.map((item) => ({
    href: localizedPath(locale, item.route),
    label: t(locale, item.label),
    trackingLabel: item.route,
  }));
  const activeSocialLinks = socialContactLinks.filter((item) => item.href);
  const copyrightYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[rgba(19,41,104,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(245,249,255,0.96)_100%)] py-6 md:bg-white/92 md:py-10">
      <div className="site-container grid grid-cols-2 gap-3 md:gap-8 md:grid-cols-[1.2fr_0.9fr_1fr_0.95fr] md:items-start">
        <div className="col-span-2 rounded-[1.35rem] border border-[rgba(32,62,143,0.08)] bg-white/88 p-3.5 shadow-[0_18px_36px_-30px_rgba(20,44,119,0.16)] md:col-span-1 md:rounded-none md:border-0 md:bg-transparent md:p-0 md:shadow-none">
          <BrandMark compact />
          <p className="mt-2 max-w-none text-[0.84rem] leading-5 text-[#6f7ea9] md:max-w-[16rem] md:text-[0.92rem] md:leading-7">
            {t(locale, siteCopy.brandTagline)}
          </p>
          <div className="mt-3 grid gap-1.5 md:mt-4 md:gap-2">
            <a
              className={footerContactClass}
              data-track-event="contact_click"
              data-track-label="footer_email"
              data-track-location="footer"
              data-track-method="email"
              href={`mailto:${siteCopy.contact.email}`}
            >
              <Mail size={14} strokeWidth={2.1} />
              <span>{siteCopy.contact.email}</span>
            </a>
            <a
              className={footerContactClass}
              data-track-event="contact_click"
              data-track-label="footer_phone"
              data-track-location="footer"
              data-track-method="phone"
              href={telephoneHref(siteCopy.contact.phone)}
            >
              <Phone size={14} strokeWidth={2.1} />
              <span>{siteCopy.contact.phone}</span>
            </a>
            <span className={footerContactClass}>
              <MapPin size={14} strokeWidth={2.1} />
              <span>{t(locale, siteCopy.contact.address)}</span>
            </span>
          </div>
          {activeSocialLinks.length > 0 ? (
            <div className="mt-3 border-t border-[rgba(37,99,255,0.08)] pt-3 md:mt-4 md:pt-4">
              <h4 className="mb-2 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[#9aa8cc]">
                {t(locale, { en: "Social Contact", zh: "社交联系方式" })}
              </h4>
              <div className="flex flex-wrap gap-2">
                {activeSocialLinks.map((item) => {
                  const SocialIcon = socialContactIcons[item.key];

                  return (
                    <a
                      aria-label={t(locale, item.label)}
                      className={
                        item.variant === "primary"
                          ? footerSocialPrimaryLinkClass
                          : footerSocialLinkClass
                      }
                      data-track-destination={item.href}
                      data-track-event="contact_click"
                      data-track-label={`footer_${item.key}`}
                      data-track-location="footer_social_contact"
                      data-track-method={item.trackingMethod}
                      href={item.href}
                      key={item.key}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <SocialIcon size={14} strokeWidth={2.1} />
                      <span>{t(locale, item.label)}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>

        <FooterLinkGroup
          links={quickLinks}
          trackingLocation="footer_quick_links"
          title={t(locale, { en: "Quick Links", zh: "快捷链接" })}
        />

        <FooterLinkGroup
          links={productLinks}
          trackingLocation="footer_products"
          title={t(locale, { en: "Products", zh: "产品" })}
        />

        <div className="col-span-2 rounded-[1.2rem] border border-[rgba(32,62,143,0.07)] bg-white/84 p-3.5 shadow-[0_16px_34px_-30px_rgba(20,44,119,0.14)] md:col-span-1 md:rounded-none md:border-0 md:bg-transparent md:p-0 md:shadow-none">
          <h4 className={footerHeadingClass}>
            {t(locale, { en: "Support", zh: "支持" })}
          </h4>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 md:grid-cols-1 md:gap-2">
            {supportLinks.map((item) => (
              <Link
                className={footerLinkClass}
                data-track-destination={item.href}
                data-track-event="nav_click"
                data-track-label={item.trackingLabel ?? item.label}
                data-track-location="footer_support"
                href={item.href}
                key={item.href + item.label}
              >
                {item.label}
              </Link>
            ))}
            <button
              className={`${footerLinkClass} text-left`}
              data-track-event="cta_click"
              data-track-label="cookie_settings"
              data-track-location="footer_support"
              type="button"
              onClick={openCookieConsentManager}
            >
              {t(locale, { en: "Cookie Settings", zh: "Cookie 设置" })}
            </button>
          </div>
        </div>
      </div>

      <p className="site-container mt-4 border-t border-[rgba(19,41,104,0.08)] pt-3 text-center text-[0.76rem] leading-5 text-[#6f7ea9] md:mt-8 md:border-0 md:pt-0 md:text-[0.84rem]">
        © {copyrightYear} {t(locale, siteCopy.companyName)}. All Rights Reserved.
      </p>
    </footer>
  );
}

export function SiteShell({ children, locale }: SiteShellProps) {
  const pathname = usePathname();
  useScrollRestoration(pathname);

  return (
    <div className="min-h-screen">
      <SiteHeader key={`${locale}:${pathname}`} locale={locale} pathname={pathname} />
      <main className="w-full px-0 pb-[3rem] lg:pb-[4.5rem]">{children}</main>
      <SiteFooter locale={locale} />
      <GlobalFormFeedback locale={locale} />
    </div>
  );
}
