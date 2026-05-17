import { http } from '@/utils/request';
import type { Article, PaginationParams, PaginationResult } from '@/types';

type NewsPageParams = PaginationParams & {
  category?: string;
  keyword?: string;
  status?: string;
  publicOnly?: boolean;
};

type NewsListParams = {
  category?: string;
  status?: string;
  publicOnly?: boolean;
  pageSize?: number;
};

/** 获取新闻分页数据 */
export const getNewsPage = (params: NewsPageParams) =>
  http.get<PaginationResult<Article>>('/api/v1/admin/news', params);

/** 获取新闻列表 */
export const getNewsList = (params?: NewsListParams) =>
  http.get<PaginationResult<Article>>('/api/v1/admin/news', params);

/** 获取新闻详情 */
export const getNewsDetail = (id: number) =>
  http.get<Article>(`/api/v1/admin/news/${id}`);

/** 通过 slug 获取新闻详情 */
export const getNewsDetailBySlug = (slug: string) =>
  http.get<Article>(`/api/v1/admin/news/slug/${slug}`);

/** 新增新闻 */
export const createNews = (data: Partial<Article>) =>
  http.post<Article>('/api/v1/admin/news', data);

/** 更新新闻 */
export const updateNews = (id: number, data: Partial<Article>) =>
  http.patch<Article>(`/api/v1/admin/news/${id}`, data);

/** 删除新闻 */
export const deleteNews = (id: number) =>
  http.delete(`/api/v1/admin/news/${id}`);

/** 获取新闻历史版本 */
export const getNewsRevisions = (id: number) =>
  http.get(`/api/v1/admin/news/${id}/revisions`);

/** 恢复新闻历史版本 */
export const rollbackNewsRevision = (id: number, revisionId: number) =>
  http.post<Article>(`/api/v1/admin/news/${id}/rollback/${revisionId}`);
