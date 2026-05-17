import type { SeedPrisma } from './client';

const faqs = [
  {
    categoryKey: 'oem-odm',
    categoryLabelZh: 'OEM/ODM',
    categoryLabelEn: 'OEM/ODM',
    questionZh: '是否支持 OEM 与 ODM 合作？',
    questionEn: 'Do you support OEM and ODM cooperation?',
    answerZh:
      '支持。可覆盖需求接收、工程评审、打样、量产到出货交接的完整 OEM/ODM 流程。',
    answerEn:
      'Yes. We support OEM and ODM workflows from requirement intake, engineering review, sampling, mass production, to shipment handoff.',
  },
  {
    categoryKey: 'moq',
    categoryLabelZh: 'MOQ 与交期',
    categoryLabelEn: 'MOQ & Lead Time',
    questionZh: '常见 MOQ 是多少？',
    questionEn: 'What is the typical MOQ?',
    answerZh:
      'MOQ 取决于产品结构、模具复杂度和包装配置，通常会按数量梯度给出阶梯报价。',
    answerEn:
      'MOQ depends on product structure, mold complexity, and packaging configuration. We usually provide tiered pricing by quantity brackets.',
  },
];

export async function seedFaqs(prisma: SeedPrisma) {
  for (const [index, faq] of faqs.entries()) {
    await prisma.faqItem.upsert({
      where: { id: index + 1 },
      update: { ...faq, status: 'active', sortOrder: index + 1 },
      create: { ...faq, status: 'active', sortOrder: index + 1 },
    });
  }
}
