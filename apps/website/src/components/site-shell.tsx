"use client";

import Link from "next/link";
import {ArrowRight, Facebook, Globe, Instagram, Linkedin, Menu, Youtube, X} from "lucide-react";
import {usePathname} from "next/navigation";
import {useEffect, useMemo, useRef, useState} from "react";

import {BrandMark} from "@/components/marketing";
import {navItems, siteCopy} from "@/components/site-shell.data";
import {localeRegistry, t, type Locale} from "@/lib/i18n";
import {contactFormPath, localizedPath, replaceLocaleInPath} from "@/lib/routes";
type SiteShellProps = {
  children: React.ReactNode;
  locale: Locale;
};

function isActive(pathname: string, locale: Locale, href: string) {
  const localizedHref = `/${locale}${href}`;
  return href === "" ? pathname === `/${locale}` : pathname.startsWith(localizedHref);
}

export function SiteShell({children, locale}: SiteShellProps) {
  const pathname = usePathname();
  const contactHref = contactFormPath(locale);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [localeOpen, setLocaleOpen] = useState(false);
  const localeMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const lastPathnameRef = useRef(pathname);
  const localeEntries = useMemo(() => Object.entries(localeRegistry) as Array<[Locale, (typeof localeRegistry)[Locale]]>, []);
  const footerQuickLinks = [
    {label: {en: "Home", zh: "首页"}, href: localizedPath(locale, "home")},
    {label: {en: "Products", zh: "产品"}, href: localizedPath(locale, "products")},
    {label: {en: "Solutions", zh: "解决方案"}, href: localizedPath(locale, "solutions")},
    {label: {en: "News", zh: "新闻"}, href: localizedPath(locale, "news")},
    {label: {en: "About Us", zh: "关于我们"}, href: localizedPath(locale, "about")},
    {label: {en: "Contact Us", zh: "联系我们"}, href: contactHref},
  ] as const;
  const footerProductLinks = [
    {label: {en: "Building Toy Sets", zh: "拼搭玩具套装"}, href: localizedPath(locale, "products")},
    {label: {en: "STEM Construction Toys", zh: "STEM 搭建玩具"}, href: localizedPath(locale, "products")},
    {label: {en: "Toy Accessories", zh: "玩具配件"}, href: localizedPath(locale, "products")},
    {label: {en: "All Products", zh: "全部产品"}, href: localizedPath(locale, "products")},
  ] as const;
  const footerSupportLinks = [
    {label: {en: "FAQ", zh: "常见问题"}, href: localizedPath(locale, "faq")},
    {label: {en: "Custom Solutions", zh: "定制方案"}, href: localizedPath(locale, "solutions")},
    {label: {en: "Quality Assurance", zh: "品质保障"}, href: localizedPath(locale, "compliance")},
    {label: {en: "Delivery & Shipping", zh: "交付运输"}, href: localizedPath(locale, "solutions")},
  ] as const;

  useEffect(() => {
    function handlePointer(event: MouseEvent) {
      if (localeMenuRef.current && !localeMenuRef.current.contains(event.target as Node)) {
        setLocaleOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setLocaleOpen(false);
        setMobileOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointer);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (lastPathnameRef.current === pathname) {
      return;
    }

    lastPathnameRef.current = pathname;
    setMobileOpen(false);
    setLocaleOpen(false);

    const hash = window.location.hash;
    if (hash) {
      const scrollToHash = () => {
        const target = document.getElementById(decodeURIComponent(hash.slice(1)));

        if (target) {
          target.scrollIntoView({block: "start", behavior: "auto"});
          return;
        }

        window.scrollTo({top: 0, left: 0, behavior: "auto"});
      };

      requestAnimationFrame(() => {
        requestAnimationFrame(scrollToHash);
      });
      return;
    }

    window.scrollTo({top: 0, left: 0, behavior: "auto"});
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) {
      document.body.style.overflow = "";
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  const navLinkBase =
    "relative text-[0.97rem] font-semibold text-[#132968] transition-colors hover:text-[#2563ff] after:absolute after:-bottom-2.5 after:left-0 after:right-0 after:h-[3px] after:origin-center after:scale-x-0 after:rounded-full after:bg-[#2563ff] after:transition-transform after:duration-200";
  const navLinkActive = "text-[#2563ff] after:scale-x-100";
  const localeButtonClass =
    "inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[rgba(32,62,143,0.10)] bg-white px-3.5 text-[0.92rem] font-medium text-[#132968] shadow-[0_10px_30px_-24px_rgba(20,44,119,0.2)] transition duration-200 hover:-translate-y-0.5 hover:border-[rgba(37,99,255,0.16)] hover:bg-[#f7faff] hover:text-[#2563ff]";
  const dropdownClass =
    "absolute right-0 top-[calc(100%+0.75rem)] z-50 min-w-[180px] rounded-[1.1rem] border border-[rgba(32,62,143,0.10)] bg-white/95 p-3 shadow-[0_18px_42px_-30px_rgba(20,44,119,0.14)] backdrop-blur-xl";
  const localeOptionClass =
    "block rounded-2xl px-4 py-3 text-sm font-semibold text-[#6f7ea9] transition hover:bg-[#2563ff]/10 hover:text-[#0e2f9a]";
  const localeOptionActiveClass = "bg-[#2563ff]/10 text-[#0e2f9a]";
  const headerCtaClass =
    "inline-flex h-11 items-center justify-center gap-2 rounded-full border border-transparent bg-[linear-gradient(135deg,#2563ff_0%,#1a43c9_100%)] px-4 text-[0.92rem] font-bold text-white shadow-[0_16px_34px_-20px_rgba(37,99,255,0.58)] transition duration-200 hover:-translate-y-0.5 hover:text-white hover:shadow-[0_20px_40px_-22px_rgba(37,99,255,0.66)] [&>span]:text-white [&>svg]:text-white";
  const mobileHeaderCtaClass =
    "relative z-10 mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-transparent bg-[linear-gradient(135deg,#2563ff_0%,#1a43c9_100%)] px-4 text-[0.92rem] font-bold text-white shadow-[0_16px_34px_-20px_rgba(37,99,255,0.58)] transition duration-200 hover:-translate-y-0.5 hover:text-white hover:shadow-[0_20px_40px_-22px_rgba(37,99,255,0.66)] [&>span]:text-white [&>svg]:text-white";
  const footerSocialClass =
    "inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(32,62,143,0.10)] bg-white text-[#0e2f9a] shadow-[0_12px_24px_-22px_rgba(20,44,119,0.22)] transition duration-200 hover:-translate-y-0.5 hover:border-transparent hover:bg-[linear-gradient(135deg,#2563ff_0%,#1a43c9_100%)] hover:text-white hover:shadow-[0_18px_38px_-24px_rgba(37,99,255,0.62)] md:h-[2.55rem] md:w-[2.55rem]";
  const footerLinkClass =
    "inline-flex min-h-11 w-full items-center rounded-[0.95rem] px-2 text-[0.82rem] leading-5 text-[#6f7ea9] transition hover:bg-[#2563ff]/6 hover:text-[#2563ff] md:min-h-0 md:w-auto md:rounded-none md:px-0 md:text-[0.92rem] md:leading-7 md:hover:bg-transparent";
  const closeMenus = () => {
    setMobileOpen(false);
    setLocaleOpen(false);
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-[rgba(19,41,104,0.06)] bg-white/88 shadow-[0_14px_34px_-28px_rgba(18,41,103,0.24)] backdrop-blur-[22px]">
        <div className="mx-auto flex min-h-[72px] w-[min(1260px,calc(100%-24px))] items-center gap-4 md:min-h-[84px] md:w-[min(1260px,calc(100%-32px))] md:gap-6">
          <Link aria-label="yaoshun toys" className="shrink-0" href={`/${locale}`}>
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
                className={`${navLinkBase} ${
                  isActive(pathname, locale, item.href) ? navLinkActive : ""
                }`}
                href={`/${locale}${item.href}`}
                onClick={closeMenus}
              >
                {t(locale, item.label)}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <div className="relative" ref={localeMenuRef}>
              <button
                aria-expanded={localeOpen}
                className={localeButtonClass}
                type="button"
                onClick={() => setLocaleOpen((value) => !value)}
              >
                <Globe size={16} strokeWidth={2.2} />
                <span>{localeRegistry[locale].nativeLabel}</span>
              </button>
              {localeOpen ? (
                <div className={dropdownClass}>
                  {localeEntries.map(([entry, meta]) => (
                    <Link
                      key={entry}
                      className={`${localeOptionClass} ${
                        entry === locale ? localeOptionActiveClass : ""
                      }`}
                      href={replaceLocaleInPath(pathname, entry)}
                      onClick={closeMenus}
                    >
                      {meta.nativeLabel}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>

            <Link className={headerCtaClass} href={contactHref} onClick={closeMenus}>
              <span>{t(locale, siteCopy.headerCta)}</span>
              <ArrowRight size={15} strokeWidth={2.2} />
            </Link>
          </div>

          <div className="relative ml-auto lg:hidden" ref={mobileMenuRef}>
            <button
              aria-expanded={mobileOpen}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-transparent bg-[linear-gradient(135deg,#2563ff_0%,#1a43c9_100%)] text-white shadow-[0_16px_34px_-20px_rgba(37,99,255,0.58)] transition duration-200 hover:-translate-y-0.5 hover:text-white hover:shadow-[0_20px_40px_-22px_rgba(37,99,255,0.66)]"
              type="button"
              onClick={() => setMobileOpen((value) => !value)}
            >
              {mobileOpen ? <X size={18} strokeWidth={2.4} /> : <Menu size={18} strokeWidth={2.4} />}
            </button>
            {mobileOpen ? (
              <div className="fixed inset-x-0 bottom-0 top-[72px] z-[70] h-[calc(100dvh-72px)] overflow-y-auto border-t border-[rgba(32,62,143,0.10)] bg-[linear-gradient(180deg,#fdfefe_0%,#f6f9ff_100%)] px-3 pb-6 pt-4 shadow-[0_28px_64px_-34px_rgba(18,41,103,0.3)]">
                <div className="mx-auto grid min-h-full w-full max-w-[560px] content-between gap-4">
                  <nav className="grid w-full gap-2.5">
                    {navItems.map((item) => (
                      <Link
                        key={item.key}
                        className={`flex min-h-[3.45rem] items-center rounded-[1.25rem] border px-4 py-3 text-[1.04rem] font-medium shadow-none transition ${
                          isActive(pathname, locale, item.href)
                            ? "border-transparent bg-[linear-gradient(135deg,#2563ff_0%,#1a43c9_100%)] !text-white shadow-[0_18px_38px_-24px_rgba(37,99,255,0.54)]"
                            : "border-[rgba(37,99,255,0.10)] bg-white text-[#17306e] hover:border-[rgba(37,99,255,0.16)] hover:bg-white"
                        }`}
                        href={`/${locale}${item.href}`}
                        onClick={closeMenus}
                      >
                        {t(locale, item.label)}
                      </Link>
                    ))}
                  </nav>

                  <div className="grid gap-4 pb-1">
                    <Link className={mobileHeaderCtaClass} href={contactHref} onClick={closeMenus}>
                      <span>{t(locale, siteCopy.headerCta)}</span>
                      <ArrowRight size={15} strokeWidth={2.2} />
                    </Link>

                    <div className="grid w-full gap-2.5 border-t border-[rgba(37,99,255,0.08)] pt-4">
                      {localeEntries.map(([entry, meta]) => (
                        <Link
                          key={entry}
                          className={`flex min-h-[3.1rem] items-center justify-center rounded-[1.1rem] border px-4 text-[0.98rem] font-semibold shadow-none transition duration-200 ${
                            entry === locale
                              ? "border-transparent bg-[#dceaff] text-[#16368d]"
                              : "border-[rgba(37,99,255,0.10)] bg-white text-[#17306e] hover:bg-[#2563ff]/10 hover:text-[#0e2f9a]"
                          }`}
                          href={replaceLocaleInPath(pathname, entry)}
                          onClick={closeMenus}
                        >
                          {meta.nativeLabel}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <main className="w-full px-0 pb-[3rem] lg:pb-[4.5rem]">{children}</main>

      <footer className="border-t border-[rgba(19,41,104,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(245,249,255,0.96)_100%)] py-6 md:bg-white/92 md:py-10">
        <div className="mx-auto grid w-[min(1260px,calc(100%-24px))] grid-cols-2 gap-3 md:w-[min(1260px,calc(100%-32px))] md:gap-8 md:grid-cols-[1.2fr_0.9fr_1fr_0.95fr] md:items-start">
          <div className="col-span-2 rounded-[1.35rem] border border-[rgba(32,62,143,0.08)] bg-white/88 p-3.5 shadow-[0_18px_36px_-30px_rgba(20,44,119,0.16)] md:col-span-1 md:rounded-none md:border-0 md:bg-transparent md:p-0 md:shadow-none">
            <BrandMark compact />
            <p className="mt-2 max-w-none text-[0.84rem] leading-5 text-[#6f7ea9] md:max-w-[16rem] md:text-[0.92rem] md:leading-7">{t(locale, siteCopy.brandTagline)}</p>
            <div className="mt-3 flex gap-2 md:mt-4 md:gap-2.5">
              <a className={footerSocialClass} aria-label="Facebook" href="https://www.facebook.com" rel="noreferrer" target="_blank">
                <Facebook size={14} strokeWidth={2.1} />
              </a>
              <a className={footerSocialClass} aria-label="Instagram" href="https://www.instagram.com" rel="noreferrer" target="_blank">
                <Instagram size={14} strokeWidth={2.1} />
              </a>
              <a className={footerSocialClass} aria-label="LinkedIn" href="https://www.linkedin.com" rel="noreferrer" target="_blank">
                <Linkedin size={14} strokeWidth={2.1} />
              </a>
              <a className={footerSocialClass} aria-label="YouTube" href="https://www.youtube.com" rel="noreferrer" target="_blank">
                <Youtube size={14} strokeWidth={2.1} />
              </a>
            </div>
          </div>

          <div className="rounded-[1.2rem] border border-[rgba(32,62,143,0.07)] bg-white/84 p-3.5 shadow-[0_16px_34px_-30px_rgba(20,44,119,0.14)] md:rounded-none md:border-0 md:bg-transparent md:p-0 md:shadow-none">
            <h4 className="mb-2.5 font-['Outfit','Plus_Jakarta_Sans',sans-serif] text-[0.95rem] font-semibold text-[#132968] md:mb-4 md:text-[1.02rem]">
              {t(locale, {en: "Quick Links", zh: "快捷链接"})}
            </h4>
            <div className="grid gap-1.5 md:gap-2">
              {footerQuickLinks.map((item) => (
                <Link className={footerLinkClass} key={item.href + t(locale, item.label)} href={item.href}>
                  {t(locale, item.label)}
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[1.2rem] border border-[rgba(32,62,143,0.07)] bg-white/84 p-3.5 shadow-[0_16px_34px_-30px_rgba(20,44,119,0.14)] md:rounded-none md:border-0 md:bg-transparent md:p-0 md:shadow-none">
            <h4 className="mb-2.5 font-['Outfit','Plus_Jakarta_Sans',sans-serif] text-[0.95rem] font-semibold text-[#132968] md:mb-4 md:text-[1.02rem]">
              {t(locale, {en: "Products", zh: "产品"})}
            </h4>
            <div className="grid gap-1.5 md:gap-2">
              {footerProductLinks.map((item) => (
                <Link className={footerLinkClass} key={item.href + t(locale, item.label)} href={item.href}>
                  {t(locale, item.label)}
                </Link>
              ))}
            </div>
          </div>

          <div className="col-span-2 rounded-[1.2rem] border border-[rgba(32,62,143,0.07)] bg-white/84 p-3.5 shadow-[0_16px_34px_-30px_rgba(20,44,119,0.14)] md:col-span-1 md:rounded-none md:border-0 md:bg-transparent md:p-0 md:shadow-none">
            <h4 className="mb-2.5 font-['Outfit','Plus_Jakarta_Sans',sans-serif] text-[0.95rem] font-semibold text-[#132968] md:mb-4 md:text-[1.02rem]">
              {t(locale, {en: "Support", zh: "支持"})}
            </h4>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 md:grid-cols-1 md:gap-2">
              {footerSupportLinks.map((item) => (
                <Link className={footerLinkClass} key={item.href + t(locale, item.label)} href={item.href}>
                  {t(locale, item.label)}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <p className="mx-auto mt-4 w-[min(1260px,calc(100%-24px))] border-t border-[rgba(19,41,104,0.08)] pt-3 text-center text-[0.76rem] leading-5 text-[#6f7ea9] md:mt-8 md:w-[min(1260px,calc(100%-32px))] md:border-0 md:pt-0 md:text-[0.84rem]">
          © 2026 {t(locale, siteCopy.companyName)}. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}
