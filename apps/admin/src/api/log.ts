import { http } from '@/utils/request';
import type { OperationLog, PaginationParams, PaginationResult } from '@/types';

type OperationLogPageParams = PaginationParams & {
  userId?: string;
  module?: string;
  keyword?: string;
  startTime?: string;
  endTime?: string;
};

/** 获取操作日志分页数据 */
export const getOperationLogPage = (params: OperationLogPageParams) =>
  http.get<PaginationResult<OperationLog>>('/api/v1/admin/logs/page', params);
