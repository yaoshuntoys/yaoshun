import { useCallback, useEffect, useState } from 'react';
import { Button, Form, Space, message } from 'antd';
import { SaveOutlined, SendOutlined } from '@ant-design/icons';
import { getMailConfig, saveMailConfig, testMailConfig } from '@/api/mail';
import PageContainer from '@/components/PageContainer';
import { defaultMailConfig } from '@/pages/setting/mail/constants';
import MailConfigForm from '@/pages/setting/mail/components/MailConfigForm';
import MailConfigSummary from '@/pages/setting/mail/components/MailConfigSummary';
import MailConfigTips from '@/pages/setting/mail/components/MailConfigTips';
import type { MailConfig } from '@/types';
import styles from '@/pages/setting/mail/index.module.css';

export default function MailConfig() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [form] = Form.useForm<MailConfig>();
  const formValues = Form.useWatch([], form) as Partial<MailConfig> | undefined;

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    try {
      const config = await getMailConfig();
      form.setFieldsValue(config);
    } catch {
      form.setFieldsValue(defaultMailConfig);
    } finally {
      setLoading(false);
    }
  }, [form]);

  useEffect(() => {
    void fetchConfig();
  }, [fetchConfig]);

  const handleSave = async (values: MailConfig) => {
    setSaving(true);
    try {
      const { hasPassword, ...payload } = values;
      void hasPassword;
      const savedConfig = await saveMailConfig({
        ...payload,
        fromEmail: payload.fromEmail?.trim() || payload.username,
      });
      form.setFieldsValue(savedConfig);
      message.success('邮件配置保存成功');
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    try {
      const values = await form.validateFields();
      const { hasPassword, ...payload } = values;
      void hasPassword;
      const result = await testMailConfig({
        ...payload,
        fromEmail: payload.fromEmail?.trim() || payload.username,
      });
      if (result.status === 'sent') {
        message.success(result.message || '测试邮件发送成功');
      } else {
        message.error(result.message || result.errorMessage || '测试邮件发送失败');
      }
    } finally {
      setTesting(false);
    }
  };

  const handleApplyPreset = (
    preset: Pick<MailConfig, 'smtpHost' | 'smtpPort' | 'smtpSecure'>,
  ) => {
    form.setFieldsValue(preset);
    message.success('已套用 SMTP 预设，请补充账号和授权码后保存');
  };

  return (
    <PageContainer
      title="邮件设置"
      description="配置 SMTP 服务器、发件人信息以及留言通知和密码重置邮件。"
      extra={(
        <Space size={12}>
          <Button
            icon={<SendOutlined />}
            onClick={() => void handleTest()}
            loading={testing}
          >
            发送测试邮件
          </Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={() => form.submit()}
            loading={saving}
          >
            保存配置
          </Button>
        </Space>
      )}
    >
      <div className={styles.stack}>
        <MailConfigSummary config={formValues ?? defaultMailConfig} />

        <div className={styles.layout}>
          <div className={styles.mainColumn}>
            <MailConfigForm
              form={form}
              initialValues={defaultMailConfig}
              loading={loading}
              onSubmit={handleSave}
            />
          </div>

          <aside className={styles.sideColumn}>
            <MailConfigTips onApplyPreset={handleApplyPreset} />
          </aside>
        </div>
      </div>
    </PageContainer>
  );
}
