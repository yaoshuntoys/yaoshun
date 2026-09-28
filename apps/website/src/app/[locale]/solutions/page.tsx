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

type CapabilityTileSeed = {
  image: string;
  title: Localized;
};

type CapabilityCardSeed = {
  bullets: Localized[];
  icon: typeof Factory;
  image: string;
  text: Localized;
  title: Localized;
  tiles?: CapabilityTileSeed[];
};

const proofCards = [
  {
    icon: CircleDotDashed,
    value: { en: "Since 2016", zh: "2016 年起" },
    label: { en: "Toy & plastic manufacturing", zh: "玩具与塑胶制造" },
  },
  {
    icon: TimerReset,
    value: { en: "Rapid Sampling", zh: "快速打样" },
    label: { en: "Typical lead-time planning", zh: "常规交期参考" },
  },
  {
    icon: Boxes,
    value: { en: "One-stop", zh: "全流程" },
    label: { en: "Project workflow", zh: "从开模到交付" },
  },
  {
    icon: ShieldCheck,
    value: { en: "Global-ready", zh: "出口配套" },
    label: { en: "Reports and delivery support", zh: "检测与出口交付" },
  },
] as const;

const capabilityTabs = [
  {
    label: { en: "Injection Molding", zh: "注塑成型" },
    meta: { en: "Trial and repeat molding", zh: "试模与复产成型" },
  },
  {
    label: { en: "Extrusion Workshop", zh: "挤出车间" },
    meta: { en: "Profile and tube production", zh: "管材与异型材生产" },
  },
  {
    label: { en: "PCBA Custom Service", zh: "PCBA 定制服务" },
    meta: { en: "Board assembly and testing", zh: "板卡组装与测试" },
  },
  {
    label: { en: "Assembly / Packaging Test", zh: "组装与包装测试" },
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

const capabilityCards: CapabilityCardSeed[] = [
  {
    icon: FlaskConical,
    image: solutionsEquipmentImages.hwaChin210se,
    title: { en: "Injection Molding Production", zh: "注塑成型与复产" },
    text: {
      en: "Hwa Chin, Haitian, and Victor Taichung horizontal injection machines turn approved tooling into repeatable toy parts.",
      zh: "华钦、海天、台中精机等卧式注塑机用于试模和复产，验证后的模具可继续生产玩具塑件。",
    },
    bullets: [
      { en: "125SE to 220T machine coverage", zh: "125SE 至 220T 注塑机" },
      { en: "Automatic take-out support", zh: "自动取件" },
      { en: "Trial molding parameter tuning", zh: "试模参数验证" },
      { en: "Repeatable plastic-part output", zh: "塑件批量复产" },
    ],
  },
  {
    icon: Factory,
    image: solutionsEquipmentImages.extrusionWorkshopOverview,
    title: { en: "Extrusion Workshop For Tubes And Profiles", zh: "管材与异型材挤出" },
    text: {
      en: "The workshop overview shows extrusion lines, control stations, cooling sections, and line-side turnover areas for steady plastic tube and profile production.",
      zh: "现场可看到挤出线、控制工位、冷却段和线边周转区，主要用于管材与异型材生产。",
    },
    bullets: [
      { en: "Plastic tube and profile extrusion", zh: "塑胶管材与异型材挤出" },
      { en: "Line-side cooling and haul-off", zh: "冷却与牵引" },
      { en: "Workshop turnover arrangement", zh: "成品周转" },
      { en: "Batch production preparation", zh: "批量生产准备" },
    ],
  },
  {
    icon: Settings2,
    image: solutionsEquipmentImages.pcbaDesignRd,
    title: { en: "PCBA Design And R&D Custom Service", zh: "PCBA 设计与研发定制" },
    text: {
      en: "From PCB layout and board making to SMT placement and complete product solution customization, PCBA work starts with design and R&D review before assembly.",
      zh: "从 PCB 设计、制板、SMT 贴片到整机方案，先确认设计和工艺，再安排贴装与功能测试。",
    },
    bullets: [
      { en: "PCB Design", zh: "PCB 设计" },
      { en: "PCB Board Making", zh: "PCB 制板" },
      { en: "SMT Placement", zh: "SMT 贴片" },
      { en: "Tailor-made PCBA Solution", zh: "整机方案定制" },
    ],
    tiles: [
      {
        image: solutionsEquipmentImages.pcbaDesignRd,
        title: { en: "PCB Design", zh: "PCB 设计" },
      },
      {
        image: solutionsEquipmentImages.pcbaBoardMaking,
        title: { en: "PCB Board Making", zh: "PCB 制板" },
      },
      {
        image: solutionsEquipmentImages.pcbaSmtPlacement,
        title: { en: "SMT Placement", zh: "SMT 贴片" },
      },
      {
        image: solutionsEquipmentImages.pcbaTailorMadeSolution,
        title: { en: "Tailor-made PCBA Solution", zh: "整机方案定制" },
      },
    ],
  },
  {
    icon: PackageCheck,
    image: solutionsWorkshopImages.overview,
    title: { en: "Assembly, Packaging And Testing Workflow", zh: "组装、包装与测试" },
    text: {
      en: "The plastic-electronics workshop view shows organized workstations for assembly, checking, packaging preparation, and shipment-ready review.",
      zh: "塑胶电子车间按组装、检查、包装和出货复核安排工位，现场流程清楚。",
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
    title: { en: "In-House Mold Making Workflow", zh: "自有模具加工" },
    text: {
      en: "The tooling shop brings turning, milling, drilling, wire cutting, and EDM preparation into one visible workflow.",
      zh: "模具车间配有车、铣、钻、线切割和电火花等工位，从钢料加工到试模前准备都在厂内完成。",
    },
    bullets: [
      { en: "Tooling schedule coordination", zh: "模具加工排程" },
      { en: "Steel preparation and fixture setup", zh: "钢料准备与工装定位" },
      { en: "Multiple machining stations", zh: "车、铣、钻等工序" },
      { en: "Trial-molding readiness", zh: "试模前准备" },
    ],
  },
  {
    icon: Wrench,
    image: solutionsEquipmentImages.extrusionEquipmentDisplay,
    title: { en: "Extrusion Equipment And Line Control", zh: "挤出设备与产线控制" },
    text: {
      en: "The equipment image shows a complete extrusion line with control panels, drive sections, forming areas, and downstream handling equipment in a bright workshop.",
      zh: "照片能看到控制面板、驱动段、成型区和后段设备，便于了解整条挤出线的配置。",
    },
    bullets: [
      { en: "Multi-zone equipment control", zh: "多区段控制" },
      { en: "Extrusion forming and output", zh: "挤出成型与出料" },
      { en: "Line setup and process tuning", zh: "产线调试与工艺调整" },
      { en: "Workshop-scale equipment layout", zh: "整线设备布局" },
    ],
  },
] as const;

const coreFocusCards = [
  {
    icon: Factory,
    image: solutionsPageImages.education,
    title: { en: "STEM Toy R&D", zh: "STEM 益智玩具研发" },
    text: {
      en: "Focused on educational toys and building block assembly, from structure development to production.",
      zh: "围绕益智玩具与积木拼装产品，参与结构开发和生产导入。",
    },
    points: [
      { en: "Educational toy development", zh: "益智玩具开发" },
      { en: "In-house tooling support", zh: "自有模具配套" },
      { en: "Drawing or sample based", zh: "来图来样开发" },
    ],
  },
  {
    icon: Boxes,
    image: solutionsPageImages.retail,
    title: { en: "Interlocking & DIY Toys", zh: "拼接玩具与 DIY 定制" },
    text: {
      en: "Custom interlocking sets by theme, piece count, and play pattern, with sampling support.",
      zh: "可按主题、件数和玩法定制拼接玩具套装，并支持打样复产。",
    },
    points: [
      { en: "Custom shapes and themes", zh: "造型与主题定制" },
      { en: "Hands-on DIY creativity", zh: "动手拼搭玩法" },
      { en: "Trial to repeat orders", zh: "试单与复产" },
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
      en: "Plastic tubing, profiles, structural parts, and selected electronic housings can be developed together.",
      zh: "可配套管材、异型材、塑料结构件和塑胶电子外壳项目。",
    },
    points: [
      {
        en: "Plastic structural components and accessory parts",
        zh: "结构件与配套辅件",
      },
      {
        en: "PVC, PU, ABS, PC, and nylon material routes",
        zh: "管材与异型材",
      },
      { en: "Packaging-ready product combinations", zh: "电子外壳配套" },
    ],
  },
  {
    icon: ShieldCheck,
    image: solutionsPageImages.oem,
    title: {
      en: "Eco-Safe Materials With Strict QC",
      zh: "材料与质量控制",
    },
    text: {
      en: "Confirm materials and check incoming parts, production stages, and shipment status with records.",
      zh: "按项目要求确认材料，并检查来料、生产过程和出货状态。",
    },
    points: [
      {
        en: "Durable and non-toxic material options",
        zh: "材料与环保要求",
      },
      {
        en: "Automated inspection and traceable QC",
        zh: "自动化检测记录",
      },
      {
        en: "Third-party reports and market-entry files",
        zh: "第三方检测资料",
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
      zh: "用于视频通讯板程序烧录和功能测试，出货前再核对接口、检测点并做好防静电包装。",
    },
  },
  {
    category: "pcba",
    image: solutionsEquipmentImages.pcbaServiceAngle,
    title: { en: "12-Layer 2.0 mm PCB Assembly", zh: "12层 2.0mm PCB 板组装" },
    text: {
      en: "The angled board view shows a 12-layer PCB with 2.0 mm board thickness, mounted chips, capacitors, connectors, and functional module areas.",
      zh: "板卡为 12 层、板厚 2.0mm，可看到芯片、电容、连接器和功能模块分区。",
    },
  },
  {
    category: "pcba",
    image: solutionsEquipmentImages.pcbaServiceInterface,
    title: { en: "Double-Sided SMT And Interface Integration", zh: "双面贴片与接口端子集成" },
    text: {
      en: "The interface close-up supports double-sided SMT projects with USB ports, pin headers, sockets, and external connector integration.",
      zh: "特写可看到 USB、排针、插座等接口，便于确认双面贴片后的连接端子布局。",
    },
  },
  {
    category: "pcba",
    image: solutionsEquipmentImages.pcbaServiceSmtDetail,
    title: { en: "0201 SMD And Dense Component Placement", zh: "0201 SMD 与密集元件贴装" },
    text: {
      en: "SMT details cover 0201 SMD placement, more than 15 IC types, over 150 chip component types, soldering quality, and inspection requirements.",
      zh: "细节图可看到 0201 SMD、15 种以上 IC、150 种以上 CHIP 料，以及焊接和检验要求。",
    },
  },
  {
    category: "pcba",
    image: solutionsEquipmentImages.pcbaServiceCircuitDetail,
    title: { en: "0.3 mm BGA Pitch And Circuit Review", zh: "0.3mm BGA 球距与线路复核" },
    text: {
      en: "The circuit close-up supports board-level review for 0.3 mm BGA pitch, 12 BGA packages, dense traces, pads, and product integration.",
      zh: "局部线路用于核对 0.3mm BGA 球距、12 颗 BGA、密集走线和焊盘，便于整机集成前检查。",
    },
  },
  {
    category: "tooling",
    image: solutionsEquipmentImages.moldWorkshop,
    title: { en: "Mold Machining Workshop", zh: "模具加工车间" },
    text: {
      en: "A tooling area that gathers turning, drilling, milling, wire-cut, and EDM preparation around mold delivery.",
      zh: "车、铣、钻、线切割和电火花工位集中在模具车间，按模具加工顺序衔接。",
    },
  },
  {
    category: "tooling",
    image: solutionsEquipmentImages.c6140aLathe,
    title: { en: "C6140A Engine Lathe", zh: "C6140A 普通车床" },
    text: {
      en: "Used for round mold inserts, sleeves, guide pins, end faces, and inner-hole turning before mold assembly.",
      zh: "用于圆形镶件、轴套和导柱等零件的外圆、端面及内孔加工。",
    },
  },
  {
    category: "tooling",
    image: solutionsEquipmentImages.cn6150bLathe,
    title: { en: "CN6150B Long-Bed Lathe", zh: "CN6150B 长床车床" },
    text: {
      en: "The longer bed supports shaft-like mold components, longer fixtures, and auxiliary parts that need stable turning.",
      zh: "床身较长，适合加工长轴、杆件、夹具和模具辅助件。",
    },
  },
  {
    category: "tooling",
    image: solutionsEquipmentImages.turretMillDetail1,
    title: { en: "Turret Milling Machine", zh: "炮塔铣床" },
    text: {
      en: "Handles mold plate surfaces, steps, slots, and datum faces so fitting and later drilling stay aligned.",
      zh: "用于加工模板平面、台阶、槽位和定位面，为装配和后续钻孔留出基准。",
    },
  },
  {
    category: "tooling",
    image: solutionsEquipmentImages.radialDrill,
    title: { en: "Z3035x10 Radial Drilling Machine", zh: "Z3035x10 摇臂钻床" },
    text: {
      en: "Used for mold-base holes, threaded holes, water-line preparation, and flexible positioning on larger workpieces.",
      zh: "用于模架孔位、螺纹孔和冷却水路钻孔，大件定位和调整更方便。",
    },
  },
  {
    category: "extrusion",
    image: solutionsEquipmentImages.extrusionWorkshopOverview,
    title: { en: "Extrusion Line Overview", zh: "挤出产线整体布局" },
    text: {
      en: "Multiple extrusion lines, control stations, cooling and haul-off sections are arranged in a clean workshop for steady plastic profile and tube production.",
      zh: "现场可看到多条挤出线、控制工位、冷却牵引段和周转区，用于管材与异型材生产。",
    },
  },
  {
    category: "extrusion",
    image: solutionsEquipmentImages.extrusionWorkshopPackagingTurnover,
    title: { en: "Packaging And Turnover Station", zh: "包装与周转工位" },
    text: {
      en: "Finished rolls, cartons, pallets, and blue turnover baskets are handled beside the extrusion lines to connect production, checking, and packing.",
      zh: "卷材、纸箱、托盘和蓝色周转筐放在产线旁，方便成品整理、复核和包装。",
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
      zh: "白色挤出杆件在产线旁集中出料，现场可进行长度整理、外观检查和订单周转。",
    },
  },
  {
    category: "injection",
    image: solutionsEquipmentImages.injectionWorkshop,
    title: { en: "Injection Molding Workshop", zh: "注塑生产车间" },
    text: {
      en: "A production line with horizontal injection machines, automatic take-out arms, drying hoppers, and material handling.",
      zh: "多台卧式注塑机配合自动取件机械手、料斗干燥和供料系统，组成连续生产线。",
    },
  },
  {
    category: "injection",
    image: solutionsEquipmentImages.hwaChin125se,
    title: { en: "Hwa Chin 125SE Injection Machine", zh: "华钦 125SE 注塑机" },
    text: {
      en: "Suited to small and medium toy parts, connectors, and structural components with automatic take-out support.",
      zh: "适合中小型玩具塑件、连接件和结构件成型，自动取件可减少人工转运。",
    },
  },
  {
    category: "injection",
    image: solutionsEquipmentImages.hwaChin210se,
    title: { en: "Hwa Chin 210SE Injection Machine", zh: "华钦 210SE 注塑机" },
    text: {
      en: "Handles larger or heavier toy parts; the image shows take-out automation and turnover baskets at the machine side.",
      zh: "适合更大尺寸或克重更高的玩具部件，机旁配有自动取件机械手和周转筐。",
    },
  },
  {
    category: "injection",
    image: solutionsEquipmentImages.haitian220t,
    title: { en: "Haitian 220T Injection Machine", zh: "海天 220T 注塑机" },
    text: {
      en: "Supports larger molds and higher clamping requirements for batch production of bigger plastic structures.",
      zh: "用于较大模具和较高锁模需求的塑件成型，适合大结构件批量生产。",
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
      zh: "用于玩具零件复产和换模生产，可根据零件尺寸和材料调整工艺。",
    },
  },
] as const;

const processSteps = [
  {
    icon: ClipboardCheck,
    step: "01",
    title: { en: "Project Brief And Fast Review", zh: "项目需求与初步评估" },
    text: {
      en: "We clarify target market, toy category, quantity plan, packaging direction, and technical scope first, with most first replies sent within 24 hours.",
      zh: "先确认目标市场、玩具类别、数量、包装和技术要求；资料齐全的询盘通常可在 24 小时内收到初步回复。",
    },
    details: [
      { en: "Target market and product category", zh: "目标市场与产品类别" },
      {
        en: "Quantity plan and delivery expectation",
        zh: "数量与交期",
      },
      { en: "Packaging and technical boundaries", zh: "包装方向与技术范围" },
    ],
    output: {
      en: "Requirement list and first feasibility reply",
      zh: "需求清单与初步评估",
    },
  },
  {
    icon: PencilRuler,
    step: "02",
    title: {
      en: "Tooling, Structure And Material Design",
      zh: "模具、结构与材料方案",
    },
    text: {
      en: "Drawing-based or sample-based development defines assembly logic, mold route, material selection, component strength, and safety assumptions.",
      zh: "根据图纸或样品，确认拼装方式、开模路径、材料、部件强度和安全要求。",
    },
    details: [
      { en: "Assembly logic and structure review", zh: "拼装方式与结构检查" },
      { en: "Tooling route and material selection", zh: "开模路径与材料" },
      { en: "Strength and safety assumptions", zh: "强度与安全要求" },
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
      zh: "通过样品或小批量试单检查装配、外观、玩法、耐用性和包装，再决定是否放量。",
    },
    details: [
      {
        en: "Fit, appearance, and playability check",
        zh: "装配、外观与玩法检查",
      },
      { en: "Durability and material feedback", zh: "耐用性与材料反馈" },
      { en: "Trial order before bulk production", zh: "小批试单后再放量" },
    ],
    output: {
      en: "Approved sample and revision list",
      zh: "确认样品与修改清单",
    },
  },
  {
    icon: BadgeCheck,
    step: "04",
    title: {
      en: "Production And Quality Control",
      zh: "量产与质量控制",
    },
    text: {
      en: "Production runs through raw material checks, in-process inspection, automated review, assembly control, and final outgoing inspection before shipment.",
      zh: "量产时检查原料、生产过程、自动化检测、组装和出货状态，并保留批次记录。",
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
      zh: "批次记录与出货放行",
    },
  },
  {
    icon: PackageCheck,
    step: "05",
    title: {
      en: "Reports, Packaging And Export Handoff",
      zh: "检测资料、包装与出货",
    },
    text: {
      en: "We coordinate packing details, third-party reports, buyer filing documents, and export handoff so the order can move forward with less friction.",
      zh: "确认包装细节、第三方检测和客户归档资料，完成出口交接。",
    },
    details: [
      { en: "Packing method and carton details", zh: "包装方式与箱规细节" },
      {
        en: "Third-party reports and filing files",
        zh: "第三方检测与归档资料",
      },
      { en: "Export delivery handoff", zh: "出口出货交接" },
    ],
    output: {
      en: "Shipment-ready files and delivery handoff",
      zh: "可出货资料与交付交接",
    },
  },
] as const;

const processReadinessItems = [
  {
    title: { en: "Demand Freeze", zh: "需求确认" },
    text: {
      en: "Confirm product scope, target market, quantity rhythm, packaging direction, and cost boundary before tooling or batch scheduling.",
      zh: "在开模或排产前，确认产品范围、目标市场、数量、包装和成本边界。",
    },
  },
  {
    title: { en: "Sample Approval", zh: "样品确认" },
    text: {
      en: "Review structure, color, touch, play pattern, assembly fit, and safety risk points against the approved sample.",
      zh: "以确认样品为准，核对结构、颜色、手感、玩法、装配和安全风险。",
    },
  },
  {
    title: { en: "Production Files", zh: "生产资料" },
    text: {
      en: "Prepare BOM, tooling status, material batch notes, inspection standards, packing method, carton specs, and buyer files.",
      zh: "整理 BOM、模具状态、材料批次、检验标准、包装方式、箱规和客户资料。",
    },
  },
  {
    title: { en: "Risk Closure", zh: "问题确认" },
    text: {
      en: "Lock open issues, responsible owners, change records, and go/no-go decisions before releasing bulk production.",
      zh: "量产前明确未解决的问题、负责人、变更记录和是否放行。",
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
      zh: "线路板先完成 SMT 贴片，再进入功能件组装。",
    },
  },
  {
    icon: CircleDotDashed,
    step: "02",
    title: { en: "DIP Insertion", zh: "DIP插件" },
    text: {
      en: "Through-hole insertion and line-side handling connect electronic components with stable production flow.",
      zh: "DIP 插件与现场周转相连，方便电子元件继续流转到下一工序。",
    },
  },
  {
    icon: PackageCheck,
    step: "03",
    title: { en: "Product Assembly", zh: "成品组装" },
    text: {
      en: "Plastic housings, electronic parts, and final assembly stations connect sampling, repeat production, and shipment handoff.",
      zh: "塑胶外壳、电子部件和成品组装工位相互衔接，适合打样、复产和出货前整理。",
    },
  },
] as const;

const workshopFlowItems = [
  {
    title: { en: "Electronic Board Preparation", zh: "电子板加工" },
    text: { en: "SMT mounting and DIP insertion", zh: "SMT 贴片与 DIP 插件" },
  },
  {
    title: { en: "Plastic-Electronic Matching", zh: "外壳与电子件匹配" },
    text: {
      en: "Plastic housings, parts, and electronic modules",
      zh: "塑胶外壳、结构件和电子模块",
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
    title: { en: "Repeat-Order Handoff", zh: "复产与交付" },
    text: {
      en: "Inspection-ready handling for batch delivery",
      zh: "批量订单的待检流转",
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
      zh: "从需求、研发、模具到生产和交付，由同一团队跟进。",
    },
  },
  {
    icon: Globe2,
    title: { en: "Domestic And Overseas Markets", zh: "国内外订单经验" },
    text: {
      en: "Domestic and export project experience supports smoother buyer communication.",
      zh: "熟悉国内外项目沟通，出口资料协同更直接。",
    },
  },
  {
    icon: TimerReset,
    title: { en: "Trial-To-Bulk Planning", zh: "从试单到量产" },
    text: {
      en: "Sampling, small trial orders, and repeat production are planned as one continuous path.",
      zh: "打样、小批试单和复产按同一项目节奏安排。",
    },
  },
  {
    icon: PackageCheck,
    title: { en: "Reports And Export Handoff", zh: "检测资料与出货交接" },
    text: {
      en: "Packing details, third-party reports, buyer files, and export handoff are coordinated before shipment.",
      zh: "包装细节、检测报告和客户资料在出货前一并核对。",
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
        zh: "尧顺从产品设计、模具开发和注塑，到组装、品控、包装与出口交付，提供玩具 OEM/ODM 定制开发。",
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
                {localized(locale, { en: "Custom Fort Building Kit", zh: "定制堡垒拼搭套装" })}
              </span>
              <span>
                <span className="hero-blue-word">
                  {localized(locale, { en: "OEM/ODM", zh: "OEM/ODM" })}
                </span>{" "}
                <span className="hero-orange-word">
                  {localized(locale, { en: "Solutions", zh: "解决方案" })}
                </span>
              </span>
            </h1>
            <p className="solutions-hero-text">
              {localized(locale, {
              en: "For brand and sourcing teams, Yaoshun connects requirement review, structure design, mold machining, injection molding, assembly, quality control, packaging, and export documents into one toy OEM/ODM delivery workflow.",
                zh: "面向品牌与采购团队，尧顺从需求评估、结构设计、开模和注塑，到组装质检、包装与出口资料，按项目节点推进玩具 OEM/ODM 订单。",
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
          title={{ en: "Our Solution Capabilities", zh: "生产与定制能力" }}
          text={{
            en: "A real equipment-led view of injection molding, extrusion, PCBA, assembly, packaging, testing, and tooling support.",
            zh: "现场设备和车间照片，分别展示注塑、挤出、PCBA、组装包装测试与模具加工。",
          }}
        />

        <SolutionsCapabilityCarousel
          cards={capabilityCards.map((card, index) => ({
            bullets: card.bullets.map((bullet) => localized(locale, bullet)),
            image: card.image,
            meta: localized(locale, capabilityTabs[index].meta),
            text: localized(locale, card.text),
            tiles: card.tiles?.map((tile) => ({
              image: tile.image,
              title: localized(locale, tile.title),
            })),
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
            en: "Workshop photos show whether each machine is used for tooling, molding, extrusion, or PCBA work.",
            zh: "设备照片按工序整理，方便了解它们分别用于模具加工、注塑、挤出还是 PCBA。",
          }}
        />
        <div className="solutions-equipment-panel">
          <SolutionsEquipmentList
            cards={equipmentCards.map((card) => ({
              category: card.category,
              image: card.image,
              text: localized(locale, card.text),
              title: localized(locale, card.title),
              unoptimized:
                card.image ===
                solutionsEquipmentImages.extrusionWorkshopPackagingTurnover,
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
            zh: "现场展示塑胶电子车间的 SMT 贴片、DIP 插件、成品组装、塑胶件周转和复产交付。",
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
                  zh: "SMT 贴片、DIP 插件与组装生产现场",
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
                zh: "SMT 贴片、DIP 插件和成品组装在同一车间衔接。",
              })}
            </h3>
            <p>
              {localized(locale, {
                en: "The workshop connects electronic-board work, plastic housing matching, assembly stations, operating aisles, turnover baskets, and inspection-ready handling into one practical production scene.",
                zh: "现场可以看到电子板作业、塑胶外壳匹配、组装工位、操作通道、周转筐和待检区，便于打样、复产及出货交接。",
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
                zh: "为什么与尧顺合作",
              })}
            </h3>
            <p>
              {localized(locale, {
                en: "Source-factory capability, deeper customization, safer materials, and reliable delivery build long-term cooperation.",
                zh: "从研发、开模到生产和交付，由同一团队持续跟进。",
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
              {localized(locale, { en: "Cooperation Rhythm", zh: "合作节奏" })}
            </span>
            <h3>
              {localized(locale, {
                en: "Clear checkpoints before every production decision.",
                zh: "每个生产节点，都先把关键事项确认清楚。",
              })}
            </h3>
            <p>
              {localized(locale, {
                en: "Before tooling, trial production, bulk release, and shipment, we align the decision basis, owner, documents, and next action so the project does not move forward with unclear assumptions.",
                zh: "开模、试产、量产放行和出货前，确认依据、负责人、资料和下一步动作，项目再继续推进。",
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
                    zh: "多数询盘初步回复时间",
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
                    zh: "检测资料与出口",
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
