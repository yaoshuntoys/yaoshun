export type ContentRevisionEntityType =
  | 'product'
  | 'news'
  | 'faq'
  | 'partner'
  | 'page'
  | 'enterprise-setting'
  | 'media';

export type ContentRevisionAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'save_draft'
  | 'publish'
  | 'rollback';

export interface ContentRevisionRecord {
  id: number;
  entityType: string;
  entityId: string;
  version: number;
  action: string;
  operatorName?: string | null;
  summary?: string | null;
  snapshot: unknown;
  createdAt: Date;
}
