import { Form, Input, Typography } from 'antd';

const { Title } = Typography;

interface SeoModuleProps {
  prefix?: string[];
}

export default function SeoModule({ prefix = ['seo'] }: SeoModuleProps) {
  const name = (field: string) => [...prefix, field];

  return (
    <div className="mb-6 rounded-lg border border-slate-200 p-5">
      <Title level={5} className="mb-4">SEO 设置</Title>

      <Form.Item
        name={name('title')}
        label="页面标题"
        rules={[{ required: false }]}
      >
        <Input placeholder="请输入页面标题" />
      </Form.Item>

      <Form.Item
        name={name('description')}
        label="页面描述"
        rules={[{ required: false }]}
      >
        <Input.TextArea rows={3} placeholder="请输入页面描述" />
      </Form.Item>

      <Form.Item
        name={name('keywords')}
        label="关键词"
        rules={[{ required: false }]}
      >
        <Input.TextArea rows={2} placeholder="请输入关键词，使用英文逗号分隔" />
      </Form.Item>

      <Form.Item
        name={name('canonical')}
        label="Canonical URL"
        rules={[{ required: false }]}
      >
        <Input placeholder="请输入规范 URL" />
      </Form.Item>

      <Form.Item
        name={name('ogImage')}
        label="OG 图片"
        rules={[{ required: false }]}
      >
        <Input placeholder="请输入 OG 图片 URL" />
      </Form.Item>
    </div>
  );
}
