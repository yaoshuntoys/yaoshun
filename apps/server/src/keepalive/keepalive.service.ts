import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class KeepaliveService {
  constructor(private readonly prisma: PrismaService) {}

  async pingDatabase() {
    const checkedAt = new Date();
    const [databaseTime] = await this.prisma.$queryRaw<
      { current_timestamp: Date }[]
    >`SELECT CURRENT_TIMESTAMP`;

    await this.prisma.operationLog.create({
      data: {
        module: '系统保活',
        action: '数据库保活',
        details: `Keepalive ping at ${checkedAt.toISOString()}`,
        username: 'system',
      },
    });

    return {
      status: 'ok',
      database: 'up',
      checkedAt: checkedAt.toISOString(),
      databaseTime: databaseTime?.current_timestamp?.toISOString?.() ?? null,
    };
  }
}
