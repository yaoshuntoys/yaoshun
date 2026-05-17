import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Divider, Form, Input, Space } from 'antd';

import LocalizedFields from '@/pages/page/components/LocalizedFields';

export default function CulturePageForm() {
  return (
    <>
      <Divider orientation={'left' as never}>愿景与使命</Divider>
      <Form.Item
        label="愿景图标"
        name={['vision', 'icon']}
        rules={[{ required: true, message: '请输入愿景图标' }]}
      >
        <Input placeholder="例如：🎯" />
      </Form.Item>
      <LocalizedFields
        label="愿景标题"
        name={['vision', 'titleZh']}
      />
      <LocalizedFields
        label="愿景描述"
        name={['vision', 'descriptionZh']}
        textarea
      />

      <Divider orientation={'left' as never}>企业文化</Divider>
      <Form.Item
        label="文化图标"
        name={['culture', 'icon']}
        rules={[{ required: true, message: '请输入文化图标' }]}
      >
        <Input placeholder="例如：💡" />
      </Form.Item>
      <LocalizedFields
        label="文化标题"
        name={['culture', 'titleZh']}
      />
      <LocalizedFields
        label="文化描述"
        name={['culture', 'descriptionZh']}
        textarea
      />
      <LocalizedFields
        label="理念金句"
        name={['culture', 'philosophyZh']}
        textarea
      />

      <Divider orientation={'left' as never}>核心价值观</Divider>
      <LocalizedFields
        label="价值观标题"
        name={['values', 'titleZh']}
      />
      <Form.List name={['values', 'items']}>
        {(fields, { add, remove }) => (
          <Space direction="vertical" size={16} className="w-full">
            {fields.map((field, index) => (
              <Card
                key={field.key}
                size="small"
                title={`价值项 ${index + 1}`}
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
                  label="Value Key"
                  name={[field.name, 'key']}
                  rules={[{ required: true, message: '请输入 Value Key' }]}
                >
                  <Input placeholder="例如：quality" />
                </Form.Item>
                <Form.Item
                  label="图标"
                  name={[field.name, 'icon']}
                  rules={[{ required: true, message: '请输入图标' }]}
                >
                  <Input placeholder="例如：⬡" />
                </Form.Item>
                <LocalizedFields
                  label="价值标题"
                  name={[field.name, 'titleZh']}
                />
                <LocalizedFields
                  label="价值描述"
                  name={[field.name, 'descriptionZh']}
                  textarea
                />
              </Card>
            ))}

            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={() =>
                add({
                  key: '',
                  icon: '',
                  titleZh: '',
                  descriptionZh: '',
                })
              }
            >
              新增价值项
            </Button>
          </Space>
        )}
      </Form.List>
    </>
  );
}
