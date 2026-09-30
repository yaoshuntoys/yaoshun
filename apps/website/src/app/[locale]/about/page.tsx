import type { Metadata } from "next";
import "@/styles/pages/about.css";
import type { ReactNode } from "react";
import {
  ArrowRight,
  BadgeDollarSign,
  Building2,
  Boxes,
  Factory,
  Globe,
  HandCoins,
  HeartHandshake,
  Lightbulb,
  Leaf,
  PackageCheck,
  Plane,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  Truck,
  UserRound,
  Wrench,
} from "lucide-react";
import Image from "@/components/media/smart-image";
import Link from "next/link";

import {CooperationPartnersSection} from "@/components/sections/cooperation-partners-section";
import {CertificatesSection} from "@/components/sections/certificates-section";
import {SourceFactorySection} from "@/components/sections/source-factory-section";
import { StructuredData } from "@/components/seo/structured-data";
import { siteCopy } from "@/components/layout/site-shell.data";
import { aboutContent } from "@/content/site";
import { buildPageMetadata } from "@/lib/metadata";
import { getLocaleFromParams, t } from "@/lib/i18n";
import { contactFormPath, localizedPath } from "@/lib/routes";
import { toAbsoluteUrl } from "@/lib/site-config";
import {
  certificateItems,
  certificateSectionCopy,
  getCertificateDocumentsStructuredData,
} from "@/content/pages/certificates";
import {
  cooperationPartnersSectionCopy,
  factoryItems,
  partnerItems,
  sourceFactorySectionCopy,
} from "@/content/pages/company-showcase";

const heroFactItems = [
  {
    value: { en: "2016", zh: "2016" },
    label: { en: "Founded", zh: "公司成立" },
    icon: Building2,
  },
  {
    value: { en: "OEM/ODM", zh: "OEM/ODM" },
    label: { en: "Custom Development", zh: "定制开发" },
    icon: Boxes,
  },
  {
    value: { en: "±0.01mm", zh: "±0.01mm" },
    label: { en: "Tooling Precision", zh: "模具精度" },
    icon: SlidersHorizontal,
  },
  {
    value: { en: "RoHS / REACH", zh: "RoHS / REACH" },
    label: { en: "Eco Compliance", zh: "环保合规" },
    icon: Leaf,
  },
] as const;

const advantageItems = [
  {
    icon: Lightbulb,
    title: { en: "Integrated R&D And Tooling", zh: "研发与模具一体化" },
    text: {
      en: "Our engineering team supports CAD/UG-based mold design, drawing-based or sample-based development, structural refinement, and sample optimization for educational toys and precision plastic components.",
      zh: "工程团队使用 CAD/UG 完成模具设计、来图来样开发和结构优化，服务益智玩具及精密塑胶件项目。",
    },
  },
  {
    icon: Factory,
    title: { en: "Full-Chain Manufacturing", zh: "全链路制造能力" },
    text: {
      en: "The factory integrates extrusion, injection molding, quality inspection, finished assembly, and export handoff in one coordinated workflow.",
      zh: "覆盖挤出、注塑、质检、组装和出口交付。",
    },
  },
  {
    icon: Boxes,
    title: { en: "Custom Plastic Product Coverage", zh: "塑胶制品定制覆盖面" },
    text: {
      en: "We support educational toys, interlocking toy accessories, precision molded parts, PVC/PU/ABS/PC/nylon tubing, and custom plastic profiles.",
      zh: "提供益智玩具、拼插配件、精密注塑件、PVC/PU/ABS/PC/尼龙管材及异型材定制。",
    },
  },
  {
    icon: HeartHandshake,
    title: { en: "Flexible OEM/ODM Cooperation", zh: "灵活的 OEM/ODM 协作" },
    text: {
      en: "From small-batch trial orders to large-volume production, we adapt tooling, materials, packaging, and schedules to real customer programs.",
      zh: "支持小批量试单和大批量生产，按项目调整模具、材料、包装和交期。",
    },
  },
  {
    icon: Leaf,
    title: { en: "Eco-Compliant Materials", zh: "环保合规材料" },
    text: {
      en: "Materials are planned around RoHS, REACH, EN71, and ASTM F963 expectations while avoiding phthalates, heavy metals, and other restricted substances.",
      zh: "按 RoHS、REACH、EN71、ASTM F963 等要求规划材料，控制邻苯、重金属等受限物质。",
    },
  },
  {
    icon: SlidersHorizontal,
    title: { en: "Process Accuracy And Validation", zh: "工艺精度与验证能力" },
    text: {
      en: "Tooling precision can reach +/-0.01 mm, supported by tensile, climate simulation, drop, durability, and dimensional checks before shipment.",
      zh: "模具精度可达 +/-0.01 mm，出货前完成拉力、跌落、耐用性和尺寸检测。",
    },
  },
  {
    icon: ShieldCheck,
    title: { en: "Strict Quality Assurance", zh: "严格质量保障" },
    text: {
      en: "Raw material inspection, in-process sampling, automated inspection, lab verification, final outgoing checks, and third-party report coordination are built into every order workflow.",
      zh: "覆盖原料检验、过程抽检、自动检测、实验室验证、出厂终检及第三方检测。",
    },
  },
  {
    icon: BadgeDollarSign,
    title: { en: "Multi-Industry Delivery Experience", zh: "多行业交付经验" },
    text: {
      en: "Beyond toys, our plastic manufacturing workflow also supports industrial, medical, food-contact, and lighting-related applications when projects require it.",
      zh: "除玩具外，也支持工业、医疗、食品接触和灯饰类塑胶项目。",
    },
  },
] as const;

const serviceHighlights = [
  {
    icon: Lightbulb,
    title: { en: "Educational Toy Development", zh: "益智玩具开发" },
    text: {
      en: "Support concept review, structural refinement, and play-pattern optimization for STEM and interlocking toy programs.",
      zh: "提供 STEM 与拼插玩具的方案评估、结构优化和玩法设计。",
    },
  },
  {
    icon: Boxes,
    title: { en: "Precision Injection Molding", zh: "高精密注塑件" },
    text: {
      en: "Produce toy accessories, structural parts, and custom molded components with stable dimensional control.",
      zh: "生产玩具配件、结构件和定制注塑件，控制尺寸一致性。",
    },
  },
  {
    icon: Factory,
    title: { en: "Custom Tubing & Profiles", zh: "定制管材与异型材" },
    text: {
      en: "Support PVC, PU, ABS, PC, PE, and nylon tubing or profile development with flexible size and hardness options.",
      zh: "提供 PVC、PU、ABS、PC、PE、尼龙管材及型材开发，可调整规格、颜色和硬度。",
    },
  },
  {
    icon: HeartHandshake,
    title: { en: "Mold Design & Sampling", zh: "模具设计与打样" },
    text: {
      en: "Shorten the path from drawing or sample to pilot validation with in-house tooling coordination.",
      zh: "厂内完成模具设计与打样，缩短从图纸或样品到试产的周期。",
    },
  },
  {
    icon: Leaf,
    title: { en: "Compliance & Testing", zh: "合规与测试支持" },
    text: {
      en: "Coordinate reports, lab checks, and market-entry requirements for toy and plastic product export programs.",
      zh: "协助完成检测资料、实验室验证和市场准入。",
    },
  },
  {
    icon: HandCoins,
    title: { en: "Fast Business Response", zh: "快速商务响应" },
    text: {
      en: "Multilingual trade support targets replies within 24 hours and keeps quotation progress visible.",
      zh: "多语种外贸团队跟进报价和项目，力争 24 小时内回复。",
    },
  },
] as const;

const compactServiceHighlights = [
  serviceHighlights[0],
  serviceHighlights[3],
  serviceHighlights[4],
  serviceHighlights[5],
] as const;

const cultureItems = [
  {
    icon: Star,
    title: { en: "Mission", zh: "企业使命" },
    text: {
      en: "Create safe and reliable plastic product value for global customers, making every delivery worthy of trust.",
      zh: "以可靠工艺，为客户提供安全、稳定的塑胶产品。",
    },
  },
  {
    icon: HeartHandshake,
    title: { en: "Vision", zh: "企业愿景" },
    text: {
      en: "Become a benchmark manufacturer for plastic tubing and toy accessories, building a trusted Yaoshun quality label.",
      zh: "成为塑胶管材和玩具配件领域值得信赖的制造商。",
    },
  },
  {
    icon: ShieldCheck,
    title: { en: "Core Values", zh: "核心价值观" },
    text: {
      en: "Quality first, customer focus, innovation, integrity, compliance, and collaborative growth.",
      zh: "品质优先、客户至上、创新、诚信、合规、协作共赢。",
    },
  },
  {
    icon: UserRound,
    title: { en: "Team Culture", zh: "团队文化" },
    text: {
      en: "Craftsmanship, continuous learning, human care, and strong ownership shape our daily execution style.",
      zh: "重视工艺、学习、关怀和责任。",
    },
  },
] as const;

const milestoneItems = [
  {
    year: "2016",
    title: { en: "Company Founded", zh: "公司成立" },
    text: {
      en: "Yaoshun started from plastic tubing extrusion and established its core processing foundation in Dongguan.",
      zh: "尧顺在东莞成立，以塑胶管材挤出业务为起点，奠定核心工艺基础。",
    },
  },
  {
    year: "2018",
    title: { en: "Injection Business Expanded", zh: "注塑业务拓展" },
    text: {
      en: "High-precision injection equipment was introduced to extend into toy accessories and interlocking toy programs.",
      zh: "引入高精度注塑设备，拓展至玩具配件与拼插玩具项目。",
    },
  },
  {
    year: "2020",
    title: { en: "Clean Production Upgraded", zh: "洁净产线升级" },
    text: {
      en: "Production capacity and cleanliness were upgraded to support higher-standard tubing and plastic product projects.",
      zh: "升级产能和洁净生产条件，满足更高标准的管材与塑胶项目。",
    },
  },
  {
    year: "2021",
    title: { en: "In-House Tooling Team Built", zh: "自有模具团队建立" },
    text: {
      en: "Independent tooling design shortened sample lead times and improved custom project responsiveness.",
      zh: "建立自有模具团队，缩短打样周期，提升项目响应速度。",
    },
  },
  {
    year: "2022",
    title: {
      en: "RoHS / REACH Compliance Improved",
      zh: "RoHS / REACH 合规完善",
    },
    text: {
      en: "Environmental compliance capabilities were strengthened for European and North American market access.",
      zh: "完善 RoHS、REACH 等环保合规资料，支持产品进入欧洲和北美市场。",
    },
  },
  {
    year: "2023",
    title: {
      en: "Canton Fair And Global Expansion",
      zh: "广交会与全球市场拓展",
    },
    text: {
      en: "The company expanded international buyer outreach through trade-show participation and deeper coordination with overseas sourcing programs.",
      zh: "通过展会和海外采购项目，服务更多国际客户。",
    },
  },
  {
    year: "2024",
    title: { en: "Automation And QC Expanded", zh: "自动化与质控提升" },
    text: {
      en: "Facilities and automatic inspection tools were upgraded to support more stable batch delivery.",
      zh: "升级厂房和自动检测设备，提升批量交付的稳定性。",
    },
  },
] as const;

const shippingItems = [
  {
    icon: Truck,
    label: { en: "Europe", zh: "欧洲市场" },
  },
  {
    icon: Plane,
    label: { en: "North America & Central America", zh: "北美与中美洲市场" },
  },
  {
    icon: PackageCheck,
    label: { en: "Asia", zh: "亚洲市场" },
  },
  {
    icon: Globe,
    label: { en: "Oceania", zh: "大洋洲市场" },
  },
] as const;

type BrandItem = {
  key: string;
  label: string;
  logo: ReactNode;
};

const paymentMethods: BrandItem[] = [
  {
    key: "visa",
    label: "Visa",
    logo: (
      <svg aria-hidden="true" viewBox="0 0 120 40">
        <rect width="120" height="40" rx="8" fill="#1A4AA2" />
        <text
          x="60"
          y="26"
          textAnchor="middle"
          fill="#FFFFFF"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="20"
          fontWeight="700"
        >
          VISA
        </text>
      </svg>
    ),
  },
  {
    key: "paypal",
    label: "PayPal",
    logo: (
      <svg aria-hidden="true" viewBox="0 0 120 40">
        <rect width="120" height="40" rx="8" fill="#FFFFFF" />
        <path
          d="M22 10h12c7 0 12 3.4 12 9.5 0 5.4-4.2 8.8-10.8 8.8h-5.5V34H22V10Zm8 6v7h3.8c2.8 0 4.5-1.1 4.5-3.6S36.6 16 33.8 16H30Z"
          fill="#123F8D"
        />
        <path
          d="M51 10h7v24h-7V10Zm15 0h8c9 0 15 4.8 15 12s-6 12-15 12h-8V10Zm7 5.2v13.6h1.2c4.4 0 7.4-2.2 7.4-6.8s-3-6.8-7.4-6.8H73Z"
          fill="#179BD7"
        />
      </svg>
    ),
  },
  {
    key: "mastercard",
    label: "Mastercard",
    logo: (
      <svg aria-hidden="true" viewBox="0 0 120 40">
        <rect width="120" height="40" rx="8" fill="#FFFFFF" />
        <circle cx="47" cy="20" r="10.5" fill="#E6392E" />
        <circle cx="61" cy="20" r="10.5" fill="#F4A62A" fillOpacity="0.95" />
        <path
          d="M54 11.5c2.6 1.9 4.3 4.9 4.3 8.5s-1.7 6.6-4.3 8.5c-2.6-1.9-4.3-4.9-4.3-8.5s1.7-6.6 4.3-8.5Z"
          fill="#F06D24"
        />
        <text
          x="84"
          y="23"
          textAnchor="middle"
          fill="#213B80"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="8.5"
          fontWeight="700"
        >
          Mastercard
        </text>
      </svg>
    ),
  },
  {
    key: "discover",
    label: "Discover",
    logo: (
      <svg aria-hidden="true" viewBox="0 0 120 40">
        <rect width="120" height="40" rx="8" fill="#FFFFFF" />
        <text
          x="50"
          y="23.5"
          textAnchor="middle"
          fill="#212121"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="14"
          fontWeight="700"
        >
          DISCOVER
        </text>
        <path d="M74 26h26l-6 6H68l6-6Z" fill="#F58B21" />
      </svg>
    ),
  },
  {
    key: "western-union",
    label: "Western Union",
    logo: (
      <svg aria-hidden="true" viewBox="0 0 120 40">
        <rect width="120" height="40" rx="8" fill="#FFD230" />
        <text
          x="60"
          y="21"
          textAnchor="middle"
          fill="#111111"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="11"
          fontWeight="900"
        >
          WESTERN UNION
        </text>
        <text
          x="60"
          y="29"
          textAnchor="middle"
          fill="#111111"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="4.2"
          fontWeight="700"
          letterSpacing="1"
        >
          MONEY TRANSFER
        </text>
      </svg>
    ),
  },
];

const deliveryMethods: BrandItem[] = [
  {
    key: "ups",
    label: "UPS",
    logo: (
      <svg aria-hidden="true" viewBox="0 0 120 40">
        <rect width="120" height="40" rx="8" fill="#FFFFFF" />
        <path
          d="M60 5c9.5 0 19 2.2 26 6v8.3c0 8.8-7.7 14.7-26 22.2-18.3-7.5-26-13.4-26-22.2V11c7-3.8 16.5-6 26-6Z"
          fill="#5B3317"
        />
        <path
          d="M60 10c6.8 0 13.8 1.4 19 4v5.8c0 6.4-5.4 10.8-19 16.5-13.6-5.7-19-10.1-19-16.5V14c5.2-2.6 12.2-4 19-4Z"
          fill="#F5BE27"
        />
        <text
          x="60"
          y="24"
          textAnchor="middle"
          fill="#3D250F"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="12"
          fontWeight="900"
        >
          UPS
        </text>
      </svg>
    ),
  },
  {
    key: "fedex",
    label: "FedEx",
    logo: (
      <svg aria-hidden="true" viewBox="0 0 120 40">
        <rect width="120" height="40" rx="8" fill="#FFFFFF" />
        <text
          x="34"
          y="25"
          fill="#4D148C"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="20"
          fontWeight="700"
        >
          Fed
        </text>
        <text
          x="74"
          y="25"
          fill="#FF6600"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="20"
          fontWeight="700"
        >
          Ex
        </text>
      </svg>
    ),
  },
  {
    key: "dhl",
    label: "DHL",
    logo: (
      <svg aria-hidden="true" viewBox="0 0 120 40">
        <rect width="120" height="40" rx="8" fill="#FFD11A" />
        <text
          x="60"
          y="26"
          textAnchor="middle"
          fill="#D51920"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="18"
          fontStyle="italic"
          fontWeight="900"
        >
          DHL
        </text>
        <path d="M10 15h22" stroke="#D51920" strokeWidth="2.5" />
        <path d="M10 23h22" stroke="#D51920" strokeWidth="2.5" />
        <path d="M88 15h22" stroke="#D51920" strokeWidth="2.5" />
        <path d="M88 23h22" stroke="#D51920" strokeWidth="2.5" />
      </svg>
    ),
  },
  {
    key: "tnt",
    label: "TNT",
    logo: (
      <svg aria-hidden="true" viewBox="0 0 120 40">
        <rect width="120" height="40" rx="8" fill="#FFFFFF" />
        <circle cx="32" cy="20" r="11" fill="#F58220" />
        <circle cx="60" cy="20" r="11" fill="#F58220" />
        <circle cx="88" cy="20" r="11" fill="#F58220" />
        <text
          x="32"
          y="24"
          textAnchor="middle"
          fill="#FFFFFF"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="13"
          fontWeight="900"
        >
          T
        </text>
        <text
          x="60"
          y="24"
          textAnchor="middle"
          fill="#FFFFFF"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="13"
          fontWeight="900"
        >
          N
        </text>
        <text
          x="88"
          y="24"
          textAnchor="middle"
          fill="#FFFFFF"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="13"
          fontWeight="900"
        >
          T
        </text>
      </svg>
    ),
  },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await getLocaleFromParams(params);
  return buildPageMetadata(locale, aboutContent.seo, "about");
}

function copy(locale: "en" | "zh") {
  return {
    heroEyebrow: t(locale, {
      en: "Dongguan Source Factory",
      zh: "东莞源头工厂",
    }),
    heroTitleLine1: t(locale, {
      en: "About Yaoshun",
      zh: "关于尧顺",
    }),
    heroTitleLine2: t(locale, {
      en: "Fort Building Toy Manufacturer",
      zh: "堡垒拼搭玩具制造商",
    }),
    heroText: t(locale, {
      en: "Founded in 2016, Dongguan Yaoshun Technology Co., Ltd. is a Dongguan source toy factory combining design, tooling, production, quality control, and export coordination for building toys, custom toys, and global toy OEM/ODM programs.",
      zh: "尧顺 2016 年成立于东莞，专注搭建玩具和定制玩具的设计、开模、生产与质检，承接海外 OEM/ODM 订单。",
    }),
    intro: t(locale, {
      en: "Founded on August 26, 2016 with registered capital of RMB 3 million, Dongguan Yaoshun Technology Co., Ltd. is a full-chain Dongguan source factory integrating mold development, plastic extrusion, precision injection molding, quality inspection, finished assembly, and export delivery. We focus on building toys, custom toys, educational toys, interlocking plastic toys, custom tubing, profiles, precision molded parts, and selected AI toy plastic electronic products for global OEM/ODM buyers.",
      zh: "尧顺成立于 2016 年，注册资本 300 万元。厂内涵盖模具开发、塑胶挤出、精密注塑、质检和组装包装，主要生产搭建玩具、益智玩具、塑胶配件、管材型材及注塑件，承接全球 OEM/ODM 项目。",
    }),
    companyTitle: t(locale, {
      en: "Dongguan Yaoshun Technology Co., Ltd.",
      zh: "东莞市尧顺科技有限公司",
    }),
    learnMore: t(locale, { en: "Learn More", zh: "了解更多" }),
    contactUs: t(locale, { en: "Contact Us", zh: "联系我们" }),
    advantages: t(locale, { en: "Our Advantages", zh: "我们的优势" }),
    advantagesEyebrow: t(locale, { en: "Why Choose Us", zh: "核心优势" }),
    advantagesText: t(locale, {
      en: "Our competitive edge comes from combining building toy and custom toy development with in-house tooling, extrusion, injection, compliance, automated inspection, and delivery execution in one source-factory system.",
      zh: "从开发、开模到挤出、注塑、检测和出货，主要环节均可在厂内完成，便于控制进度和品质。",
    }),
    oneStop: t(locale, { en: "Core Services", zh: "核心服务" }),
    serviceEyebrow: t(locale, { en: "Capabilities", zh: "能力模块" }),
    shipping: t(locale, { en: "History & Milestones", zh: "发展历程与里程碑" }),
    shippingEyebrow: t(locale, { en: "Growth", zh: "成长路径" }),
    paymentDelivery: t(locale, {
      en: "Global Reach & Trade Support",
      zh: "全球市场与贸易支持",
    }),
    paymentEyebrow: t(locale, { en: "Markets", zh: "市场覆盖" }),
    paymentMethods: t(locale, { en: "Payment Methods", zh: "支付方式" }),
    deliveryMethods: t(locale, { en: "Delivery Methods", zh: "配送方式" }),
    cultureTitle: t(locale, { en: "Corporate Culture", zh: "企业文化" }),
    cultureEyebrow: t(locale, { en: "Culture", zh: "文化理念" }),
    serviceText: t(locale, {
      en: "From concept or sample to validated production, reports, and shipment, key tasks stay inside one connected execution chain.",
      zh: "从概念、样品到量产、检测和出货，由同一团队全程跟进。",
    }),
    shippingText: t(locale, {
      en: "Key milestones show how the company expanded from tubing extrusion into mold development, precision injection, and international compliance support.",
      zh: "公司从管材挤出起步，随后建立模具开发和精密注塑团队，完善出口产品的检测与合规服务。",
    }),
    paymentText: t(locale, {
      en: "Multilingual trade support covers core export regions with flexible payment, document, and shipping coordination for OEM/ODM orders.",
      zh: "多语种团队对接欧洲、北美和亚洲市场，协助安排订单付款、资料和运输。",
    }),
    closingTitle: t(locale, {
      en: "Build With A Reliable OEM/ODM Factory Team",
      zh: "与可靠的 OEM/ODM 工厂团队协同合作",
    }),
    closingText: t(locale, {
      en: "Whether you are building a toy line, custom toy, custom plastic component, tubing project, or export-ready OEM program, Yaoshun is ready to support your project with source-factory engineering, disciplined quality control, and responsive delivery.",
      zh: "搭建玩具、定制玩具、塑胶部件或管材项目，尧顺都可从开模、生产、检测到出口交付全程跟进。",
    }),
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await getLocaleFromParams(params);
  const text = copy(locale);
  const homeHref = localizedPath(locale, "home");
  const pageUrl = toAbsoluteUrl(localizedPath(locale, "about"));
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: locale === "zh" ? "首页" : "Home",
          item: toAbsoluteUrl(homeHref),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: locale === "zh" ? "关于我们" : "About Us",
          item: pageUrl,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: text.companyTitle,
      description: text.intro,
      url: pageUrl,
      inLanguage: locale === "zh" ? "zh-CN" : "en-US",
      about: {
        "@type": ["Organization", "LocalBusiness"],
        name: siteCopy.companyName[locale],
        foundingDate: "2016-08-26",
        email: siteCopy.contact.email,
        telephone: siteCopy.contact.phone,
        address: {
          "@type": "PostalAddress",
          streetAddress: siteCopy.contact.address[locale],
          addressLocality: "Dongguan",
          addressRegion: "Guangdong",
          addressCountry: "CN",
        },
        knowsAbout: [
          locale === "zh" ? "东莞源头玩具工厂" : "Dongguan source toy factory",
          locale === "zh"
            ? "搭建玩具与定制玩具"
            : "Building toys and custom toys",
          locale === "zh"
            ? "玩具 OEM/ODM 定制化开发"
            : "Toy OEM/ODM custom development",
          locale === "zh"
            ? "益智玩具研发制造"
            : "Educational toy development and manufacturing",
          locale === "zh"
            ? "积木拼装玩具定制"
            : "Interlocking building toy customization",
          locale === "zh"
            ? "精密注塑件生产"
            : "Precision injection molded components",
          locale === "zh"
            ? "塑胶管材与异型材开发"
            : "Plastic tubing and profile development",
          locale === "zh" ? "OEM/ODM 一站式交付" : "OEM/ODM project delivery",
        ],
      },
    },
    ...getCertificateDocumentsStructuredData(),
  ];

  return (
    <div className="about-page">
      <StructuredData data={structuredData} />

      <section className="about-hero">
        <div className="about-hero-background" aria-hidden="true">
          <Image
            alt=""
            className="about-hero-background-image"
            fill
            priority
            sizes="100vw"
            src="/site/misc/about-bg-new.webp"
          />
        </div>

        <div className="about-hero-inner">
          <div className="about-hero-copy">
            <p className="about-hero-eyebrow">{text.heroEyebrow}</p>
            <h1 className="about-hero-title">
              <span>{text.heroTitleLine1}</span>
              <span className="hero-blue-word">{text.heroTitleLine2}</span>
            </h1>
            <p className="about-hero-text">{text.heroText}</p>
            <div className="page-hero-actions">
              <Link
                className="hero-primary-cta"
                data-track-destination="#about-advantages"
                data-track-event="cta_click"
                data-track-label="learn_more"
                data-track-location="about_hero"
                href="#about-advantages"
              >
                <span>{text.learnMore}</span>
                <ArrowRight size={16} strokeWidth={2.15} />
              </Link>
              <Link
                className="hero-secondary-cta"
                data-track-destination={contactFormPath(locale)}
                data-track-event="cta_click"
                data-track-label="contact_us"
                data-track-location="about_hero"
                href={contactFormPath(locale)}
              >
                <span>{text.contactUs}</span>
                <span className="hero-secondary-dot" />
              </Link>
            </div>
            <div className="hero-feature-strip">
              {[
                {
                  icon: Lightbulb,
                  label: {
                    en: "R&D And Structure Review",
                    zh: "研发与结构评估",
                  },
                },
                {
                  icon: Wrench,
                  label: { en: "In-House Tooling Support", zh: "自有模具支持" },
                },
                {
                  icon: Factory,
                  label: { en: "Injection And Assembly", zh: "注塑与组装协同" },
                },
                {
                  icon: Globe,
                  label: { en: "Export Document Handoff", zh: "出口资料交接" },
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <article className="hero-feature-item" key={item.label.en}>
                    <div className="hero-feature-icon">
                      <Icon size={21} strokeWidth={1.95} />
                    </div>
                    <p>{t(locale, item.label)}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>

        <div className="about-hero-metrics-anchor">
          <section className="about-metrics">
            {heroFactItems.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  className="about-metric"
                  key={item.value.en + item.label.en}
                >
                  <div className="about-metric-icon">
                    <Icon size={24} strokeWidth={1.9} />
                  </div>
                  <div className="about-metric-body">
                    <strong>{t(locale, item.value)}</strong>
                    <span>{t(locale, item.label)}</span>
                  </div>
                </article>
              );
            })}
          </section>
        </div>
      </section>

      <section className="about-advantages" id="about-milestones">
        <div className="about-section-heading">
          <p className="about-section-eyebrow">{text.shippingEyebrow}</p>
          <h2>{text.shipping}</h2>
        </div>
        <p className="about-section-copy">{text.shippingText}</p>
        <div className="about-advantage-grid">
          {milestoneItems.map((item) => (
            <article className="about-advantage-card" key={item.year}>
              <div className="about-advantage-copy">
                <p className="about-milestone-year">{item.year}</p>
                <h3>{item.title[locale]}</h3>
                <p>{item.text[locale]}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="about-advantages" id="about-advantages">
        <div className="about-section-heading">
          <p className="about-section-eyebrow">{text.advantagesEyebrow}</p>
          <h2>{text.advantages}</h2>
        </div>
        <p className="about-section-copy">{text.advantagesText}</p>
        <div className="about-advantage-grid">
          {advantageItems.map((item) => {
            const Icon = item.icon;
            return (
              <article className="about-advantage-card" key={item.title.en}>
                <div className="about-advantage-icon">
                  <Icon size={22} strokeWidth={1.9} />
                </div>
                <div className="about-advantage-copy">
                  <h3>{item.title[locale]}</h3>
                  <p>{item.text[locale]}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <SourceFactorySection
        description={t(locale, sourceFactorySectionCopy.description)}
        eyebrow={t(locale, sourceFactorySectionCopy.eyebrow)}
        id="about-source-factory"
        items={factoryItems}
        locale={locale}
        title={t(locale, sourceFactorySectionCopy.title)}
      />

      <CertificatesSection
        collapseLabel={t(locale, certificateSectionCopy.collapseLabel)}
        description={t(locale, certificateSectionCopy.description)}
        documentLabel={t(locale, certificateSectionCopy.documentLabel)}
        dialogLabel={t(locale, certificateSectionCopy.dialogLabel)}
        expandLabel={t(locale, certificateSectionCopy.expandLabel)}
        eyebrow={t(locale, certificateSectionCopy.eyebrow)}
        id="about-certificate"
        items={certificateItems}
        previewOnlyLabel={t(locale, certificateSectionCopy.previewOnlyLabel)}
        title={t(locale, certificateSectionCopy.title)}
      />

      <CooperationPartnersSection
        description={t(locale, cooperationPartnersSectionCopy.description)}
        eyebrow={t(locale, cooperationPartnersSectionCopy.eyebrow)}
        id="about-cooperation-partners"
        items={partnerItems}
        locale={locale}
        title={t(locale, cooperationPartnersSectionCopy.title)}
      />

      <section
        aria-label={t(locale, {
          en: "Core services, global markets, and company culture",
          zh: "核心服务、全球市场与企业文化",
        })}
        className="about-bottom-grid"
        id="about-company-details"
      >
        <article className="about-info-card">
          <div className="about-section-heading">
            <p className="about-section-eyebrow">{text.serviceEyebrow}</p>
            <h2>{text.oneStop}</h2>
          </div>
          <p className="about-card-copy">{text.serviceText}</p>
          <div className="about-service-detail-list">
            {compactServiceHighlights.map((item) => {
              const Icon = item.icon;
              return (
                <div className="about-service-detail-item" key={item.title.en}>
                  <div className="about-service-icon">
                    <Icon size={24} strokeWidth={1.9} />
                  </div>
                  <div className="about-service-detail-copy">
                    <h3>{item.title[locale]}</h3>
                    <p>{item.text[locale]}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </article>

        <article className="about-info-card about-trade-card">
          <div className="about-section-heading">
            <p className="about-section-eyebrow">{text.paymentEyebrow}</p>
            <h2>{text.paymentDelivery}</h2>
          </div>
          <p className="about-card-copy">{text.paymentText}</p>
          <div className="about-trade-block">
            <div className="about-trade-block-heading">
              <h3>
                {t(locale, { en: "Market coverage", zh: "市场覆盖" })}
              </h3>
            </div>
            <div className="about-shipping-list">
              {shippingItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div className="about-shipping-item" key={item.label.en}>
                    <div className="about-shipping-item-head">
                      <div className="about-shipping-item-icon">
                        <Icon size={18} strokeWidth={2} />
                      </div>
                      <span>{t(locale, item.label)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="about-trade-block about-trade-methods">
            <div className="about-trade-block-heading">
              <h3>
                {t(locale, {
                  en: "Payment and shipping",
                  zh: "付款与运输",
                })}
              </h3>
            </div>
            <div className="about-payment-delivery-grid">
              <div className="about-payment-group">
                <h4>{text.paymentMethods}</h4>
                <div className="about-payment-chip-list">
                  {paymentMethods.map((item) => (
                    <span className="about-payment-chip" key={item.key}>
                      {item.label}
                    </span>
                  ))}
                </div>
              </div>
              <div className="about-payment-group">
                <h4>{text.deliveryMethods}</h4>
                <div className="about-payment-chip-list">
                  {deliveryMethods.map((item) => (
                    <span className="about-payment-chip" key={item.key}>
                      {item.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </article>

        <article className="about-info-card">
          <div className="about-section-heading">
            <p className="about-section-eyebrow">{text.cultureEyebrow}</p>
            <h2>{text.cultureTitle}</h2>
          </div>
          <p className="about-card-copy">
            {t(locale, {
              en: "Our culture turns quality, customer focus, innovation, and responsibility into daily manufacturing behavior.",
              zh: "我们把品质、客户需求、创新和责任落实到每天的生产和项目沟通中。",
            })}
          </p>
          <div className="about-service-detail-list">
            {cultureItems.map((item) => {
              const Icon = item.icon;
              return (
                <div className="about-service-detail-item" key={item.title.en}>
                  <div className="about-service-icon">
                    <Icon size={24} strokeWidth={1.9} />
                  </div>
                  <div className="about-service-detail-copy">
                    <h3>{item.title[locale]}</h3>
                    <p>{item.text[locale]}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </article>
      </section>

      <section className="about-closing-panel">
        <div className="about-section-heading">
          <p className="about-section-eyebrow">{text.serviceEyebrow}</p>
          <h2>{text.closingTitle}</h2>
        </div>
        <p className="about-section-copy">{text.closingText}</p>
        <Link
          className="about-primary-cta"
          data-track-destination={contactFormPath(locale)}
          data-track-event="cta_click"
          data-track-label="contact_us"
          data-track-location="about_closing"
          href={contactFormPath(locale)}
        >
          <span>{text.contactUs}</span>
          <ArrowRight size={16} strokeWidth={2.15} />
        </Link>
      </section>
    </div>
  );
}
