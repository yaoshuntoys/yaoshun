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
import { CreateNewsDto } from './dto/create-news.dto';
import { QueryNewsDto } from './dto/query-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

@Injectable()
export class NewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly revisionService: ContentRevisionService,
    private readonly mediaReferenceService: MediaReferenceService,
  ) {}

  async create(dto: CreateNewsDto, operatorName?: string) {
    return this.prisma.$transaction(async (tx) => {
      const created = await tx.news.create({
        data: this.buildCreateData(dto),
      });

      await this.revisionService.createRevision({
        db: tx,
        entityType: 'news',
        entityId: getEntityId(created),
        action: 'create',
        operatorName,
        summary: `创建新闻：${dto.titleZh || dto.slug}`,
        snapshot: created,
      });

      await this.mediaReferenceService.syncReferences({
        db: tx,
        entityType: 'news',
        entityId: getEntityId(created),
        displayName: dto.titleZh || dto.slug,
        content: created,
      });

      return created;
    });
  }

  async findAll(query: QueryNewsDto = {}, publicOnly = false) {
    const { page, pageSize, skip } = getPaginationParams(query);
    const where = this.buildWhere(query, publicOnly);

    const [total, list] = await Promise.all([
      this.prisma.news.count({ where }),
      this.prisma.news.findMany({
        where,
        orderBy: [{ sortOrder: 'asc' }, { publishedAt: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: pageSize,
      }),
    ]);

    return buildPaginatedResult(list, total, page, pageSize);
  }

  async findOne(id: number, publicOnly = false) {
    const item = await this.prisma.news.findUnique({ where: { id } });
    const notFoundMessage = `News ${id} not found`;
    if (publicOnly) {
      assertPublicEntity(item, 'published', notFoundMessage);
    } else {
      assertActiveEntity(item, notFoundMessage);
    }
    return item;
  }

  async findBySlug(slug: string, publicOnly = false) {
    const item = await this.prisma.news.findUnique({ where: { slug } });
    const notFoundMessage = `News ${slug} not found`;
    if (publicOnly) {
      assertPublicEntity(item, 'published', notFoundMessage);
    } else {
      assertActiveEntity(item, notFoundMessage);
    }

    void this.prisma.news.update({
      where: { id: item.id },
      data: { viewCount: { increment: 1 } },
    });

    return this.findOne(item.id, publicOnly);
  }

  async update(id: number, dto: UpdateNewsDto, operatorName?: string) {
    await this.ensureExists(id);
    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.news.update({
        where: { id },
        data: this.buildUpdateData(dto),
      });

      await this.revisionService.createRevision({
        db: tx,
        entityType: 'news',
        entityId: id,
        action: 'update',
        operatorName,
        summary: `更新新闻：${dto.titleZh ?? id}`,
        snapshot: updated,
      });

      await this.mediaReferenceService.syncReferences({
        db: tx,
        entityType: 'news',
        entityId: id,
        displayName: dto.titleZh,
        content: updated,
      });

      return updated;
    });
  }

  async remove(id: number, operatorName?: string) {
    await this.ensureExists(id);
    return this.prisma.$transaction(async (tx) => {
      const removed = await tx.news.update({
        where: { id },
        data: { status: 'archived', deletedAt: new Date() },
      });

      await this.revisionService.createRevision({
        db: tx,
        entityType: 'news',
        entityId: id,
        action: 'delete',
        operatorName,
        summary: `归档新闻：${removed.titleZh}`,
        snapshot: removed,
      });

      await this.mediaReferenceService.clearReferences({
        db: tx,
        entityType: 'news',
        entityId: id,
      });

      return removed;
    });
  }

  findRevisions(id: number) {
    return this.revisionService.findRevisions('news', id);
  }

  async rollback(id: number, revisionId: string, operatorName?: string) {
    await this.ensureExists(id);
    const revision = await this.revisionService.findRevision(
      'news',
      id,
      revisionId,
    );
    const snapshot = normalizeRevisionSnapshot(revision.snapshot);
    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.news.update({
        where: { id },
        data: buildRollbackData(snapshot) as Prisma.NewsUpdateInput,
      });

      await this.revisionService.createRevision({
        db: tx,
        entityType: 'news',
        entityId: id,
        action: 'rollback',
        operatorName,
        summary: `恢复新闻历史版本 #${revision.version}`,
        snapshot: updated,
      });

      await this.mediaReferenceService.syncReferences({
        db: tx,
        entityType: 'news',
        entityId: id,
        displayName: getEntityDisplayName(updated, 'titleZh', id),
        content: updated,
      });

      return updated;
    });
  }

  private async ensureExists(id: number) {
    const exists = await this.prisma.news.findUnique({
      where: { id },
      select: { id: true, deletedAt: true },
    });
    assertActiveEntity(exists, `News ${id} not found`);
  }

  private buildWhere(
    query: QueryNewsDto,
    publicOnly: boolean,
  ): Prisma.NewsWhereInput {
    const where: Prisma.NewsWhereInput = { deletedAt: null };

    if (query.category) {
      where.category = query.category;
    }
    if (publicOnly || query.publicOnly) {
      where.status = 'published';
    } else if (query.status) {
      where.status = query.status;
    }
    if (query.keyword) {
      where.OR = [
        { titleZh: { contains: query.keyword, mode: 'insensitive' } },
        { titleEn: { contains: query.keyword, mode: 'insensitive' } },
        { summaryZh: { contains: query.keyword, mode: 'insensitive' } },
        { summaryEn: { contains: query.keyword, mode: 'insensitive' } },
      ];
    }

    return where;
  }

  private buildCreateData(dto: CreateNewsDto): Prisma.NewsCreateInput {
    return {
      ...dto,
      titleEn: dto.titleEn || dto.titleZh,
      contentEn: dto.contentEn || dto.contentZh,
      summaryEn: dto.summaryEn || dto.summaryZh,
      galleryImages: this.toJson(dto.galleryImages ?? []),
      featuredTopic: dto.featuredTopic ?? false,
      seoKeywords: this.toJson(dto.seoKeywords ?? {}),
      relatedProduct:
        dto.relatedProduct === undefined ? undefined : this.toJson(dto.relatedProduct),
      detailConfig: this.toJson(dto.detailConfig ?? {}),
      rawData: this.toJson(dto.rawData ?? {}),
      status: dto.status ?? 'published',
      publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : null,
      viewCount: dto.viewCount ?? 0,
      sortOrder: dto.sortOrder ?? 0,
    };
  }

  private buildUpdateData(dto: UpdateNewsDto): Prisma.NewsUpdateInput {
    return {
      ...dto,
      galleryImages:
        dto.galleryImages === undefined ? undefined : this.toJson(dto.galleryImages),
      seoKeywords:
        dto.seoKeywords === undefined ? undefined : this.toJson(dto.seoKeywords),
      relatedProduct:
        dto.relatedProduct === undefined
          ? undefined
          : this.toJson(dto.relatedProduct),
      detailConfig:
        dto.detailConfig === undefined ? undefined : this.toJson(dto.detailConfig),
      rawData: dto.rawData === undefined ? undefined : this.toJson(dto.rawData),
      publishedAt:
        dto.publishedAt === undefined
          ? undefined
          : dto.publishedAt
            ? new Date(dto.publishedAt)
            : null,
    };
  }

  private toJson(value: unknown): Prisma.InputJsonValue {
    return JSON.parse(JSON.stringify(value ?? null)) as Prisma.InputJsonValue;
  }
}
