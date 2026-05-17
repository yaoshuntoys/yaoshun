import { Form, Input, Modal } from 'antd';

import type { CreateMessagePayload } from '@/api/message';

interface Props {
  open: boolean;
  submitting: boolean;
  onCancel: () => void;
  onFinish: (values: CreateMessagePayload) => void | Promise<void>;
}

const initialValues: CreateMessagePayload = {
  name: '测试用户',
  email: 'test@example.com',
  phone: '13800138000',
  subject: '后台测试留言',
  message: '这是一条从 admin 后台提交的测试留言，用于验证 message/create 接口是否正常。',
};

export default function MessageFormModal({ open, submitting, onCancel, onFinish }: Props) {
  const [form] = Form.useForm<CreateMessagePayload>();

  const handleCancel = () => {
    if (submitting) return;
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="新增客户留言"
      open={open}
      confirmLoading={submitting}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      destroyOnHidden
      afterOpenChange={(visible) => {
        if (!visible) {
          form.resetFields();
        }
      }}
    >
      <Form<CreateMessagePayload>
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={initialValues}
      >
        <Form.Item
          name="name"
          label="姓名"
          rules={[{ required: true, message: '请输入姓名' }]}
        >
          <Input placeholder="请输入姓名" maxLength={50} />
        </Form.Item>
        <Form.Item
          name="email"
          label="邮箱"
          rules={[
            { required: true, message: '请输入邮箱' },
            { type: 'email', message: '请输入有效的邮箱地址' },
          ]}
        >
          <Input placeholder="请输入邮箱" maxLength={100} />
        </Form.Item>
        <Form.Item name="phone" label="电话">
          <Input placeholder="请输入电话" maxLength={30} />
        </Form.Item>
        <Form.Item name="subject" label="主题">
          <Input placeholder="请输入主题" maxLength={100} />
        </Form.Item>
        <Form.Item
          name="message"
          label="留言内容"
          rules={[{ required: true, message: '请输入留言内容' }]}
        >
          <Input.TextArea placeholder="请输入留言内容" rows={5} maxLength={1000} showCount />
        </Form.Item>
      </Form>
    </Modal>
  );
}
