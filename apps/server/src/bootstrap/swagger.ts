import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NextFunction, Request, Response } from 'express';
import { timingSafeEqual } from 'node:crypto';

function isEnabled(value?: string) {
  return ['1', 'true', 'yes', 'on'].includes((value ?? '').toLowerCase());
}

export function shouldEnableSwagger(configService: ConfigService) {
  const configured = configService.get<string>('SWAGGER_ENABLED');
  if (configured !== undefined) {
    return isEnabled(configured);
  }

  const nodeEnv = configService.get<string>('NODE_ENV') ?? 'development';
  return ['development', 'local', 'test'].includes(nodeEnv);
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function protectSwagger(
  app: NestExpressApplication,
  username: string,
  password: string,
) {
  app.use(
    ['/docs', '/docs-json'],
    (req: Request, res: Response, next: NextFunction) => {
      const authorization = req.headers.authorization;
      const unauthorized = () => {
        res.setHeader('WWW-Authenticate', 'Basic realm="Swagger"');
        return res.status(401).send('Unauthorized');
      };

      if (!authorization?.startsWith('Basic ')) {
        return unauthorized();
      }

      const credential = Buffer.from(authorization.slice(6), 'base64').toString(
        'utf8',
      );
      const separatorIndex = credential.indexOf(':');
      const providedUsername =
        separatorIndex >= 0 ? credential.slice(0, separatorIndex) : '';
      const providedPassword =
        separatorIndex >= 0 ? credential.slice(separatorIndex + 1) : '';

      if (
        safeEqual(providedUsername, username) &&
        safeEqual(providedPassword, password)
      ) {
        return next();
      }

      return unauthorized();
    },
  );
}

export function configureSwagger(
  app: NestExpressApplication,
  configService: ConfigService,
) {
  if (!shouldEnableSwagger(configService)) {
    return;
  }

  const swaggerUsername = configService.get<string>('SWAGGER_USERNAME');
  const swaggerPassword = configService.get<string>('SWAGGER_PASSWORD');
  if (swaggerUsername && swaggerPassword) {
    protectSwagger(app, swaggerUsername, swaggerPassword);
  }

  const swaggerConfig = new DocumentBuilder()
    .setTitle('尧顺玩具官网管理后台 API')
    .setDescription('基于 NestJS + Prisma + Supabase PostgreSQL 的管理后台系统')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);
}
