import type { FormInstance } from 'antd';
import { Form, Input, Modal } from 'antd';

type FolderFormValues = {
  name: string;
};

interface Props {
  open: boolean;
  form: FormInstance<FolderFormValues>;
  onFinish: (values: FolderFormValues) => void;
  onClose: () => void;
}

export default function CreateFolderModal({ open, form, onFinish, onClose }: Props) {
  return (
    <Modal title="新建文件夹" open={open} onCancel={onClose} onOk={() => form.submit()}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="name" label="文件夹名称" rules={[{ required: true, message: '请输入文件夹名称' }]}>
          <Input placeholder="请输入文件夹名称" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
