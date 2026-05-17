import { resolve } from 'path';
import * as dotenv from 'dotenv';

export function getRuntimeEnvironment() {
  return (
    process.env.VERCEL_ENV ||
    process.env.APP_ENVIRONMENT ||
    process.env.NODE_ENV ||
    'development'
  );
}

export function getEnvFilePaths() {
  const environments = [
    process.env.VERCEL_ENV,
    process.env.APP_ENVIRONMENT,
    process.env.NODE_ENV,
    getRuntimeEnvironment(),
  ].filter(Boolean);

  const candidates = environments.flatMap((environment) => [
    `.env.${environment}.local`,
    `.env.${environment}`,
  ]);

  return [...new Set([...candidates, '.env.local', '.env'])];
}

export function loadEnvFiles(basePath = process.cwd()) {
  for (const filePath of getEnvFilePaths()) {
    dotenv.config({ path: resolve(basePath, filePath) });
  }
}
