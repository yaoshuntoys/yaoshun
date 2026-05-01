import type { Metadata } from "next";
import {
  ArrowRight,
  Clock3,
  Factory,
  Globe2,
  Mail,
  MapPin,
  PackageCheck,
  Phone,
  Plus,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

import { Breadcrumbs } from "@/components/marketing";
import { ContactForm } from "@/components/contact-form";
import { PageHero } from "@/components/page-hero";
import { StructuredData } from "@/components/structured-data";
import { siteCopy } from "@/components/site-shell.data";
import { buildMetadata } from "@/lib/metadata";
import { getLocaleFromParams, t } from "@/lib/i18n";
import { toAbsoluteUrl } from "@/lib/site-config";
import { contactCopy } from "./data";
import { faqItems } from "../faq/data";

const contactCards = [
  {
    title: { en: "Email Us", zh: "邮件联系" },
    icon: Mail,
    value: siteCopy.contact.email,
    note: {
      en: "Most first replies are sent within 24 hours",
      zh: "大多数询盘会在 24 小时内获得初步回复",
    },
  },
  {
    title: { en: "Call Us", zh: "电话联系" },
    icon: Phone,
    value: siteCopy.contact.phone,
    note: {
      en: "Factory coordination for sampling, production, and shipment",
      zh: "可沟通打样、生产排期与出货协同",
    },
  },
  {
    title: { en: "Visit Us", zh: "来访地址" },
    icon: MapPin,
    value: siteCopy.contact.address,
    note: {
      en: "Factory visits can be arranged in advance",
      zh: "支持提前预约工厂来访",
    },
  },
  {
    title: { en: "Business Hours", zh: "工作时间" },
    icon: Clock3,
    value: {
      en: "Mon - Fri: 9:00 AM - 6:00 PM",
      zh: "周一至周五：9:00 - 18:00",
    },
    note: {
      en: "GMT+8, with export inquiry follow-up support",
      zh: "GMT+8，支持出口项目跟进",
    },
  },
] as const;

const solutionItems = [
  {
    title: { en: "Educational Toy OEM/ODM", zh: "益智玩具 OEM/ODM" },
    text: {
      en: "From requirement review and structure refinement to packaging and export delivery for educational, interlocking, and STEM toy programs.",
      zh: "围绕益智玩具、拼接玩具与 STEM 玩具项目，提供从需求评估、结构优化到包装与出口交付的定制支持。",
    },
    icon: PackageCheck,
  },
  {
    title: { en: "In-House Mold, Injection & Extrusion", zh: "自有模具、注塑与挤出配套" },
    text: {
      en: "Support drawing-based and sample-based processing for custom tubing, plastic profiles, structural parts, and precision molded components inside one factory workflow.",
      zh: "在同一工厂流程中协同完成来图来样加工、定制管材、塑胶异型材、结构件与高精密注塑件开发。",
    },
    icon: Factory,
  },
  {
    title: { en: "Reports, Packing & Export Coordination", zh: "检测资料、包装与出口协同" },
    text: {
      en: "Covers raw material review, production control, assembly, inspection, third-party reports, logistics, and buyer filing support.",
      zh: "覆盖原料评估、生产管控、组装、检验、第三方报告、物流与客户归档资料支持。",
    },
    icon: Globe2,
  },
] as const;

const assuranceItems = [
  {
    icon: ShieldCheck,
    title: { en: "Safe & Compliant Materials", zh: "安全合规材料" },
    text: {
      en: "Material planning can align with RoHS, REACH, and project-specific safety expectations.",
      zh: "材料方案可围绕 RoHS、REACH 及项目安全要求进行规划。",
    },
  },
  {
    icon: Sparkles,
    title: { en: "In-House Mold & Sampling", zh: "自有模具与打样支持" },
    text: {
      en: "Tooling coordination, sample review, and structural adjustment can move inside one connected factory team.",
      zh: "模具协同、样品验证与结构调整可在同一工厂团队内完成推进。",
    },
  },
  {
    icon: Clock3,
    title: { en: "Flexible Trial & Lead Time Planning", zh: "灵活试单与交期规划" },
    text: {
      en: "Small-batch trial orders are supported, with many regular projects moving in about 7 to 15 days after confirmation.",
      zh: "支持小批量试单，许多常规项目在确认后可按 7 到 15 天左右的节奏推进。",
    },
  },
  {
    icon: PackageCheck,
    title: { en: "Reports & Export Delivery Support", zh: "检测资料与出口交付支持" },
    text: {
      en: "We can coordinate third-party reports, buyer filing documents, packing plans, and shipment handoff for export orders.",
      zh: "可协同第三方检测、客户归档资料、包装方案与出口订单交付对接。",
    },
  },
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await getLocaleFromParams(params);
  return buildMetadata(
    locale,
    "Contact Dongguan Yaoshun Technology | OEM/ODM Toy & Plastic Projects",
    "Contact Dongguan Yaoshun Technology for educational toys, interlocking toy OEM/ODM, in-house mold development, custom plastic production, compliance files, and export delivery support.",
    "contact",
    [
      "contact educational toy manufacturer",
      "oem odm toy project inquiry",
      "custom plastic production contact",
      "in-house mold development contact",
      "toy compliance export support",
    ],
  );
}

function copy(locale: "en" | "zh") {
  return {
    heroTitle: t(locale, {
      en: "Tell Us Your Project, Get A Practical Factory Reply",
      zh: "告诉我们你的项目，获取务实的工厂回复",
    }),
    heroAlt: t(locale, {
      en: "yaoshun toys contact hero visual",
      zh: "yaoshun toys 联系我们页主视觉",
    }),
    getInTouch: t(locale, { en: "Get in Touch", zh: "联系我们" }),
    aboutBrand: t(locale, {
      en: "Factory Snapshot",
      zh: "工厂概览",
    }),
    faqTitle: t(locale, { en: "Frequently Asked Questions", zh: "常见问题" }),
    faqAction: t(locale, { en: "View All FAQs", zh: "查看全部 FAQ" }),
    solutionsTitle: t(locale, { en: "Project Support We Can Deliver", zh: "我们可提供的项目支持" }),
    solutionsAction: t(locale, {
      en: "Learn More About Our Solutions",
      zh: "了解更多方案",
    }),
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await getLocaleFromParams(params);
  const text = copy(locale);
  const featuredFaqItems = faqItems.slice(0, 5);
  const pageUrl = toAbsoluteUrl(`/${locale}/contact`);
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: locale === "zh" ? "首页" : "Home",
          item: toAbsoluteUrl(`/${locale}`),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: locale === "zh" ? "联系我们" : "Contact",
          item: pageUrl,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      name:
        locale === "zh"
          ? "联系东莞市尧顺科技有限公司"
          : "Contact Dongguan Yaoshun Technology Co., Ltd.",
      description: contactCopy.description[locale],
      url: pageUrl,
      inLanguage: locale === "zh" ? "zh-CN" : "en-US",
      mainEntity: {
        "@type": "Organization",
        name: siteCopy.companyName[locale],
        email: siteCopy.contact.email,
        telephone: siteCopy.contact.phone,
        address: {
          "@type": "PostalAddress",
          streetAddress: siteCopy.contact.address[locale],
          addressLocality: "Dongguan",
          addressRegion: "Guangdong",
          addressCountry: "CN",
        },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: featuredFaqItems.map((item) => ({
        "@type": "Question",
        name: item.question[locale],
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer[locale],
        },
      })),
    },
  ];

  return (
    <div className="contact-page">
      <StructuredData data={structuredData} />

      <PageHero
        backgroundClassName="contact-hero-background"
        backgroundImageClassName="contact-hero-background-image"
        backgroundSrc="https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/site/misc/contact-bg.webp"
        copyClassName="contact-hero-copy"
        gridClassName="contact-hero-grid"
        innerClassName="contact-hero-inner"
        sectionClassName="contact-hero"
      >
        <Breadcrumbs
          items={[
            { href: `/${locale}`, label: { en: "Home", zh: "首页" } },
            { label: { en: "Contact", zh: "联系我们" } },
          ]}
          locale={locale}
        />
        <p className="contact-eyebrow">{contactCopy.eyebrow[locale]}</p>
        <h1 className="contact-hero-title">{text.heroTitle}</h1>
        <p className="contact-hero-text">{contactCopy.description[locale]}</p>
        <Link
          className="contact-primary-cta"
          href={`mailto:${siteCopy.contact.email}`}
        >
          <span>{text.getInTouch}</span>
          <ArrowRight size={16} strokeWidth={2.1} />
        </Link>
      </PageHero>

      <section className="contact-card-grid">
        {contactCards.map((item) => {
          const Icon = item.icon;
          return (
            <article className="contact-card" key={item.title.en}>
              <div className="contact-card-head">
                <div className="contact-card-icon">
                  <Icon size={22} strokeWidth={2} />
                </div>
                <h3>{item.title[locale]}</h3>
              </div>
              <p className="contact-card-value">
                {typeof item.value === "string"
                  ? item.value
                  : item.value[locale]}
              </p>
              <p className="contact-card-note">{item.note[locale]}</p>
            </article>
          );
        })}
      </section>

      <section className="contact-message-shell" id="contact-message">
        <article className="contact-company-panel">
          <div className="contact-panel-head">
            <p className="contact-mini-eyebrow">{text.aboutBrand}</p>
            <h2>{siteCopy.companyName[locale]}</h2>
            <p>{siteCopy.companyIntro[locale]}</p>
          </div>
          <div className="contact-company-content">
            <div className="contact-company-stats">
              {[
                {
                  value: "2016",
                  label: {
                    en: "Company Established",
                    zh: "公司成立",
                  },
                  icon: Factory,
                },
                {
                  value: "RMB 3M",
                  label: {
                    en: "Registered Capital",
                    zh: "注册资本",
                  },
                  icon: Sparkles,
                },
                {
                  value: "24H",
                  label: { en: "First Reply Target", zh: "首次回复目标" },
                  icon: Mail,
                },
                {
                  value: "7-15 Days",
                  label: {
                    en: "Regular Lead Time",
                    zh: "常规交付周期",
                  },
                  icon: PackageCheck,
                },
              ].map((item) => {
                const StatIcon = item.icon;

                return (
                  <div className="contact-company-stat" key={item.value}>
                    <div className="contact-company-stat-icon">
                      <StatIcon size={18} strokeWidth={2} />
                    </div>
                    <div className="contact-company-stat-copy">
                      <strong>{item.value}</strong>
                      <span>{item.label[locale]}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </article>

        <article className="contact-form-panel">
          <div className="contact-panel-head">
            <h2>{contactCopy.formTitle[locale]}</h2>
            <p>{contactCopy.formDescription[locale]}</p>
          </div>
          <ContactForm
            labels={{
              name: {
                label: { en: "Your Name", zh: "姓名" },
                placeholder: { en: "Enter your name", zh: "输入你的姓名" },
              },
              email: {
                label: { en: "Your Email", zh: "邮箱" },
                placeholder: { en: "Enter your email", zh: "输入你的邮箱" },
              },
              message: {
                label: { en: "Your Message", zh: "留言内容" },
                placeholder: {
                  en: "Please describe your inquiry in detail...",
                  zh: "请详细描述你的需求...",
                },
              },
              submit: { en: "Send Message", zh: "发送消息" },
              success: {
                en: "Your inquiry has been submitted successfully.",
                zh: "咨询提交成功，我们会尽快联系你。",
              },
              error: {
                en: "Submission failed. Please try again later.",
                zh: "提交失败，请稍后再试。",
              },
            }}
            locale={locale}
          />
        </article>
      </section>

      <section className="contact-lower-grid">
        <article className="contact-solution-panel">
          <div className="contact-panel-head">
            <h2>{text.solutionsTitle}</h2>
            <p>
              {t(locale, {
                en: "Focused on educational toys, interlocking toy customization, in-house mold development, precision molding, and export-ready plastic manufacturing support.",
                zh: "聚焦益智玩具、拼接玩具定制、自有模具开发、精密注塑与面向出口的塑胶制造配套能力。",
              })}
            </p>
          </div>
          <div className="contact-solution-grid">
            {solutionItems.map((item) => {
              const Icon = item.icon;
              return (
                <div className="contact-solution-item" key={item.title.en}>
                  <Icon size={34} strokeWidth={1.75} />
                  <h3>{item.title[locale]}</h3>
                  <p>{item.text[locale]}</p>
                </div>
              );
            })}
          </div>
          <Link className="contact-secondary-cta" href={`/${locale}/solutions`}>
            <span>{text.solutionsAction}</span>
            <ArrowRight size={16} strokeWidth={2.1} />
          </Link>
        </article>

        <article className="contact-faq-panel">
          <div className="contact-panel-head">
            <h2>{text.faqTitle}</h2>
          </div>
          <div className="contact-faq-list">
            {featuredFaqItems.map((item) => (
              <div className="contact-faq-item" key={item.question.en}>
                <span>{item.question[locale]}</span>
                <Plus size={16} strokeWidth={2.2} />
              </div>
            ))}
          </div>
          <Link
            className="contact-inline-link view-accent-link contact-faq-link"
            href={`/${locale}/faq`}
          >
            <span>{text.faqAction}</span>
            <ArrowRight size={14} strokeWidth={2.1} />
          </Link>
        </article>
      </section>

      <section className="contact-assurance-strip">
        {assuranceItems.map((item) => {
          const Icon = item.icon;
          return (
            <article className="contact-assurance-item" key={item.title.en}>
              <Icon size={34} strokeWidth={1.75} />
              <h3>{item.title[locale]}</h3>
              <p>{item.text[locale]}</p>
            </article>
          );
        })}
      </section>
    </div>
  );
}
