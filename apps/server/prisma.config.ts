import { defineConfig } from 'prisma/config';

import { loadEnvFiles } from './src/config/env';

loadEnvFiles();

export default defineConfig({
  schema: 'prisma/schema',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: process.env.DIRECT_URL || process.env.DATABASE_URL,
  },
});
