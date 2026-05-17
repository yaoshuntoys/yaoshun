import { Card, Space, Tag, Typography } from 'antd';

import styles from '@/pages/dashboard/dashboard.module.css';
import type { DashboardStatus } from '@/types';

const { Text } = Typography;

interface Props {
  systemStatus: DashboardStatus[];
}

export default function DashboardSystemStatus({ systemStatus }: Props) {
  return (
    <Card
      title="系统状态"
      bordered={false}
      className={styles.blockCard}
    >
      <Space direction="vertical" className="w-full" size="middle">
        {systemStatus.map((status) => (
          <div key={status.key} className={styles.statusItem}>
            <Text>{status.label}</Text>
            <Tag color={status.color}>{status.value}</Tag>
          </div>
        ))}
      </Space>
    </Card>
  );
}
