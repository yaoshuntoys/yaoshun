import type { Metadata } from "next";
import "@/styles/pages/solutions.css";
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  CircleDotDashed,
  ClipboardCheck,
  Factory,
  FlaskConical,
  Globe2,
  PackageCheck,
  PencilRuler,
  Settings2,
  ShieldCheck,
  Sparkles,
  TimerReset,
  Wrench,
} from "lucide-react";
import Image from "@/components/media/smart-image";
import Link from "next/link";

import { StructuredData } from "@/components/seo/structured-data";
import { SolutionsCapabilityCarousel } from "@/components/solutions/solutions-capability-carousel";
import { SolutionsEquipmentList } from "@/components/solutions/solutions-equipment-list";
import { siteCopy } from "@/components/layout/site-shell.data";
import { solutionsContent } from "@/content/site";
import { buildPageMetadata } from "@/lib/metadata";
import { getLocaleFromParams, t, type Locale } from "@/lib/i18n";
import { contactFormPath, localizedPath } from "@/lib/routes";
import { toAbsoluteUrl } from "@/lib/site-config";
import {
  solutionsEquipmentImages,
  solutionsPageImages,
  solutionsWorkshopImages,
} from "@/content/pages/solutions";

type Localized = {
  en: string;
  zh: string;
};

const proofCards = [
  {
    icon: CircleDotDashed,
    value: { en: "Since 2016", zh: "16+ 年" },
    label: { en: "Toy & plastic manufacturing", zh: "玩具与塑胶制造" },
  },
  {
    icon: TimerReset,
    value: { en: "Rapid Sampling", zh: "快速打样" },
    label: { en: "Typical lead-time planning", zh: "常规交期参考" },
  },
  {
    icon: Boxes,
    value: { en: "One-stop", zh: "一站式" },
    label: { en: "Project workflow", zh: "项目协作流程" },
  },
  {
    icon: ShieldCheck,
    value: { en: "Global-ready", zh: "全球安全" },
    label: { en: "Reports and delivery support", zh: "检测与交付支持" },
  },
] as const;

const capabilityTabs = [
  {
    label: { en: "Injection Molding", zh: "注塑成型" },
    meta: { en: "Trial and repeat molding", zh: "试模与复产成型" },
  },
  {
    label: { en: "Extrusion Workshop", zh: "挤出车间" },
    meta: { en: "Profile and tube production", zh: "管材与型材生产" },
  },
  {
    label: { en: "PCBA Custom Service", zh: "PCBA定制服务" },
    meta: { en: "Board assembly and testing", zh: "板卡组装与测试" },
  },
  {
    label: { en: "Assembly / Packaging Test", zh: "组/包装测试" },
    meta: { en: "Assembly and delivery check", zh: "组装包装与交付复核" },
  },
  {
    label: { en: "Mold Making", zh: "模具制作" },
    meta: { en: "Steel and tooling intake", zh: "钢料与开模准备" },
  },
  {
    label: { en: "Extrusion Equipment", zh: "挤出设备" },
    meta: { en: "Line equipment control", zh: "产线设备控制" },
  },
] as const;

const capabilityCards = [
  {
    icon: FlaskConical,
    image: solutionsEquipmentImages.hwaChin210se,
    title: { en: "Injection Molding Production", zh: "注塑成型与复产验证" },
    text: {
      en: "Hwa Chin, Haitian, and Victor Taichung horizontal injection machines turn approved tooling into repeatable toy parts.",
      zh: "华钦、海天、台中精机等卧式注塑机承接试模与复产，把通过验证的模具转化为稳定塑件。",
    },
    bullets: [
      { en: "125SE to 220T machine coverage", zh: "125SE 至 220T 机台覆盖" },
      { en: "Automatic take-out support", zh: "自动取件辅机配合" },
      { en: "Trial molding parameter tuning", zh: "试模参数验证" },
      { en: "Repeatable plastic-part output", zh: "塑件稳定复产" },
    ],
  },
  {
    icon: Factory,
    image: solutionsEquipmentImages.extrusionWorkshopOverview,
    title: { en: "Extrusion Workshop For Tubes And Profiles", zh: "挤出车间管材与型材生产" },
    text: {
      en: "The workshop overview shows extrusion lines, control stations, cooling sections, and line-side turnover areas for steady plastic tube and profile production.",
      zh: "车间总览展示挤出产线、控制工位、冷却段和线边周转区，支撑塑胶管材与异型材稳定生产。",
    },
    bullets: [
      { en: "Plastic tube and profile extrusion", zh: "塑胶管材与异型材挤出" },
      { en: "Line-side cooling and haul-off", zh: "线边冷却与牵引衔接" },
      { en: "Workshop turnover arrangement", zh: "车间周转动线安排" },
      { en: "Batch production preparation", zh: "批量生产前置准备" },
    ],
  },
  {
    icon: Settings2,
    image: solutionsEquipmentImages.pcbaServiceBoard,
    title: { en: "PCBA Custom Service For Electronic Products", zh: "电子产品 PCBA 定制服务" },
    text: {
      en: "The full board image shows mounted chips, interface connectors, power areas, and test points for PCBA assembly, programming, and functional review.",
      zh: "完整板卡图展示芯片、接口端子、电源区域和测试点，可支持 PCBA 贴装、程序烧录与功能复核。",
    },
    bullets: [
      { en: "SMT component assembly support", zh: "SMT 元件贴装支持" },
      { en: "Connector and interface review", zh: "连接器与接口复核" },
      { en: "Program flashing and function test", zh: "程序烧录与功能测试" },
      { en: "Anti-static delivery preparation", zh: "防静电交付准备" },
    ],
  },
  {
    icon: PackageCheck,
    image: solutionsWorkshopImages.overview,
    title: { en: "Assembly, Packaging And Testing Workflow", zh: "组装、包装与测试流程" },
    text: {
      en: "The plastic-electronics workshop view shows organized workstations for assembly, checking, packaging preparation, and shipment-ready review.",
      zh: "塑胶电子车间图展示整齐工位，可承接产品组装、过程检查、包装准备和出货前复核。",
    },
    bullets: [
      { en: "Product assembly workstation", zh: "产品组装工位" },
      { en: "Function and appearance checks", zh: "功能与外观检查" },
      { en: "Packaging preparation and sorting", zh: "包装准备与分拣" },
      { en: "Shipment-ready review", zh: "出货前复核" },
    ],
  },
  {
    icon: Factory,
    image: solutionsEquipmentImages.moldWorkshop,
    title: { en: "In-House Mold Making Workflow", zh: "自有模具制作动线" },
    text: {
      en: "The tooling shop brings turning, milling, drilling, wire cutting, and EDM preparation into one visible workflow.",
      zh: "模具车间集中车、铣、钻、线切割与电火花准备，形成从钢料到试模前的自有加工动线。",
    },
    bullets: [
      { en: "Tooling schedule coordination", zh: "模具加工排程协同" },
      { en: "Steel preparation and fixture setup", zh: "钢料准备与工装定位" },
      { en: "Multiple machining stations", zh: "多工位加工衔接" },
      { en: "Trial-molding readiness", zh: "面向试模交付准备" },
    ],
  },
  {
    icon: Wrench,
    image: solutionsEquipmentImages.extrusionEquipmentDisplay,
    title: { en: "Extrusion Equipment And Line Control", zh: "挤出设备与产线控制" },
    text: {
      en: "The equipment image shows a complete extrusion line with control panels, drive sections, forming areas, and downstream handling equipment in a bright workshop.",
      zh: "设备图展示完整挤出产线，包含控制面板、驱动段、成型区域和后段辅助设备，适合说明挤出设备配置能力。",
    },
    bullets: [
      { en: "Multi-zone equipment control", zh: "多区段设备控制" },
      { en: "Extrusion forming and output", zh: "挤出成型与出料" },
      { en: "Line setup and process tuning", zh: "产线调试与工艺调整" },
      { en: "Workshop-scale equipment layout", zh: "车间级设备布局" },
    ],
  },
] as const;

const coreFocusCards = [
  {
    icon: Factory,
    image: solutionsPageImages.education,
    title: { en: "STEM Toy R&D", zh: "STEM 益智玩具研发" },
    text: {
      en: "Focused on educational toys and building block assembly programs.",
      zh: "聚焦益智玩具与积木拼装产品，支持结构研发与生产导入。",
    },
    points: [
      { en: "Educational toy development", zh: "益智玩具开发" },
      { en: "In-house tooling support", zh: "自有模具协同" },
      { en: "Drawing or sample based", zh: "来图来样开发" },
    ],
  },
  {
    icon: Boxes,
    image: solutionsPageImages.retail,
    title: { en: "Interlocking & DIY Toys", zh: "拼接玩具与 DIY 定制" },
    text: {
      en: "Custom interlocking sets, themed structures, and hands-on play products.",
      zh: "支持拼接玩具、主题套装与 DIY 玩法产品定制。",
    },
    points: [
      { en: "Custom shapes and themes", zh: "造型与主题定制" },
      { en: "Hands-on DIY creativity", zh: "强调动手创造体验" },
      { en: "Trial to repeat orders", zh: "试单到复产" },
    ],
  },
  {
    icon: FlaskConical,
    image: solutionsPageImages.events,
    title: {
      en: "Custom Plastic Products, Tubing & Smart Housings",
      zh: "塑料制品、管材与塑胶电子外壳定制",
    },
    text: {
      en: "Beyond toy sets, we also support PVC/PU/ABS/PC/nylon tubing, custom profiles, plastic structural parts, and selected AI toy plastic electronic housings when the project requires coordinated manufacturing.",
      zh: "除玩具套装外，我们也支持 PVC/PU/ABS/PC/尼龙管材、塑胶异型材、塑料结构件以及部分 AI 玩具塑胶电子外壳定制，满足项目化协同生产需求。",
    },
    points: [
      {
        en: "Plastic structural components and accessory parts",
        zh: "塑料结构件与配套辅件",
      },
      {
        en: "PVC, PU, ABS, PC, and nylon material routes",
        zh: "PVC、PU、ABS、PC 与尼龙材料方案",
      },
      { en: "Packaging-ready product combinations", zh: "可直接进入包装组合" },
    ],
  },
  {
    icon: ShieldCheck,
    image: solutionsPageImages.oem,
    title: {
      en: "Eco-Safe Materials With Strict QC",
      zh: "环保材料与严格质量控制",
    },
    text: {
      en: "We prioritize eco-friendly, non-toxic material routes and use raw-material checks, in-process control, automated inspection, and final review to keep products safe, durable, and shipment-ready.",
      zh: "我们优先采用环保无毒材料方案，并通过原料确认、过程管控、自动化检测和终检复核，确保产品安全、耐用、适合稳定出货。",
    },
    points: [
      {
        en: "Durable and non-toxic material options",
        zh: "耐用且环保无毒的材料选择",
      },
      {
        en: "Automated inspection and traceable QC",
        zh: "自动化检测与可追溯质控",
      },
      {
        en: "Third-party reports and market-entry files",
        zh: "第三方检测与市场准入资料",
      },
    ],
  },
] as const;

const equipmentTabs = [
  { id: "all", label: { en: "All", zh: "全部设备" } },
  { id: "tooling", label: { en: "Mold Machining Workshop", zh: "模具加工车间" } },
  { id: "extrusion", label: { en: "Extrusion Workshop", zh: "挤出车间" } },
  { id: "injection", label: { en: "Injection Production", zh: "注塑生产" } },
  { id: "pcba", label: { en: "PCBA Service", zh: "PCBA 服务" } },
] as const;

const equipmentCards = [
  {
    category: "pcba",
    image: solutionsEquipmentImages.pcbaServiceBoard,
    title: { en: "Video Communication PCBA Programming And Testing", zh: "视频通讯板程序烧录与功能测试" },
    text: {
      en: "Supports video communication board program flashing, functional testing, connector review, inspection checkpoints, and anti-static packaging before delivery.",
      zh: "支持视频通讯板程序烧录、功能测试、接口复核、检测点确认，并在出货前配合防静电包装。",
    },
  },
  {
    category: "pcba",
    image: solutionsEquipmentImages.pcbaServiceAngle,
    title: { en: "12-Layer 2.0 mm PCB Assembly", zh: "12层 2.0mm PCB 板组装" },
    text: {
      en: "The angled board view shows a 12-layer PCB with 2.0 mm board thickness, mounted chips, capacitors, connectors, and functional module areas.",
      zh: "斜角板卡图展示 12层 PCB、2.0mm 板厚、芯片、电容、连接器和功能模块区域。",
    },
  },
  {
    category: "pcba",
    image: solutionsEquipmentImages.pcbaServiceInterface,
    title: { en: "Double-Sided SMT And Interface Integration", zh: "双面贴片与接口端子集成" },
    text: {
      en: "The interface close-up supports double-sided SMT projects with USB ports, pin headers, sockets, and external connector integration.",
      zh: "接口与排针区域特写，适合双面贴片项目中 USB、排针、插座和外部连接端子的集成确认。",
    },
  },
  {
    category: "pcba",
    image: solutionsEquipmentImages.pcbaServiceSmtDetail,
    title: { en: "0201 SMD And Dense Component Placement", zh: "0201 SMD 与密集元件贴装" },
    text: {
      en: "SMT details cover 0201 SMD placement, more than 15 IC types, over 150 chip component types, soldering quality, and inspection requirements.",
      zh: "SMT 细节覆盖 0201 SMD 贴装、15种以上 IC、150种以上 CHIP 料、焊接品质和检验要求。",
    },
  },
  {
    category: "pcba",
    image: solutionsEquipmentImages.pcbaServiceCircuitDetail,
    title: { en: "0.3 mm BGA Pitch And Circuit Review", zh: "0.3mm BGA 球距与线路复核" },
    text: {
      en: "The circuit close-up supports board-level review for 0.3 mm BGA pitch, 12 BGA packages, dense traces, pads, and product integration.",
      zh: "线路局部图支持 0.3mm BGA 球距、12颗 BGA、密集走线、焊盘和整机集成前的板级复核。",
    },
  },
  {
    category: "tooling",
    image: solutionsEquipmentImages.moldWorkshop,
    title: { en: "Mold Machining Workshop", zh: "模具加工车间" },
    text: {
      en: "A tooling area that gathers turning, drilling, milling, wire-cut, and EDM preparation around mold delivery.",
      zh: "车床、钻床、铣床、线切割与电火花工位集中布置，围绕模具交付节奏形成自有加工动线。",
    },
  },
  {
    category: "tooling",
    image: solutionsEquipmentImages.c6140aLathe,
    title: { en: "C6140A Engine Lathe", zh: "C6140A 普通车床" },
    text: {
      en: "Used for round mold inserts, sleeves, guide pins, end faces, and inner-hole turning before mold assembly.",
      zh: "用于圆形镶件、轴套、导柱类零件的外圆、端面和内孔车削，是模具基础加工工位。",
    },
  },
  {
    category: "tooling",
    image: solutionsEquipmentImages.cn6150bLathe,
    title: { en: "CN6150B Long-Bed Lathe", zh: "CN6150B 长床车床" },
    text: {
      en: "The longer bed supports shaft-like mold components, longer fixtures, and auxiliary parts that need stable turning.",
      zh: "机身行程更长，适合较长轴类、杆件、夹具和模具辅助件的稳定车削加工。",
    },
  },
  {
    category: "tooling",
    image: solutionsEquipmentImages.turretMillDetail1,
    title: { en: "Turret Milling Machine", zh: "炮塔铣床" },
    text: {
      en: "Handles mold plate surfaces, steps, slots, and datum faces so fitting and later drilling stay aligned.",
      zh: "用于模板平面、台阶、槽位和定位面的铣削，为装配和后续钻孔提供加工基准。",
    },
  },
  {
    category: "tooling",
    image: solutionsEquipmentImages.radialDrill,
    title: { en: "Z3035x10 Radial Drilling Machine", zh: "Z3035x10 摇臂钻床" },
    text: {
      en: "Used for mold-base holes, threaded holes, water-line preparation, and flexible positioning on larger workpieces.",
      zh: "用于模架孔位、螺纹孔、冷却水路和较大工件的钻孔定位，摇臂结构便于调整。",
    },
  },
  {
    category: "extrusion",
    image: solutionsEquipmentImages.extrusionWorkshopOverview,
    title: { en: "Extrusion Line Overview", zh: "挤出产线整体布局" },
    text: {
      en: "Multiple extrusion lines, control stations, cooling and haul-off sections are arranged in a clean workshop for steady plastic profile and tube production.",
      zh: "多条挤出线、控制工位、冷却牵引与现场周转区集中布置，支撑塑胶管材和异型材稳定生产。",
    },
  },
  {
    category: "extrusion",
    image: solutionsEquipmentImages.extrusionWorkshopPackagingTurnover,
    title: { en: "Packaging And Turnover Station", zh: "包装与周转工位" },
    text: {
      en: "Finished rolls, cartons, pallets, and blue turnover baskets are handled beside the extrusion lines to connect production, checking, and packing.",
      zh: "卷材、纸箱、托盘与蓝色周转筐靠近产线布置，方便挤出成品整理、复核与包装衔接。",
    },
  },
  {
    category: "extrusion",
    image: solutionsEquipmentImages.extrusionWorkshopRodOutputInspection,
    title: {
      en: "Plastic Rod Output And Inspection",
      zh: "塑胶杆件出料与检验",
    },
    text: {
      en: "White extruded rods are gathered at the line-side table for length sorting, visual checks, and order-ready turnover.",
      zh: "白色挤出杆件在产线旁集中出料，便于长度整理、外观复核和订单周转。",
    },
  },
  {
    category: "injection",
    image: solutionsEquipmentImages.injectionWorkshop,
    title: { en: "Injection Molding Workshop", zh: "注塑生产车间" },
    text: {
      en: "A production line with horizontal injection machines, automatic take-out arms, drying hoppers, and material handling.",
      zh: "多台卧式注塑机搭配自动取件机械手、料斗干燥和供料系统，形成稳定注塑生产线。",
    },
  },
  {
    category: "injection",
    image: solutionsEquipmentImages.hwaChin125se,
    title: { en: "Hwa Chin 125SE Injection Machine", zh: "华钦 125SE 注塑机" },
    text: {
      en: "Suited to small and medium toy parts, connectors, and structural components with automatic take-out support.",
      zh: "适合中小型玩具塑件、连接件和结构件成型，前端配合自动取件提升稳定性。",
    },
  },
  {
    category: "injection",
    image: solutionsEquipmentImages.hwaChin210se,
    title: { en: "Hwa Chin 210SE Injection Machine", zh: "华钦 210SE 注塑机" },
    text: {
      en: "Handles larger or heavier toy parts; the image shows take-out automation and turnover baskets at the machine side.",
      zh: "用于更大尺寸或更高克重的玩具部件，图片中可见自动取件机械手与周转筐。",
    },
  },
  {
    category: "injection",
    image: solutionsEquipmentImages.haitian220t,
    title: { en: "Haitian 220T Injection Machine", zh: "海天 220T 注塑机" },
    text: {
      en: "Supports larger molds and higher clamping requirements for batch production of bigger plastic structures.",
      zh: "承担较大模具和较高锁模需求的塑件成型，适合批量复产与较大结构件。",
    },
  },
  {
    category: "injection",
    image: solutionsEquipmentImages.victorTaichungHorizontal,
    title: {
      en: "Victor Taichung Horizontal Injection Machine",
      zh: "台中精机卧式注塑机",
    },
    text: {
      en: "A horizontal injection cell for stable repeat production and flexible mold changes across toy part sizes.",
      zh: "用于稳定复产和灵活换模，适配不同玩具零件尺寸与材料工艺。",
    },
  },
] as const;

const processSteps = [
  {
    icon: ClipboardCheck,
    step: "01",
    title: { en: "Project Brief And Fast Review", zh: "项目需求与快速评估" },
    text: {
      en: "We clarify target market, toy category, quantity plan, packaging direction, and technical scope first, with most first replies sent within 24 hours.",
      zh: "先确认目标市场、玩具类别、数量计划、包装方向与技术范围。资料完整的询盘通常可在 24 小时内收到初步回复。",
    },
    details: [
      { en: "Target market and product category", zh: "目标市场与产品类别" },
      {
        en: "Quantity plan and delivery expectation",
        zh: "数量计划与交期预期",
      },
      { en: "Packaging and technical boundaries", zh: "包装方向与技术范围" },
    ],
    output: {
      en: "Requirement list and first feasibility reply",
      zh: "需求清单与初步可行性回复",
    },
  },
  {
    icon: PencilRuler,
    step: "02",
    title: {
      en: "Tooling, Structure And Material Design",
      zh: "模具、结构与材料设计",
    },
    text: {
      en: "Drawing-based or sample-based development defines assembly logic, mold route, material selection, component strength, and safety assumptions.",
      zh: "围绕拼装逻辑、开模路径、材料方案、部件强度与安全要求，完成来图来样开发与结构设计。",
    },
    details: [
      { en: "Assembly logic and structure review", zh: "拼装逻辑与结构评估" },
      { en: "Tooling route and material selection", zh: "开模路径与材料选择" },
      { en: "Strength and safety assumptions", zh: "强度与安全要求预判" },
    ],
    output: {
      en: "Practical structure and tooling proposal",
      zh: "结构与开模建议",
    },
  },
  {
    icon: Wrench,
    step: "03",
    title: { en: "Sampling And Trial Validation", zh: "打样与试单验证" },
    text: {
      en: "Samples or small-batch trial orders are used to review fit, appearance, playability, durability, and packaging assumptions before scale-up.",
      zh: "通过样品或小批量试单验证装配匹配、外观、玩法、耐用性与包装假设，再推进后续量产。",
    },
    details: [
      {
        en: "Fit, appearance, and playability check",
        zh: "装配、外观与玩法验证",
      },
      { en: "Durability and material feedback", zh: "耐用性与材料反馈" },
      { en: "Trial order before bulk production", zh: "小批量试单再放量" },
    ],
    output: {
      en: "Approved sample and revision list",
      zh: "确认样品与修订清单",
    },
  },
  {
    icon: BadgeCheck,
    step: "04",
    title: {
      en: "Production And Quality Control",
      zh: "从原料到终检的量产控制",
    },
    text: {
      en: "Production runs through raw material checks, in-process inspection, automated review, assembly control, and final outgoing inspection before shipment.",
      zh: "量产阶段执行原料确认、过程检验、自动化复核、组装控制与出货终检，帮助提升批次稳定性。",
    },
    details: [
      { en: "Raw material and color confirmation", zh: "原料与颜色确认" },
      {
        en: "Process inspection and assembly control",
        zh: "过程检验与组装控制",
      },
      { en: "Final outgoing quality inspection", zh: "出货前终检" },
    ],
    output: {
      en: "Stable batch production and QC record",
      zh: "稳定量产与质检记录",
    },
  },
  {
    icon: PackageCheck,
    step: "05",
    title: {
      en: "Reports, Packaging And Export Handoff",
      zh: "检测资料、包装与出口交接",
    },
    text: {
      en: "We coordinate packing details, third-party reports, buyer filing documents, and export handoff so the order can move forward with less friction.",
      zh: "协同包装细节、第三方检测、客户归档资料与出口交接，让订单推进更顺畅。",
    },
    details: [
      { en: "Packing method and carton details", zh: "包装方式与箱规细节" },
      {
        en: "Third-party reports and filing files",
        zh: "第三方检测与归档资料",
      },
      { en: "Export delivery handoff", zh: "出口交付交接" },
    ],
    output: {
      en: "Shipment-ready files and delivery handoff",
      zh: "可出货资料与交付交接",
    },
  },
] as const;

const processReadinessItems = [
  {
    title: { en: "Demand Freeze", zh: "需求冻结" },
    text: {
      en: "Confirm product scope, target market, quantity rhythm, packaging direction, and cost boundary before tooling or batch scheduling.",
      zh: "确认产品范围、目标市场、数量节奏、包装方向与成本边界，再进入开模或批量排程。",
    },
  },
  {
    title: { en: "Sample Approval", zh: "样品确认" },
    text: {
      en: "Review structure, color, touch, play pattern, assembly fit, and safety risk points against the approved sample.",
      zh: "围绕确认样品核对结构、颜色、手感、玩法、装配匹配与安全风险点。",
    },
  },
  {
    title: { en: "Production Files", zh: "生产资料" },
    text: {
      en: "Prepare BOM, tooling status, material batch notes, inspection standards, packing method, carton specs, and buyer files.",
      zh: "准备 BOM、模具状态、材料批次、检验标准、包装方式、箱规与客户归档资料。",
    },
  },
  {
    title: { en: "Risk Closure", zh: "风险闭环" },
    text: {
      en: "Lock open issues, responsible owners, change records, and go/no-go decisions before releasing bulk production.",
      zh: "量产前锁定未决问题、责任人、变更记录与是否放行生产的判断。",
    },
  },
] as const;

const workshopHighlights = [
  {
    icon: Settings2,
    step: "01",
    title: { en: "SMT Mounting", zh: "SMT贴片" },
    text: {
      en: "Supports circuit-board mounting coordination for plastic electronics projects before functional assembly.",
      zh: "支持塑胶电子项目的线路板贴装衔接，为后续功能件装配做准备。",
    },
  },
  {
    icon: CircleDotDashed,
    step: "02",
    title: { en: "DIP Insertion", zh: "DIP插件" },
    text: {
      en: "Through-hole insertion and line-side handling connect electronic components with stable production flow.",
      zh: "插件作业与现场流转衔接电子元件处理，服务稳定的生产推进。",
    },
  },
  {
    icon: PackageCheck,
    step: "03",
    title: { en: "Product Assembly", zh: "成品组装" },
    text: {
      en: "Plastic housings, electronic parts, and final assembly stations connect sampling, repeat production, and shipment handoff.",
      zh: "塑胶外壳、电子部件与成品组装工位衔接打样、复产和出货交接。",
    },
  },
] as const;

const workshopFlowItems = [
  {
    title: { en: "Electronic Board Preparation", zh: "电子板准备" },
    text: { en: "SMT mounting and DIP insertion", zh: "SMT贴片与DIP插件" },
  },
  {
    title: { en: "Plastic-Electronic Matching", zh: "塑胶电子匹配" },
    text: {
      en: "Plastic housings, parts, and electronic modules",
      zh: "塑胶外壳、结构件与电子模块",
    },
  },
  {
    title: { en: "Assembly And Turnover", zh: "组装与周转" },
    text: {
      en: "Assembly stations, aisles, and turnover baskets",
      zh: "组装工位、通道与周转筐",
    },
  },
  {
    title: { en: "Repeat-Order Handoff", zh: "复产交付" },
    text: {
      en: "Inspection-ready handling for batch delivery",
      zh: "面向批量交付的待检流转",
    },
  },
] as const;

const workshopGallery = [
  {
    image: solutionsWorkshopImages.line1,
    title: { en: "Machine-side production cell", zh: "机台生产工位" },
  },
  {
    image: solutionsWorkshopImages.line2,
    title: { en: "Workshop aisle and turnover", zh: "车间通道与周转" },
  },
  {
    image: solutionsWorkshopImages.line3,
    title: { en: "Equipment operation area", zh: "设备运行区域" },
  },
  {
    image: solutionsWorkshopImages.line4,
    title: { en: "Batch production environment", zh: "批量生产环境" },
  },
  {
    image: solutionsWorkshopImages.line5,
    title: { en: "On-site manufacturing view", zh: "现场制造视角" },
  },
] as const;

const reasonCards = [
  {
    icon: Factory,
    title: {
      en: "Supplier + Manufacturer + R&D",
      zh: "供应商 + 生产商 + 研发协作",
    },
    text: {
      en: "One team connects requirements, development, tooling, production, and delivery.",
      zh: "同一团队衔接需求、研发、模具、生产与交付。",
    },
  },
  {
    icon: Globe2,
    title: { en: "Domestic And Overseas Markets", zh: "国内外市场同步覆盖" },
    text: {
      en: "Domestic and export project experience supports smoother buyer communication.",
      zh: "覆盖国内外市场，支持出口项目沟通与资料协同。",
    },
  },
  {
    icon: TimerReset,
    title: { en: "Trial-To-Bulk Planning", zh: "试单到量产规划" },
    text: {
      en: "Sampling, small trial orders, and repeat production are planned as one continuous path.",
      zh: "从打样、小批量试单到复产放量，交期与产能按项目节奏推进。",
    },
  },
  {
    icon: PackageCheck,
    title: { en: "Reports And Export Handoff", zh: "检测资料与出口交接" },
    text: {
      en: "Packing details, third-party reports, buyer files, and export handoff are coordinated before shipment.",
      zh: "包装细节、第三方检测、客户归档资料与出口交接统一协同。",
    },
  },
] as const;

const heroImage = "/site/misc/solution-bg.webp";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await getLocaleFromParams(params);
  return buildPageMetadata(locale, solutionsContent.seo, "solutions");
}

function localized(locale: Locale, value: Localized) {
  return t(locale, value);
}

function SectionHeader({
  eyebrow,
  highlight,
  title,
  text,
  locale,
}: {
  eyebrow?: Localized;
  highlight?: Localized;
  title: Localized;
  text?: Localized;
  locale: Locale;
}) {
  const localizedTitle = localized(locale, title);
  const localizedHighlight = highlight ? localized(locale, highlight) : "";
  const titleParts =
    localizedHighlight && localizedTitle.includes(localizedHighlight)
      ? localizedTitle.split(localizedHighlight)
      : null;

  return (
    <div className="solutions-section-head">
      {eyebrow ? <p>{localized(locale, eyebrow)}</p> : null}
      <h2>
        {titleParts ? (
          <>
            {titleParts[0]}
            <strong>{localizedHighlight}</strong>
            {titleParts.slice(1).join(localizedHighlight)}
          </>
        ) : (
          localizedTitle
        )}
      </h2>
      {text ? <span>{localized(locale, text)}</span> : null}
    </div>
  );
}

export default async function SolutionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await getLocaleFromParams(params);
  const contactHref = contactFormPath(locale);
  const homeHref = localizedPath(locale, "home");
  const pageUrl = toAbsoluteUrl(localizedPath(locale, "solutions"));
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
          name: locale === "zh" ? "解决方案" : "Solutions",
          item: pageUrl,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: localized(locale, {
        en: "Toy OEM/ODM Custom Development Solution",
        zh: "玩具 OEM/ODM 定制化开发方案",
      }),
      description: localized(locale, {
        en: "Yaoshun provides toy OEM/ODM custom development from product design, mold development, injection molding, assembly, quality control, packaging, and export delivery.",
        zh: "尧顺提供玩具 OEM/ODM 定制化开发，覆盖产品设计、模具开发、注塑成型、组装、品控、包装与出口交付。",
      }),
      provider: {
        "@type": ["Organization", "LocalBusiness"],
        name: siteCopy.companyName[locale],
        email: siteCopy.contact.email,
        telephone: siteCopy.contact.phone,
        url: toAbsoluteUrl(homeHref),
      },
      url: pageUrl,
    },
  ];

  return (
    <div className="solutions-page">
      <StructuredData data={structuredData} />

      <section className="solutions-hero">
        <div className="solutions-hero-background" aria-hidden="true">
          <Image
            alt=""
            className="solutions-hero-background-image"
            fill
            priority
            loading="eager"
            quality={100}
            sizes="100vw"
            src={heroImage}
          />
        </div>
        <div className="solutions-hero-inner">
          <div className="solutions-hero-copy">
            <p className="solutions-eyebrow">
              {localized(locale, {
                en: "OEM/ODM Solutions",
                zh: "OEM/ODM 解决方案",
              })}
            </p>
            <h1 className="solutions-hero-title">
              <span>
                {localized(locale, { en: "Toy Custom", zh: "玩具定制" })}
              </span>
              <span>
                <span className="hero-blue-word">
                  {localized(locale, { en: "Solutions", zh: "解决方案" })}
                </span>{" "}
                <span className="hero-orange-word">
                  {localized(locale, { en: "To Shipment", zh: "到出货" })}
                </span>
              </span>
            </h1>
            <p className="solutions-hero-text">
              {localized(locale, {
                en: "For brand and sourcing teams, Yaoshun connects requirement review, structure design, mold machining, injection molding, assembly, quality control, packaging, and export documents into one toy OEM/ODM delivery workflow.",
                zh: "面向品牌与采购团队，尧顺把需求评估、结构设计、模具加工、注塑生产、组装质检、包装与出口资料串联成清晰的玩具 OEM/ODM 交付流程。",
              })}
            </p>
            <div className="page-hero-actions">
              <Link
                className="hero-primary-cta"
                href="#solutions-capability-title"
              >
                <span>
                  {localized(locale, { en: "View Workflow", zh: "查看流程" })}
                </span>
                <ArrowRight size={16} strokeWidth={2.25} />
              </Link>
              <Link className="hero-secondary-cta" href={contactHref}>
                <span>
                  {localized(locale, { en: "Discuss Project", zh: "咨询项目" })}
                </span>
                <span className="hero-secondary-dot" />
              </Link>
            </div>
            <div className="hero-feature-strip">
              {proofCards.map((item) => {
                const Icon = item.icon;
                return (
                  <article className="hero-feature-item" key={item.value.en}>
                    <div className="hero-feature-icon">
                      <Icon size={21} strokeWidth={1.95} />
                    </div>
                    <p>
                      {localized(locale, item.value)} ·{" "}
                      {localized(locale, item.label)}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section
        className="solutions-capabilities"
        aria-labelledby="solutions-capability-title"
      >
        <SectionHeader
          highlight={{ en: "Solution", zh: "解决方案" }}
          locale={locale}
          title={{ en: "Our Solution Capabilities", zh: "我们的解决方案能力" }}
          text={{
            en: "A real equipment-led view of injection molding, extrusion, PCBA, assembly, packaging, testing, and tooling support.",
            zh: "按真实设备与车间画面展示注塑、挤出、PCBA、组装包装测试和模具制作能力。",
          }}
        />

        <SolutionsCapabilityCarousel
          cards={capabilityCards.map((card, index) => ({
            bullets: card.bullets.map((bullet) => localized(locale, bullet)),
            image: card.image,
            meta: localized(locale, capabilityTabs[index].meta),
            text: localized(locale, card.text),
            title: localized(locale, capabilityTabs[index].label),
          }))}
          contactHref={contactHref}
          learnMoreLabel={localized(locale, {
            en: "Learn More",
            zh: "了解更多",
          })}
          nextLabel={localized(locale, {
            en: "Next solution",
            zh: "下一个解决方案",
          })}
          previousLabel={localized(locale, {
            en: "Previous solution",
            zh: "上一个解决方案",
          })}
        />
      </section>

      <section
        className="solutions-equipment"
        aria-labelledby="solutions-equipment-title"
      >
        <SectionHeader
          highlight={{ en: "Equipment & Capacity", zh: "设备与产能" }}
          locale={locale}
          title={{ en: "Equipment & Capacity Showcase", zh: "设备与产能展示" }}
          text={{
            en: "Real workshop images explain what each machine does in tooling, trial molding, and batch production.",
            zh: "用真实车间图片说明每台设备在开模、试模与批量生产中的作用。",
          }}
        />
        <div className="solutions-equipment-panel">
          <SolutionsEquipmentList
            cards={equipmentCards.map((card) => ({
              category: card.category,
              image: card.image,
              text: localized(locale, card.text),
              title: localized(locale, card.title),
            }))}
            categories={equipmentTabs.map((tab) => ({
              id: tab.id,
              label: localized(locale, tab.label),
            }))}
            collapseLabel={localized(locale, {
              en: "Collapse Equipment",
              zh: "收起设备",
            })}
            expandLabel={localized(locale, {
              en: "Expand Equipment",
              zh: "展开设备",
            })}
            filterLabel={localized(locale, {
              en: "Equipment filters",
              zh: "设备分类",
            })}
          />
        </div>
      </section>

      <section
        className="solutions-workshop"
        aria-labelledby="solutions-workshop-title"
      >
        <SectionHeader
          highlight={{ en: "Production Workshop", zh: "生产车间" }}
          locale={locale}
          title={{
            en: "Plastic Electronics Production Workshop",
            zh: "塑胶电子生产车间",
          }}
          text={{
            en: "A focused view of the workshop capability behind SMT mounting, DIP insertion, product assembly, plastic-part turnover, and repeat-order delivery.",
            zh: "重点展示塑胶电子生产车间能力，覆盖SMT贴片、DIP插件、成品组装、塑胶件周转与稳定复产交付。",
          }}
        />

        <div className="solutions-workshop-capabilities">
          {workshopHighlights.map((item) => {
            const Icon = item.icon;
            return (
              <article
                className="solutions-workshop-capability"
                key={item.title.en}
              >
                <div className="solutions-workshop-capability-head">
                  <span>{item.step}</span>
                  <Icon size={22} strokeWidth={1.95} />
                </div>
                <h3>{localized(locale, item.title)}</h3>
                <p>{localized(locale, item.text)}</p>
              </article>
            );
          })}
        </div>

        <div className="solutions-workshop-board">
          <div className="solutions-workshop-visual">
            <Image
              alt={localized(locale, {
                en: "Plastic electronics production environment overview",
                zh: "塑胶电子生产车间整体环境",
              })}
              className="solutions-workshop-main-image"
              fill
              preview
              sizes="(min-width: 1024px) 54vw, 100vw"
              src={solutionsWorkshopImages.overview}
            />
            <div className="solutions-workshop-visual-label">
              <span>
                {localized(locale, { en: "Real Workshop", zh: "真实车间" })}
              </span>
              <strong>
                {localized(locale, {
                  en: "SMT, DIP And Assembly Production Site",
                  zh: "SMT贴片、DIP插件与组装生产现场",
                })}
              </strong>
            </div>
          </div>

          <div className="solutions-workshop-copy">
            <span>
              {localized(locale, {
                en: "Plastic Electronics Production",
                zh: "塑胶电子生产",
              })}
            </span>
            <h3>
              {localized(locale, {
                en: "Workshop layout for SMT mounting, DIP insertion, and product assembly.",
                zh: "覆盖SMT贴片、DIP插件与组装的生产车间布局。",
              })}
            </h3>
            <p>
              {localized(locale, {
                en: "The workshop connects electronic-board work, plastic housing matching, assembly stations, operating aisles, turnover baskets, and inspection-ready handling into one practical production scene.",
                zh: "车间把电子板作业、塑胶外壳匹配、组装工位、操作通道、周转筐与待检流转放在同一生产场景中，服务打样、复产和项目交付。",
              })}
            </p>
            <div
              className="solutions-workshop-flow"
              aria-label={localized(locale, {
                en: "Plastic electronics production flow",
                zh: "塑胶电子生产流程",
              })}
            >
              {workshopFlowItems.map((item) => (
                <div
                  className="solutions-workshop-flow-item"
                  key={item.title.en}
                >
                  <strong>{localized(locale, item.title)}</strong>
                  <span>{localized(locale, item.text)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className="solutions-workshop-gallery"
          aria-label={localized(locale, {
            en: "Workshop production photos",
            zh: "车间生产图片",
          })}
        >
          {workshopGallery.map((item) => (
            <figure className="solutions-workshop-thumb" key={item.title.en}>
              <Image
                alt={localized(locale, item.title)}
                className="solutions-workshop-thumb-image"
                fill
                preview
                sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                src={item.image}
              />
              <figcaption>{localized(locale, item.title)}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section
        className="solutions-core-focus"
        aria-labelledby="solutions-core-focus-title"
      >
        <SectionHeader
          highlight={{ en: "Core Capability", zh: "核心能力" }}
          locale={locale}
          title={{ en: "Core Capability Focus", zh: "核心能力聚焦" }}
          text={{
            en: "Focused source-factory capabilities for toy R&D, tooling, custom building toys, plastic parts, and safer delivery.",
            zh: "聚焦源头工厂研发、自有模具、搭建玩具定制、塑料制品协同与安全制造。",
          }}
        />
        <div className="solutions-core-grid">
          {coreFocusCards.map((card) => {
            const Icon = card.icon;
            return (
              <article className="solutions-core-card" key={card.title.en}>
                <div className="solutions-core-image-wrap">
                  <Image
                    alt={localized(locale, card.title)}
                    className="solutions-core-image"
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 100vw"
                    src={card.image}
                  />
                  <span className="solutions-core-icon" aria-hidden="true">
                    <Icon size={22} strokeWidth={1.9} />
                  </span>
                </div>
                <div className="solutions-core-body">
                  <h3>{localized(locale, card.title)}</h3>
                  <p>{localized(locale, card.text)}</p>
                  <ul>
                    {card.points.map((point) => (
                      <li key={point.en}>{localized(locale, point)}</li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>

        <div
          className="solutions-core-reasons"
          aria-labelledby="solutions-core-reasons-title"
        >
          <div className="solutions-core-reasons-head">
            <h3 id="solutions-core-reasons-title">
              {localized(locale, {
                en: "Why Buyers Choose Yaoshun",
                zh: "客户选择尧顺的原因",
              })}
            </h3>
            <p>
              {localized(locale, {
                en: "Source-factory capability, deeper customization, safer materials, and reliable delivery build long-term cooperation.",
                zh: "源头工厂能力、定制深度与安全交付，是长期合作的基础。",
              })}
            </p>
          </div>
          <div className="solutions-reason-grid">
            {reasonCards.map((card) => {
              const Icon = card.icon;
              return (
                <article className="solutions-reason-card" key={card.title.en}>
                  <Icon size={26} strokeWidth={1.9} />
                  <h3>{localized(locale, card.title)}</h3>
                  <p>{localized(locale, card.text)}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section
        className="solutions-process"
        aria-labelledby="solutions-process-title"
      >
        <SectionHeader
          highlight={{ en: "How We Work", zh: "如何合作" }}
          locale={locale}
          title={{
            en: "From Idea To Shipment, How We Work",
            zh: "从想法到出货，我们如何合作",
          }}
          text={{
            en: "A practical R&D and quality-control path keeps timing, materials, reports, and shipment responsibilities clear.",
            zh: "围绕交期、材料、资料和出货责任建立清晰的研发与质量控制路径。",
          }}
        />
        <div className="solutions-process-board">
          <aside className="solutions-process-summary">
            <span>
              {localized(locale, { en: "Cooperation Rhythm", zh: "协作节奏" })}
            </span>
            <h3>
              {localized(locale, {
                en: "Clear checkpoints before every production decision.",
                zh: "每一次投入生产前，都先把关键节点确认清楚。",
              })}
            </h3>
            <p>
              {localized(locale, {
                en: "Before tooling, trial production, bulk release, and shipment, we align the decision basis, owner, documents, and next action so the project does not move forward with unclear assumptions.",
                zh: "开模、试产、量产放行与出货前，先把判断依据、责任人、资料与下一步动作对齐，避免项目带着不清晰的假设继续推进。",
              })}
            </p>
            <div
              className="solutions-process-checklist"
              aria-label={localized(locale, {
                en: "Pre-production checklist",
                zh: "生产前确认清单",
              })}
            >
              {processReadinessItems.map((item) => (
                <div key={item.title.en}>
                  <strong>{localized(locale, item.title)}</strong>
                  <span>{localized(locale, item.text)}</span>
                </div>
              ))}
            </div>
            <div
              className="solutions-process-metrics"
              aria-label={localized(locale, {
                en: "Process highlights",
                zh: "流程重点",
              })}
            >
              <div>
                <strong>
                  {localized(locale, { en: "24h", zh: "24 小时" })}
                </strong>
                <span>
                  {localized(locale, {
                    en: "First reply for most inquiries",
                    zh: "多数询盘初步回复",
                  })}
                </span>
              </div>
              <div>
                <strong>
                  {localized(locale, { en: "7-15d", zh: "7-15 天" })}
                </strong>
                <span>
                  {localized(locale, {
                    en: "Typical lead-time planning",
                    zh: "常规交期规划",
                  })}
                </span>
              </div>
              <div>
                <strong>
                  {localized(locale, { en: "Files", zh: "资料" })}
                </strong>
                <span>
                  {localized(locale, {
                    en: "Reports and export coordination",
                    zh: "检测与出口协同",
                  })}
                </span>
              </div>
            </div>
          </aside>
          <div className="solutions-process-track">
            {processSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <article className="solutions-process-step" key={step.title.en}>
                  <div className="solutions-process-step-head">
                    <span className="solutions-process-index">{step.step}</span>
                    <span className="solutions-process-icon">
                      <Icon size={24} strokeWidth={1.9} />
                    </span>
                  </div>
                  <div className="solutions-process-step-copy">
                    <h3>{localized(locale, step.title)}</h3>
                    <p>{localized(locale, step.text)}</p>
                    <ul>
                      {step.details.map((detail) => (
                        <li key={detail.en}>{localized(locale, detail)}</li>
                      ))}
                    </ul>
                    <div className="solutions-process-output">
                      <span>
                        {localized(locale, { en: "Output", zh: "阶段产出" })}
                      </span>
                      <strong>{localized(locale, step.output)}</strong>
                    </div>
                  </div>
                  {index < processSteps.length - 1 ? (
                    <span
                      className="solutions-process-arrow"
                      aria-hidden="true"
                    />
                  ) : null}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section
        className="solutions-ready"
        aria-labelledby="solutions-ready-title"
      >
        <div className="solutions-ready-card">
          <div className="solutions-ready-copy">
            <h2 id="solutions-ready-title">
              {localized(locale, {
                en: "Ready To Start Your Custom Project?",
                zh: "准备好开启您的定制项目了吗？",
              })}
            </h2>
            <p>
              {localized(locale, {
                en: "Our team can help review the structure, tooling route, packaging plan, and delivery steps for your project.",
                zh: "我们的团队可协助评估结构、开模路径、包装方案与交付步骤。",
              })}
            </p>
            <div className="solutions-ready-actions">
              <Link href={contactHref}>
                <span>
                  {localized(locale, { en: "Contact Us", zh: "联系我们" })}
                </span>
                <ArrowRight size={18} strokeWidth={2.25} />
              </Link>
            </div>
          </div>
          <div className="solutions-ready-image">
            <div className="solutions-ready-image-glow" aria-hidden="true" />
            <Image
              alt={localized(locale, {
                en: "Custom toy project support",
                zh: "定制玩具项目支持",
              })}
              className="solutions-ready-product-image"
              height={1088}
              sizes="(min-width: 1024px) 26vw, 62vw"
              src="/site/solutions/ready-custom-project-showcase.webp"
              width={1088}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
