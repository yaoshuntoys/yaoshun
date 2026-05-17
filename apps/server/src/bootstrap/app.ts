import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from '../app.module';
import { assertRequiredEnv } from './env';
import { configureCors, configureHttp, configureNestDefaults } from './http';
import { createAppLogger } from './logger';
import { configureSwagger } from './swagger';

export async function createApp() {
  assertRequiredEnv(['DATABASE_URL', 'JWT_SECRET']);

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: createAppLogger(),
  });
  const configService = app.get(ConfigService);

  configureHttp(app);
  configureCors(app, configService);
  configureNestDefaults(app);
  configureSwagger(app, configService);

  return app;
}
