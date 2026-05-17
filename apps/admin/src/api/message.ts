import { http } from '@/utils/request';
import type { PaginationResult } from '@/types';

export interface Message {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface CreateMessagePayload {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

/** 创建客户留言 */
export const createMessage = (data: CreateMessagePayload) =>
  http.post<Message>('/api/v1/admin/messages/create', data);

/** 获取客户留言分页数据 */
export const getMessagePage = (params: { page?: number; pageSize?: number; isRead?: boolean; keyword?: string }) =>
  http.get<PaginationResult<Message>>('/api/v1/admin/messages/page', params);

/** 获取未读留言数量 */
export const getUnreadMessageCount = () =>
  http.get<{ count: number }>('/api/v1/admin/messages/unread-count');

/** 获取留言详情 */
export const getMessageDetail = (data: { id: number }) =>
  http.post<Message>('/api/v1/admin/messages/detail', data);

/** 标记留言为已读 */
export const markMessageRead = (data: { id: number }) =>
  http.post('/api/v1/admin/messages/mark-read', data);

/** 删除留言 */
export const deleteMessage = (data: { id: number }) =>
  http.post('/api/v1/admin/messages/delete', data);
