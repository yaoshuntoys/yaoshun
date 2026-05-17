import { http } from '@/utils/request';
import type { EnterpriseConfig } from '@/types';

/** 获取企业配置 */
export const getEnterpriseConfig = () =>
  http.get<EnterpriseConfig>('/api/v1/admin/settings/enterprise');

/** 保存企业配置 */
export const saveEnterpriseConfig = (data: EnterpriseConfig) =>
  http.post<EnterpriseConfig>('/api/v1/admin/settings/enterprise', data);

/** 获取企业配置历史 */
export const getEnterpriseRevisions = () =>
  http.get<Array<{
    id: number;
    version: number;
    action: string;
    operatorName?: string | null;
    summary?: string | null;
    snapshot: EnterpriseConfig;
    createdAt: string;
  }>>('/api/v1/admin/settings/enterprise/revisions');

/** 恢复企业配置历史 */
export const rollbackEnterpriseConfig = (revisionId: number) =>
  http.post<EnterpriseConfig>(`/api/v1/admin/settings/enterprise/rollback/${revisionId}`);
