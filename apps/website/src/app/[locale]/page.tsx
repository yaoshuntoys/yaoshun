import type { Metadata } from "next";
import {
  ArrowRight,
  Brain,
  Blocks,
  Circle,
  Clock3,
  Factory,
  Globe2,
  House,
  type LucideIcon,
  Mail,
  MapPin,
  PackageCheck,
  Phone,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import Image from "@/components/smart-image";
import Link from "next/link";

import { HomeLeadForm } from "@/components/home-lead-form";
import { PageHero } from "@/components/page-hero";
import { siteCopy } from "@/components/site-shell.data";
import { homeContent } from "@/content/site";
import { buildPageMetadata } from "@/lib/metadata";
import { getLocaleFromParams, t, type Locale } from "@/lib/i18n";
import { getHomeFeaturedShowcaseCatalog } from "@/lib/relaunch-data";
import { productPath } from "@/lib/routes";
import { homePageImages } from "./_home/data";

function copy(locale: Locale) {
  return {
    eyebrow: t(locale, { en: "Educational Toy & Plastic OEM/ODM", zh: "益智玩具与塑料制品 OEM/ODM" }),
    heroLine1: t(locale, { en: "OEM/ODM For", zh: "专注提供" }),
    heroLine2a: t(locale, { en: "Educational Toys", zh: "益智玩具" }),
    heroLine2b: t(locale, { en: "And Custom", zh: "与定制" }),
    heroLine2c: t(locale, { en: "Plastics", zh: "塑料制品" }),
    heroText: t(locale, {
      en: "Founded in 2016, Dongguan Yaoshun Technology develops and manufactures educational toys, interlocking building toys, AI toy plastic electronic parts, and custom plastic products with in-house mold development, eco-safe materials, and export-ready delivery.",
      zh: "东莞市尧顺科技有限公司成立于 2016 年，专注益智玩具、积木拼装玩具、AI 玩具塑胶电子部件及塑料制品的研发生产，提供自有开模、环保材料方案与稳定出口交付支持。",
    }),
    explore: t(locale, { en: "Explore Products", zh: "探索产品" }),
    learnMore: t(locale, { en: "Learn More", zh: "了解更多" }),
    bestsellers: t(locale, { en: "Our Bestsellers", zh: "热销产品" }),
    whyChoose: t(locale, {
      en: "Why Choose yaoshun toys?",
      zh: "为什么选择 yaoshun toys？",
    }),
    aboutEyebrow: t(locale, { en: "ABOUT YAOSHUN", zh: "关于尧顺" }),
    aboutTitleA: t(locale, { en: "Your Trusted OEM/ODM", zh: "值得信赖的 OEM/ODM" }),
    aboutTitleB: t(locale, { en: "Factory Partner", zh: "工厂合作伙伴" }),
    aboutText: t(locale, {
      en: "Founded on August 26, 2016, Dongguan Yaoshun Technology Co., Ltd. is a full-chain manufacturer focused on educational toys, interlocking plastic toys, precision injection molded parts, and tubing or profile support, with one-stop OEM/ODM service from tooling to production and delivery.",
      zh: "东莞市尧顺科技有限公司成立于 2016 年 8 月 26 日，是一家聚焦益智玩具、拼插类塑胶玩具、精密注塑件及管材型材配套的全链路制造企业，提供从开模到生产交付的一站式 OEM/ODM 服务。",
    }),
    solutions: t(locale, {
      en: "Our One-stop Solutions",
      zh: "我们的一站式解决方案",
    }),
    leaveMessage: t(locale, { en: "Leave Us a Message", zh: "给我们留言" }),
    leaveMessageText: t(locale, {
      en: "Share drawings, samples, quantity, and target market. Most first replies are sent within 24 hours.",
      zh: "欢迎提供图纸、样品、数量计划与目标市场，大多数询盘会在 24 小时内获得首次回复。",
    }),
    getInTouch: t(locale, { en: "Get in Touch", zh: "联系我们" }),
    heroImageAlt: t(locale, {
      en: "Children building a fort with yaoshun toys",
      zh: "孩子们使用拼搭玩具搭建城堡",
    }),
    bestsellersLead: t(locale, { en: "Our", zh: "我们的" }),
    bestsellersAccent: t(locale, { en: "Bestsellers", zh: "热销产品" }),
    bestsellersTags: t(locale, {
      en: "OEM/ODM · Factory Direct · Export-Ready",
      zh: "OEM/ODM · 源头工厂 · 面向出口",
    }),
    viewAllProducts: t(locale, { en: "View All Products", zh: "查看全部产品" }),
    whyChooseLead: t(locale, { en: "Why Choose", zh: "为什么选择" }),
    whyImageAlt: t(locale, {
      en: "Child building a creative structure toy",
      zh: "孩子拼搭创意结构玩具",
    }),
    aboutCta: t(locale, { en: "Learn More About Us", zh: "了解更多" }),
    factoryAlt: t(locale, {
      en: "yaoshun toys factory exterior",
      zh: "yaoshun toys 工厂外景",
    }),
    solutionsLead: t(locale, { en: "Our One-stop", zh: "我们的一站式" }),
    solutionsAccent: t(locale, { en: "Solutions", zh: "解决方案" }),
    address: t(locale, {
      en: "No. 3 Weixing Road, Chashan Town, Dongguan, Guangdong, China",
      zh: "中国广东省东莞市茶山镇伟兴路3号",
    }),
    mapAlt: t(locale, { en: "Global service map", zh: "全球服务地图" }),
  };
}

function PlaceholderVisual({
  locale,
  title,
  subtitle,
  icon: Icon,
  className,
  compact = false,
  textless = false,
}: {
  locale: Locale;
  title: { en: string; zh: string };
  subtitle?: { en: string; zh: string };
  icon: LucideIcon;
  className?: string;
  compact?: boolean;
  textless?: boolean;
}) {
  return (
    <div
      className={`home-placeholder ${compact ? "home-placeholder-compact" : ""} ${textless ? "home-placeholder-textless" : ""} ${className || ""}`.trim()}
    >
      <div className="home-placeholder-badge">
        <Icon size={22} strokeWidth={2.1} />
      </div>
      {textless ? null : <strong>{t(locale, title)}</strong>}
      {textless || !subtitle ? null : <span>{t(locale, subtitle)}</span>}
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await getLocaleFromParams(params);
  return buildPageMetadata(locale, homeContent.seo, "");
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await getLocaleFromParams(params);
  const text = copy(locale);
  const featuredProducts = getHomeFeaturedShowcaseCatalog().map((item) => ({
    title: t(locale, item.label),
    meta: t(locale, item.summary),
    href: productPath(locale, item.product.productId),
    image: item.images[0] || "",
    productId: item.product.productId,
  }));

  return (
    <div className="home-page">
      <PageHero
        afterContent={
          <div className="home-hero-surface-anchor">
            <section className="home-stats home-surface">
              {[
                {
                  value: "2016",
                  label: t(locale, { en: "Founded", zh: "成立时间" }),
                  icon: Sparkles,
                },
                {
                  value: "24H",
                  label: t(locale, { en: "First Reply Target", zh: "首次回复目标" }),
                  icon: Mail,
                },
                {
                  value: "7-15 Days",
                  label: t(locale, { en: "Regular Lead Time", zh: "常规交付周期" }),
                  icon: Clock3,
                },
                {
                  value: "OEM/ODM",
                  label: t(locale, {
                    en: "Custom Programs",
                    zh: "定制项目",
                  }),
                  icon: ShieldCheck,
                },
                {
                  value: "RoHS / REACH",
                  label: t(locale, { en: "Compliance", zh: "合规支持" }),
                  icon: Globe2,
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.value} className="home-stat-item">
                    <Icon
                      className="home-stat-icon"
                      size={30}
                      strokeWidth={1.9}
                    />
                    <div>
                      <div className="home-stat-value">{item.value}</div>
                      <div className="home-stat-label">{item.label}</div>
                    </div>
                  </div>
                );
              })}
            </section>
          </div>
        }
        backgroundClassName="home-hero-background"
        backgroundImageClassName="home-section-image home-hero-background-image"
        backgroundSrc="/site/misc/solution-bg.webp"
        copyClassName="home-hero-copy"
        gridClassName="home-hero-grid"
        innerClassName="home-hero-inner"
        sectionClassName="home-hero-section"
      >
        <p className="home-eyebrow">{text.eyebrow}</p>
        <h1 className="home-hero-title">
          <span>{text.heroLine1}</span>
          <span>
            {text.heroLine2a}{" "}
            <span className="home-blue-word">{text.heroLine2b}</span>{" "}
            <span className="home-orange-word">{text.heroLine2c}</span>
          </span>
        </h1>
        <p className="home-hero-text">{text.heroText}</p>

        <div className="home-hero-actions">
          <Link className="home-primary-cta" href={`/${locale}/products`}>
            <span>{text.explore}</span>
            <ArrowRight size={16} strokeWidth={2.25} />
          </Link>
          <Link className="home-secondary-cta" href={`/${locale}/about`}>
            <span>{text.learnMore}</span>
            <span className="home-secondary-dot" />
          </Link>
        </div>

        <div className="home-feature-strip">
          {[
            {
              title: t(locale, {
                en: "Non-toxic & Compliant Materials",
                zh: "环保无毒与合规材料",
              }),
              icon: ShieldCheck,
            },
            {
              title: t(locale, {
                en: "In-House Mold Development",
                zh: "自有模具开发",
              }),
              icon: Wrench,
            },
            {
              title: t(locale, {
                en: "Flexible Trial & Bulk Orders",
                zh: "灵活试单与批量订单",
              }),
              icon: PackageCheck,
            },
            {
              title: t(locale, {
                en: "Export & Document Support",
                zh: "出口与资料协同支持",
              }),
              icon: Globe2,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="home-feature-item">
                <div className="home-feature-icon">
                  <Icon size={22} strokeWidth={1.95} />
                </div>
                <p>{item.title}</p>
              </div>
            );
          })}
        </div>
      </PageHero>

      <section className="home-bestseller home-surface">
        <div className="home-section-head">
          <div>
            <h2 className="home-section-title">
              {text.bestsellersLead}{" "}
              <span className="home-blue-word">{text.bestsellersAccent}</span>{" "}
              <span className="home-orange-word">•</span>
            </h2>
            <p className="home-mini-tags">{text.bestsellersTags}</p>
          </div>
          <Link
            className="home-inline-link view-accent-link"
            href={`/${locale}/products`}
          >
            <span>{text.viewAllProducts}</span>
            <ArrowRight size={15} strokeWidth={2.2} />
          </Link>
        </div>

        <div className="home-product-row">
          {featuredProducts.map((item) => (
            <Link
              className="home-product-card"
              data-track-event="product_card_click"
              data-track-label={item.productId}
              data-track-location="home_bestsellers"
              href={item.href}
              key={item.title}
            >
              <div className="home-product-image-wrap">
                {item.image ? (
                  <Image
                    alt={item.title}
                    className="home-section-image home-product-image"
                    fill
                    sizes="(min-width: 1280px) 18rem, (min-width: 768px) 24vw, 100vw"
                    src={item.image}
                  />
                ) : (
                  <PlaceholderVisual
                    compact
                    className="home-product-placeholder"
                    icon={
                      item.title.includes("Connector")
                        ? Circle
                        : item.title.includes("3D")
                          ? Blocks
                          : item.title.includes("Large")
                            ? House
                            : PackageCheck
                    }
                    locale={locale}
                    textless
                    title={{ en: "Product Visual", zh: "产品图" }}
                  />
                )}
              </div>
              <div className="home-product-body">
                <h3>{item.title}</h3>
                <p>{item.meta}</p>
                <span aria-hidden="true" className="home-product-arrow">
                  <ArrowRight size={16} strokeWidth={2.2} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-why home-surface">
        <div className="home-why-copy">
          <h2 className="home-section-title">
            {text.whyChooseLead}{" "}
            <span className="home-blue-word">yaoshun toys?</span>{" "}
            <span className="home-orange-word">•</span>
          </h2>
          <div className="home-why-features">
            {[
              {
                title: t(locale, { en: "In-House Tooling & R&D", zh: "自有模具与研发" }),
                text: t(locale, {
                  en: "We support drawing-based or sample-based development, structure refinement, and mold coordination inside one connected team.",
                  zh: "支持来图来样开发、结构优化与模具协同，由同一团队贯穿推进。",
                }),
                icon: Brain,
              },
              {
                title: t(locale, {
                  en: "Raw Material To Final QC",
                  zh: "从原料到终检的质量控制",
                }),
                text: t(locale, {
                  en: "Raw material checks, in-process inspection, automated review, and outgoing checks help keep delivery stable.",
                  zh: "从原料确认、过程检验、自动化复核到出货终检，形成更稳定的交付品质。",
                }),
                icon: ShieldCheck,
              },
              {
                title: t(locale, { en: "Flexible Production Planning", zh: "灵活的生产规划" }),
                text: t(locale, {
                  en: "We support samples, small-batch trial orders, and bulk production with a normal project rhythm of about 7 to 15 days.",
                  zh: "支持样品、小批量试单和批量生产，许多常规项目可按 7 到 15 天左右节奏推进。",
                }),
                icon: Factory,
              },
              {
                title: t(locale, { en: "Global Trade Coordination", zh: "全球贸易协同" }),
                text: t(locale, {
                  en: "We help buyers coordinate packaging, compliance files, logistics, and export handoff for international programs.",
                  zh: "可协助客户处理包装、合规资料、物流与出口交接，适配国际项目推进。",
                }),
                icon: Globe2,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="home-why-item">
                  <div className="home-feature-icon">
                    <Icon size={24} strokeWidth={1.95} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="home-why-visual">
          <Image
            alt={text.whyImageAlt}
            className="home-section-image home-why-image"
            fill
            sizes="(min-width: 1024px) 36vw, 100vw"
            src={homePageImages.why}
          />
        </div>
      </section>

      <section className="home-about">
        <div className="home-about-copy">
          <p className="home-eyebrow">{text.aboutEyebrow}</p>
          <h2 className="home-section-title home-about-title">
            <span>{text.aboutTitleA}</span>
            <span className="home-blue-word">{text.aboutTitleB}</span>
          </h2>
          <p className="home-about-text">{text.aboutText}</p>

          <div className="home-about-list">
            {[
              t(locale, {
                en: "OEM / ODM With Mold, Injection, Assembly, And Delivery",
                zh: "覆盖开模、注塑、组装与交付的 OEM / ODM 服务",
              }),
              t(locale, {
                en: "RoHS / REACH / EN71 / ASTM F963 Compliance Support",
                zh: "支持 RoHS / REACH / EN71 / ASTM F963 合规要求",
              }),
              t(locale, {
                en: "Custom Extrusion, Tubing, Precision Injection, And AI Plastic Electronic Part Support",
                zh: "具备定制挤出、管材、精密注塑及 AI 塑胶电子部件配套能力",
              }),
              t(locale, {
                en: "Small-Batch Trial Orders, Third-Party Reports, And Flexible Bulk Production",
                zh: "支持小批量试单、第三方检测资料与灵活批量生产",
              }),
            ].map((item) => (
              <div key={item} className="home-about-bullet">
                <ShieldCheck size={15} strokeWidth={2.2} />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <Link
            className="home-primary-cta home-about-cta"
            href={`/${locale}/about`}
          >
            <span>{text.aboutCta}</span>
            <ArrowRight size={16} strokeWidth={2.25} />
          </Link>
        </div>

        <div className="home-about-visual-wrap">
          <div className="home-about-visual">
            <Image
              alt={text.factoryAlt}
              className="home-section-image home-about-image"
              fill
              sizes="(min-width: 1024px) 42vw, 100vw"
              src={homePageImages.about}
            />
          </div>
          <div className="home-about-stats">
            {[
              {
                value: "2016",
                label: t(locale, { en: "Established", zh: "成立时间" }),
              },
              {
                value: "OEM/ODM",
                label: t(locale, { en: "Custom Programs", zh: "定制项目" }),
              },
              {
                value: "7-15 Days",
                label: t(locale, { en: "Regular Lead Time", zh: "常规交期" }),
              },
              {
                value: "±0.01mm",
                label: t(locale, { en: "Tooling Precision", zh: "模具精度" }),
              },
            ].map((item) => (
              <div key={item.value + item.label} className="home-about-stat">
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-solutions">
        <h2 className="home-solutions-title">
          {text.solutionsLead}{" "}
          <span className="home-blue-word">{text.solutionsAccent}</span>{" "}
          <span className="home-orange-word">•</span>
        </h2>
        <div className="home-solutions-process" aria-hidden="true">
          PROCESS
        </div>
        <div className="home-solution-row">
          {[
            {
              label: t(locale, { en: "Requirement Review", zh: "需求评估" }),
              icon: Sparkles,
            },
            {
              label: t(locale, { en: "Tooling & Sampling", zh: "开模与打样" }),
              icon: Wrench,
            },
            {
              label: t(locale, { en: "Injection / Extrusion", zh: "注塑 / 挤出生产" }),
              icon: Factory,
            },
            {
              label: t(locale, { en: "Inspection & Assembly", zh: "检测与组装" }),
              icon: ShieldCheck,
            },
            {
              label: t(locale, { en: "Packing & Export Handoff", zh: "包装与出口交接" }),
              icon: PackageCheck,
            },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="home-solution-step">
                <div className="home-solution-icon">
                  <Icon size={26} strokeWidth={1.95} />
                </div>
                <p>{item.label}</p>
                {index < 4 ? <div className="home-solution-arrow" /> : null}
              </div>
            );
          })}
        </div>
      </section>

      <section className="home-contact-grid home-surface home-contact-shell">
        <div className="home-contact-info-card">
          <div className="home-contact-info-content">
            <div className="home-contact-card-head">
              <h2 className="home-section-title">
                {text.getInTouch} <span className="home-orange-word">•</span>
              </h2>
            </div>
            <div className="home-contact-info">
              <div className="home-contact-lines">
                <div>
                  <Mail size={17} strokeWidth={2} />
                  <span>{siteCopy.contact.email}</span>
                </div>
                <div>
                  <Phone size={17} strokeWidth={2} />
                  <span>{siteCopy.contact.phone}</span>
                </div>
                <div>
                  <Globe2 size={17} strokeWidth={2} />
                  <span>{siteCopy.contact.website.replace(/^https?:\/\//, "")}</span>
                </div>
                <div>
                  <MapPin size={17} strokeWidth={2} />
                  <span>{text.address}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="home-contact-form-card">
          <div className="home-contact-card-head">
            <h2 className="home-section-title">
              {text.leaveMessage} <span className="home-orange-word">•</span>
            </h2>
            <p>{text.leaveMessageText}</p>
          </div>
          <HomeLeadForm locale={locale} />
        </div>
      </section>
    </div>
  );
}
