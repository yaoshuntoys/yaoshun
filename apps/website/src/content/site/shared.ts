import type { Locale } from "@/lib/i18n";
import type { RouteKey } from "@/lib/routes";

export type LocalizedText = Partial<Record<Locale, string>>;
export type LocalizedKeywords = Partial<Record<Locale, readonly string[]>>;
export type ProductModule = "toys";
export type LocalizedTag = {
  key: string;
  zh: string;
  en: string;
};

export type Product = {
  slug: string;
  offerId?: string;
  module: ProductModule;
  tags: LocalizedTag[];
  priority: number;
  title: LocalizedText;
  badge: LocalizedText;
  summary: LocalizedText;
  detail: LocalizedText;
  moq: LocalizedText;
  materials: LocalizedText;
  useCases: LocalizedText[];
  highlights: LocalizedText[];
  specs: Array<{ label: LocalizedText; value: LocalizedText }>;
  seoKeywords: LocalizedKeywords;
  image: string;
  gallery?: string[];
  videos?: string[];
  sourceUrl?: string;
  sourcePrice?: string;
  sourceMinimumOrder?: string;
  sourceShippingLocation?: string;
};

export const pageLabels: Record<RouteKey, LocalizedText> = {
  home: { en: "Home", zh: "首页" },
  products: { en: "Products", zh: "产品目录" },
  solutions: { en: "Solutions", zh: "解决方案" },
  about: { en: "About Us", zh: "关于我们" },
  news: { en: "News", zh: "新闻中心" },
  faq: { en: "FAQ", zh: "FAQ" },
  contact: { en: "Get a Quote", zh: "获取报价" },
  privacy: { en: "Privacy", zh: "隐私政策" },
  refundReturn: { en: "Refund / Return Policy", zh: "退款与退换货政策" },
  terms: { en: "Terms & Conditions", zh: "条款与条件" },
};

export const desktopNav: RouteKey[] = [
  "home",
  "products",
  "solutions",
  "about",
  "news",
  "faq",
];

export const seoKeywordPools = {
  company: {
    en: [
      "Yaoshun Toys",
      "fort building kit",
      "fort building toy",
      "fort building kit manufacturer",
      "fort building kit factory",
      "ball and rod tent supplier",
      "toy OEM ODM factory",
      "B2B toy supplier",
      "custom toy manufacturer",
    ],
    zh: [
      "尧顺玩具",
      "玩具 OEM ODM工厂",
      "B2B玩具供应商",
      "定制玩具制造商",
      "益智玩具制造",
      "玩具出口交付",
    ],
  },
  products: {
    en: [
      "fort building kit",
      "fort building toy",
      "fort building kit manufacturer",
      "fort building kit factory",
      "ball and rod tent supplier",
      "wholesale fort building kits",
      "bulk fort building kits",
      "private label fort building kits",
      "custom make a fort toy manufacturer",
      "bulk buy make a fort toys",
      "bulk fort kits for schools",
      "fort building kit for preschools",
      "ball and rod tent",
      "DIY building toys",
      "STEM toy",
      "kids fort kit",
      "construction toy for kids",
      "glow in the dark fort building kit",
      "rotating ball fort building kit",
      "PP rods connector balls",
      "storage bag fort kit",
    ],
    zh: [
      "堡垒搭建套装",
      "STEM玩具",
      "搭建堡垒玩具",
      "堡垒拼搭玩具",
      "STEM搭建玩具",
      "DIY儿童搭建玩具",
      "夜光堡垒拼搭玩具",
      "旋转球堡垒拼搭玩具",
      "连接杆连接球",
      "收纳袋玩具套装",
    ],
  },
  factoryCapabilities: {
    en: [
      "custom plastic toy manufacturer",
      "precision injection molding manufacturer",
      "plastic extrusion manufacturer",
      "PVC PU ABS PC nylon tubing manufacturer",
      "custom plastic profiles",
      "interlocking plastic toy accessories",
      "AI plastic electronic toy products",
      "in-house mold development",
      "mold making and sampling",
      "assembly and packaging factory",
      "export-ready toy delivery",
      "7-15 days regular lead time",
    ],
    zh: [
      "塑胶玩具定制厂家",
      "精密注塑厂家",
      "塑胶挤出厂家",
      "PVC管 PU管 ABS管 PC管 尼龙管",
      "塑胶异型材定制",
      "拼插类塑胶玩具配件",
      "AI塑胶电子玩具",
      "自有模具开发",
      "开模打样",
      "组装包装工厂",
      "玩具出口交付",
      "7-15天常规交付",
    ],
  },
  customization: {
    en: [
      "toy OEM ODM customization",
      "private label toy production",
      "custom toy development",
      "custom building toy development",
      "custom toy packaging",
      "custom logo toy packaging",
      "sample-based processing",
      "drawing-based processing",
      "turnkey toy processing",
      "small batch trial production",
      "mass production toy supplier",
    ],
    zh: [
      "玩具OEM ODM定制",
      "私标玩具生产",
      "定制玩具",
      "玩具定制化开发",
      "搭建玩具定制开发",
      "包装定制",
      "彩盒包装定制",
      "Logo定制",
      "来样加工",
      "来图加工",
      "包工包料",
      "小批量试单",
      "大批量量产供应",
    ],
  },
  compliance: {
    en: [
      "RoHS toy supplier",
      "REACH toy supplier",
      "EN71 toy manufacturer",
      "ASTM F963 toy manufacturer",
      "ISO 9000 toy factory",
      "third-party compliance report support",
    ],
    zh: [
      "RoHS玩具供应商",
      "REACH玩具供应商",
      "EN71玩具厂家",
      "ASTM F963玩具厂家",
      "ISO9000玩具工厂",
      "第三方检测报告支持",
    ],
  },
} as const;

export const siteSeo = {
  defaultKeywords: {
    en: [
      "Yaoshun Toys",
      "fort building kit",
      "connector ball tent",
      "ball and rod tent",
      "kids tent building kit",
      "make a fort toy",
    ],
    zh: [
      "尧顺玩具",
      "玩具OEM ODM工厂",
      "B2B玩具供应商",
      "定制玩具制造商",
      "益智玩具制造",
      "玩具出口交付",
    ],
  },
};

export const sharedUi = {
  pageLinks: {
    eyebrow: { en: "Continue Exploring", zh: "继续浏览" },
    action: { en: "Open Page", zh: "打开页面" },
  },
  productCard: {
    action: { en: "Open Product Detail", zh: "查看详情" },
  },
  quoteForm: {
    title: { en: "Request a Quote", zh: "获取报价" },
    description: {
      en: "Share product direction, quantity, and timeline to start a structured quotation review.",
      zh: "填写产品方向、数量与时间要求，快速启动结构化报价评估。",
    },
    step: { en: "STEP 1 OF 1", zh: "第 1 步 / 共 1 步" },
    fields: {
      name: {
        label: { en: "Name", zh: "姓名" },
        placeholder: { en: "Your name", zh: "请输入姓名" },
      },
      company: {
        label: { en: "Company", zh: "公司名称" },
        placeholder: { en: "Your company name", zh: "请输入公司名称" },
      },
      email: {
        label: { en: "Email", zh: "邮箱" },
        placeholder: { en: "you@company.com", zh: "请输入邮箱" },
      },
      country: {
        label: { en: "Target Market / Country", zh: "目标市场 / 国家" },
        placeholder: {
          en: "e.g. US, Germany, UAE",
          zh: "例如：美国、德国、阿联酋",
        },
      },
      quantity: {
        label: { en: "Estimated Quantity", zh: "预估数量" },
        placeholder: { en: "e.g. 3000 units / SKU", zh: "例如：3000 件 / SKU" },
      },
      message: {
        label: { en: "Project Brief", zh: "项目需求说明" },
        placeholder: {
          en: "Include product type, material preference, packaging request, and target launch date.",
          zh: "请说明产品类型、材质偏好、包装要求与目标上市时间。",
        },
      },
    },
    submit: { en: "Submit For Evaluation", zh: "提交评估" },
    support: {
      en: "After submission, our team will follow up by email or WhatsApp. You can also reach us at {email} / {whatsapp}.",
      zh: "提交后我们会通过邮箱或 WhatsApp 跟进，也可直接联系 {email} / {whatsapp}。",
    },
  },
  siteShell: {
    mobileMenuAriaLabel: {
      en: "Toggle navigation menu",
      zh: "切换导航菜单",
    },
    mobileMenuLabel: { en: "Menu", zh: "菜单" },
    localeMenuLabel: { en: "Language / Region", zh: "语言 / 地区" },
    footerQuickLinks: { en: "Quick Links", zh: "快速链接" },
    footerContact: { en: "Contact", zh: "联系信息" },
    footerSalesChannelLabel: { en: "Sales Channel", zh: "业务渠道" },
    footerWhatsappLabel: { en: "WhatsApp", zh: "WhatsApp" },
    footerWebsiteLabel: { en: "Web", zh: "官网" },
  },
};

export const companyProfile = {
  brand: {
    en: "Dongguan Yaoshun Technology",
    zh: "东莞市尧顺科技",
  },
  brandShort: {
    en: "Yaoshun",
    zh: "尧顺",
  },
  companyName: {
    en: "Dongguan Yaoshun Technology Co., Ltd.",
    zh: "东莞市尧顺科技有限公司",
  },
  tagline: {
    en: "Dongguan source toy factory for building toys, custom toys, toy OEM/ODM, custom development, in-house mold development, injection molding, assembly, packaging, and export-ready delivery.",
    zh: "尧顺是东莞源头玩具工厂，支持搭建玩具、定制玩具、玩具 OEM/ODM、定制化开发、自有模具开发、注塑、组装包装与出口交付。",
  },
  seoDescription: {
    en: "Dongguan Yaoshun Technology Co., Ltd., founded on August 26, 2016, is a Dongguan source factory for building toys, custom toys, toy OEM/ODM, and custom development. We develop and manufacture educational toys, AI toy plastic electronic products, interlocking plastic toys, precision injection-molded parts, PVC/PU/ABS/PC/nylon tubing, custom profiles, and mold-based OEM/ODM programs for global buyers.",
    zh: "东莞市尧顺科技有限公司成立于 2016 年 8 月 26 日，是支持搭建玩具、定制玩具、玩具 OEM/ODM 与定制化开发的东莞源头工厂，专注益智玩具、AI塑胶电子产品、拼插类塑胶玩具、精密注塑件、PVC/PU/ABS/PC/尼龙管材型材及模具类 OEM/ODM 项目的研发与生产。",
  },
  businessType: {
    en: "Dongguan source factory and OEM/ODM manufacturer for building toys, custom toys, educational toys, AI toy plastic electronics, custom development, precision injection molding, custom tubing, profiles, and mold development",
    zh: "专注搭建玩具、定制玩具、益智玩具、AI玩具塑胶电子、玩具定制化开发、精密注塑、模具开发、塑胶管材与异型材定制的东莞源头工厂及 OEM/ODM 制造商",
  },
  expertise: [
    {
      en: "Dongguan source toy factory supply",
      zh: "东莞源头玩具工厂供应",
    },
    {
      en: "building toy and custom toy development",
      zh: "搭建玩具与定制玩具开发",
    },
    {
      en: "custom toy OEM/ODM development",
      zh: "玩具 OEM/ODM 定制化开发",
    },
    {
      en: "educational toy design and manufacturing",
      zh: "益智玩具设计与制造",
    },
    {
      en: "interlocking plastic toy development",
      zh: "拼插类塑胶玩具开发",
    },
    {
      en: "precision injection molded components",
      zh: "高精密注塑件制造",
    },
    {
      en: "PVC, PU, ABS, PC and nylon tubing extrusion",
      zh: "PVC、PU、ABS、PC、尼龙管材挤出",
    },
    {
      en: "custom plastic profiles and mold development",
      zh: "塑胶异型材与模具开发",
    },
    {
      en: "AI toy and smart plastic electronic product development",
      zh: "AI玩具与塑胶电子产品开发",
    },
    {
      en: "OEM and ODM manufacturing",
      zh: "OEM 与 ODM 制造",
    },
    {
      en: "assembly, packaging and export coordination",
      zh: "组装、包装与出口交付协同",
    },
    {
      en: "sample-based and drawing-based processing",
      zh: "来样与来图加工",
    },
    {
      en: "medical-grade and food-contact tubing support",
      zh: "医疗级与食品接触级管材支持",
    },
    {
      en: "third-party compliance report coordination",
      zh: "第三方合规检测报告协同",
    },
    {
      en: "automated inspection and traceable quality control",
      zh: "自动化检测与可追溯质量控制",
    },
  ],
  serviceRegions: [
    { en: "Europe", zh: "欧洲" },
    { en: "North America & Central America", zh: "北美及中美洲" },
    { en: "East Asia & Southeast Asia", zh: "东亚及东南亚" },
    { en: "Oceania", zh: "大洋洲" },
  ],
  contactLanguages: [
    { en: "English", zh: "英语" },
    { en: "Chinese", zh: "中文" },
  ],
  foundedYear: "2016-08-26",
  email: "yaoshuntoys@gmail.com",
  phone: "+86 18780083256",
  whatsapp: "8618780083256",
  website: "https://www.yaoshuntoys.com/",
  address: {
    en: "No. 3 Weixing Road, Chashan Town, Dongguan, Guangdong, China",
    zh: "中国广东省东莞市茶山镇伟兴路3号",
  },
};

export const visualAssets = {
  companyHero:
    "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/products-q92/1601110728943/1.webp",
  factoryHero:
    "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/products-q92/1601730326005/1.webp",
  factoryFloor:
    "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/products-q92/1600900125789/1.webp",
  toyLearning:
    "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/products-q92/1601724919450/1.webp",
  profileSeries:
    "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/products-q92/1601730435470/1.webp",
  engineeringSupport:
    "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/products-q92/1601316583146/1.webp",
  rdLab:
    "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/products-q92/1601728749802/3.webp",
  craftsmanship:
    "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/products-q92/1601213973459/1.webp",
  complianceLab:
    "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/products-q92/1601214840405/1.webp",
  oemWorkflow:
    "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/products-q92/1601729187617/1.webp",
  projectEngineering:
    "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/products-q92/1601313719232/3.webp",
} as const;

export const siteStats = [
  {
    value: { en: "2016", zh: "2016" },
    label: { en: "Company established", zh: "公司成立" },
  },
  {
    value: { en: "OEM/ODM", zh: "OEM/ODM" },
    label: { en: "Custom project support", zh: "定制项目支持" },
  },
  {
    value: { en: "7-15 Days", zh: "7-15 天" },
    label: { en: "Regular lead time", zh: "常规交付周期" },
  },
  {
    value: { en: "RoHS / REACH", zh: "RoHS / REACH" },
    label: { en: "Compliance support", zh: "合规支持" },
  },
];

export const routeJourneys: Record<RouteKey, RouteKey[]> = {
  home: ["products", "solutions", "contact"],
  products: ["solutions", "about", "contact"],
  solutions: ["products", "about", "contact"],
  about: ["news", "faq", "contact"],
  news: ["products", "solutions", "contact"],
  faq: ["products", "contact", "privacy"],
  contact: ["products", "privacy", "refundReturn"],
  privacy: ["terms", "refundReturn", "contact"],
  refundReturn: ["terms", "contact", "products"],
  terms: ["privacy", "refundReturn", "about"],
};
