import { Card, Col, Row, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

import { getStatIcon } from '@/pages/dashboard/data';
import styles from '@/pages/dashboard/dashboard.module.css';
import type { DashboardStat } from '@/types';

const { Text } = Typography;

interface Props {
  loading: boolean;
  stats: DashboardStat[];
}

export default function DashboardStats({ loading, stats }: Props) {
  const navigate = useNavigate();

  const routes: Record<DashboardStat['key'], string> = {
    content: '/content/product',
    published: '/content/news',
    media: '/content/media',
    message: '/customer/message',
  };

  return (
    <Row gutter={[24, 24]} className={styles.statsRow}>
      {stats.map((stat) => (
        <Col xs={24} sm={12} lg={6} key={stat.key}>
          <Card
            bordered={false}
            hoverable={!loading}
            className={`${styles.statCard} ${loading ? styles.statCardLoading : ''}`}
            onClick={() => {
              if (!loading) {
                navigate(routes[stat.key]);
              }
            }}
          >
            <div className={styles.statContent}>
              <div>
                <Text className={styles.statLabel}>{stat.title}</Text>
                <div className={styles.statValue}>{loading ? '--' : stat.value}</div>
                <Text className={styles.statTrend}>{stat.trend}</Text>
              </div>
              <div
                className={`${styles.statIcon} ${
                  stat.key === 'content'
                    ? styles.statContentIcon
                    : stat.key === 'published'
                      ? styles.statPublishedIcon
                      : stat.key === 'media'
                        ? styles.statMediaIcon
                        : styles.statMessageIcon
                }`}
              >
                {getStatIcon(stat.key)}
              </div>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
