import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { ContentRevisionService } from '../content-revision/content-revision.service';
import { MediaReferenceService } from '../media-reference/media-reference.service';
import { PrismaService } from '../prisma/prisma.service';
import { SavePageDraftDto, UpdatePageConfigDto } from './dto/update-page-config.dto';
import { buildDefaultBrand } from './page-brand';
import { getDefaultPageContent } from './page-default-content';
import { PAGE_DEFINITIONS } from './page.definitions';
import {
  normalizeLocalizedPageContent,
  normalizePageRevisionSnapshot,
  sanitizePageContent,
  stripDerivedContent,
  toJsonValue,
} from './page-content.utils';
import {
  PAGE_KEYS,
  type LocalizedPageContent,
  type PageConfigResponse,
  type PageDraftResponse,
  type PageKey,
  type PageRevision,
} from './page.types';

interface StoredPageVersion {
  content: LocalizedPageContent;
  updatedAt: string;
  operatorName?: string;
}

interface StoredPublishedPageVersion extends StoredPageVersion {
  publishedAt: string;
}

@Injectable()
export class PageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly revisionService: ContentRevisionService,
    private readonly mediaReferenceService: MediaReferenceService,
  ) {}

  async findAdminList(): Promise<PageConfigResponse[]> {
    await this.ensurePages();
    return Promise.all(PAGE_KEYS.map((key) => this.findPublished(key)));
  }

  async findPublished(key: string): Promise<PageConfigResponse> {
    const pageKey = this.assertPageKey(key);
    const definition = this.getDefinition(pageKey);
    const published = await this.readPublished(pageKey);
    const content = published
      ? sanitizePageContent(pageKey, published.content).zh
      : getDefaultPageContent(pageKey);

    return {
      key: pageKey,
      title: definition.title,
      description: definition.description,
      path: definition.path,
      content: await this.injectBrandIntoContent(content),
      isDefault: !published,
    };
  }

  async findDraft(key: string): Promise<PageDraftResponse> {
    await this.ensurePages();
    const pageKey = this.assertPageKey(key);
    const definition = this.getDefinition(pageKey);
    const draft = await this.readDraft(pageKey);
    const published = await this.readPublished(pageKey);
    const fallbackContent = normalizeLocalizedPageContent(
      getDefaultPageContent(pageKey),
    );
    const draftContent = sanitizePageContent(
      pageKey,
      draft?.content ?? published?.content ?? fallbackContent,
    );

    return {
      key: pageKey,
      title: definition.title,
      description: definition.description,
      path: definition.path,
      draft: stripDerivedContent(draftContent),
      published: published ? stripDerivedContent(published.content) : null,
      status: this.resolveStatus(Boolean(draft), Boolean(published)),
      lastSavedAt: draft?.updatedAt,
      lastPublishedAt: published?.publishedAt,
      lastOperatorName: draft?.operatorName ?? published?.operatorName,
    };
  }

  async saveDraft(
    key: string,
    dto: SavePageDraftDto,
    operatorName?: string,
  ): Promise<PageDraftResponse> {
    const pageKey = this.assertPageKey(key);
    const content = sanitizePageContent(pageKey, {
      zh: stripDerivedContent(dto.zh),
      en: stripDerivedContent(dto.en),
    });

    await this.ensurePage(pageKey);
    await this.prisma.$transaction(async (tx) => {
      await tx.sitePageDraft.upsert({
        where: { pageKey },
        update: {
          content: toJsonValue(content),
          operatorName,
        },
        create: {
          pageKey,
          content: toJsonValue(content),
          operatorName,
        },
      });

      await this.createPageRevision(pageKey, {
        db: tx,
        action: 'save_draft',
        summary: '保存页面草稿',
        operatorName,
        snapshot: content,
      });

      await this.mediaReferenceService.syncReferences({
        db: tx,
        entityType: 'page',
        entityId: pageKey,
        displayName: this.getDefinition(pageKey).title,
        content,
      });
    });

    return this.findDraft(pageKey);
  }

  async publish(key: string, operatorName?: string): Promise<PageDraftResponse> {
    const pageKey = this.assertPageKey(key);
    const draft = await this.readDraft(pageKey);
    if (!draft) {
      throw new BadRequestException('请先保存草稿后再发布');
    }

    await this.prisma.sitePagePublished.upsert({
      where: { pageKey },
      update: {
        content: toJsonValue(draft.content),
        operatorName,
        publishedAt: new Date(),
      },
      create: {
        pageKey,
        content: toJsonValue(draft.content),
        operatorName,
      },
    });

    await this.createPageRevision(pageKey, {
      action: 'publish',
      summary: '发布页面配置',
      operatorName,
      snapshot: draft.content,
    });

    return this.findDraft(pageKey);
  }

  async findRevisions(key: string): Promise<PageRevision[]> {
    const pageKey = this.assertPageKey(key);
    const revisions = await this.revisionService.findRevisions('page', pageKey);
    return revisions.map((revision) => ({
      id: revision.id,
      version: revision.version,
      action: revision.action as PageRevision['action'],
      summary: revision.summary ?? '',
      operatorName: revision.operatorName ?? undefined,
      createdAt: revision.createdAt.toISOString(),
      snapshot: revision.snapshot as unknown as LocalizedPageContent,
    }));
  }

  async rollback(
    key: string,
    revisionId: string,
    operatorName?: string,
  ): Promise<PageDraftResponse> {
    const pageKey = this.assertPageKey(key);
    const revision = await this.revisionService.findRevision(
      'page',
      pageKey,
      revisionId,
    );
    const snapshot = normalizePageRevisionSnapshot(revision.snapshot);

    await this.prisma.$transaction(async (tx) => {
      await tx.sitePageDraft.upsert({
        where: { pageKey },
        update: {
          content: toJsonValue(snapshot),
          operatorName,
        },
        create: {
          pageKey,
          content: toJsonValue(snapshot),
          operatorName,
        },
      });

      await this.createPageRevision(pageKey, {
        db: tx,
        action: 'rollback',
        summary: `恢复历史版本 #${revision.version}`,
        operatorName,
        snapshot,
      });

      await this.mediaReferenceService.syncReferences({
        db: tx,
        entityType: 'page',
        entityId: pageKey,
        displayName: this.getDefinition(pageKey).title,
        content: snapshot,
      });
    });

    return this.findDraft(pageKey);
  }

  async update(key: string, dto: UpdatePageConfigDto): Promise<PageConfigResponse> {
    const pageKey = this.assertPageKey(key);
    await this.saveDraft(pageKey, {
      zh: dto.content,
      en: dto.content,
    });

    return this.findPublished(pageKey);
  }

  async delete(key: string): Promise<void> {
    const pageKey = this.assertPageKey(key);
    await this.prisma.$transaction(async (tx) => {
      await tx.sitePageDraft.deleteMany({ where: { pageKey } });
      await tx.sitePagePublished.deleteMany({ where: { pageKey } });
      await this.mediaReferenceService.clearReferences({
        db: tx,
        entityType: 'page',
        entityId: pageKey,
      });
    });
  }

  private async readDraft(key: PageKey): Promise<StoredPageVersion | null> {
    const draft = await this.prisma.sitePageDraft.findUnique({
      where: { pageKey: key },
    });
    if (!draft) return null;
    return {
      content: draft.content as unknown as LocalizedPageContent,
      updatedAt: draft.updatedAt.toISOString(),
      operatorName: draft.operatorName ?? undefined,
    };
  }

  private async readPublished(
    key: PageKey,
  ): Promise<StoredPublishedPageVersion | null> {
    const published = await this.prisma.sitePagePublished.findUnique({
      where: { pageKey: key },
    });
    if (!published) return null;
    return {
      content: published.content as unknown as LocalizedPageContent,
      updatedAt: published.updatedAt.toISOString(),
      publishedAt: published.publishedAt.toISOString(),
      operatorName: published.operatorName ?? undefined,
    };
  }

  private resolveStatus(
    hasDraft: boolean,
    hasPublished: boolean,
  ): PageDraftResponse['status'] {
    if (hasDraft && hasPublished) return 'published_with_draft';
    if (hasDraft) return 'draft';
    if (hasPublished) return 'published';
    return 'unconfigured';
  }

  private getDefinition(key: PageKey) {
    return PAGE_DEFINITIONS[key];
  }

  private assertPageKey(key: string): PageKey {
    if (PAGE_KEYS.includes(key as PageKey)) {
      return key as PageKey;
    }
    throw new NotFoundException(`Page ${key} not found`);
  }

  private async injectBrandIntoContent(
    content: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    const brand = buildDefaultBrand();

    const enterprise = await this.prisma.enterpriseSetting.findUnique({
      where: { id: 1 },
    });
    if (enterprise) {
      Object.assign(brand, {
        nameZh: enterprise.brandName || brand.nameZh,
        nameEn: enterprise.brandNameEn || brand.nameEn,
        legalNameZh: enterprise.companyName || brand.legalNameZh,
        legalNameEn: enterprise.companyNameEn || brand.legalNameEn,
        logo: enterprise.companyLogo || brand.logo,
        email: enterprise.contactEmail || brand.email,
        phone: enterprise.contactPhone || brand.phone,
        website: enterprise.website || brand.website,
        addressZh: enterprise.address || brand.addressZh,
        addressEn: enterprise.addressEn || brand.addressEn,
      });
    }

    return { ...content, brand };
  }

  private async ensurePages() {
    await Promise.all(PAGE_KEYS.map((key) => this.ensurePage(key)));
  }

  private async ensurePage(key: PageKey) {
    const definition = this.getDefinition(key);
    await this.prisma.sitePage.upsert({
      where: { key },
      update: {
        title: definition.title,
        description: definition.description,
        path: definition.path,
      },
      create: {
        key,
        title: definition.title,
        description: definition.description,
        path: definition.path,
        sortOrder: PAGE_KEYS.indexOf(key) + 1,
      },
    });
  }

  private createPageRevision(
    key: PageKey,
    revision: Omit<PageRevision, 'id' | 'version' | 'createdAt'> & {
      db?: Parameters<ContentRevisionService['createRevision']>[0]['db'];
    },
  ) {
    return this.revisionService.createRevision({
      db: revision.db,
      entityType: 'page',
      entityId: key,
      action: revision.action,
      operatorName: revision.operatorName,
      summary: revision.summary,
      snapshot: revision.snapshot,
    });
  }

}
