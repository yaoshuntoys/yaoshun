import type { SeedPrisma } from './client';

const newsItems = [
  {
    slug: 'custom-130-piece-glow-fort-kit-open-for-private-label-projects',
    category: 'product',
    titleZh: '定制130件夜光堡垒套装开放贴牌项目沟通',
    titleEn: 'Custom 130-Piece Glow Fort Kit Open For Private Label Projects',
    summaryZh:
      '130件夜光堡垒拼搭套装以太空主题彩盒为参考，适合品牌客户开展贴牌和 OEM/ODM 包装评估。',
    summaryEn:
      'The 130-piece glow fort kit uses a space-theme color box reference for private-label and OEM/ODM packaging review.',
    contentZh:
      '定制130件夜光堡垒拼搭套装已开放贴牌项目沟通，当前参考方向为太空主题彩盒，适合需要夜光卖点和清晰件数配置的客户。',
    contentEn:
      'The custom 130-piece glow-in-the-dark fort building kit is now open for private-label discussion, with a space-theme color box direction.',
    cover:
      '/site/news/custom-130-piece-glow-fort-kit-open-for-private-label-projects/1.webp',
    galleryImages: [
      '/site/news/custom-130-piece-glow-fort-kit-open-for-private-label-projects/1.webp',
    ],
    featuredTopic: true,
    relatedProduct: {
      productId: '2026050708',
      label: {
        zh: '定制130件夜光堡垒拼搭套装',
        en: 'Custom Glow in the Dark 130-Piece Fort Building Kit',
      },
    },
    seoKeywords: {
      zh: ['130件夜光堡垒套装', '贴牌夜光堡垒玩具'],
      en: ['130-piece glow fort kit', 'private label glow fort toy'],
    },
    publishedAt: new Date('2026-05-07'),
  },
];

export async function seedNews(prisma: SeedPrisma) {
  for (const [index, item] of newsItems.entries()) {
    await prisma.news.upsert({
      where: { slug: item.slug },
      update: { ...item, status: 'published', sortOrder: index + 1 },
      create: { ...item, status: 'published', sortOrder: index + 1 },
    });
  }
}
