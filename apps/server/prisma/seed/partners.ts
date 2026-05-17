import type { SeedPrisma } from './client';

const partners = [
  { nameZh: '玩具品牌客户', nameEn: 'Toy Brand Clients' },
  { nameZh: '跨境电商团队', nameEn: 'Cross-Border E-Commerce Teams' },
  { nameZh: '礼品渠道客户', nameEn: 'Gift Channel Buyers' },
  { nameZh: 'OEM/ODM 项目客户', nameEn: 'OEM/ODM Project Buyers' },
];

export async function seedPartners(prisma: SeedPrisma) {
  for (const [index, partner] of partners.entries()) {
    await prisma.partner.upsert({
      where: { id: index + 1 },
      update: { ...partner, status: 'active', sortOrder: index + 1 },
      create: { ...partner, status: 'active', sortOrder: index + 1 },
    });
  }
}
