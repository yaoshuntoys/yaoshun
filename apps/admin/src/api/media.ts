import { http } from '@/utils/request';
import type { Media, PaginationParams, PaginationResult } from '@/types';

export type MediaFile = Media & {
  fileName: string;
  fileType: string;
};

export interface Folder {
  id: number;
  name: string;
  parentId: number | null;
  isSystem: boolean;
  children?: Folder[];
  createdAt?: string;
}

/** 获取媒体目录树 */
export const getFolderTree = () =>
  http.get<Folder[]>('/api/v1/admin/media/folders/tree');

/** 新增目录 */
export const createFolder = (data: { name: string; parentId?: number }) =>
  http.post<Folder>('/api/v1/admin/media/folders/create', data);

/** 重命名目录 */
export const renameFolder = (data: { id: number; name: string }) =>
  http.post('/api/v1/admin/media/folders/rename', data);

/** 移动目录 */
export const moveFolder = (data: { id: number; parentId: number | null }) =>
  http.post('/api/v1/admin/media/folders/move', data);

/** 删除目录 */
export const deleteFolder = (data: { id: number }) =>
  http.post('/api/v1/admin/media/folders/delete', data);

/** 获取媒体分页数据 */
export const getMediaPage = (params: PaginationParams & { mimetype?: string; search?: string; folderId?: number }) =>
  http.get<PaginationResult<Media>>('/api/v1/admin/media/assets/page', params);

/** 上传媒体文件 */
export const uploadMedia = (file: File, folderId?: number) => {
  const formData = new FormData();
  formData.append('file', file);
  if (folderId !== undefined) formData.append('folderId', String(folderId));
  return http.post<Media>('/api/v1/admin/media/assets/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

/** 重命名媒体文件 */
export const renameMedia = (data: { id: number; name: string }) =>
  http.post('/api/v1/admin/media/assets/rename', data);

/** 删除媒体文件 */
export const deleteMedia = (data: { id: number }) =>
  http.post('/api/v1/admin/media/assets/delete', data);
