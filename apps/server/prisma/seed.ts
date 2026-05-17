import { loadEnvFiles } from '../src/config/env';
import { createSeedClient } from './seed/client';
import { runSeedModules } from './seed/index';

loadEnvFiles();

const { prisma, pool } = createSeedClient();

async function main() {
  console.log('Start seeding Yaoshun admin data...');
  await runSeedModules(prisma);
  console.log('Yaoshun seed completed');
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
