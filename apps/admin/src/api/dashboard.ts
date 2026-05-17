import { http } from '@/utils/request';
import type {
  DashboardActivity,
  DashboardStatsResponse,
} from '@/types';

let statsRequest: Promise<DashboardStatsResponse> | null = null;
let activitiesRequest: Promise<DashboardActivity[]> | null = null;

/** 获取仪表盘统计数据 */
export const getDashboardStats = () => {
  if (!statsRequest) {
    statsRequest = http
      .get<DashboardStatsResponse>('/api/v1/admin/dashboard/stats')
      .finally(() => {
        statsRequest = null;
      });
  }

  return statsRequest;
};

/** 获取最近操作动态 */
export const getDashboardActivities = () => {
  if (!activitiesRequest) {
    activitiesRequest = http
      .get<DashboardActivity[]>('/api/v1/admin/dashboard/activities')
      .finally(() => {
        activitiesRequest = null;
      });
  }

  return activitiesRequest;
};
