import { http } from '@/utils/request';
import type { User } from '@/types';
import type { PaginationParams, PaginationResult } from '@/types';

type AccountPageParams = PaginationParams & {
  keyword?: string;
  role?: string;
  status?: string;
};

/** 获取账号分页数据 */
export const getAccountPage = (params: AccountPageParams) =>
  http.get<PaginationResult<User>>('/api/v1/admin/accounts/page', params);

/** 获取账号列表 */
export const getAccountList = () =>
  http.get<User[]>('/api/v1/admin/accounts/list');

/** 获取账号详情 */
export const getAccountDetail = (data: { id: number }) =>
  http.post<User>('/api/v1/admin/accounts/detail', data);

/** 新增账号 */
export const createAccount = (data: Partial<User> & { password: string }) =>
  http.post('/api/v1/admin/accounts/create', data);

/** 更新账号 */
export const updateAccount = (data: Partial<User> & { id: number }) =>
  http.post('/api/v1/admin/accounts/update', data);

/** 删除账号 */
export const deleteAccount = (data: { id: number }) =>
  http.post('/api/v1/admin/accounts/delete', data);

/** 重置账号密码 */
export const resetAccountPassword = (data: { id: number; password: string }) =>
  http.post('/api/v1/admin/accounts/reset-password', data);

/** 切换账号状态 */
export const toggleAccountStatus = (data: { id: number }) =>
  http.post('/api/v1/admin/accounts/toggle', data);
