import { http } from '@/utils/request';

export type TranslatableContent =
  | string
  | number
  | boolean
  | null
  | TranslatableContent[]
  | { [key: string]: TranslatableContent | unknown };

export interface TranslationResult {
  sourceLocale: 'zh' | 'en';
  targetLocale: 'zh' | 'en';
  provider: string;
  translated: TranslatableContent;
}

export const translateContent = (content: TranslatableContent) =>
  http.post<TranslationResult>('/api/v1/admin/translation/translate', {
    sourceLocale: 'zh',
    targetLocale: 'en',
    content,
  });
