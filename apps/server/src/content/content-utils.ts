import { NotFoundException } from '@nestjs/common';

export function getEntityId(entity: unknown): number | string {
  if (entity && typeof entity === 'object' && 'id' in entity) {
    return Number((entity as { id: number | string }).id);
  }

  return 'unknown';
}

export function getEntityDisplayName(
  entity: unknown,
  fieldName: string,
  fallback: number | string,
) {
  if (entity && typeof entity === 'object' && fieldName in entity) {
    const value = (entity as Record<string, unknown>)[fieldName];
    if (typeof value === 'string' && value.trim()) {
      return value;
    }
  }

  return String(fallback);
}

export function assertActiveEntity(
  entity: unknown,
  notFoundMessage: string,
): asserts entity is NonNullable<typeof entity> {
  if (!entity || (entity as { deletedAt?: Date | string | null }).deletedAt) {
    throw new NotFoundException(notFoundMessage);
  }
}

export function assertPublicEntity(
  entity: unknown,
  expectedStatus: string,
  notFoundMessage: string,
): asserts entity is NonNullable<typeof entity> {
  assertActiveEntity(entity, notFoundMessage);

  if ((entity as { status?: string }).status !== expectedStatus) {
    throw new NotFoundException(notFoundMessage);
  }
}

export function normalizeRevisionSnapshot(
  snapshot: unknown,
): Record<string, unknown> {
  if (!snapshot || typeof snapshot !== 'object' || Array.isArray(snapshot)) {
    throw new NotFoundException('历史版本快照不可用');
  }

  return snapshot as Record<string, unknown>;
}

export function buildRollbackData(snapshot: Record<string, unknown>) {
  const { id, createdAt, updatedAt, ...data } = snapshot;
  void id;
  void createdAt;
  void updatedAt;

  return data;
}
