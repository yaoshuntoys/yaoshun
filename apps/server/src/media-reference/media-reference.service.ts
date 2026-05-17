import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, PrismaClient } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

type MediaReferenceDb =
  | Pick<PrismaClient, 'mediaAsset' | 'mediaReference'>
  | Prisma.TransactionClient;

interface ExtractedMediaReference {
  value: string;
  fieldPath: string;
}

interface SyncMediaReferenceOptions {
  entityType: string;
  entityId: string | number;
  displayName?: string;
  content: unknown;
  db?: MediaReferenceDb;
}

@Injectable()
export class MediaReferenceService {
  private readonly db: PrismaClient;
  private readonly appUrl: string;

  constructor(
    prisma: PrismaService,
    configService: ConfigService,
  ) {
    this.db = prisma as unknown as PrismaClient;
    this.appUrl = (configService.get<string>('APP_URL') || '').replace(/\/$/, '');
  }

  async syncReferences(options: SyncMediaReferenceOptions) {
    const db = options.db ?? this.db;
    const entityId = String(options.entityId);
    const extracted = this.extractMediaReferences(options.content);
    const lookupValues = Array.from(
      new Set(extracted.flatMap((item) => this.buildLookupValues(item.value))),
    );

    await db.mediaReference.deleteMany({
      where: {
        entityType: options.entityType,
        entityId,
      },
    });

    if (lookupValues.length === 0) {
      return [];
    }

    const assets = await db.mediaAsset.findMany({
      where: {
        deletedAt: null,
        OR: [
          { url: { in: lookupValues } },
          { pathname: { in: lookupValues } },
          { storageKey: { in: lookupValues } },
        ],
      },
      select: {
        id: true,
        url: true,
        pathname: true,
        storageKey: true,
        originalName: true,
      },
    });

    const assetByLookupValue = new Map<string, (typeof assets)[number]>();
    for (const asset of assets) {
      for (const value of [asset.url, asset.pathname, asset.storageKey]) {
        if (!value) continue;
        for (const lookupValue of this.buildLookupValues(value)) {
          assetByLookupValue.set(lookupValue, asset);
        }
      }
    }

    const uniqueReferences = new Map<string, Prisma.MediaReferenceCreateManyInput>();
    for (const item of extracted) {
      const asset = this.buildLookupValues(item.value)
        .map((value) => assetByLookupValue.get(value))
        .find(Boolean);
      if (!asset) continue;

      const key = `${asset.id}:${item.fieldPath}`;
      uniqueReferences.set(key, {
        assetId: asset.id,
        entityType: options.entityType,
        entityId,
        fieldPath: item.fieldPath,
        displayName: options.displayName || asset.originalName,
      });
    }

    const data = Array.from(uniqueReferences.values());
    if (data.length === 0) {
      return [];
    }

    await db.mediaReference.createMany({
      data,
      skipDuplicates: true,
    });

    return data;
  }

  clearReferences(options: {
    entityType: string;
    entityId: string | number;
    db?: MediaReferenceDb;
  }) {
    const db = options.db ?? this.db;
    return db.mediaReference.deleteMany({
      where: {
        entityType: options.entityType,
        entityId: String(options.entityId),
      },
    });
  }

  private extractMediaReferences(content: unknown): ExtractedMediaReference[] {
    const results: ExtractedMediaReference[] = [];
    const visit = (value: unknown, path: string) => {
      if (typeof value === 'string') {
        if (this.isMediaCandidate(value)) {
          results.push({ value: value.trim(), fieldPath: path || '$' });
        }
        return;
      }

      if (Array.isArray(value)) {
        value.forEach((item, index) => visit(item, `${path}[${index}]`));
        return;
      }

      if (!value || typeof value !== 'object') {
        return;
      }

      Object.entries(value as Record<string, unknown>).forEach(([key, entry]) => {
        visit(entry, path ? `${path}.${key}` : key);
      });
    };

    visit(content, '');
    return results.slice(0, 1000);
  }

  private isMediaCandidate(value: string) {
    const trimmed = value.trim();
    if (!trimmed) return false;
    if (trimmed.includes('/uploads/')) return true;
    if (trimmed.startsWith('uploads/')) return true;

    try {
      const url = new URL(trimmed);
      return this.hasSupportedMediaExtension(url.pathname);
    } catch {
      return this.hasSupportedMediaExtension(trimmed);
    }
  }

  private hasSupportedMediaExtension(value: string) {
    return /\.(avif|bmp|gif|jpe?g|png|webp|mp4|mov|webm|pdf|docx?|xlsx?|pptx?)$/i.test(
      value.split('?')[0] ?? '',
    );
  }

  private buildLookupValues(value: string) {
    const values = new Set<string>();
    const trimmed = value.trim();
    if (!trimmed) return [];

    values.add(trimmed);
    try {
      const url = new URL(trimmed);
      values.add(url.pathname);
      values.add(url.pathname.replace(/^\/+/, ''));
    } catch {
      values.add(trimmed.replace(/^\/+/, ''));
      values.add(`/${trimmed.replace(/^\/+/, '')}`);
      if (this.appUrl) {
        values.add(`${this.appUrl}/${trimmed.replace(/^\/+/, '')}`);
      }
    }

    return Array.from(values);
  }
}
