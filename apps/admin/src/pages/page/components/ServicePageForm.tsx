import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Divider, Form, Input, Space } from 'antd';

import LocalizedFields from '@/pages/page/components/LocalizedFields';

export default function ServicePageForm() {
  return (
    <>
      <Divider orientation={'left' as never}>模块标题</Divider>
      <LocalizedFields
        label="眉标题"
        name={['hero', 'eyebrowZh']}
      />
      <LocalizedFields
        label="主标题"
        name={['hero', 'titleZh']}
      />
      <LocalizedFields
        label="标题强调词"
        name={['hero', 'titleAccentZh']}
      />
      <LocalizedFields
        label="模块说明"
        name={['hero', 'subtitleZh']}
        textarea
      />
      <LocalizedFields
        label="底部按钮文案"
        name={['hero', 'ctaLabelZh']}
      />
      <Form.Item
        label="底部按钮链接"
        name={['hero', 'ctaHref']}
        rules={[{ required: true, message: '请输入按钮链接' }]}
      >
        <Input placeholder="/products" />
      </Form.Item>

      <Divider orientation={'left' as never}>服务项</Divider>
      <Form.List name="items">
        {(fields, { add, remove }) => (
          <Space direction="vertical" size={16} className="w-full">
            {fields.map((field, index) => (
              <Card
                key={field.key}
                size="small"
                title={`服务项 ${index + 1}`}
                extra={(
                  <Button
                    danger
                    type="text"
                    icon={<DeleteOutlined />}
                    onClick={() => remove(field.name)}
                  >
                    删除
                  </Button>
                )}
              >
                <Form.Item
                  label="服务 Key"
                  name={[field.name, 'key']}
                  rules={[{ required: true, message: '请输入服务 Key' }]}
                >
                  <Input placeholder="例如：pcba" />
                </Form.Item>
                <LocalizedFields
                  label="服务标题"
                  name={[field.name, 'titleZh']}
                />
                <LocalizedFields
                  label="服务说明"
                  name={[field.name, 'descriptionZh']}
                  textarea
                />
              </Card>
            ))}

            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={() => add({ key: '', titleZh: '', descriptionZh: '' })}
            >
              新增服务项
            </Button>
          </Space>
        )}
      </Form.List>
    </>
  );
}
