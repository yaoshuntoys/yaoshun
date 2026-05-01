export const siteCopy = {
  brandTagline: {
    en: "Educational toys, AI toy plastic electronics, custom tubing, and precision plastic manufacturing with reliable global delivery.",
    zh: "专注益智玩具、AI塑胶电子、定制管材与精密塑胶制造，并提供稳定全球交付。",
  },
  companyName: {
    en: "Dongguan Yaoshun Technology Co., Ltd.",
    zh: "东莞市尧顺科技有限公司",
  },
  companyIntro: {
    en: "Founded in 2016, Yaoshun is a manufacturer focused on educational toys, AI toy plastic electronic products, interlocking plastic toys, precision injection molding, custom tubing, and profiles, with OEM/ODM development from design and tooling to delivery.",
    zh: "尧顺成立于 2016 年，专注益智玩具、AI塑胶电子产品、拼插类塑胶玩具、精密注塑件及管材型材配套，提供从设计、开模到交付的 OEM/ODM 一站式支持。",
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

export const navItems = [
  {key: "home", href: "", label: {en: "Home", zh: "首页"}},
  {key: "products", href: "/products", label: {en: "Products", zh: "产品"}},
  {key: "solutions", href: "/solutions", label: {en: "Solutions", zh: "解决方案"}},
  {key: "news", href: "/news", label: {en: "News", zh: "新闻"}},
  {key: "about", href: "/about", label: {en: "About Us", zh: "关于我们"}},
] as const;
