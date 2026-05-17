import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(config: ConfigService) {
    const isDev = config.get<string>('NODE_ENV') === 'development';
    const connectionTimeoutMillis = Number(
      config.get<string>('DB_CONNECTION_TIMEOUT_MS') || 10000,
    );
    const idleTimeoutMillis = Number(
      config.get<string>('DB_IDLE_TIMEOUT_MS') || 30000,
    );
    const connectionString =
      config.get<string>('DATABASE_APP_URL') ||
      (isDev ? config.get<string>('DIRECT_URL') : undefined) ||
      config.get<string>('DATABASE_URL') ||
      config.get<string>('DIRECT_URL');

    const pool = new Pool({
      connectionString,
      max: isDev ? 10 : 20,
      idleTimeoutMillis,
      connectionTimeoutMillis,
    });

    const adapter = new PrismaPg(pool);
    super({
      adapter,
      log: isDev ? ['query', 'info', 'warn', 'error'] : ['error'],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
    } catch (error) {
      console.error('Failed to connect to database:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
