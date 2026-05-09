import type { Metadata } from "next";
import "@/styles/pages/contact.css";
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

import { ContactForm } from "@/components/forms/contact-form";
import { StructuredData } from "@/components/seo/structured-data";
import { siteCopy } from "@/components/layout/site-shell.data";
import { contactContent } from "@/content/site";
import { buildPageMetadata } from "@/lib/metadata";
import { getLocaleFromParams, t } from "@/lib/i18n";
import { toAbsoluteUrl } from "@/lib/site-config";
import { contactCopy } from "@/content/pages/contact";
import { faqItems } from "@/content/pages/faq";

const contactCards = [
  {
    title: { en: "Email Us", zh: "邮件联系" },
    icon: Mail,
    value: siteCopy.contact.email,
  },
  {
    title: { en: "Call Us", zh: "电话联系" },
    icon: Phone,
    value: siteCopy.contact.phone,
  },
  {
    title: { en: "Visit Us", zh: "来访地址" },
    icon: MapPin,
    value: siteCopy.contact.address,
  },
  {
    title: { en: "Business Hours", zh: "工作时间" },
    icon: Clock3,
    value: {
      en: "Mon - Fri: 9:00 AM - 6:00 PM",
      zh: "周一至周五：9:00 - 18:00",
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
    title: {
      en: "In-House Mold, Injection & Extrusion",
      zh: "自有模具、注塑与挤出配套",
    },
    text: {
      en: "Support drawing-based and sample-based processing for custom tubing, plastic profiles, structural parts, and precision molded components inside one factory workflow.",
      zh: "在同一工厂流程中协同完成来图来样加工、定制管材、塑胶异型材、结构件与高精密注塑件开发。",
    },
    icon: Factory,
  },
  {
    title: {
      en: "Reports, Packing & Export Coordination",
      zh: "检测资料、包装与出口协同",
    },
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
    title: {
      en: "Flexible Trial & Lead Time Planning",
      zh: "灵活试单与交期规划",
    },
    text: {
      en: "Small-batch trial orders are supported, with many regular projects moving in about 7 to 15 days after confirmation.",
      zh: "支持小批量试单，许多常规项目在确认后可按 7 到 15 天左右的节奏推进。",
    },
  },
  {
    icon: PackageCheck,
    title: {
      en: "Reports & Export Delivery Support",
      zh: "检测资料与出口交付支持",
    },
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
  return buildPageMetadata(locale, contactContent.seo, "contact");
}

function copy(locale: "en" | "zh") {
  return {
    aboutBrand: t(locale, {
      en: "Factory Snapshot",
      zh: "工厂概览",
    }),
    faqTitle: t(locale, { en: "Frequently Asked Questions", zh: "常见问题" }),
    faqAction: t(locale, { en: "View All FAQs", zh: "查看全部 FAQ" }),
    solutionsTitle: t(locale, {
      en: "Project Support We Can Deliver",
      zh: "我们可提供的项目支持",
    }),
    solutionsAction: t(locale, {
      en: "Learn More About Our Solutions",
      zh: "了解更多方案",
    }),
  };
}

function telephoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
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

      <section className="contact-message-shell" id="contact-message">
        <article className="contact-company-panel">
          <div className="contact-panel-head">
            <p className="contact-mini-eyebrow">{text.aboutBrand}</p>
            <h2>{siteCopy.companyName[locale]}</h2>
            <p>{siteCopy.companyIntro[locale]}</p>
          </div>
          <div className="contact-company-content">
            <div className="contact-company-stats">
              {contactCards.map((item) => {
                const ContactIcon = item.icon;
                const value =
                  typeof item.value === "string"
                    ? item.value
                    : item.value[locale];

                return (
                  <div className="contact-company-stat" key={item.title.en}>
                    <div className="contact-company-stat-icon">
                      <ContactIcon size={18} strokeWidth={2} />
                    </div>
                    <div className="contact-company-stat-copy">
                      <span className="contact-company-stat-label">
                        {item.title[locale]}
                      </span>
                      {item.icon === Mail ? (
                        <strong>
                          <a
                            data-track-event="contact_click"
                            data-track-label="company_panel_email"
                            data-track-location="contact_company_panel"
                            data-track-method="email"
                            href={`mailto:${siteCopy.contact.email}`}
                          >
                            {value}
                          </a>
                        </strong>
                      ) : item.icon === Phone ? (
                        <strong>
                          <a
                            data-track-event="contact_click"
                            data-track-label="company_panel_phone"
                            data-track-location="contact_company_panel"
                            data-track-method="phone"
                            href={telephoneHref(siteCopy.contact.phone)}
                          >
                            {value}
                          </a>
                        </strong>
                      ) : (
                        <strong>{value}</strong>
                      )}
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
          <Link
            className="contact-secondary-cta"
            data-track-destination={`/${locale}/solutions`}
            data-track-event="cta_click"
            data-track-label="learn_more_solutions"
            data-track-location="contact_solutions"
            href={`/${locale}/solutions`}
          >
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
            data-track-destination={`/${locale}/faq`}
            data-track-event="cta_click"
            data-track-label="view_all_faq"
            data-track-location="contact_faq"
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
