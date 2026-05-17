export interface DashboardStat {
  key: 'content' | 'published' | 'media' | 'message';
  title: string;
  value: number;
  trend: string;
}

export interface DashboardStatus {
  key: string;
  label: string;
  value: string;
  color: 'success' | 'processing' | 'warning' | 'default';
}

export interface DashboardActivity {
  id: number;
  user: string;
  action: string;
  module: string;
  target: string;
  createdAt: string;
  type: 'create' | 'update' | 'delete';
}

export interface DashboardStatsResponse {
  stats: DashboardStat[];
  systemStatus: DashboardStatus[];
}
