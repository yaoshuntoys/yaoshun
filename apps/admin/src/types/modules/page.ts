export const pageKeys = [
  'home',
  'products',
  'news',
  'faq',
  'about',
  'solutions',
  'privacy',
  'terms',
] as const;

export type PageKey = (typeof pageKeys)[number];

export type PageConfigContent = Record<string, unknown>;

export interface LocalizedPageContent {
  zh: PageConfigContent;
  en: PageConfigContent;
}

export type PageContentMap = Record<PageKey, PageConfigContent>;

export interface PageConfigRecord<K extends PageKey = PageKey> {
  key: K;
  title: string;
  description: string;
  path: string;
  content: PageContentMap[K];
  isDefault: boolean;
}

export interface PageDraftRecord<K extends PageKey = PageKey> {
  key: K;
  title: string;
  description: string;
  path: string;
  draft: LocalizedPageContent;
  published: LocalizedPageContent | null;
  status: 'unconfigured' | 'draft' | 'published' | 'published_with_draft';
  lastSavedAt?: string;
  lastPublishedAt?: string;
  lastOperatorName?: string;
}

export interface PageRevisionRecord {
  id: number;
  version: number;
  action: 'save_draft' | 'publish' | 'rollback';
  summary: string;
  operatorName?: string;
  createdAt: string;
  snapshot: LocalizedPageContent;
}

export interface PageConfigUpdate<K extends PageKey = PageKey> {
  content: PageContentMap[K];
}

export interface PageDraftSave {
  zh: PageConfigContent;
  en: PageConfigContent;
}

export interface PageMeta {
  key: PageKey;
  routePath: string;
  title: string;
  description: string;
}
