import { http } from '@/utils/request';
import type {
  PageConfigRecord,
  PageConfigUpdate,
  PageDraftRecord,
  PageDraftSave,
  PageKey,
  PageRevisionRecord,
} from '@/types';

/** 获取页面配置列表 */
export const getPageConfigList = () =>
  http.get<PageConfigRecord[]>('/api/v1/admin/pages');

/** 获取页面配置详情 */
export const getPageConfigDetail = <K extends PageKey>(key: K) =>
  http.get<PageConfigRecord<K>>(`/api/v1/site/pages/${key}`);

/** 获取页面草稿详情 */
export const getPageDraftDetail = <K extends PageKey>(key: K) =>
  http.get<PageDraftRecord<K>>(`/api/v1/admin/pages/${key}/draft`);

/** 保存页面中英文草稿 */
export const savePageDraft = <K extends PageKey>(key: K, data: PageDraftSave) =>
  http.post<PageDraftRecord<K>>(`/api/v1/admin/pages/${key}/save-draft`, data);

/** 发布页面草稿 */
export const publishPageDraft = <K extends PageKey>(key: K) =>
  http.post<PageDraftRecord<K>>(`/api/v1/admin/pages/${key}/publish`);

/** 获取页面历史 */
export const getPageRevisions = <K extends PageKey>(key: K) =>
  http.get<PageRevisionRecord[]>(`/api/v1/admin/pages/${key}/revisions`);

/** 恢复页面历史为草稿 */
export const rollbackPageRevision = <K extends PageKey>(key: K, revisionId: string | number) =>
  http.post<PageDraftRecord<K>>(`/api/v1/admin/pages/${key}/rollback/${revisionId}`);

/** 更新页面配置 */
export const updatePageConfig = <K extends PageKey>(key: K, data: PageConfigUpdate<K>) =>
  http.patch<PageConfigRecord<K>>(`/api/v1/admin/pages/${key}`, data);
