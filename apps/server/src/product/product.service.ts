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
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly revisionService: ContentRevisionService,
    private readonly mediaReferenceService: MediaReferenceService,
  ) {}

  async create(dto: CreateProductDto, operatorName?: string) {
    return this.prisma.$transaction(async (tx) => {
      const created = await tx.product.create({
        data: this.buildCreateData(dto),
      });

      await this.revisionService.createRevision({
        db: tx,
        entityType: 'product',
        entityId: getEntityId(created),
        action: 'create',
        operatorName,
        summary: `创建商品：${dto.titleZh || dto.slug}`,
        snapshot: created,
      });

      await this.mediaReferenceService.syncReferences({
        db: tx,
        entityType: 'product',
        entityId: getEntityId(created),
        displayName: dto.titleZh || dto.slug,
        content: created,
      });

      return created;
    });
  }

  async findAll(query: QueryProductDto = {}, publicOnly = false) {
    const { page, pageSize, skip } = getPaginationParams(query);
    const where = this.buildWhere(query, publicOnly);

    const [total, list] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
        skip,
        take: pageSize,
      }),
    ]);

    return buildPaginatedResult(list, total, page, pageSize);
  }

  async findOne(id: number, publicOnly = false) {
    const item = await this.prisma.product.findUnique({ where: { id } });
    const notFoundMessage = `Product ${id} not found`;
    if (publicOnly) {
      assertPublicEntity(item, 'active', notFoundMessage);
    } else {
      assertActiveEntity(item, notFoundMessage);
    }
    return item;
  }

  async findBySlug(slug: string, publicOnly = false) {
    const item = await this.prisma.product.findUnique({ where: { slug } });
    const notFoundMessage = `Product ${slug} not found`;
    if (publicOnly) {
      assertPublicEntity(item, 'active', notFoundMessage);
    } else {
      assertActiveEntity(item, notFoundMessage);
    }
    return item;
  }

  async update(id: number, dto: UpdateProductDto, operatorName?: string) {
    await this.ensureExists(id);
    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.product.update({
        where: { id },
        data: this.buildUpdateData(dto),
      });

      await this.revisionService.createRevision({
        db: tx,
        entityType: 'product',
        entityId: id,
        action: 'update',
        operatorName,
        summary: `更新商品：${dto.titleZh ?? id}`,
        snapshot: updated,
      });

      await this.mediaReferenceService.syncReferences({
        db: tx,
        entityType: 'product',
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
      const removed = await tx.product.update({
        where: { id },
        data: { status: 'archived', deletedAt: new Date() },
      });

      await this.revisionService.createRevision({
        db: tx,
        entityType: 'product',
        entityId: id,
        action: 'delete',
        operatorName,
        summary: `归档商品：${removed.titleZh}`,
        snapshot: removed,
      });

      await this.mediaReferenceService.clearReferences({
        db: tx,
        entityType: 'product',
        entityId: id,
      });

      return removed;
    });
  }

  findRevisions(id: number) {
    return this.revisionService.findRevisions('product', id);
  }

  async rollback(id: number, revisionId: string, operatorName?: string) {
    await this.ensureExists(id);
    const revision = await this.revisionService.findRevision(
      'product',
      id,
      revisionId,
    );
    const snapshot = normalizeRevisionSnapshot(revision.snapshot);
    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.product.update({
        where: { id },
        data: buildRollbackData(snapshot) as Prisma.ProductUpdateInput,
      });

      await this.revisionService.createRevision({
        db: tx,
        entityType: 'product',
        entityId: id,
        action: 'rollback',
        operatorName,
        summary: `恢复商品历史版本 #${revision.version}`,
        snapshot: updated,
      });

      await this.mediaReferenceService.syncReferences({
        db: tx,
        entityType: 'product',
        entityId: id,
        displayName: getEntityDisplayName(updated, 'titleZh', id),
        content: updated,
      });

      return updated;
    });
  }

  private async ensureExists(id: number) {
    const exists = await this.prisma.product.findUnique({
      where: { id },
      select: { id: true, deletedAt: true },
    });
    assertActiveEntity(exists, `Product ${id} not found`);
  }

  private buildWhere(
    query: QueryProductDto,
    publicOnly: boolean,
  ): Prisma.ProductWhereInput {
    const where: Prisma.ProductWhereInput = { deletedAt: null };

    if (query.category) {
      where.category = query.category;
    }
    if (publicOnly || query.publicOnly) {
      where.status = 'active';
    } else if (query.status) {
      where.status = query.status;
    }
    if (query.keyword) {
      where.OR = [
        { titleZh: { contains: query.keyword, mode: 'insensitive' } },
        { titleEn: { contains: query.keyword, mode: 'insensitive' } },
        { summaryZh: { contains: query.keyword, mode: 'insensitive' } },
        { summaryEn: { contains: query.keyword, mode: 'insensitive' } },
        { descriptionZh: { contains: query.keyword, mode: 'insensitive' } },
        { descriptionEn: { contains: query.keyword, mode: 'insensitive' } },
        { productId: { contains: query.keyword, mode: 'insensitive' } },
      ];
    }

    return where;
  }

  private buildCreateData(dto: CreateProductDto): Prisma.ProductCreateInput {
    return {
      ...dto,
      titleEn: dto.titleEn || dto.titleZh,
      descriptionEn: dto.descriptionEn || dto.descriptionZh,
      summaryEn: dto.summaryEn || dto.summaryZh,
      specs: this.toJson(dto.specs ?? []),
      productAttributes: this.toJson(dto.productAttributes ?? []),
      attributePairs: this.toJson(dto.attributePairs ?? []),
      pricing: this.toJson(dto.pricing ?? {}),
      customizationOptions: this.toJson(dto.customizationOptions ?? []),
      images: this.toJson(dto.images ?? []),
      seoKeywords: this.toJson(dto.seoKeywords ?? {}),
      detailConfig: this.toJson(dto.detailConfig ?? {}),
      rawData: this.toJson(dto.rawData ?? {}),
      status: dto.status ?? 'active',
      sortOrder: dto.sortOrder ?? 0,
    };
  }

  private buildUpdateData(dto: UpdateProductDto): Prisma.ProductUpdateInput {
    return {
      ...dto,
      specs: dto.specs === undefined ? undefined : this.toJson(dto.specs),
      productAttributes:
        dto.productAttributes === undefined
          ? undefined
          : this.toJson(dto.productAttributes),
      attributePairs:
        dto.attributePairs === undefined ? undefined : this.toJson(dto.attributePairs),
      pricing: dto.pricing === undefined ? undefined : this.toJson(dto.pricing),
      customizationOptions:
        dto.customizationOptions === undefined
          ? undefined
          : this.toJson(dto.customizationOptions),
      images: dto.images === undefined ? undefined : this.toJson(dto.images),
      seoKeywords:
        dto.seoKeywords === undefined ? undefined : this.toJson(dto.seoKeywords),
      detailConfig:
        dto.detailConfig === undefined ? undefined : this.toJson(dto.detailConfig),
      rawData: dto.rawData === undefined ? undefined : this.toJson(dto.rawData),
    };
  }

  private toJson(value: unknown): Prisma.InputJsonValue {
    return JSON.parse(JSON.stringify(value ?? null)) as Prisma.InputJsonValue;
  }
}
