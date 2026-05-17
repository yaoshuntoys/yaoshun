import { useEffect } from 'react';
import { Form, Input, Modal } from 'antd';

import type { User } from '@/types';

interface ProfileFormValues {
  username?: string;
  name?: string;
  nickname?: string;
  email?: string;
}

interface Props {
  open: boolean;
  loading: boolean;
  user: User | null;
  onCancel: () => void;
  onSubmit: (values: { name?: string; nickname?: string; email?: string }) => void;
}

export default function ProfileSettingsModal({
  open,
  loading,
  user,
  onCancel,
  onSubmit,
}: Props) {
  const [form] = Form.useForm<ProfileFormValues>();

  useEffect(() => {
    if (!open) {
      form.resetFields();
      return;
    }

    form.setFieldsValue({
      username: user?.username,
      name: user?.name,
      nickname: user?.nickname,
      email: user?.email,
    });
  }, [form, open, user]);

  return (
    <Modal
      title="个人设置"
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText="保存"
      cancelText="取消"
      confirmLoading={loading}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => onSubmit(values)}
      >
        <Form.Item label="用户名" name="username">
          <Input disabled />
        </Form.Item>
        <Form.Item label="姓名" name="name">
          <Input placeholder="请输入姓名" />
        </Form.Item>
        <Form.Item label="昵称" name="nickname">
          <Input placeholder="请输入昵称" />
        </Form.Item>
        <Form.Item
          label="邮箱"
          name="email"
          rules={[
            { required: true, message: '请输入邮箱' },
            { type: 'email', message: '请输入有效的邮箱地址' },
          ]}
        >
          <Input placeholder="请输入邮箱" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
