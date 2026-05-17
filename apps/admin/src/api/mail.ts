import { http } from '@/utils/request';
import type { MailConfig, MailRecord, PaginationParams, PaginationResult } from '@/types';

type MailRecordPageParams = PaginationParams & {
  keyword?: string;
  scene?: string;
  status?: string;
  startTime?: string;
  endTime?: string;
};

/** 获取邮件通道配置 */
export const getMailConfig = () =>
  http.get<MailConfig>('/api/v1/admin/settings/mail');

/** 保存邮件通道配置 */
export const saveMailConfig = (data: MailConfig) =>
  http.post<MailConfig>('/api/v1/admin/settings/mail', data);

/** 发送测试邮件 */
export const testMailConfig = (data: MailConfig) =>
  http.post<{ message: string; status: string; toEmail: string; errorMessage?: string }>(
    '/api/v1/admin/settings/mail/test',
    data,
  );

/** 获取邮件发送记录分页数据 */
export const getMailRecordPage = (params: MailRecordPageParams) =>
  http.get<PaginationResult<MailRecord>>('/api/v1/admin/mail-records/page', params);
