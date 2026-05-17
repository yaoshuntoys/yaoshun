export const PAGE_KEYS = [
  'home',
  'products',
  'about',
  'solutions',
  'faq',
  'news',
  'privacy',
  'terms',
] as const;

export type PageKey = (typeof PAGE_KEYS)[number];

export type PageConfigContent = Record<string, unknown>;
export type PageLocale = 'zh' | 'en';

export interface LocalizedPageContent {
  zh: PageConfigContent;
  en: PageConfigContent;
}

export type PageConfigMap = Record<PageKey, PageConfigContent>;

export interface PageDefinition<K extends PageKey = PageKey> {
  key: K;
  title: string;
  description: string;
  path: string;
  content: PageConfigMap[K];
}

export interface PageConfigResponse<K extends PageKey = PageKey>
  extends PageDefinition<K> {
  isDefault: boolean;
}

export interface PageRevision {
  id: number;
  version: number;
  action: 'save_draft' | 'publish' | 'rollback';
  summary: string;
  operatorName?: string;
  createdAt: string;
  snapshot: LocalizedPageContent;
}

export interface PageDraftResponse<K extends PageKey = PageKey> {
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
