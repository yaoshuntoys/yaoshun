import {
  Controller,
  Get,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { Public } from '../auth/public.decorator';
import { KeepaliveService } from './keepalive.service';

@ApiTags('数据库保活')
@Controller('keepalive')
export class KeepaliveController {
  constructor(
    private readonly keepaliveService: KeepaliveService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Get('database')
  @ApiOperation({ summary: 'PostgreSQL weekly keepalive ping' })
  pingDatabase(@Headers('authorization') authorization?: string) {
    const cronSecret = this.configService.get<string>('CRON_SECRET');

    if (cronSecret && authorization !== `Bearer ${cronSecret}`) {
      throw new UnauthorizedException('Invalid cron authorization');
    }

    return this.keepaliveService.pingDatabase();
  }
}
