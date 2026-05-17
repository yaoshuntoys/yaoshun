import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import type {
  ContentRevisionAction,
  ContentRevisionEntityType,
  ContentRevisionRecord,
} from './content-revision.types';

type RevisionDb = Pick<PrismaClient, 'contentRevision'> | Prisma.TransactionClient;

@Injectable()
export class ContentRevisionService {
  private readonly db: PrismaClient;

  constructor(prisma: PrismaService) {
    this.db = prisma as unknown as PrismaClient;
  }

  async createRevision(options: {
    entityType: ContentRevisionEntityType;
    entityId: string | number;
    action: ContentRevisionAction;
    operatorName?: string;
    summary?: string;
    snapshot: unknown;
    db?: RevisionDb;
  }): Promise<ContentRevisionRecord> {
    const entityId = String(options.entityId);
    const db = options.db ?? this.db;

    for (let attempt = 0; attempt < 3; attempt += 1) {
      const latest = await db.contentRevision.findFirst({
        where: { entityType: options.entityType, entityId },
        orderBy: { version: 'desc' },
        select: { version: true },
      });

      try {
        return await db.contentRevision.create({
          data: {
            entityType: options.entityType,
            entityId,
            version: (latest?.version ?? 0) + 1,
            action: options.action,
            operatorName: options.operatorName,
            summary: options.summary,
            snapshot: this.toJsonValue(options.snapshot),
          },
        });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2002' &&
          attempt < 2
        ) {
          continue;
        }

        throw error;
      }
    }

    throw new Error('Failed to create content revision');
  }

  findRevisions(
    entityType: ContentRevisionEntityType,
    entityId: string | number,
  ): Promise<ContentRevisionRecord[]> {
    return this.db.contentRevision.findMany({
      where: {
        entityType,
        entityId: String(entityId),
      },
      orderBy: { version: 'desc' },
      take: 50,
    });
  }

  async findRevision(
    entityType: ContentRevisionEntityType,
    entityId: string | number,
    revisionId: string | number,
  ): Promise<ContentRevisionRecord> {
    const revision = await this.db.contentRevision.findFirst({
      where: {
        id: Number(revisionId),
        entityType,
        entityId: String(entityId),
      },
    });

    if (!revision) {
      throw new NotFoundException('历史版本不存在');
    }

    return revision;
  }

  private toJsonValue(value: unknown): Prisma.InputJsonValue {
    return JSON.parse(JSON.stringify(value ?? null)) as Prisma.InputJsonValue;
  }
}
