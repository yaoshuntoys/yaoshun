import { Form, Input, Typography } from 'antd';

const { Title } = Typography;

interface HeroModuleProps {
  prefix?: string[];
}

export default function HeroModule({ prefix = ['hero'] }: HeroModuleProps) {
  const name = (field: string) => [...prefix, field];

  return (
    <div className="mb-6 rounded-lg border border-slate-200 p-5">
      <Title level={5} className="mb-4">首屏配置</Title>

      <Form.Item
        name={name('eyebrow')}
        label="眉题"
        rules={[{ required: false }]}
        className="mb-3"
      >
        <Input placeholder="请输入眉题" />
      </Form.Item>

      <Form.Item
        name={name('title')}
        label="标题"
        rules={[{ required: false }]}
      >
        <Input placeholder="请输入标题" />
      </Form.Item>

      <Form.Item
        name={name('description')}
        label="描述"
        rules={[{ required: false }]}
      >
        <Input.TextArea rows={3} placeholder="请输入描述" />
      </Form.Item>

      <Form.Item
        name={name('backgroundImage')}
        label="背景图片"
        rules={[{ required: false }]}
      >
        <Input placeholder="请输入背景图片 URL" />
      </Form.Item>

      <Form.Item
        name={name('ctaText')}
        label="按钮文字"
        rules={[{ required: false }]}
      >
        <Input placeholder="请输入按钮文字" />
      </Form.Item>

      <Form.Item
        name={name('ctaLink')}
        label="按钮链接"
        rules={[{ required: false }]}
      >
        <Input placeholder="请输入按钮链接" />
      </Form.Item>
    </div>
  );
}
