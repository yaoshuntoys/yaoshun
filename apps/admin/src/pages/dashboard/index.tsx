import { useEffect, useState } from 'react';
import { Col, Row, message } from 'antd';

import { getDashboardActivities, getDashboardStats } from '@/api/dashboard';
import PageContainer from '@/components/PageContainer';
import DashboardQuickActions from '@/pages/dashboard/components/DashboardQuickActions';
import DashboardRecentActivities from '@/pages/dashboard/components/DashboardRecentActivities';
import DashboardStats from '@/pages/dashboard/components/DashboardStats';
import DashboardSystemStatus from '@/pages/dashboard/components/DashboardSystemStatus';
import {
  dashboardStatPlaceholders,
  dashboardStatusPlaceholders,
} from '@/pages/dashboard/data';
import styles from '@/pages/dashboard/dashboard.module.css';
import type {
  DashboardActivity,
  DashboardStatsResponse,
} from '@/types';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState<DashboardStatsResponse>({
    stats: dashboardStatPlaceholders,
    systemStatus: dashboardStatusPlaceholders,
  });
  const [activities, setActivities] = useState<DashboardActivity[]>([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const [statsRes, activitiesRes] = await Promise.all([
          getDashboardStats(),
          getDashboardActivities(),
        ]);
        setStatsData(statsRes);
        setActivities(activitiesRes);
      } catch (error) {
        console.error(error);
        message.error('仪表盘数据加载失败');
      } finally {
        setLoading(false);
      }
    };

    void fetchDashboard();
  }, []);

  return (
    <PageContainer
      title="仪表盘"
      description="集中查看内容发布、客户留言、素材资源与后台操作动态，帮助运营快速定位当天重点工作。"
    >
      <div className={styles.root}>
        <DashboardStats loading={loading} stats={statsData.stats} />

        <Row gutter={[24, 24]} className={styles.twoColumnRow}>
          <Col xs={24} lg={16}>
            <DashboardQuickActions />
          </Col>
          <Col xs={24} lg={8}>
            <DashboardSystemStatus systemStatus={statsData.systemStatus} />
          </Col>
        </Row>

        <DashboardRecentActivities loading={loading} activities={activities} />
      </div>
    </PageContainer>
  );
}
