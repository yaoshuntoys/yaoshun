import { http } from '@/utils/request';
import type {
  PaginationParams,
  PaginationResult,
  Role,
} from '@/types';

type RolePageParams = PaginationParams & {
  keyword?: string;
  status?: string;
};

/** 获取角色分页数据 */
export const getRolePage = (params: RolePageParams) =>
  http.get<PaginationResult<Role>>('/api/v1/admin/roles/page', params);

/** 获取角色列表 */
export const getRoleList = (params?: { status?: string }) =>
  http.get<Role[]>('/api/v1/admin/roles/list', params);

/** 获取可分配角色列表 */
export const getAssignableRoleList = () =>
  http.get<Role[]>('/api/v1/admin/roles/assignable-roles');

/** 获取角色详情 */
export const getRoleDetail = (data: { id: number }) =>
  http.post<Role>('/api/v1/admin/roles/detail', data);

/** 新增角色 */
export const createRole = (
  data: Partial<Role> & { code: string; name: string; permissionCodes?: string[] },
) => http.post<Role>('/api/v1/admin/roles/create', data);

/** 更新角色 */
export const updateRole = (
  data: Partial<Role> & { id: number; permissionCodes?: string[] },
) => http.post<Role>('/api/v1/admin/roles/update', data);

/** 切换角色状态 */
export const toggleRole = (data: { id: number }) =>
  http.post<Role>('/api/v1/admin/roles/toggle', data);

/** 删除角色 */
export const deleteRole = (data: { id: number }) =>
  http.post<Role>('/api/v1/admin/roles/delete', data);
