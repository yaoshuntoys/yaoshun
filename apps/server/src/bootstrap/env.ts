export function assertRequiredEnv(requiredKeys: string[]) {
  const missing = requiredKeys.filter((key) => !process.env[key]);
  if (missing.length === 0) {
    return;
  }

  console.error(
    `[Startup] Missing required environment variables: ${missing.join(', ')}`,
  );
  process.exit(1);
}
