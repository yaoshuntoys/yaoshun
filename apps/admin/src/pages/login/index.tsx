import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Space,
  Checkbox,
  message,
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@/stores';
import { forgotPassword, login as loginByPassword } from '@/api';
import { APP_NAME, APP_SUBTITLE } from '@/config';
import ForgotPasswordModal from '@/pages/login/components/ForgotPasswordModal';
import styles from '@/pages/login/index.module.css';

const { Title, Text } = Typography;

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    document.title = APP_NAME;
  }, []);

  const handleSubmit = async (values: {
    username: string;
    password: string;
    remember: boolean;
  }) => {
    setLoading(true);
    try {
      const res = await loginByPassword({ username: values.username, password: values.password });
      if (!res?.access_token) {
        message.error('登录响应异常，请稍后重试');
        return;
      }
      login(res.access_token, res.user);
      message.success('登录成功');
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      message.error('用户名或密码错误');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (values: {
    email: string;
  }) => {
    setForgotLoading(true);
    try {
      const result = await forgotPassword({
        email: values.email.trim(),
      });
      message.success(result.message);
      setForgotOpen(false);
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.orbTop} />
      <div className={styles.orbBottom} />

      <Card
        className={styles.card}
        bordered={false}
      >
        <Space direction="vertical" align="center" className={styles.header}>
          <img
            src="/favicon-rounded-192.png"
            alt={APP_NAME}
            className={styles.logo}
          />
          <Title level={3} className={styles.title}>{APP_NAME}</Title>
          <Text className={styles.subtitle}>{APP_SUBTITLE}</Text>
        </Space>

        <Form
          form={form}
          name="login"
          onFinish={handleSubmit}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input
              prefix={<UserOutlined className={styles.icon} />}
              placeholder="用户名"
              autoFocus
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined className={styles.icon} />}
              placeholder="密码"
            />
          </Form.Item>

          <Form.Item>
            <div className={styles.options}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>记住我</Checkbox>
              </Form.Item>
              <button
                type="button"
                className={styles.forgot}
                onClick={() => setForgotOpen(true)}
              >
                忘记密码？
              </button>
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
              className={styles.submit}
            >
              登录
            </Button>
          </Form.Item>
        </Form>

        <Text className={styles.footer}>
          © 2026 {APP_NAME}. All rights reserved.
        </Text>
      </Card>

      <ForgotPasswordModal
        open={forgotOpen}
        loading={forgotLoading}
        onCancel={() => setForgotOpen(false)}
        onSubmit={(values) => void handleForgotPassword(values)}
      />
    </div>
  );
}
