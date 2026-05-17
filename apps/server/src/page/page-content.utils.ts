import { NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { getDefaultPageContent } from './page-default-content';
import type { LocalizedPageContent, PageKey } from './page.types';

export function normalizeLocalizedPageContent(
  content: Record<string, unknown>,
): LocalizedPageContent {
  return {
    zh: content,
    en: content,
  };
}

export function stripDerivedContent<
  T extends Record<string, unknown> | LocalizedPageContent,
>(content: T): T {
  return stripDerivedValue(content) as T;
}

export function sanitizePageContent(
  key: PageKey,
  content: LocalizedPageContent,
): LocalizedPageContent {
  return {
    zh: pickTemplateFields(getDefaultPageContent(key), content.zh) as Record<
      string,
      unknown
    >,
    en: pickTemplateFields(getDefaultPageContent(key), content.en) as Record<
      string,
      unknown
    >,
  };
}

export function normalizePageRevisionSnapshot(
  snapshot: unknown,
): LocalizedPageContent {
  if (!snapshot || typeof snapshot !== 'object' || Array.isArray(snapshot)) {
    throw new NotFoundException('历史版本快照不可用');
  }

  return snapshot as LocalizedPageContent;
}

export function toJsonValue(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value ?? null)) as Prisma.InputJsonValue;
}

function stripDerivedValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => stripDerivedValue(item));
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([key]) => key !== 'brand')
        .map(([key, entry]) => [key, stripDerivedValue(entry)]),
    );
  }

  return value;
}

function pickTemplateFields(template: unknown, source: unknown): unknown {
  if (Array.isArray(template)) {
    return Array.isArray(source) ? source : template;
  }

  if (!isRecord(template)) {
    return source ?? template;
  }

  const sourceRecord = isRecord(source) ? source : {};
  return Object.fromEntries(
    Object.entries(template).map(([key, value]) => [
      key,
      pickTemplateFields(value, sourceRecord[key]),
    ]),
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}
