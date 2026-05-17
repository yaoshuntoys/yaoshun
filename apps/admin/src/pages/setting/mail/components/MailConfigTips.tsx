import { MailOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Space, Tag, Typography } from 'antd';

import type { MailConfig } from '@/types';

const { Text } = Typography;

interface MailPreset {
  label: string;
  host: string;
  port: number;
  secure: boolean;
}

const mailPresets: MailPreset[] = [
  { label: 'QQ邮箱', host: 'smtp.qq.com', port: 465, secure: true },
  { label: '163邮箱', host: 'smtp.163.com', port: 465, secure: true },
  { label: '阿里云企业邮箱', host: 'smtp.mxhichina.com', port: 465, secure: true },
  { label: 'Gmail', host: 'smtp.gmail.com', port: 587, secure: false },
];

interface Props {
  onApplyPreset: (
    preset: Pick<MailConfig, 'smtpHost' | 'smtpPort' | 'smtpSecure'>,
  ) => void;
}

export default function MailConfigTips({ onApplyPreset }: Props) {
  return (
    <Space direction="vertical" className="w-full" size="middle">
      <Card title="快速预设" size="small">
        <Space direction="vertical" className="w-full">
          {mailPresets.map((preset) => (
            <Card
              key={preset.label}
              size="small"
              styles={{ body: { padding: 12 } }}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <Text strong>{preset.label}</Text>
                  <div>
                    <Text type="secondary">
                      {preset.host}:{preset.port}
                    </Text>
                  </div>
                  <Tag color={preset.secure ? 'success' : 'default'}>
                    {preset.secure ? 'SSL/TLS' : 'STARTTLS/普通连接'}
                  </Tag>
                </div>
                <Button
                  size="small"
                  onClick={() =>
                    onApplyPreset({
                      smtpHost: preset.host,
                      smtpPort: preset.port,
                      smtpSecure: preset.secure,
                    })
                  }
                >
                  套用
                </Button>
              </div>
            </Card>
          ))}
        </Space>
      </Card>

      <Alert
        message="配置说明"
        description={
          <ul className="mb-0 pl-4">
            <li>SMTP服务器地址请咨询您的邮件服务商</li>
            <li>建议使用SSL/TLS加密连接</li>
            <li>部分邮箱需要使用授权码而非登录密码</li>
            <li>配置完成后建议先发送一封测试邮件</li>
          </ul>
        }
        type="info"
        showIcon
      />

      <Card size="small">
        <Space>
          <MailOutlined className="text-2xl text-sky-500" />
          <div>
            <Text strong>邮件服务状态</Text>
            <div>
              <Text type="success">● 已启用</Text>
            </div>
          </div>
        </Space>
      </Card>
    </Space>
  );
}
