import { useEffect } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import type { Role, User } from '@/types';

interface AccountFormValues extends Partial<User> {
  password?: string;
}

interface Props {
  open: boolean;
  editingUser: User | null;
  roles: Role[];
  onCancel: () => void;
  onFinish: (values: Partial<User> & { password?: string }) => void;
}

export default function AccountFormModal({
  open,
  editingUser,
  roles,
  onCancel,
  onFinish,
}: Props) {
  const [form] = Form.useForm<AccountFormValues>();

  useEffect(() => {
    if (!open) {
      return;
    }

    if (editingUser) {
      form.setFieldsValue({
        username: editingUser.username,
        nickname: editingUser.nickname,
        email: editingUser.email,
        role: editingUser.role,
      });
      return;
    }

    form.resetFields();
    form.setFieldsValue({
      username: undefined,
      nickname: undefined,
      email: undefined,
      password: undefined,
      role: undefined,
    });
  }, [editingUser, form, open]);

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={editingUser ? '编辑账号' : '添加账号'}
      open={open}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      destroyOnHidden
      afterOpenChange={(visible) => {
        if (!visible) {
          form.resetFields();
        }
      }}
    >
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        onFinish={(values) => onFinish(values)}
      >
        <Form.Item name="username" label="用户名" rules={[{ required: true, message: '请输入用户名' }]}>
          <Input placeholder="请输入用户名" disabled={!!editingUser} autoComplete="off" />
        </Form.Item>
        <Form.Item name="nickname" label="昵称" rules={[{ required: true, message: '请输入昵称' }]}>
          <Input placeholder="请输入昵称" autoComplete="off" />
        </Form.Item>
        <Form.Item
          name="email"
          label="邮箱"
          rules={[
            { required: true, message: '请输入邮箱' },
            { type: 'email', message: '请输入有效的邮箱地址' },
          ]}
        >
          <Input placeholder="请输入邮箱" autoComplete="off" />
        </Form.Item>
        {!editingUser && (
          <Form.Item
            name="password"
            label="初始密码"
            rules={[
              { required: true, message: '请输入初始密码' },
              { min: 6, message: '密码长度至少6位' },
            ]}
          >
            <Input.Password placeholder="请输入初始密码" autoComplete="new-password" />
          </Form.Item>
        )}
        <Form.Item name="role" label="角色" rules={[{ required: true, message: '请选择角色' }]}>
          <Select
            placeholder="选择角色"
            options={roles.map((role) => ({
              label: role.name,
              value: role.code,
            }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
