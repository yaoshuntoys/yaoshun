import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

import { getPaginationParams, buildPaginatedResult } from '../common/utils/pagination.util';
import { PrismaService } from '../prisma/prisma.service';
import { QueryOperationLogDto } from './dto/query-operation-log.dto';

interface CreateOperationLogInput {
  userId?: number;
  username?: string;
  module: string;
  action: string;
  details: string;
  ip?: string;
  userAgent?: string;
}

@Injectable()
export class LogService {
  private readonly db: PrismaClient;

  constructor(prisma: PrismaService) {
    this.db = prisma as unknown as PrismaClient;
  }

  create(data: CreateOperationLogInput) {
    return this.db.operationLog.create({
      data: {
        userId: data.userId,
        username: data.username,
        module: data.module,
        action: data.action,
        details: data.details,
        ip: data.ip,
        userAgent: data.userAgent,
      },
    });
  }

  async findAll(query: QueryOperationLogDto) {
    const { page, pageSize, skip } = getPaginationParams(query);

    const where: Record<string, unknown> = {};
    if (query.userId) where.userId = query.userId;
    if (query.module) where.module = query.module;
    if (query.keyword) {
      where.OR = [
        { username: { contains: query.keyword, mode: 'insensitive' } },
        { action: { contains: query.keyword, mode: 'insensitive' } },
        { details: { contains: query.keyword, mode: 'insensitive' } },
      ];
    }
    if (query.startTime || query.endTime) {
      const createdAt: Prisma.DateTimeFilter = {};
      if (query.startTime) {
        createdAt.gte = new Date(query.startTime);
      }
      if (query.endTime) {
        createdAt.lte = new Date(query.endTime);
      }
      where.createdAt = createdAt;
    }

    const [total, items] = await Promise.all([
      this.db.operationLog.count({ where }),
      this.db.operationLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
    ]);

    return buildPaginatedResult(items, total, page, pageSize);
  }
}
