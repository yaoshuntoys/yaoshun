import { UserOutlined } from '@ant-design/icons';
import { Avatar, Card, Empty, Space, Timeline, Typography } from 'antd';

import { getActivityIcon } from '@/pages/dashboard/data';
import styles from '@/pages/dashboard/dashboard.module.css';
import type { DashboardActivity } from '@/types';

const { Text } = Typography;

interface Props {
  loading: boolean;
  activities: DashboardActivity[];
}

function formatTime(value: string) {
  return new Date(value).toLocaleString('zh-CN');
}

export default function DashboardRecentActivities({ loading, activities }: Props) {
  return (
    <Card
      title="最近动态"
      bordered={false}
      className={styles.blockCard}
    >
      {loading ? (
        <div className={styles.activityPlaceholderList}>
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className={styles.activityPlaceholderItem}>
              <div className={styles.activityPlaceholderAvatar} />
              <div className={styles.activityPlaceholderContent}>
                <div className={styles.activityPlaceholderLineShort} />
                <div className={styles.activityPlaceholderLine} />
              </div>
            </div>
          ))}
        </div>
      ) : activities.length === 0 ? (
        <div className={styles.emptyState}>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无操作动态" />
        </div>
      ) : (
        <Timeline mode="left">
          {activities.map((activity) => (
            <Timeline.Item
              key={activity.id}
              dot={getActivityIcon(activity.type)}
              label={formatTime(activity.createdAt)}
              className={
                activity.type === 'create'
                  ? styles.timelineCreate
                  : activity.type === 'delete'
                    ? styles.timelineDelete
                    : styles.timelineUpdate
              }
            >
              <div className={styles.timelineItem}>
                <Space align="start" className={styles.activityRow}>
                  <Avatar size="small" icon={<UserOutlined />} />
                  <div>
                    <Space wrap>
                      <Text className={styles.activityUser}>{activity.user}</Text>
                      <Text>{activity.action}</Text>
                      <Text className={styles.activityModule}>{activity.module}</Text>
                    </Space>
                    <Text className={styles.activityTarget}>{activity.target}</Text>
                  </div>
                </Space>
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      )}
    </Card>
  );
}
