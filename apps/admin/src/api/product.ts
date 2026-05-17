import { http } from '@/utils/request';
import type { PaginationParams, PaginationResult, Product } from '@/types';

type ProductMutationPayload = Partial<Product> | Record<string, unknown>;

type ProductPageParams = PaginationParams & {
  category?: string;
  keyword?: string;
  status?: string;
  publicOnly?: boolean;
};

type ProductListParams = {
  category?: string;
  status?: string;
  publicOnly?: boolean;
  pageSize?: number;
};

/** 获取产品分页数据 */
export const getProductPage = (params: ProductPageParams) =>
  http.get<PaginationResult<Product>>('/api/v1/admin/products', params);

/** 获取产品列表 */
export const getProductList = (params?: ProductListParams) =>
  http.get<PaginationResult<Product>>('/api/v1/admin/products', params);

/** 获取产品详情 */
export const getProductDetail = (id: number) =>
  http.get<Product>(`/api/v1/admin/products/${id}`);

/** 新增产品 */
export const createProduct = (data: ProductMutationPayload) =>
  http.post<Product>('/api/v1/admin/products', data);

/** 更新产品 */
export const updateProduct = (id: number, data: ProductMutationPayload) =>
  http.patch<Product>(`/api/v1/admin/products/${id}`, data);

/** 删除产品 */
export const deleteProduct = (id: number) =>
  http.delete(`/api/v1/admin/products/${id}`);

/** 获取产品历史版本 */
export const getProductRevisions = (id: number) =>
  http.get(`/api/v1/admin/products/${id}/revisions`);

/** 恢复产品历史版本 */
export const rollbackProductRevision = (id: number, revisionId: number) =>
  http.post<Product>(`/api/v1/admin/products/${id}/rollback/${revisionId}`);
