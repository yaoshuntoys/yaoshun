import { seedAuth } from './auth';
import type { SeedPrisma } from './client';
import { seedFaqs } from './faqs';
import { seedMedia } from './media';
import { seedNews } from './news';
import { seedPartners } from './partners';
import { seedProducts } from './products';
import { seedSettings } from './settings';

type SeedStep = {
  name: string;
  run: (prisma: SeedPrisma) => Promise<void>;
};

const seedSteps: SeedStep[] = [
  { name: 'RBAC and accounts', run: seedAuth },
  { name: 'Settings and page configs', run: seedSettings },
  { name: 'Products', run: seedProducts },
  { name: 'News', run: seedNews },
  { name: 'FAQ', run: seedFaqs },
  { name: 'Partners', run: seedPartners },
  { name: 'Media folders', run: seedMedia },
];

export async function runSeedModules(prisma: SeedPrisma) {
  for (const step of seedSteps) {
    await step.run(prisma);
    console.log(`${step.name} seeded`);
  }
}
