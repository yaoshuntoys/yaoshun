import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import {
  buildPaginatedResult,
  getPaginationParams,
} from '../common/utils/pagination.util';
import {
  assertActiveEntity,
  assertPublicEntity,
  buildRollbackData,
  getEntityDisplayName,
  getEntityId,
  normalizeRevisionSnapshot,
} from '../content/content-utils';
import { ContentRevisionService } from '../content-revision/content-revision.service';
import { MediaReferenceService } from '../media-reference/media-reference.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { QueryPartnerDto } from './dto/query-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';

@Injectable()
export class PartnerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly revisionService: ContentRevisionService,
    private readonly mediaReferenceService: MediaReferenceService,
  ) {}

  async create(dto: CreatePartnerDto, operatorName?: string) {
    return this.prisma.$transaction(async (tx) => {
      const created = await tx.partner.create({
        data: this.buildCreateData(dto),
      });

      await this.revisionService.createRevision({
        db: tx,
        entityType: 'partner',
        entityId: getEntityId(created),
        action: 'create',
        operatorName,
        summary: `创建合作客户：${dto.nameZh}`,
        snapshot: created,
      });

      await this.mediaReferenceService.syncReferences({
        db: tx,
        entityType: 'partner',
        entityId: getEntityId(created),
        displayName: dto.nameZh,
        content: created,
      });

      return created;
    });
  }

  async findAll(query: QueryPartnerDto = {}, publicOnly = false) {
    const { page, pageSize, skip } = getPaginationParams(query);
    const where = this.buildWhere(query, publicOnly);

    const [total, list] = await Promise.all([
      this.prisma.partner.count({ where }),
      this.prisma.partner.findMany({
        where,
        orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
        skip,
        take: pageSize,
      }),
    ]);

    return buildPaginatedResult(list, total, page, pageSize);
  }

  async findOne(id: number, publicOnly = false) {
    const item = await this.prisma.partner.findUnique({ where: { id } });
    const notFoundMessage = `Partner ${id} not found`;
    if (publicOnly) {
      assertPublicEntity(item, 'active', notFoundMessage);
    } else {
      assertActiveEntity(item, notFoundMessage);
    }
    return item;
  }

  async update(id: number, dto: UpdatePartnerDto, operatorName?: string) {
    await this.ensureExists(id);
    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.partner.update({
        where: { id },
        data: this.buildUpdateData(dto),
      });

      await this.revisionService.createRevision({
        db: tx,
        entityType: 'partner',
        entityId: id,
        action: 'update',
        operatorName,
        summary: `更新合作客户：${dto.nameZh ?? id}`,
        snapshot: updated,
      });

      await this.mediaReferenceService.syncReferences({
        db: tx,
        entityType: 'partner',
        entityId: id,
        displayName: dto.nameZh,
        content: updated,
      });

      return updated;
    });
  }

  async remove(id: number, operatorName?: string) {
    await this.ensureExists(id);
    return this.prisma.$transaction(async (tx) => {
      const removed = await tx.partner.update({
        where: { id },
        data: { status: 'archived', deletedAt: new Date() },
      });

      await this.revisionService.createRevision({
        db: tx,
        entityType: 'partner',
        entityId: id,
        action: 'delete',
        operatorName,
        summary: `归档合作客户：${removed.nameZh}`,
        snapshot: removed,
      });

      await this.mediaReferenceService.clearReferences({
        db: tx,
        entityType: 'partner',
        entityId: id,
      });

      return removed;
    });
  }

  findRevisions(id: number) {
    return this.revisionService.findRevisions('partner', id);
  }

  async rollback(id: number, revisionId: string, operatorName?: string) {
    await this.ensureExists(id);
    const revision = await this.revisionService.findRevision(
      'partner',
      id,
      revisionId,
    );
    const snapshot = normalizeRevisionSnapshot(revision.snapshot);
    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.partner.update({
        where: { id },
        data: buildRollbackData(snapshot) as Prisma.PartnerUpdateInput,
      });

      await this.revisionService.createRevision({
        db: tx,
        entityType: 'partner',
        entityId: id,
        action: 'rollback',
        operatorName,
        summary: `恢复合作客户历史版本 #${revision.version}`,
        snapshot: updated,
      });

      await this.mediaReferenceService.syncReferences({
        db: tx,
        entityType: 'partner',
        entityId: id,
        displayName: getEntityDisplayName(updated, 'nameZh', id),
        content: updated,
      });

      return updated;
    });
  }

  private async ensureExists(id: number) {
    const exists = await this.prisma.partner.findUnique({
      where: { id },
      select: { id: true, deletedAt: true },
    });
    assertActiveEntity(exists, `Partner ${id} not found`);
  }

  private buildWhere(
    query: QueryPartnerDto,
    publicOnly: boolean,
  ): Prisma.PartnerWhereInput {
    const where: Prisma.PartnerWhereInput = { deletedAt: null };

    if (publicOnly || query.publicOnly) {
      where.status = 'active';
    } else if (query.status) {
      where.status = query.status;
    }
    if (query.keyword) {
      where.OR = [
        { nameZh: { contains: query.keyword, mode: 'insensitive' } },
        { nameEn: { contains: query.keyword, mode: 'insensitive' } },
      ];
    }

    return where;
  }

  private buildCreateData(dto: CreatePartnerDto): Prisma.PartnerCreateInput {
    return {
      ...dto,
      nameEn: dto.nameEn || dto.nameZh,
      status: dto.status ?? 'active',
      sortOrder: dto.sortOrder ?? 0,
    };
  }

  private buildUpdateData(dto: UpdatePartnerDto): Prisma.PartnerUpdateInput {
    return {
      ...dto,
      nameEn: dto.nameEn ?? (dto.nameZh ? dto.nameZh : undefined),
    };
  }
}
