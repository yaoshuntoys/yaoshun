import { http } from '@/utils/request';
import type { FaqItem, PaginationParams, PaginationResult } from '@/types';

type FaqPageParams = PaginationParams & {
  categoryKey?: string;
  keyword?: string;
  status?: string;
  publicOnly?: boolean;
};

/** 获取 FAQ 分页数据 */
export const getFaqPage = (params: FaqPageParams) =>
  http.get<PaginationResult<FaqItem>>('/api/v1/admin/faqs', params);

/** 获取 FAQ 详情 */
export const getFaqDetail = (id: number) =>
  http.get<FaqItem>(`/api/v1/admin/faqs/${id}`);

/** 新增 FAQ */
export const createFaq = (data: Partial<FaqItem>) =>
  http.post<FaqItem>('/api/v1/admin/faqs', data);

/** 更新 FAQ */
export const updateFaq = (id: number, data: Partial<FaqItem>) =>
  http.patch<FaqItem>(`/api/v1/admin/faqs/${id}`, data);

/** 删除 FAQ */
export const deleteFaq = (id: number) =>
  http.delete(`/api/v1/admin/faqs/${id}`);

/** 获取 FAQ 历史版本 */
export const getFaqRevisions = (id: number) =>
  http.get(`/api/v1/admin/faqs/${id}/revisions`);

/** 恢复 FAQ 历史版本 */
export const rollbackFaqRevision = (id: number, revisionId: number) =>
  http.post<FaqItem>(`/api/v1/admin/faqs/${id}/rollback/${revisionId}`);
