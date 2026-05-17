import type { SeedPrisma } from './client';

const pageDefinitions = [
  {
    key: 'home',
    title: '首页',
    description: '维护官网首页首屏、核心卖点、精选商品与询盘引导配置。',
    path: '/',
  },
  {
    key: 'products',
    title: '产品目录',
    description: '维护产品目录页 SEO、Hero、精选商品、分类说明与展示规则。',
    path: '/products',
  },
  {
    key: 'news',
    title: '新闻中心',
    description: '维护新闻列表页 SEO、首屏、分类说明、推荐新闻与 CTA。',
    path: '/news',
  },
  {
    key: 'faq',
    title: '常见问题',
    description: '维护 FAQ 页面 SEO、首屏、分类说明、展示规则与 CTA。',
    path: '/faq',
  },
  {
    key: 'about',
    title: '关于我们',
    description: '维护公司简介、工厂/证书多媒体、发展历程与企业文化。',
    path: '/about',
  },
  {
    key: 'solutions',
    title: '解决方案',
    description: '维护解决方案页面 SEO、服务说明、流程区块与 CTA。',
    path: '/solutions',
  },
  {
    key: 'privacy',
    title: '隐私政策',
    description: '维护隐私政策 SEO、正文富文本和更新时间。',
    path: '/privacy',
  },
  {
    key: 'terms',
    title: '服务条款',
    description: '维护服务条款 SEO、正文富文本和更新时间。',
    path: '/terms',
  },
];

export async function seedSettings(prisma: SeedPrisma) {
  await prisma.enterpriseSetting.upsert({
    where: { id: 1 },
    update: {
      companyName: '东莞市尧顺科技有限公司',
      companyNameEn: 'Dongguan Yaoshun Technology Co., Ltd.',
      brandName: '尧顺玩具',
      brandNameEn: 'Yaoshun Toys',
      companyLogo: '/favicon-rounded-192.png',
      contactEmail: 'yaoshuntoys@gmail.com',
      contactPhone: '+86 18780083256',
      whatsapp: '+86 18780083256',
      wechat: '',
      address: '中国广东省东莞市茶山镇伟兴路3号',
      addressEn: 'No. 3, Weixing Road, Chashan Town, Dongguan, Guangdong, China',
      foundedAt: '2016-08-26',
      registeredCapital: '300 万元人民币',
      businessScope:
        '搭建玩具、定制玩具、益智玩具、拼插类塑胶玩具、定制管材型材、高精密注塑件以及玩具 OEM/ODM 定制化开发。',
      keywords:
        '东莞市尧顺科技有限公司,Yaoshun Toys,Dongguan Yaoshun Technology,玩具OEM,玩具ODM,搭建玩具,定制玩具,益智玩具,塑胶玩具,精密注塑',
      description:
        '东莞市尧顺科技有限公司成立于 2016 年，是一家集设计、开模、生产、质控与出口协同于一体的东莞源头玩具工厂，为全球客户提供搭建玩具、定制玩具与玩具 OEM/ODM 定制化开发服务。',
      website: 'https://www.yaoshuntoys.com',
      copyright: 'Copyright © Dongguan Yaoshun Technology Co., Ltd.',
      icp: '',
    },
    create: {
      id: 1,
      companyName: '东莞市尧顺科技有限公司',
      companyNameEn: 'Dongguan Yaoshun Technology Co., Ltd.',
      brandName: '尧顺玩具',
      brandNameEn: 'Yaoshun Toys',
      companyLogo: '/favicon-rounded-192.png',
      contactEmail: 'yaoshuntoys@gmail.com',
      contactPhone: '+86 18780083256',
      whatsapp: '+86 18780083256',
      wechat: '',
      address: '中国广东省东莞市茶山镇伟兴路3号',
      addressEn: 'No. 3, Weixing Road, Chashan Town, Dongguan, Guangdong, China',
      foundedAt: '2016-08-26',
      registeredCapital: '300 万元人民币',
      businessScope:
        '搭建玩具、定制玩具、益智玩具、拼插类塑胶玩具、定制管材型材、高精密注塑件以及玩具 OEM/ODM 定制化开发。',
      keywords:
        '东莞市尧顺科技有限公司,Yaoshun Toys,Dongguan Yaoshun Technology,玩具OEM,玩具ODM,搭建玩具,定制玩具,益智玩具,塑胶玩具,精密注塑',
      description:
        '东莞市尧顺科技有限公司成立于 2016 年，是一家集设计、开模、生产、质控与出口协同于一体的东莞源头玩具工厂，为全球客户提供搭建玩具、定制玩具与玩具 OEM/ODM 定制化开发服务。',
      website: 'https://www.yaoshuntoys.com',
      copyright: 'Copyright © Dongguan Yaoshun Technology Co., Ltd.',
      icp: '',
    },
  });

  await prisma.mailSetting.upsert({
    where: { id: 1 },
    update: {
      smtpHost: process.env.EMAIL_HOST || 'smtp.gmail.com',
      smtpPort: Number(process.env.EMAIL_PORT || 465),
      smtpSecure: (process.env.EMAIL_SECURE || 'true').toLowerCase() !== 'false',
      username: process.env.EMAIL_USER || 'yaoshuntoys@gmail.com',
      password: process.env.EMAIL_PASS || '',
      fromName: process.env.EMAIL_FROM_NAME || 'Yaoshun Toys',
      fromEmail:
        process.env.EMAIL_FROM ||
        process.env.EMAIL_USER ||
        'yaoshuntoys@gmail.com',
      notifyOnContact: true,
      notifyOnPasswordReset: true,
    },
    create: {
      id: 1,
      smtpHost: process.env.EMAIL_HOST || 'smtp.gmail.com',
      smtpPort: Number(process.env.EMAIL_PORT || 465),
      smtpSecure: (process.env.EMAIL_SECURE || 'true').toLowerCase() !== 'false',
      username: process.env.EMAIL_USER || 'yaoshuntoys@gmail.com',
      password: process.env.EMAIL_PASS || '',
      fromName: process.env.EMAIL_FROM_NAME || 'Yaoshun Toys',
      fromEmail:
        process.env.EMAIL_FROM ||
        process.env.EMAIL_USER ||
        'yaoshuntoys@gmail.com',
      notifyOnContact: true,
      notifyOnPasswordReset: true,
    },
  });

  for (const [index, page] of pageDefinitions.entries()) {
    await prisma.sitePage.upsert({
      where: { key: page.key },
      update: { ...page, sortOrder: index + 1 },
      create: { ...page, sortOrder: index + 1 },
    });
  }
}
