import { Typography } from 'antd';

const { Title, Text } = Typography;

export default function OperationLogHeader() {
  return (
    <div>
      <Title level={4} className="admin-section-title">操作日志</Title>
      <Text type="secondary" className="text-xs">
        记录后台人员的登录时间和具体操作行为，便于追溯
      </Text>
    </div>
  );
}
