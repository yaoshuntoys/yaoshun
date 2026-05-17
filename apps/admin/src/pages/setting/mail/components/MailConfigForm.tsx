import { Card, Col, Form, Input, InputNumber, Row, Switch, Typography } from 'antd';

import type { MailConfig } from '@/types';
import styles from '@/pages/setting/mail/components/MailConfigForm.module.css';

const { Paragraph, Text, Title } = Typography;

interface Props {
  form: ReturnType<typeof Form.useForm<MailConfig>>[0];
  initialValues: MailConfig;
  loading: boolean;
  onSubmit: (values: MailConfig) => void;
}

export default function MailConfigForm({
  form,
  initialValues,
  loading,
  onSubmit,
}: Props) {
  const secureEnabled = Form.useWatch('smtpSecure', form);
  const hasStoredPassword = Boolean(Form.useWatch('hasPassword', form));

  return (
    <Card
      title="邮件通道配置"
      extra={<Text type="secondary">保存后可在页面右上角发送测试邮件</Text>}
    >
      <Form
        form={form}
        layout="vertical"
        disabled={loading}
        onFinish={onSubmit}
        initialValues={initialValues}
      >
        <Form.Item name="hasPassword" hidden>
          <Input type="hidden" />
        </Form.Item>
        <div className={styles.sectionList}>
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <Title level={5} className={styles.sectionTitle}>
                连接参数
              </Title>
              <Paragraph className={styles.sectionDescription}>
                配置 SMTP 服务地址、端口和加密方式，决定邮件通道的基础连通性。
              </Paragraph>
            </div>

            <Row gutter={16}>
              <Col xs={24} md={16}>
                <Form.Item
                  name="smtpHost"
                  label="SMTP服务器地址"
                  rules={[{ required: true, message: '请输入SMTP服务器地址' }]}
                >
                  <Input placeholder="例如：smtp.example.com" />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name="smtpPort"
                  label="端口号"
                  rules={[{ required: true, message: '请输入端口号' }]}
                >
                  <InputNumber style={{ width: '100%' }} placeholder="587" />
                </Form.Item>
              </Col>
            </Row>

            <div className={styles.switchField}>
              <div className={styles.switchMeta}>
                <span className={styles.switchLabel}>使用安全连接（SSL/TLS）</span>
                <span className={styles.switchDescription}>
                  {secureEnabled
                    ? '当前优先使用加密连接，适合 465 等 SSL/TLS 端口。'
                    : '当前使用普通连接或 STARTTLS，常见于 587 端口。'}
                </span>
              </div>
              <Form.Item name="smtpSecure" valuePropName="checked" noStyle>
                <Switch checkedChildren="开启" unCheckedChildren="关闭" />
              </Form.Item>
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <Title level={5} className={styles.sectionTitle}>
                认证信息
              </Title>
              <Paragraph className={styles.sectionDescription}>
                用于 SMTP 登录认证。企业邮箱和 QQ 邮箱通常需要填写授权码，而不是登录密码。
              </Paragraph>
            </div>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="username"
                  label="邮箱账号"
                  rules={[{ required: true, message: '请输入邮箱账号' }]}
                >
                  <Input placeholder="例如：noreply@example.com" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="password"
                  label="邮箱密码/授权码"
                  rules={
                    hasStoredPassword
                      ? []
                      : [{ required: true, message: '请输入邮箱密码' }]
                  }
                  extra={
                    hasStoredPassword
                      ? '已保存授权码；留空保存时会沿用旧授权码。'
                      : '首次配置需要填写 SMTP 密码或授权码。'
                  }
                >
                  <Input.Password placeholder="请输入密码或授权码" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="fromName"
                  label="发件人名称"
                  rules={[{ required: true, message: '请输入发件人名称' }]}
                >
                  <Input placeholder="例如：企业官网" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24}>
                <Form.Item
                  name="fromEmail"
                  label="发件人邮箱"
                  rules={[{ required: true, message: '请输入发件人邮箱' }]}
                >
                  <Input placeholder="默认可与邮箱账号保持一致" />
                </Form.Item>
              </Col>
            </Row>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <Title level={5} className={styles.sectionTitle}>
                通知场景
              </Title>
              <Paragraph className={styles.sectionDescription}>
                控制系统在客户留言和密码找回等关键流程中，是否自动触发邮件通知。
              </Paragraph>
            </div>

            <div className={styles.switchField}>
              <div className={styles.switchMeta}>
                <span className={styles.switchLabel}>接收新留言通知</span>
                <span className={styles.switchDescription}>
                  开启后，官网提交客户留言时会自动发送邮件提醒。
                </span>
              </div>
              <Form.Item name="notifyOnContact" valuePropName="checked" noStyle>
                <Switch checkedChildren="开启" unCheckedChildren="关闭" />
              </Form.Item>
            </div>

            <div className={styles.switchField}>
              <div className={styles.switchMeta}>
                <span className={styles.switchLabel}>找回密码通知</span>
                <span className={styles.switchDescription}>
                  开启后，系统重置密码或找回密码时会自动发送安全通知或重置链接。
                </span>
              </div>
              <Form.Item
                name="notifyOnPasswordReset"
                valuePropName="checked"
                noStyle
              >
                <Switch checkedChildren="开启" unCheckedChildren="关闭" />
              </Form.Item>
            </div>
          </section>
        </div>
      </Form>
    </Card>
  );
}
