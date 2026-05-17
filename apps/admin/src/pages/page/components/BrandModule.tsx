import { Form, Input, Typography } from 'antd';

const { Title } = Typography;

interface BrandModuleProps {
  prefix?: string[];
}

export default function BrandModule({ prefix = ['brand'] }: BrandModuleProps) {
  const name = (field: string) => [...prefix, field];

  return (
    <div className="mb-6 rounded-lg border border-slate-200 p-5">
      <Title level={5} className="mb-4">品牌信息</Title>

      <Form.Item
        name={name('nameZh')}
        label="中文品牌名"
        rules={[{ required: false }]}
      >
        <Input placeholder="请输入中文品牌名" />
      </Form.Item>

      <Form.Item
        name={name('nameEn')}
        label="英文品牌名"
        rules={[{ required: false }]}
      >
        <Input placeholder="请输入英文品牌名" />
      </Form.Item>

      <Form.Item
        name={name('legalNameZh')}
        label="中文公司全称"
        rules={[{ required: false }]}
      >
        <Input placeholder="请输入中文公司全称" />
      </Form.Item>

      <Form.Item
        name={name('legalNameEn')}
        label="英文公司全称"
        rules={[{ required: false }]}
      >
        <Input placeholder="请输入英文公司全称" />
      </Form.Item>

      <Form.Item
        name={name('logo')}
        label="Logo URL"
        rules={[{ required: false }]}
      >
        <Input placeholder="请输入 Logo URL" />
      </Form.Item>

      <Form.Item
        name={name('email')}
        label="联系邮箱"
        rules={[{ required: false }]}
      >
        <Input placeholder="请输入联系邮箱" />
      </Form.Item>

      <Form.Item
        name={name('phone')}
        label="联系电话"
        rules={[{ required: false }]}
      >
        <Input placeholder="请输入联系电话" />
      </Form.Item>

      <Form.Item
        name={name('website')}
        label="官网地址"
        rules={[{ required: false }]}
      >
        <Input placeholder="请输入官网地址" />
      </Form.Item>

      <Form.Item
        name={name('addressZh')}
        label="中文地址"
        rules={[{ required: false }]}
      >
        <Input.TextArea rows={2} placeholder="请输入中文地址" />
      </Form.Item>

      <Form.Item
        name={name('addressEn')}
        label="英文地址"
        rules={[{ required: false }]}
      >
        <Input.TextArea rows={2} placeholder="请输入英文地址" />
      </Form.Item>
    </div>
  );
}
