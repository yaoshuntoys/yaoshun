import type {Metadata} from "next";
import "@/styles/pages/about.css";
import type {ReactNode} from "react";
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
} from "lucide-react";
import Image from "@/components/media/smart-image";
import Link from "next/link";

import {AboutCertificateGallery} from "@/components/sections/about-certificate-gallery";
import {StructuredData} from "@/components/seo/structured-data";
import {siteCopy} from "@/components/layout/site-shell.data";
import {aboutContent} from "@/content/site";
import {buildPageMetadata} from "@/lib/metadata";
import {getLocaleFromParams, t} from "@/lib/i18n";
import {contactFormPath} from "@/lib/routes";
import {toAbsoluteUrl} from "@/lib/site-config";
import {aboutCertificateCopy, certificateItems, factoryItems} from "@/content/pages/about";

const heroFactItems = [
  {
    value: {en: "2016", zh: "2016"},
    label: {en: "Founded", zh: "公司成立"},
    icon: Building2,
  },
  {
    value: {en: "OEM/ODM", zh: "OEM/ODM"},
    label: {en: "Custom Development", zh: "定制开发"},
    icon: Boxes,
  },
  {
    value: {en: "±0.01mm", zh: "±0.01mm"},
    label: {en: "Tooling Precision", zh: "模具精度"},
    icon: SlidersHorizontal,
  },
  {
    value: {en: "RoHS / REACH", zh: "RoHS / REACH"},
    label: {en: "Eco Compliance", zh: "环保合规"},
    icon: Leaf,
  },
] as const;

const advantageItems = [
  {
    icon: Lightbulb,
    title: {en: "Integrated R&D And Tooling", zh: "研发与模具一体化"},
    text: {
      en: "Our engineering team supports CAD/UG-based mold design, drawing-based or sample-based development, structural refinement, and sample optimization for educational toys and precision plastic components.",
      zh: "工程团队可基于 CAD/UG 完成模具设计、来图来样开发、结构优化与样品改良，服务益智玩具及精密塑胶件项目。",
    },
  },
  {
    icon: Factory,
    title: {en: "Full-Chain Manufacturing", zh: "全链路制造能力"},
    text: {
      en: "The factory integrates extrusion, injection molding, quality inspection, finished assembly, and export handoff in one coordinated workflow.",
      zh: "工厂将挤出成型、注塑加工、品控检测、成品组装与出口交付整合在同一协同流程中。",
    },
  },
  {
    icon: Boxes,
    title: {en: "Custom Plastic Product Coverage", zh: "塑胶制品定制覆盖面"},
    text: {
      en: "We support educational toys, interlocking toy accessories, precision molded parts, PVC/PU/ABS/PC/nylon tubing, and custom plastic profiles.",
      zh: "可支持益智玩具、拼插玩具配件、高精密注塑件、PVC/PU/ABS/PC/尼龙管材及各类塑胶异型材定制。",
    },
  },
  {
    icon: HeartHandshake,
    title: {en: "Flexible OEM/ODM Cooperation", zh: "灵活的 OEM/ODM 协作"},
    text: {
      en: "From small-batch trial orders to large-volume production, we adapt tooling, materials, packaging, and schedules to real customer programs.",
      zh: "从小批量试单到大批量订单，我们都可按项目需求灵活调整模具、材料、包装与交付节奏。",
    },
  },
  {
    icon: Leaf,
    title: {en: "Eco-Compliant Materials", zh: "环保合规材料"},
    text: {
      en: "Materials are planned around RoHS, REACH, EN71, and ASTM F963 expectations while avoiding phthalates, heavy metals, and other restricted substances.",
      zh: "材料方案围绕 RoHS、REACH、EN71、ASTM F963 等要求进行规划，避免邻苯二甲酸盐、重金属等受限物质。",
    },
  },
  {
    icon: SlidersHorizontal,
    title: {en: "Process Accuracy And Validation", zh: "工艺精度与验证能力"},
    text: {
      en: "Tooling precision can reach +/-0.01 mm, supported by tensile, climate simulation, drop, durability, and dimensional checks before shipment.",
      zh: "模具加工精度可达 +/-0.01 mm，并通过拉力、环境模拟、跌落、耐用性与尺寸检测确保出货稳定性。",
    },
  },
  {
    icon: ShieldCheck,
    title: {en: "Strict Quality Assurance", zh: "严格质量保障"},
    text: {
      en: "Raw material inspection, in-process sampling, automated inspection, lab verification, final outgoing checks, and third-party report coordination are built into every order workflow.",
      zh: "从原料检验、过程抽检、自动化检测、实验室验证到出厂终检与第三方检测协同，每一笔订单都纳入完整质控流程。",
    },
  },
  {
    icon: BadgeDollarSign,
    title: {en: "Multi-Industry Delivery Experience", zh: "多行业交付经验"},
    text: {
      en: "Beyond toys, our plastic manufacturing workflow also supports industrial, medical, food-contact, and lighting-related applications when projects require it.",
      zh: "除玩具外，我们的塑胶制造体系也可为工业、医疗、食品接触及灯饰等项目提供配套支持。",
    },
  },
] as const;

const serviceHighlights = [
  {
    icon: Lightbulb,
    title: {en: "Educational Toy Development", zh: "益智玩具开发"},
    text: {
      en: "Support concept review, structural refinement, and play-pattern optimization for STEM and interlocking toy programs.",
      zh: "支持 STEM 与拼插玩具项目的方案评估、结构优化与玩法细化。",
    },
  },
  {
    icon: Boxes,
    title: {en: "Precision Injection Molding", zh: "高精密注塑件"},
    text: {
      en: "Produce toy accessories, structural parts, and custom molded components with stable dimensional control.",
      zh: "稳定生产玩具配件、结构件及各类定制注塑件，并保障尺寸一致性。",
    },
  },
  {
    icon: Factory,
    title: {en: "Custom Tubing & Profiles", zh: "定制管材与异型材"},
    text: {
      en: "Support PVC, PU, ABS, PC, PE, and nylon tubing or profile development with flexible size and hardness options.",
      zh: "支持 PVC、PU、ABS、PC、PE、尼龙等管材及型材开发，并可灵活调整规格、颜色与硬度。",
    },
  },
  {
    icon: HeartHandshake,
    title: {en: "Mold Design & Sampling", zh: "模具设计与打样"},
    text: {
      en: "Shorten the path from drawing or sample to pilot validation with in-house tooling coordination.",
      zh: "通过内部模具协同能力，缩短从来图来样到试产验证的推进周期。",
    },
  },
  {
    icon: Leaf,
    title: {en: "Compliance & Testing", zh: "合规与测试支持"},
    text: {
      en: "Coordinate reports, lab checks, and market-entry requirements for toy and plastic product export programs.",
      zh: "配合玩具及塑胶制品出口项目完成检测资料、实验室验证与市场准入要求对接。",
    },
  },
  {
    icon: HandCoins,
    title: {en: "Fast Business Response", zh: "快速商务响应"},
    text: {
      en: "Multilingual trade support targets replies within 24 hours and keeps quotation progress visible.",
      zh: "多语种外贸团队力争 24 小时内响应，并让报价与项目推进更透明。",
    },
  },
] as const;

const compactServiceHighlights = [serviceHighlights[0], serviceHighlights[3], serviceHighlights[4], serviceHighlights[5]] as const;

const cultureItems = [
  {
    icon: Star,
    title: {en: "Mission", zh: "企业使命"},
    text: {
      en: "Create safe and reliable plastic product value for global customers, making every delivery worthy of trust.",
      zh: "用专业工艺为全球客户创造安全、可靠的塑胶产品价值，让每一份交付都值得信赖。",
    },
  },
  {
    icon: HeartHandshake,
    title: {en: "Vision", zh: "企业愿景"},
    text: {
      en: "Become a benchmark manufacturer for plastic tubing and toy accessories, building a trusted Yaoshun quality label.",
      zh: "成为塑胶管材与玩具配件领域的标杆型制造企业，打造值得信赖的“尧顺制造”品质名片。",
    },
  },
  {
    icon: ShieldCheck,
    title: {en: "Core Values", zh: "核心价值观"},
    text: {
      en: "Quality first, customer focus, innovation, integrity, compliance, and collaborative growth.",
      zh: "坚持品质为本、客户至上、创新驱动、诚信合规与协作共赢。",
    },
  },
  {
    icon: UserRound,
    title: {en: "Team Culture", zh: "团队文化"},
    text: {
      en: "Craftsmanship, continuous learning, human care, and strong ownership shape our daily execution style.",
      zh: "以匠人精神、持续学习、人文关怀与责任担当，构成团队日常执行方式。",
    },
  },
] as const;

const milestoneItems = [
  {
    year: "2016",
    title: {en: "Company Founded", zh: "公司成立"},
    text: {
      en: "Yaoshun started from plastic tubing extrusion and established its core processing foundation in Dongguan.",
      zh: "尧顺在东莞成立，以塑胶管材挤出业务为起点，奠定核心工艺基础。",
    },
  },
  {
    year: "2018",
    title: {en: "Injection Business Expanded", zh: "注塑业务拓展"},
    text: {
      en: "High-precision injection equipment was introduced to extend into toy accessories and interlocking toy programs.",
      zh: "引入高精度注塑设备，拓展至玩具配件与拼插玩具项目。",
    },
  },
  {
    year: "2020",
    title: {en: "Clean Production Upgraded", zh: "洁净产线升级"},
    text: {
      en: "Production capacity and cleanliness were upgraded to support higher-standard tubing and plastic product projects.",
      zh: "升级产能与洁净生产条件，支持更高标准的管材与塑胶制品项目。",
    },
  },
  {
    year: "2021",
    title: {en: "In-House Tooling Team Built", zh: "自有模具团队建立"},
    text: {
      en: "Independent tooling design shortened sample lead times and improved custom project responsiveness.",
      zh: "建立自有模具设计团队，缩短打样周期并提升定制项目响应效率。",
    },
  },
  {
    year: "2022",
    title: {en: "RoHS / REACH Compliance Improved", zh: "RoHS / REACH 合规完善"},
    text: {
      en: "Environmental compliance capabilities were strengthened for European and North American market access.",
      zh: "进一步完善环保合规能力，为欧洲和北美市场准入打下基础。",
    },
  },
  {
    year: "2023",
    title: {en: "Canton Fair And Global Expansion", zh: "广交会与全球市场拓展"},
    text: {
      en: "The company expanded international buyer outreach through trade-show participation and deeper coordination with overseas sourcing programs.",
      zh: "公司通过展会参与和更深入的海外采购项目协同，进一步扩大国际客户触达与市场拓展。",
    },
  },
  {
    year: "2024",
    title: {en: "Automation And QC Expanded", zh: "自动化与质控提升"},
    text: {
      en: "Facilities and automatic inspection tools were upgraded to support more stable batch delivery.",
      zh: "完成厂房与自动化检测设备升级，提升批量交付的稳定性与一致性。",
    },
  },
] as const;

const shippingItems = [
  {
    icon: Truck,
    label: {en: "Europe", zh: "欧洲市场"},
    text: {
      en: "Support buyer programs across Germany, the United Kingdom, France, Spain, and Italy.",
      zh: "稳定服务德国、英国、法国、西班牙、意大利等欧洲客户项目。",
    },
  },
  {
    icon: Plane,
    label: {en: "North America & Central America", zh: "北美与中美洲市场"},
    text: {
      en: "Coordinate delivery and compliance support for the United States, Canada, and Central America, where about 25% of shipments are delivered.",
      zh: "面向美国、加拿大及中美洲市场提供交付与合规资料协同，其中约 25% 的产品销往中美洲。",
    },
  },
  {
    icon: PackageCheck,
    label: {en: "Asia", zh: "亚洲市场"},
    text: {
      en: "Ongoing projects extend to Japan, South Korea, and Southeast Asia.",
      zh: "项目持续覆盖日本、韩国及多个东南亚国家。",
    },
  },
  {
    icon: Globe,
    label: {en: "Oceania", zh: "大洋洲市场"},
    text: {
      en: "Australia and New Zealand remain part of our regular export coverage.",
      zh: "澳大利亚与新西兰也在常规出口服务范围内。",
    },
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
        <text x="60" y="26" textAnchor="middle" fill="#FFFFFF" fontFamily="Arial, Helvetica, sans-serif" fontSize="20" fontWeight="700">
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
        <path d="M22 10h12c7 0 12 3.4 12 9.5 0 5.4-4.2 8.8-10.8 8.8h-5.5V34H22V10Zm8 6v7h3.8c2.8 0 4.5-1.1 4.5-3.6S36.6 16 33.8 16H30Z" fill="#123F8D" />
        <path d="M51 10h7v24h-7V10Zm15 0h8c9 0 15 4.8 15 12s-6 12-15 12h-8V10Zm7 5.2v13.6h1.2c4.4 0 7.4-2.2 7.4-6.8s-3-6.8-7.4-6.8H73Z" fill="#179BD7" />
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
        <path d="M54 11.5c2.6 1.9 4.3 4.9 4.3 8.5s-1.7 6.6-4.3 8.5c-2.6-1.9-4.3-4.9-4.3-8.5s1.7-6.6 4.3-8.5Z" fill="#F06D24" />
        <text x="84" y="23" textAnchor="middle" fill="#213B80" fontFamily="Arial, Helvetica, sans-serif" fontSize="8.5" fontWeight="700">
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
        <text x="50" y="23.5" textAnchor="middle" fill="#212121" fontFamily="Arial, Helvetica, sans-serif" fontSize="14" fontWeight="700">
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
        <text x="60" y="21" textAnchor="middle" fill="#111111" fontFamily="Arial, Helvetica, sans-serif" fontSize="11" fontWeight="900">
          WESTERN UNION
        </text>
        <text x="60" y="29" textAnchor="middle" fill="#111111" fontFamily="Arial, Helvetica, sans-serif" fontSize="4.2" fontWeight="700" letterSpacing="1">
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
        <path d="M60 5c9.5 0 19 2.2 26 6v8.3c0 8.8-7.7 14.7-26 22.2-18.3-7.5-26-13.4-26-22.2V11c7-3.8 16.5-6 26-6Z" fill="#5B3317" />
        <path d="M60 10c6.8 0 13.8 1.4 19 4v5.8c0 6.4-5.4 10.8-19 16.5-13.6-5.7-19-10.1-19-16.5V14c5.2-2.6 12.2-4 19-4Z" fill="#F5BE27" />
        <text x="60" y="24" textAnchor="middle" fill="#3D250F" fontFamily="Arial, Helvetica, sans-serif" fontSize="12" fontWeight="900">
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
        <text x="34" y="25" fill="#4D148C" fontFamily="Arial, Helvetica, sans-serif" fontSize="20" fontWeight="700">
          Fed
        </text>
        <text x="74" y="25" fill="#FF6600" fontFamily="Arial, Helvetica, sans-serif" fontSize="20" fontWeight="700">
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
        <text x="60" y="26" textAnchor="middle" fill="#D51920" fontFamily="Arial, Helvetica, sans-serif" fontSize="18" fontStyle="italic" fontWeight="900">
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
        <text x="32" y="24" textAnchor="middle" fill="#FFFFFF" fontFamily="Arial, Helvetica, sans-serif" fontSize="13" fontWeight="900">
          T
        </text>
        <text x="60" y="24" textAnchor="middle" fill="#FFFFFF" fontFamily="Arial, Helvetica, sans-serif" fontSize="13" fontWeight="900">
          N
        </text>
        <text x="88" y="24" textAnchor="middle" fill="#FFFFFF" fontFamily="Arial, Helvetica, sans-serif" fontSize="13" fontWeight="900">
          T
        </text>
      </svg>
    ),
  },
];

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const locale = await getLocaleFromParams(params);
  return buildPageMetadata(locale, aboutContent.seo, "about");
}

function copy(locale: "en" | "zh") {
  return {
    heroEyebrow: t(locale, {en: "About Us", zh: "关于我们"}),
    heroTitleLine1: t(locale, {
      en: "Focused Educational Toy",
      zh: "专注益智玩具研发与制造",
    }),
    heroTitleLine2: t(locale, {
      en: "R&D And Manufacturing",
      zh: "让创意点亮未来",
    }),
    heroText: t(locale, {
      en: "Founded in 2016, Dongguan Yaoshun Technology Co., Ltd. combines design, tooling, production, quality control, and export coordination to deliver safe, durable educational toys, interlocking toy programs, and custom plastic products for global OEM/ODM buyers.",
      zh: "东莞市尧顺科技有限公司成立于 2016 年，集设计、开模、生产、质控与出口协同于一体，持续为全球客户提供安全耐用的益智玩具、拼插玩具项目与定制塑料制品解决方案。",
    }),
    intro: t(locale, {
      en: "Founded on August 26, 2016 with registered capital of RMB 3 million, Dongguan Yaoshun Technology Co., Ltd. is a full-chain manufacturer integrating mold development, plastic extrusion, precision injection molding, quality inspection, finished assembly, and export delivery. We focus on educational toys, interlocking plastic toys, custom tubing, profiles, precision molded parts, and selected AI toy plastic electronic products for global OEM/ODM buyers.",
      zh: "东莞市尧顺科技有限公司成立于 2016 年 8 月 26 日，注册资本 300 万元，是一家集模具开发、塑胶挤出、精密注塑、品质检测、成品组装与出口交付于一体的全链路制造企业。公司聚焦益智玩具、拼插类塑胶玩具、定制管材型材、高精密注塑件以及部分 AI 玩具塑胶电子产品，为全球 OEM/ODM 客户提供一站式支持。",
    }),
    companyTitle: t(locale, {en: "Dongguan Yaoshun Technology Co., Ltd.", zh: "东莞市尧顺科技有限公司"}),
    learnMore: t(locale, {en: "Learn More", zh: "了解更多"}),
    contactUs: t(locale, {en: "Contact Us", zh: "联系我们"}),
    certificate: t(locale, {en: "Certificates & Compliance", zh: "资质证书"}),
    certificateEyebrow: t(locale, {en: "Compliance", zh: "合规资料"}),
    factory: t(locale, {en: "Our Factory", zh: "我们的工厂"}),
    factoryEyebrow: t(locale, {en: "Manufacturing", zh: "生产制造"}),
    advantages: t(locale, {en: "Our Advantages", zh: "我们的优势"}),
    advantagesEyebrow: t(locale, {en: "Why Choose Us", zh: "核心优势"}),
    advantagesText: t(locale, {
      en: "Our competitive edge comes from combining toy-focused product development with in-house tooling, extrusion, injection, compliance, automated inspection, and delivery execution in one factory system.",
      zh: "我们的优势在于把玩具研发与自有模具、挤出、注塑、合规、自动化检测和交付能力整合到同一工厂体系中，形成更稳定的项目执行力。",
    }),
    oneStop: t(locale, {en: "Core Services", zh: "核心服务"}),
    serviceEyebrow: t(locale, {en: "Capabilities", zh: "能力模块"}),
    shipping: t(locale, {en: "History & Milestones", zh: "发展历程与里程碑"}),
    shippingEyebrow: t(locale, {en: "Growth", zh: "成长路径"}),
    paymentDelivery: t(locale, {en: "Global Reach & Trade Support", zh: "全球市场与贸易支持"}),
    paymentEyebrow: t(locale, {en: "Markets", zh: "市场覆盖"}),
    paymentMethods: t(locale, {en: "Payment Methods", zh: "支付方式"}),
    deliveryMethods: t(locale, {en: "Delivery Methods", zh: "配送方式"}),
    cultureTitle: t(locale, {en: "Corporate Culture", zh: "企业文化"}),
    cultureEyebrow: t(locale, {en: "Culture", zh: "文化理念"}),
    viewCertificate: t(locale, {en: "View certificate", zh: "查看证书"}),
    closePreview: t(locale, {en: "Close preview", zh: "关闭预览"}),
    factoryText: t(locale, {
      en: "Our production system covers extrusion lines, injection molding capacity, clean processing areas, assembly stations, and inspection checkpoints for both toys and plastic support products.",
      zh: "生产体系覆盖挤出产线、注塑设备、洁净生产区域、组装工位与检测节点，可同时支撑玩具及塑胶配套产品的稳定交付。",
    }),
    serviceText: t(locale, {
      en: "From concept or sample to validated production, reports, and shipment, key tasks stay inside one connected execution chain.",
      zh: "从概念或样品到验证量产、检测资料与正式出货，关键节点都在同一执行链路中推进。",
    }),
    shippingText: t(locale, {
      en: "Key milestones show how the company expanded from tubing extrusion into mold development, precision injection, and international compliance support.",
      zh: "发展节点展示了公司如何从管材挤出逐步扩展到模具研发、精密注塑与国际合规配套能力。",
    }),
    paymentText: t(locale, {
      en: "Multilingual trade support covers core export regions with flexible payment, document, and shipping coordination for OEM/ODM orders.",
      zh: "多语种外贸团队覆盖核心出口市场，并为 OEM/ODM 订单提供灵活的付款、资料和运输协同。",
    }),
    closingTitle: t(locale, {en: "Build With A Reliable OEM/ODM Factory Team", zh: "与可靠的 OEM/ODM 工厂团队协同合作"}),
    closingText: t(locale, {
      en: "Whether you are building an educational toy line, custom plastic component, tubing project, or export-ready OEM program, Yaoshun is ready to support your project with practical engineering, disciplined quality control, and responsive delivery.",
      zh: "无论你正在推进益智玩具、自定义塑胶部件、管材项目，还是面向出口的 OEM 项目，尧顺都可以通过务实工程能力、严格质控流程和稳定交付节奏为你提供支持。",
    }),
  };
}

export default async function AboutPage({params}: {params: Promise<{locale: string}>}) {
  const locale = await getLocaleFromParams(params);
  const text = copy(locale);
  const pageUrl = toAbsoluteUrl(`/${locale}/about`);
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
        "@type": "Organization",
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
          locale === "zh" ? "益智玩具研发制造" : "Educational toy development and manufacturing",
          locale === "zh" ? "积木拼装玩具定制" : "Interlocking building toy customization",
          locale === "zh" ? "精密注塑件生产" : "Precision injection molded components",
          locale === "zh" ? "塑胶管材与异型材开发" : "Plastic tubing and profile development",
          locale === "zh" ? "OEM/ODM 一站式交付" : "OEM/ODM project delivery",
        ],
      },
    },
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
              <span>{text.heroTitleLine2}</span>
            </h1>
            <p className="about-hero-text">{text.heroText}</p>
            <Link
              className="about-primary-cta"
              data-track-destination="#about-advantages"
              data-track-event="cta_click"
              data-track-label="learn_more"
              data-track-location="about_hero"
              href="#about-advantages"
            >
              <span>{text.learnMore}</span>
              <ArrowRight size={16} strokeWidth={2.15} />
            </Link>
          </div>
        </div>

        <div className="about-hero-metrics-anchor">
          <section className="about-metrics">
            {heroFactItems.map((item) => {
              const Icon = item.icon;
              return (
                <article className="about-metric" key={item.value.en + item.label.en}>
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

      <section className="about-factory">
        <div className="about-section-heading">
          <p className="about-section-eyebrow">{text.factoryEyebrow}</p>
          <h2>{text.factory}</h2>
        </div>
        <p className="about-section-copy">{text.factoryText}</p>
        <div className="about-factory-grid">
          {factoryItems.map((item) => (
            <article className="about-factory-card" key={item.title.en}>
              <div className="about-factory-image-wrap">
                <Image
                  alt={item.title[locale]}
                  className="about-factory-image"
                  fill
                  sizes="(min-width: 1024px) 26vw, (min-width: 768px) 42vw, 100vw"
                  src={item.image}
                  unoptimized={item.image.startsWith("http")}
                />
              </div>
              <div className="about-factory-label">{item.title[locale]}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="about-certificate" id="about-certificate">
        <div className="about-certificate-copy">
          <div className="about-section-heading">
            <p className="about-section-eyebrow">{text.certificateEyebrow}</p>
            <h2>{text.certificate}</h2>
          </div>
          <p>{t(locale, aboutCertificateCopy.description)}</p>
        </div>

        <AboutCertificateGallery
          closeLabel={text.closePreview}
          dialogLabel={text.viewCertificate}
          items={certificateItems}
        />
      </section>

      <section className="about-advantages">
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

      <section className="about-bottom-grid">
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

        <article className="about-info-card">
          <div className="about-section-heading">
            <p className="about-section-eyebrow">{text.paymentEyebrow}</p>
            <h2>{text.paymentDelivery}</h2>
          </div>
          <p className="about-card-copy">{text.paymentText}</p>
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
                  <p>{t(locale, item.text)}</p>
                </div>
              );
            })}
          </div>
          <div className="about-payment-delivery-grid">
            <div className="about-payment-group">
              <h3>{text.paymentMethods}</h3>
              <div className="about-payment-chip-list">
                {paymentMethods.map((item) => (
                  <span className="about-payment-chip" key={item.key}>
                    {item.label}
                  </span>
                ))}
              </div>
            </div>
            <div className="about-payment-group">
              <h3>{text.deliveryMethods}</h3>
              <div className="about-payment-chip-list">
                {deliveryMethods.map((item) => (
                  <span className="about-payment-chip" key={item.key}>
                    {item.label}
                  </span>
                ))}
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
              zh: "企业文化把品质、客户导向、创新和责任，真正落实到日常制造与项目执行细节中。",
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
