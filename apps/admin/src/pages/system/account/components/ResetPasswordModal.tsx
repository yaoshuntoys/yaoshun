import { Modal, Form, Input } from 'antd';
import { SafetyOutlined, LockOutlined } from '@ant-design/icons';
import type { User } from '@/types';

interface Props {
  open: boolean;
  account: User | null;
  onCancel: () => void;
  onFinish: (values: { password: string }) => void;
}

export default function ResetPasswordModal({ open, account, onCancel, onFinish }: Props) {
  const [form] = Form.useForm();

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={`重置密码 - ${account?.nickname || account?.name || account?.username}`}
      open={open}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      afterOpenChange={(v) => { if (!v) form.resetFields(); }}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="password"
          label="新密码"
          rules={[
            { required: true, message: '请输入新密码' },
            { min: 6, message: '密码长度至少6位' },
          ]}
        >
          <Input.Password placeholder="请输入新密码" prefix={<SafetyOutlined />} />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label="确认密码"
          dependencies={['password']}
          rules={[
            { required: true, message: '请确认密码' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次输入的密码不一致'));
              },
            }),
          ]}
        >
          <Input.Password placeholder="请确认密码" prefix={<LockOutlined />} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
