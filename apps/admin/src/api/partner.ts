import { http } from '@/utils/request';
import type { PaginationParams, PaginationResult, Partner } from '@/types';

type PartnerPageParams = PaginationParams & {
  keyword?: string;
  status?: string;
  publicOnly?: boolean;
};

/** 获取合作客户分页数据 */
export const getPartnerPage = (params: PartnerPageParams) =>
  http.get<PaginationResult<Partner>>('/api/v1/admin/partners', params);

/** 获取合作客户详情 */
export const getPartnerDetail = (id: number) =>
  http.get<Partner>(`/api/v1/admin/partners/${id}`);

/** 新增合作客户 */
export const createPartner = (data: Partial<Partner>) =>
  http.post<Partner>('/api/v1/admin/partners', data);

/** 更新合作客户 */
export const updatePartner = (id: number, data: Partial<Partner>) =>
  http.patch<Partner>(`/api/v1/admin/partners/${id}`, data);

/** 删除合作客户 */
export const deletePartner = (id: number) =>
  http.delete(`/api/v1/admin/partners/${id}`);

/** 获取合作客户历史版本 */
export const getPartnerRevisions = (id: number) =>
  http.get(`/api/v1/admin/partners/${id}/revisions`);

/** 恢复合作客户历史版本 */
export const rollbackPartnerRevision = (id: number, revisionId: number) =>
  http.post<Partner>(`/api/v1/admin/partners/${id}/rollback/${revisionId}`);
