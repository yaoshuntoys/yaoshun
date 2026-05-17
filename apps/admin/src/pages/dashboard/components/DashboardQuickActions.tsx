import { Card, Col, Row, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

import { getActionIcon, quickActions } from '@/pages/dashboard/data';
import styles from '@/pages/dashboard/dashboard.module.css';

const { Text } = Typography;

export default function DashboardQuickActions() {
  const navigate = useNavigate();

  return (
    <Card
      title="快捷操作"
      bordered={false}
      className={styles.blockCard}
    >
      <Row gutter={[16, 16]}>
        {quickActions.map((action) => (
          <Col xs={24} sm={12} key={action.key}>
            <Card
              hoverable
              className={styles.actionCard}
              onClick={() => navigate(action.path)}
            >
              <div className={styles.actionBody}>
                <div
                  className={`${styles.actionIconWrap} ${
                    action.key === 'news'
                      ? styles.actionNews
                      : action.key === 'product'
                        ? styles.actionProduct
                        : action.key === 'media'
                          ? styles.actionMedia
                          : styles.actionPage
                  }`}
                >
                  {getActionIcon(action.key)}
                </div>
                <Text className={styles.actionTitle}>{action.title}</Text>
                <Text className={styles.actionDescription}>{action.description}</Text>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );
}
