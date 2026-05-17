import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { Public } from '../auth/public.decorator';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('系统健康检查')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: PrismaHealthIndicator,
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  @Public()
  @Get()
  @HealthCheck()
  @ApiOperation({ summary: '系统状态检查' })
  check() {
    const timeout = Number(this.config.get<string>('DB_HEALTH_TIMEOUT_MS') || 10000);

    return this.health.check([
      () => this.db.pingCheck('database', this.prisma, { timeout }),
    ]);
  }
}
