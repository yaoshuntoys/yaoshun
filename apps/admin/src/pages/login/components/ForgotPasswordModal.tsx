import { Form, Input, Modal } from 'antd';

interface ForgotPasswordValues {
  email: string;
}

interface Props {
  open: boolean;
  loading: boolean;
  onCancel: () => void;
  onSubmit: (values: ForgotPasswordValues) => void;
}

export default function ForgotPasswordModal({
  open,
  loading,
  onCancel,
  onSubmit,
}: Props) {
  const [form] = Form.useForm<ForgotPasswordValues>();

  return (
    <Modal
      title="找回密码"
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText="发送新密码"
      cancelText="取消"
      confirmLoading={loading}
      destroyOnHidden
      afterOpenChange={(visible) => {
        if (!visible) {
          form.resetFields();
        }
      }}
    >
      <Form<ForgotPasswordValues>
        form={form}
        layout="vertical"
        autoComplete="off"
        onFinish={onSubmit}
      >
        <Form.Item
          name="email"
          label="邮箱"
          rules={[
            { required: true, message: '请输入邮箱' },
            { type: 'email', message: '请输入有效的邮箱地址' },
          ]}
        >
          <Input placeholder="请输入账号绑定邮箱" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
