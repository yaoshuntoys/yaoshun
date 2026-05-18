export const siteCopy = {
  brandTagline: {
    en: "Dongguan source toy factory for building toys, custom toys, toy OEM/ODM, custom development, mold making, assembly, packaging, and global delivery.",
    zh: "尧顺是东莞源头玩具工厂，支持搭建玩具、定制玩具、玩具 OEM/ODM、定制化开发、开模注塑、组装包装与全球交付。",
  },
  companyName: {
    en: "Dongguan Yaoshun Technology Co., Ltd.",
    zh: "东莞市尧顺科技有限公司",
  },
  companyIntro: {
    en: "Founded in 2016, Yaoshun is a Dongguan source factory focused on building toys, custom toys, educational toys, AI toy plastic electronic products, interlocking plastic toys, precision injection molding, custom tubing, and profiles, with toy OEM/ODM and custom development from design and tooling to delivery.",
    zh: "尧顺成立于 2016 年，是一家东莞源头工厂，专注搭建玩具、定制玩具、益智玩具、AI塑胶电子产品、拼插类塑胶玩具、精密注塑件及管材型材配套，提供从设计、开模到交付的玩具 OEM/ODM 与定制化开发支持。",
  },
  contact: {
    email: "yaoshuntoys@gmail.com",
    phone: "+86 18780083256",
    website: "https://www.yaoshuntoys.com/",
    address: {
      en: "No. 3 Weixing Road, Chashan Town, Dongguan, Guangdong, China",
      zh: "中国广东省东莞市茶山镇伟兴路3号",
    },
  },
  headerCta: {en: "Get in Touch", zh: "联系我们"},
} as const;

export const socialContactLinks = [
  {
    key: "whatsapp",
    label: { en: "WhatsApp", zh: "WhatsApp" },
    href: "https://wa.me/8618780083256",
    trackingMethod: "whatsapp",
  },
  {
    key: "facebook",
    label: { en: "Facebook", zh: "Facebook" },
    href: "",
    trackingMethod: "facebook",
  },
] as const;

export const navItems = [
  {key: "home", href: "", label: {en: "Home", zh: "首页"}},
  {key: "products", href: "/products", label: {en: "Products", zh: "产品目录"}},
  {key: "solutions", href: "/solutions", label: {en: "Solutions", zh: "解决方案"}},
  {key: "news", href: "/news", label: {en: "News", zh: "新闻中心"}},
  {key: "about", href: "/about", label: {en: "About Us", zh: "关于我们"}},
] as const;

export const siteShellUi = {
  mobileMenuAriaLabel: {
    en: "Toggle navigation menu",
    zh: "切换导航菜单",
  },
  localeMenuLabel: {
    en: "Language / Region",
    zh: "语言 / 地区",
  },
} as const;
