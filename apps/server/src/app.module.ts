import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { SettingModule } from './setting/setting.module';
import { FileModule } from './file/file.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { isAbsolute, join } from 'path';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { HealthModule } from './health/health.module';
import { FolderModule } from './folder/folder.module';
import { MessageModule } from './message/message.module';
import { LogModule } from './log/log.module';
import { OperationLogInterceptor } from './log/interceptors/operation-log.interceptor';
import { MailModule } from './mail/mail.module';
import { ProductModule } from './product/product.module';
import { NewsModule } from './news/news.module';
import { FaqModule } from './faq/faq.module';
import { PartnerModule } from './partner/partner.module';
import { PageModule } from './page/page.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { PermissionModule } from './permission/permission.module';
import { PermissionsGuard } from './permission/guards/permissions.guard';
import { getEnvFilePaths } from './config/env';
import { KeepaliveModule } from './keepalive/keepalive.module';
import { TranslationModule } from './translation/translation.module';
import { SiteModule } from './site/site.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: getEnvFilePaths(),
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get<number>('THROTTLE_TTL') || 60000,
          limit: config.get<number>('THROTTLE_LIMIT') || 100,
        },
      ],
    }),
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const uploadDir = config.get<string>('UPLOAD_DIR') || 'uploads';
        if (isAbsolute(uploadDir)) {
          return [];
        }

        return [
          {
            rootPath: join(__dirname, '..', uploadDir),
            serveRoot: `/${uploadDir}`,
          },
        ];
      },
    }),
    PrismaModule,
    AccountModule,
    AuthModule,
    SettingModule,
    MessageModule,
    FileModule,
    HealthModule,
    FolderModule,
    LogModule,
    MailModule,
    ProductModule,
    NewsModule,
    FaqModule,
    PartnerModule,
    PageModule,
    DashboardModule,
    PermissionModule,
    KeepaliveModule,
    TranslationModule,
    SiteModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: OperationLogInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('{*path}');
  }
}
