import type {Metadata} from "next";
import "@/styles/pages/solutions.css";
import {
  ArrowRight,
  Boxes,
  Factory,
  FlaskConical,
  Globe2,
  Handshake,
  Leaf,
  Lightbulb,
  PackageCheck,
  Puzzle,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import Image from "@/components/media/smart-image";
import Link from "next/link";

import {PageHero} from "@/components/sections/page-hero";
import {StructuredData} from "@/components/seo/structured-data";
import {siteCopy} from "@/components/layout/site-shell.data";
import {solutionsContent} from "@/content/site";
import {buildPageMetadata} from "@/lib/metadata";
import {getLocaleFromParams, t} from "@/lib/i18n";
import {contactFormPath} from "@/lib/routes";
import {toAbsoluteUrl} from "@/lib/site-config";
import {solutionsPageImages} from "@/content/pages/solutions";

const proofPoints = [
  {
    value: {en: "R&D", zh: "研发"},
    label: {en: "Toy Expertise", zh: "玩具专长"},
    text: {
      en: "Focused on educational toys and building block assembly products with integrated development and manufacturing.",
      zh: "聚焦益智玩具与积木拼装玩具，覆盖研发、生产与项目协同。",
    },
  },
  {
    value: {en: "15%", zh: "15%"},
    label: {en: "Domestic Market", zh: "国内市场"},
    text: {
      en: "About 15% of shipments serve the domestic market alongside long-term export programs.",
      zh: "约 15% 的产品销往国内市场，同时稳定服务出口项目。",
    },
  },
  {
    value: {en: "25%", zh: "25%"},
    label: {en: "Central America", zh: "中美洲"},
    text: {
      en: "Around 25% of shipments go to Central America, with products sold across domestic and overseas markets.",
      zh: "约 25% 的产品销往中美洲，整体覆盖国内外多个市场。",
    },
  },
  {
    value: {en: "QC", zh: "质控"},
    label: {en: "Safe & Durable", zh: "安全耐用"},
    text: {
      en: "Eco-friendly, non-toxic material options plus strict quality control help ensure safety and durability.",
      zh: "环保无毒材料选择结合严格质量控制，确保产品安全性与耐用性。",
    },
  },
] as const;

const capabilityCards = [
  {
    key: "focused-manufacturing",
    icon: Factory,
    accent: "blue",
    image: solutionsPageImages.education,
    title: {
      en: "Focused STEM Toy R&D And Manufacturing",
      zh: "专注 STEM 益智玩具研发与制造",
    },
    text: {
      en: "We work as a supplier, manufacturer, and development partner focused on educational toys and building block assembly toy programs, with in-house mold coordination and structure refinement support.",
      zh: "我们以供应商、生产商和研发协作方的身份，专注服务益智玩具与积木拼装玩具项目，并提供自有模具协同和结构优化支持。",
    },
    bullets: [
      {en: "Educational toy development", zh: "益智玩具开发"},
      {en: "In-house mold design and sampling", zh: "自有模具设计与打样"},
      {en: "Drawing-based and sample-based processing", zh: "来图与来样加工"},
    ],
  },
  {
    key: "custom-building-toys",
    icon: Puzzle,
    accent: "green",
    image: solutionsPageImages.retail,
    title: {
      en: "Custom Interlocking And DIY Toy Programs",
      zh: "拼接玩具与 DIY 玩具定制",
    },
    text: {
      en: "We can complete more custom projects for interlocking toys, creative building sets, modern architecture themes, and DIY-oriented play products, from trial sampling to repeat production.",
      zh: "我们可以完成更多拼接玩具、创意拼搭套装、现代建筑主题产品和 DIY 玩具的定制开发，并支持从试样到复购量产的推进。",
    },
    bullets: [
      {en: "Unlimited shape possibilities", zh: "无限形态设计可能"},
      {en: "Hands-on DIY creativity", zh: "强调动手创造体验"},
      {en: "Small-batch trial and bulk planning", zh: "小批量试单与批量规划"},
    ],
  },
  {
    key: "custom-plastics",
    icon: FlaskConical,
    accent: "purple",
    image: solutionsPageImages.events,
    title: {
      en: "Custom Plastic Products, Tubing & Smart Housings",
      zh: "塑料制品、管材与塑胶电子外壳定制",
    },
    text: {
      en: "Beyond toy sets, we also support PVC/PU/ABS/PC/nylon tubing, custom profiles, plastic structural parts, and selected AI toy plastic electronic housings when the project requires coordinated manufacturing.",
      zh: "除玩具套装外，我们也支持 PVC/PU/ABS/PC/尼龙管材、塑胶异型材、塑料结构件以及部分 AI 玩具塑胶电子外壳定制，满足项目化协同生产需求。",
    },
    bullets: [
      {en: "Plastic structural components and accessory parts", zh: "塑料结构件与配套辅件"},
      {en: "PVC, PU, ABS, PC, and nylon material routes", zh: "PVC、PU、ABS、PC 与尼龙材料方案"},
      {en: "Packaging-ready product combinations", zh: "可直接进入包装组合"},
    ],
  },
  {
    key: "materials-quality",
    icon: ShieldCheck,
    accent: "orange",
    image: solutionsPageImages.oem,
    title: {
      en: "Eco-Safe Materials With Strict QC",
      zh: "环保材料与严格质量控制",
    },
    text: {
      en: "We prioritize eco-friendly, non-toxic material routes and use raw-material checks, in-process control, automated inspection, and final review to keep products safe, durable, and shipment-ready.",
      zh: "我们优先采用环保无毒材料方案，并通过原料确认、过程管控、自动化检测和终检复核，确保产品安全、耐用、适合稳定出货。",
    },
    bullets: [
      {en: "Durable and non-toxic material options", zh: "耐用且环保无毒的材料选择"},
      {en: "Automated inspection and traceable QC", zh: "自动化检测与可追溯质控"},
      {en: "Third-party reports and market-entry files", zh: "第三方检测与市场准入资料"},
    ],
  },
] as const;

const valueHighlights = [
  {
    icon: Sparkles,
    title: {en: "Infinite Design Possibilities", zh: "无限的设计可能性"},
    text: {
      en: "Build unlimited shapes and structures to create open-ended play value and long-lasting fun.",
      zh: "能够构建无限形状与结构，为孩子带来开放式创造体验与持久乐趣。",
    },
  },
  {
    icon: Leaf,
    title: {en: "Durable Plastic Materials", zh: "耐用塑料材质"},
    text: {
      en: "Plastic materials are selected for durability while keeping them safe for young builders.",
      zh: "塑料材质兼顾耐用与儿童使用安全，适合高频拼装与重复玩耍。",
    },
  },
  {
    icon: PackageCheck,
    title: {en: "High-Quality Structure", zh: "高品质结构"},
    text: {
      en: "Sturdy components help the final toy hold together well during repeated use and assembly.",
      zh: "坚固稳定的部件结构，让产品在反复拼搭中依旧保持良好体验。",
    },
  },
  {
    icon: Boxes,
    title: {en: "Modern Architecture Themes", zh: "现代建筑主题"},
    text: {
      en: "Product themes can be developed around futuristic buildings, engineered forms, and spatial creativity.",
      zh: "可围绕未来建筑、工程结构与空间创意开发现代化产品主题。",
    },
  },
  {
    icon: Handshake,
    title: {en: "DIY Creative Engagement", zh: "DIY 动手创造"},
    text: {
      en: "DIY toy concepts encourage children to participate, create, rebuild, and explore through hands-on play.",
      zh: "DIY 玩具理念鼓励孩子主动参与、重复创造，在动手中建立探索兴趣。",
    },
  },
] as const;

const processSteps = [
  {
    icon: Lightbulb,
    title: {en: "1. Project Brief And Fast Review", zh: "1. 项目需求与快速评估"},
    text: {
      en: "We clarify target market, toy category, quantity, packaging direction, and technical scope first, with most first replies sent within 24 hours.",
      zh: "我们先确认目标市场、玩具类别、数量计划、包装方向与技术范围，大多数询盘会在 24 小时内获得首次回复。",
    },
  },
  {
    icon: Wrench,
    title: {en: "2. Tooling, Structure & Material Design", zh: "2. 模具、结构与材料设计"},
    text: {
      en: "Define assembly logic, mold route, material selection, component strength, and safety assumptions through drawing-based or sample-based development.",
      zh: "围绕拼装逻辑、开模路径、材料方案、部件强度与安全要求，完成来图来样开发与结构设计。",
    },
  },
  {
    icon: Puzzle,
    title: {en: "3. Sampling And Trial Validation", zh: "3. 打样与试单验证"},
    text: {
      en: "Review fit, appearance, playability, durability, and packaging assumptions through samples or small-batch trial orders before scaling up.",
      zh: "通过样品或小批量试单验证装配匹配、外观、玩法、耐用性与包装假设，再推进后续量产。",
    },
  },
  {
    icon: ShieldCheck,
    title: {en: "4. Raw Material To Final QC Production", zh: "4. 从原料到终检的量产控制"},
    text: {
      en: "Production runs through raw material checks, in-process inspection, automated review, assembly control, and final outgoing inspection before shipment.",
      zh: "量产全程执行原料确认、过程检验、自动化复核、组装控制与出货终检，确保稳定交付。",
    },
  },
  {
    icon: Globe2,
    title: {en: "5. Packing, Reports & Export Handoff", zh: "5. 包装、资料与出口交接"},
    text: {
      en: "We coordinate packing details, third-party reports, buyer filing documents, and export handoff so the order can move forward with less friction.",
      zh: "我们会协同包装细节、第三方检测、客户归档资料与出口交接，让订单推进更顺畅。",
    },
  },
] as const;

const partnerItems = [
  {
    icon: Factory,
    title: {en: "Supplier + Manufacturer + R&D", zh: "供应商 + 生产商 + 研发协作"},
    text: {
      en: "One team can support requirement intake, product development, mold coordination, manufacturing, and delivery follow-up.",
      zh: "由同一团队衔接需求、研发、模具协同、生产和交付跟进，沟通更顺畅。",
    },
  },
  {
    icon: Globe2,
    title: {en: "Domestic And Overseas Markets", zh: "国内外市场同步覆盖"},
    text: {
      en: "Products are sold to both domestic and overseas markets, with about 15% shipped domestically and about 25% shipped to Central America alongside Europe, North America, Asia, and Oceania.",
      zh: "产品远销国内外市场，约 15% 销往国内市场，约 25% 销往中美洲，同时覆盖欧洲、北美、亚洲和大洋洲。",
    },
  },
  {
    icon: Boxes,
    title: {en: "Custom Building Toy Depth", zh: "深度拼搭玩具定制"},
    text: {
      en: "We support deeper customization for interlocking products, structure themes, combination sets, and play formats.",
      zh: "可围绕拼接结构、主题造型、组合套装与玩法形态进行更深度定制。",
    },
  },
  {
    icon: Leaf,
    title: {en: "Eco-Friendly Material Options", zh: "环保无毒材料方案"},
    text: {
      en: "Material planning can prioritize non-toxic and eco-conscious routes, including compliance-minded options for export projects without losing structural durability.",
      zh: "材料方案可优先考虑环保无毒方向，并兼顾出口项目合规要求，同时保持结构稳定与使用寿命。",
    },
  },
  {
    icon: ShieldCheck,
    title: {en: "STEM Safety And Durability", zh: "STEM 产品安全与耐用"},
    text: {
      en: "We are committed to STEM educational products backed by safety checks, durability review, controlled production quality, and third-party report coordination when needed.",
      zh: "公司致力于 STEM 教育产品，并通过安全、耐用、生产质量审核及必要时的第三方检测协同，确保稳定交付。",
    },
  },
] as const;

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const locale = await getLocaleFromParams(params);
  return buildPageMetadata(locale, solutionsContent.seo, "solutions");
}

function copy(locale: "en" | "zh") {
  return {
    eyebrow: t(locale, {
      en: "TOY OEM/ODM · DONGGUAN SOURCE FACTORY",
      zh: "玩具 OEM/ODM · 东莞源头工厂",
    }),
    heroTitle: t(locale, {
      en: "Custom Development For Building Toys And Custom Toys",
      zh: "搭建玩具与定制玩具的定制化开发方案",
    }),
    heroText: t(locale, {
      en: "Yaoshun is a Dongguan source toy factory focused on building toys, custom toys, STEM educational toys, custom interlocking toy programs, and related plastic product manufacturing. In-house mold development, eco-friendly non-toxic materials, and strict quality control help us deliver safe, durable, and export-ready toy OEM/ODM projects.",
      zh: "尧顺是东莞源头玩具工厂，专注搭建玩具、定制玩具、STEM 益智玩具、拼接玩具定制及相关塑料制品开发生产。依托自有开模、环保无毒材料方案与严格质量控制流程，我们持续交付安全、耐用且适合出口的玩具 OEM/ODM 定制化开发项目。",
    }),
    heroAlt: t(locale, {
      en: "yaoshun toys solutions hero visual",
      zh: "yaoshun toys 解决方案页主视觉",
    }),
    contact: t(locale, {en: "Discuss Your Custom Project", zh: "沟通定制项目"}),
    solutionsTitle: t(locale, {en: "Core Capability Focus", zh: "核心能力聚焦"}),
    solutionsText: t(locale, {
      en: "The page centers on what buyers actually need from us: source-factory toy R&D, in-house tooling, building toy execution, custom toy development, plastic product support, and reliable safety-driven manufacturing.",
      zh: "这里重点呈现客户真正关心的能力：源头工厂玩具研发、自有模具、搭建玩具执行、定制玩具开发、塑料制品协同开发，以及以安全和稳定交付为核心的制造能力。",
    }),
    customTitle: t(locale, {
      en: "Building Toys, Custom Toys, And Plastic Products Built Around Your Market",
      zh: "围绕市场需求开发搭建玩具、定制玩具与塑料制品",
    }),
    customText: t(locale, {
      en: "We can support custom projects for building toys, custom toys, interlocking toys, educational building products, plastic structures, branded combinations, tubing, and selected smart plastic housings. From material planning to structural refinement, reports, and packaging coordination, the work is organized for real production and export delivery.",
      zh: "我们可以围绕搭建玩具、定制玩具、拼接玩具、益智拼搭产品、塑料结构件、品牌组合套装、管材型材以及部分塑胶电子外壳开展定制项目。从材料规划、结构优化到检测资料与包装协同，整套工作方式都面向真实生产与出口交付。",
    }),
    customAction: t(locale, {en: "Start A Custom Discussion", zh: "开启定制沟通"}),
    valuesTitle: t(locale, {en: "Product Value Highlights", zh: "产品价值亮点"}),
    valuesText: t(locale, {
      en: "These are the product directions we repeatedly strengthen in educational building toy programs.",
      zh: "这些是我们在益智拼搭玩具项目中持续强化的核心产品价值。",
    }),
    processTitle: t(locale, {en: "From Idea To Shipment", zh: "从想法到出货"}),
    processText: t(locale, {
      en: "A development and quality-control path designed to move buyers from the first inquiry to shipment with clearer timing, safer materials, and stronger documentation.",
      zh: "这是一条围绕更清晰交期、更安全材料和更完整资料而建立的研发与质量控制路径，帮助客户从询盘推进到出货。",
    }),
    partnerTitle: t(locale, {en: "Why Buyers Work With Yaoshun", zh: "客户选择尧顺的原因"}),
  };
}

export default async function SolutionsPage({params}: {params: Promise<{locale: string}>}) {
  const locale = await getLocaleFromParams(params);
  const text = copy(locale);
  const pageUrl = toAbsoluteUrl(`/${locale}/solutions`);
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
          name: locale === "zh" ? "解决方案" : "Solutions",
          item: pageUrl,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: text.heroTitle,
      description: text.heroText,
      url: pageUrl,
      inLanguage: locale === "zh" ? "zh-CN" : "en-US",
      serviceType:
        locale === "zh"
          ? "东莞源头工厂、搭建玩具定制、定制玩具开发、玩具 OEM/ODM 与塑料制品定制"
          : "Dongguan source factory, building toy customization, custom toy development, toy OEM/ODM, and custom plastic product manufacturing",
      provider: {
        "@type": ["Organization", "LocalBusiness"],
        name: siteCopy.companyName[locale],
        url: toAbsoluteUrl(`/${locale}`),
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
      areaServed: [
        locale === "zh" ? "中国" : "China",
        locale === "zh" ? "中美洲" : "Central America",
        locale === "zh" ? "欧洲" : "Europe",
        locale === "zh" ? "北美" : "North America",
        locale === "zh" ? "亚洲" : "Asia",
        locale === "zh" ? "大洋洲" : "Oceania",
      ],
      audience: {
        "@type": "BusinessAudience",
        audienceType:
          locale === "zh"
            ? "品牌商、进口商、渠道商与教育产品采购客户"
            : "Brand owners, importers, distributors, and educational product buyers",
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: text.solutionsTitle,
        itemListElement: capabilityCards.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.title[locale],
          description: item.text[locale],
        })),
      },
    },
  ];

  return (
    <div className="solutions-page">
      <StructuredData data={structuredData} />

      <PageHero
        backgroundClassName="solutions-hero-background"
        backgroundImageClassName="solutions-hero-background-image"
        backgroundSrc="/site/misc/home-bg.webp"
        copyClassName="solutions-hero-copy"
        gridClassName="solutions-hero-grid"
        innerClassName="solutions-hero-inner"
        sectionClassName="solutions-hero"
      >
        <p className="solutions-eyebrow">{text.eyebrow}</p>
        <h1 className="solutions-hero-title">{text.heroTitle}</h1>
        <p className="solutions-hero-text">{text.heroText}</p>
        <Link
          className="solutions-primary-cta"
          data-track-destination={contactFormPath(locale)}
          data-track-event="cta_click"
          data-track-label="discuss_custom_project"
          data-track-location="solutions_hero"
          href={contactFormPath(locale)}
        >
          <span>{text.contact}</span>
          <ArrowRight size={16} strokeWidth={2.15} />
        </Link>
      </PageHero>

      <section className="solutions-proof-strip">
        {proofPoints.map((item) => (
          <article className="solutions-proof-item" key={item.label.en}>
            <div className="solutions-proof-value">{item.value[locale]}</div>
            <h2 className="solutions-proof-label">{item.label[locale]}</h2>
            <p>{item.text[locale]}</p>
          </article>
        ))}
      </section>

      <section className="solutions-section-head">
        <h2>{text.solutionsTitle}</h2>
        <p>{text.solutionsText}</p>
      </section>

      <section className="solutions-card-grid">
        {capabilityCards.map((item) => {
          const Icon = item.icon;
          return (
            <article className="solutions-card" key={item.key}>
              <div className={`solutions-card-visual ${item.accent}`}>
                <Image
                  alt={item.title[locale]}
                  className="solutions-card-image"
                  fill
                  sizes="(min-width: 1024px) 24vw, (min-width: 768px) 48vw, 100vw"
                  src={item.image}
                />
                <div className="solutions-card-badge">
                  <Icon size={24} strokeWidth={1.9} />
                </div>
              </div>
              <div className="solutions-card-body">
                <h3>{item.title[locale]}</h3>
                <p>{item.text[locale]}</p>
                <ul className="solutions-card-list">
                  {item.bullets.map((bullet) => (
                    <li key={bullet.en}>{bullet[locale]}</li>
                  ))}
                </ul>
                <Link
                  className="solutions-inline-link"
                  data-track-destination={contactFormPath(locale)}
                  data-track-event="cta_click"
                  data-track-label={item.key}
                  data-track-location="solutions_capability_card"
                  href={contactFormPath(locale)}
                >
                  <span>{text.contact}</span>
                  <ArrowRight size={15} strokeWidth={2.1} />
                </Link>
              </div>
            </article>
          );
        })}
      </section>

      <section className="solutions-banner">
        <div className="solutions-banner-visual">
          <Image
            alt={text.customTitle}
            className="solutions-banner-image"
            height={1024}
            sizes="(min-width: 1024px) 32vw, (min-width: 768px) 44vw, 100vw"
            src={solutionsPageImages.custom}
            width={1536}
          />
        </div>
        <div className="solutions-banner-copy">
          <h2>{text.customTitle}</h2>
          <p>{text.customText}</p>
          <ul className="solutions-banner-list">
            <li>{locale === "zh" ? "拼接玩具、积木拼装玩具与 STEM 教育产品定制" : "Custom interlocking toys, building block assembly toys, and STEM educational products"}</li>
            <li>{locale === "zh" ? "塑料制品、PVC / PU / ABS / PC / 尼龙管材、结构件与塑胶电子外壳协同开发" : "Custom plastic products, PVC / PU / ABS / PC / nylon tubing, structural parts, and smart plastic housings"}</li>
            <li>{locale === "zh" ? "24 小时内初步回复、常规 7-15 天交期规划、检测资料与出口协同" : "24-hour initial response, typical 7-15 day lead-time planning, reports, and export coordination"}</li>
          </ul>
          <Link
            className="solutions-primary-cta"
            data-track-destination={contactFormPath(locale)}
            data-track-event="cta_click"
            data-track-label="start_custom_discussion"
            data-track-location="solutions_banner"
            href={contactFormPath(locale)}
          >
            <span>{text.customAction}</span>
            <ArrowRight size={16} strokeWidth={2.15} />
          </Link>
        </div>
      </section>

      <section className="solutions-section-head">
        <h2>{text.valuesTitle}</h2>
        <p>{text.valuesText}</p>
      </section>

      <section className="solutions-value-grid">
        {valueHighlights.map((item) => {
          const Icon = item.icon;
          return (
            <article className="solutions-value-card" key={item.title.en}>
              <div className="solutions-value-icon">
                <Icon size={22} strokeWidth={1.9} />
              </div>
              <h3>{item.title[locale]}</h3>
              <p>{item.text[locale]}</p>
            </article>
          );
        })}
      </section>

      <section className="solutions-process">
        <div className="solutions-section-head">
          <h2>{text.processTitle}</h2>
          <p>{text.processText}</p>
        </div>
        <div className="solutions-process-grid">
          {processSteps.map((item, index) => {
            const Icon = item.icon;
            return (
              <article className="solutions-process-card" key={item.title.en}>
                <div className="solutions-process-icon">
                  <Icon size={30} strokeWidth={1.8} />
                </div>
                <h3>{item.title[locale]}</h3>
                <p>{item.text[locale]}</p>
                {index < processSteps.length - 1 ? (
                  <span className="solutions-process-arrow" aria-hidden="true">
                    →
                  </span>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>

      <section className="solutions-partner-strip">
        <h2>{text.partnerTitle}</h2>
        <div className="solutions-partner-grid">
          {partnerItems.map((item) => {
            const Icon = item.icon;
            return (
              <article className="solutions-partner-item" key={item.title.en}>
                <Icon size={30} strokeWidth={1.8} />
                <div>
                  <h3>{item.title[locale]}</h3>
                  <p>{item.text[locale]}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
