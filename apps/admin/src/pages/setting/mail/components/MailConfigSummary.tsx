import {
  CheckCircleOutlined,
  MailOutlined,
  NotificationOutlined,
  SafetyOutlined,
} from '@ant-design/icons';
import { Card, Col, Row, Space, Tag, Typography } from 'antd';

import type { MailConfig } from '@/types';

const { Text } = Typography;

interface Props {
  config: Partial<MailConfig>;
}

export default function MailConfigSummary({ config }: Props) {
  const sender = config.fromName || config.username || '-';
  const server = config.smtpHost
    ? `${config.smtpHost}:${config.smtpPort ?? '-'}`
    : '-';
  const notifyCount = Number(Boolean(config.notifyOnContact)) + Number(Boolean(config.notifyOnPasswordReset));

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={8}>
        <Card size="small">
          <Space align="start">
            <SafetyOutlined style={{ fontSize: 20, color: '#2563eb' }} />
            <div>
              <Text type="secondary">SMTP 服务</Text>
              <div>
                <Text strong>{server}</Text>
              </div>
              <Tag color={config.smtpSecure ? 'success' : 'default'}>
                {config.smtpSecure ? 'SSL/TLS 已开启' : '普通连接'}
              </Tag>
            </div>
          </Space>
        </Card>
      </Col>
      <Col xs={24} md={8}>
        <Card size="small">
          <Space align="start">
            <MailOutlined style={{ fontSize: 20, color: '#7c3aed' }} />
            <div>
              <Text type="secondary">发件人</Text>
              <div>
                <Text strong>{sender}</Text>
              </div>
              <Text type="secondary">{config.fromEmail || config.username || '-'}</Text>
            </div>
          </Space>
        </Card>
      </Col>
      <Col xs={24} md={8}>
        <Card size="small">
          <Space align="start">
            <NotificationOutlined style={{ fontSize: 20, color: '#059669' }} />
            <div>
              <Text type="secondary">通知开关</Text>
              <div>
                <Text strong>{notifyCount}/2 已开启</Text>
              </div>
              <Space size={4} wrap>
                {config.notifyOnContact ? <Tag color="success">留言通知</Tag> : null}
                {config.notifyOnPasswordReset ? <Tag color="success">密码重置</Tag> : null}
                {notifyCount === 0 ? <Tag>未开启</Tag> : null}
              </Space>
            </div>
          </Space>
        </Card>
      </Col>
      <Col span={24}>
        <Card size="small">
          <Space>
            <CheckCircleOutlined style={{ color: '#22c55e' }} />
            <Text type="secondary">
              建议保存配置后先发送测试邮件，确认 SMTP 端口、授权码和发件人信息都能正常工作。
            </Text>
          </Space>
        </Card>
      </Col>
    </Row>
  );
}
