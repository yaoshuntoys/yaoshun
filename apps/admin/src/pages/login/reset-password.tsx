import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button, Card, Form, Input, Space, Typography, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';

import { resetForgottenPassword } from '@/api';
import { APP_NAME } from '@/config';
import styles from '@/pages/login/index.module.css';

const { Text, Title } = Typography;

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const token = useMemo(() => searchParams.get('token')?.trim() ?? '', [searchParams]);

  const handleSubmit = async (values: { newPassword: string; confirmPassword: string }) => {
    if (!token) {
      message.error('重置链接无效，请重新申请');
      return;
    }

    setLoading(true);
    try {
      const result = await resetForgottenPassword({
        token,
        newPassword: values.newPassword,
      });
      message.success(result.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.orbTop} />
      <div className={styles.orbBottom} />

      <Card className={styles.card} bordered={false}>
        <Space direction="vertical" align="center" className={styles.header}>
          <img src="/favicon-rounded-192.png" alt={APP_NAME} className={styles.logo} />
          <Title level={3} className={styles.title}>重置密码</Title>
          <Text className={styles.subtitle}>请设置新的后台登录密码</Text>
        </Space>

        <Form name="reset-password" onFinish={handleSubmit} autoComplete="off" size="large">
          <Form.Item
            name="newPassword"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 6, message: '密码至少 6 位' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className={styles.icon} />}
              placeholder="新密码"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: '请再次输入新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className={styles.icon} />}
              placeholder="确认新密码"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
              className={styles.submit}
              disabled={!token}
            >
              确认重置
            </Button>
          </Form.Item>
        </Form>

        <Text className={styles.footer}>
          <Link to="/login">返回登录</Link>
        </Text>
      </Card>
    </div>
  );
}
