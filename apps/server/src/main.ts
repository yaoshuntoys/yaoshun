import { ConfigService } from '@nestjs/config';

import { createApp } from './bootstrap/app';
import { shouldEnableSwagger } from './bootstrap/swagger';
import { loadEnvFiles } from './config/env';

loadEnvFiles();

export { createApp };

async function bootstrap() {
  const app = await createApp();
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') ?? 8010;

  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
  if (shouldEnableSwagger(configService)) {
    console.log(`Swagger docs: http://localhost:${port}/docs`);
  }
}

if (process.env.VERCEL !== '1') {
  void bootstrap();
}
