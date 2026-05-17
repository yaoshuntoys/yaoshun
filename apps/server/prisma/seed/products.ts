import type { SeedPrisma } from './client';

const products = [
  {
    productId: '2026050701',
    slug: '2026050701',
    category: 'finished-toys',
    titleZh: 'LONDY Little Explorer 69件儿童堡垒拼搭套装',
    titleEn: 'LONDY Little Explorer 69-Piece Fort Building Kit',
    summaryZh:
      '69件 LONDY Little Explorer 套装，配置蓝色杆、混色连接球、夹子、收纳袋和印花帐篷布。',
    summaryEn:
      'A 69-piece LONDY Little Explorer set with blue rods, mixed-color connector balls, clips, storage bag, and printed tent blanket.',
    descriptionZh:
      '适合品牌客户做堡垒拼搭玩具、益智玩具和礼品套装项目，支持印花毯、收纳袋和彩盒包装定制。',
    descriptionEn:
      'Suitable for brand fort-building toy, educational toy, and gift-set projects with custom printed blanket, storage bag, and color-box packaging.',
    specs: [
      { labelZh: '件数', labelEn: 'Piece Count', value: '69 pcs' },
      {
        labelZh: '材质',
        labelEn: 'Material',
        value: 'PP plastic rods and balls',
      },
      { labelZh: '适用年龄', labelEn: 'Age Range', value: 'Ages 4+' },
    ],
    productAttributes: [
      {
        key: { zh: '品牌', en: 'Brand Name' },
        value: { zh: 'LONDY', en: 'LONDY' },
      },
      {
        key: { zh: '产地', en: 'Place of Origin' },
        value: { zh: '中国广东', en: 'Guangdong, China' },
      },
    ],
    pricing: {
      display: { zh: '询价', en: 'Contact us' },
      minOrder: { zh: '请与业务确认', en: 'Confirm with sales team' },
    },
    customizationOptions: [
      { label: { zh: '印花毯定制', en: 'Custom printed blanket' } },
      { label: { zh: 'OEM/ODM 包装', en: 'OEM/ODM packaging' } },
    ],
    seoKeywords: {
      zh: ['堡垒拼搭玩具', '儿童搭建套装', '玩具OEM'],
      en: ['fort building toy', 'kids building kit', 'toy OEM'],
    },
    images: ['/site/products/2026050701/1.webp'],
    cover: '/site/products/2026050701/1.webp',
  },
  {
    productId: '2026050708',
    slug: '2026050708',
    category: 'finished-toys',
    titleZh: '定制130件夜光堡垒拼搭套装',
    titleEn: 'Custom Glow in the Dark 130-Piece Fort Building Kit',
    summaryZh:
      '130件夜光堡垒拼搭彩盒定制款，可调整太空主题盒面和 OEM/ODM 包装。',
    summaryEn:
      'Custom 130-piece glow-in-the-dark fort set with a space-theme color box and OEM/ODM packing.',
    descriptionZh:
      '中等件数配置适合礼品渠道、私标项目和夜光主题玩具开发，支持盒面、说明书、LOGO、配色和外箱方案定制。',
    descriptionEn:
      'Mid-size configuration for gift channels, private-label projects, and glow-theme toy development, supporting box artwork, manuals, logos, colors, and master carton planning.',
    specs: [
      { labelZh: '件数', labelEn: 'Piece Count', value: '130 pcs' },
      { labelZh: '主题', labelEn: 'Theme', value: 'Glow / Space' },
      { labelZh: '合作方式', labelEn: 'Cooperation', value: 'OEM/ODM' },
    ],
    pricing: {
      display: { zh: '按数量报价', en: 'Quoted by quantity' },
    },
    customizationOptions: [
      { label: { zh: '太空主题彩盒', en: 'Space-theme color box' } },
      { label: { zh: '夜光件比例调整', en: 'Glow-part ratio adjustment' } },
    ],
    seoKeywords: {
      zh: ['130件夜光堡垒套装', '贴牌夜光堡垒玩具', 'OEM夜光玩具包装'],
      en: [
        '130-piece glow fort kit',
        'private label glow fort toy',
        'OEM glow toy packaging',
      ],
    },
    images: ['/site/products/2026050708/1.webp'],
    cover: '/site/products/2026050708/1.webp',
  },
];

export async function seedProducts(prisma: SeedPrisma) {
  for (const [index, product] of products.entries()) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: { ...product, status: 'active', sortOrder: index + 1 },
      create: { ...product, status: 'active', sortOrder: index + 1 },
    });
  }
}
