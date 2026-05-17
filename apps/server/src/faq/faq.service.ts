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
import { CreateFaqDto } from './dto/create-faq.dto';
import { QueryFaqDto } from './dto/query-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';

@Injectable()
export class FaqService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly revisionService: ContentRevisionService,
    private readonly mediaReferenceService: MediaReferenceService,
  ) {}

  async create(dto: CreateFaqDto, operatorName?: string) {
    return this.prisma.$transaction(async (tx) => {
      const created = await tx.faqItem.create({
        data: this.buildCreateData(dto),
      });

      await this.revisionService.createRevision({
        db: tx,
        entityType: 'faq',
        entityId: getEntityId(created),
        action: 'create',
        operatorName,
        summary: `创建 FAQ：${dto.questionZh}`,
        snapshot: created,
      });

      await this.mediaReferenceService.syncReferences({
        db: tx,
        entityType: 'faq',
        entityId: getEntityId(created),
        displayName: dto.questionZh,
        content: created,
      });

      return created;
    });
  }

  async findAll(query: QueryFaqDto = {}, publicOnly = false) {
    const { page, pageSize, skip } = getPaginationParams(query);
    const where = this.buildWhere(query, publicOnly);

    const [total, list] = await Promise.all([
      this.prisma.faqItem.count({ where }),
      this.prisma.faqItem.findMany({
        where,
        orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
        skip,
        take: pageSize,
      }),
    ]);

    return buildPaginatedResult(list, total, page, pageSize);
  }

  async findOne(id: number, publicOnly = false) {
    const item = await this.prisma.faqItem.findUnique({ where: { id } });
    const notFoundMessage = `Faq ${id} not found`;
    if (publicOnly) {
      assertPublicEntity(item, 'active', notFoundMessage);
    } else {
      assertActiveEntity(item, notFoundMessage);
    }
    return item;
  }

  async update(id: number, dto: UpdateFaqDto, operatorName?: string) {
    await this.ensureExists(id);
    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.faqItem.update({
        where: { id },
        data: this.buildUpdateData(dto),
      });

      await this.revisionService.createRevision({
        db: tx,
        entityType: 'faq',
        entityId: id,
        action: 'update',
        operatorName,
        summary: `更新 FAQ：${dto.questionZh ?? id}`,
        snapshot: updated,
      });

      await this.mediaReferenceService.syncReferences({
        db: tx,
        entityType: 'faq',
        entityId: id,
        displayName: dto.questionZh,
        content: updated,
      });

      return updated;
    });
  }

  async remove(id: number, operatorName?: string) {
    await this.ensureExists(id);
    return this.prisma.$transaction(async (tx) => {
      const removed = await tx.faqItem.update({
        where: { id },
        data: { status: 'archived', deletedAt: new Date() },
      });

      await this.revisionService.createRevision({
        db: tx,
        entityType: 'faq',
        entityId: id,
        action: 'delete',
        operatorName,
        summary: `归档 FAQ：${removed.questionZh}`,
        snapshot: removed,
      });

      await this.mediaReferenceService.clearReferences({
        db: tx,
        entityType: 'faq',
        entityId: id,
      });

      return removed;
    });
  }

  findRevisions(id: number) {
    return this.revisionService.findRevisions('faq', id);
  }

  async rollback(id: number, revisionId: string, operatorName?: string) {
    await this.ensureExists(id);
    const revision = await this.revisionService.findRevision(
      'faq',
      id,
      revisionId,
    );
    const snapshot = normalizeRevisionSnapshot(revision.snapshot);
    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.faqItem.update({
        where: { id },
        data: buildRollbackData(snapshot) as Prisma.FaqItemUpdateInput,
      });

      await this.revisionService.createRevision({
        db: tx,
        entityType: 'faq',
        entityId: id,
        action: 'rollback',
        operatorName,
        summary: `恢复 FAQ 历史版本 #${revision.version}`,
        snapshot: updated,
      });

      await this.mediaReferenceService.syncReferences({
        db: tx,
        entityType: 'faq',
        entityId: id,
        displayName: getEntityDisplayName(updated, 'questionZh', id),
        content: updated,
      });

      return updated;
    });
  }

  private async ensureExists(id: number) {
    const exists = await this.prisma.faqItem.findUnique({
      where: { id },
      select: { id: true, deletedAt: true },
    });
    assertActiveEntity(exists, `Faq ${id} not found`);
  }

  private buildWhere(query: QueryFaqDto, publicOnly: boolean): Prisma.FaqItemWhereInput {
    const where: Prisma.FaqItemWhereInput = { deletedAt: null };

    if (query.categoryKey) {
      where.categoryKey = query.categoryKey;
    }
    if (publicOnly || query.publicOnly) {
      where.status = 'active';
    } else if (query.status) {
      where.status = query.status;
    }
    if (query.keyword) {
      where.OR = [
        { categoryLabelZh: { contains: query.keyword, mode: 'insensitive' } },
        { categoryLabelEn: { contains: query.keyword, mode: 'insensitive' } },
        { questionZh: { contains: query.keyword, mode: 'insensitive' } },
        { questionEn: { contains: query.keyword, mode: 'insensitive' } },
        { answerZh: { contains: query.keyword, mode: 'insensitive' } },
        { answerEn: { contains: query.keyword, mode: 'insensitive' } },
      ];
    }

    return where;
  }

  private buildCreateData(dto: CreateFaqDto): Prisma.FaqItemCreateInput {
    return {
      ...dto,
      categoryLabelEn: dto.categoryLabelEn || dto.categoryLabelZh,
      questionEn: dto.questionEn || dto.questionZh,
      answerEn: dto.answerEn || dto.answerZh,
      status: dto.status ?? 'active',
      sortOrder: dto.sortOrder ?? 0,
    };
  }

  private buildUpdateData(dto: UpdateFaqDto): Prisma.FaqItemUpdateInput {
    return {
      ...dto,
      categoryLabelEn:
        dto.categoryLabelEn ?? (dto.categoryLabelZh ? dto.categoryLabelZh : undefined),
      questionEn: dto.questionEn ?? (dto.questionZh ? dto.questionZh : undefined),
      answerEn: dto.answerEn ?? (dto.answerZh ? dto.answerZh : undefined),
    };
  }
}
