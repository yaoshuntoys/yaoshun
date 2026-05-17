import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Divider, Form, Input, Space } from 'antd';

import LocalizedFields from '@/pages/page/components/LocalizedFields';

export default function AboutPageForm() {
  return (
    <>
      <Divider orientation={'left' as never}>首屏信息</Divider>
      <LocalizedFields
        label="页面标题"
        name={['hero', 'titleZh']}
      />
      <LocalizedFields
        label="标题强调词"
        name={['hero', 'titleAccentZh']}
      />
      <LocalizedFields
        label="副标题"
        name={['hero', 'subtitleZh']}
        textarea
      />
      <LocalizedFields
        label="成立文案"
        name={['hero', 'badgeZh']}
      />

      <Divider orientation={'left' as never}>公司简介</Divider>
      <LocalizedFields
        label="简介标题"
        name={['introduction', 'titleZh']}
      />
      <LocalizedFields
        label="简介主文案"
        name={['introduction', 'descriptionPrimaryZh']}
        textarea
      />
      <LocalizedFields
        label="简介补充文案"
        name={['introduction', 'descriptionSecondaryZh']}
        textarea
      />

      <Divider orientation={'left' as never}>发展历程</Divider>
      <LocalizedFields
        label="历程眉标题"
        name={['timeline', 'eyebrowZh']}
      />
      <LocalizedFields
        label="历程主标题"
        name={['timeline', 'titleZh']}
      />
      <Form.List name={['timeline', 'items']}>
        {(fields, { add, remove }) => (
          <Space direction="vertical" size={16} className="w-full">
            {fields.map((field, index) => (
              <Card
                key={field.key}
                size="small"
                title={`里程碑 ${index + 1}`}
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
                  label="年份"
                  name={[field.name, 'year']}
                  rules={[{ required: true, message: '请输入年份' }]}
                >
                  <Input placeholder="例如：2006" />
                </Form.Item>
                <LocalizedFields
                  label="里程碑文案"
                  name={[field.name, 'descriptionZh']}
                  textarea
                />
              </Card>
            ))}

            <Button type="dashed" icon={<PlusOutlined />} onClick={() => add()}>
              新增里程碑
            </Button>
          </Space>
        )}
      </Form.List>

      <Divider orientation={'left' as never}>资质荣誉</Divider>
      <LocalizedFields
        label="资质标题"
        name={['certifications', 'titleZh']}
      />
      <Form.List name={['certifications', 'items']}>
        {(fields, { add, remove }) => (
          <Space direction="vertical" size={16} className="w-full">
            {fields.map((field, index) => (
              <Card
                key={field.key}
                size="small"
                title={`资质项 ${index + 1}`}
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
                  label="图标"
                  name={[field.name, 'icon']}
                  rules={[{ required: true, message: '请输入图标' }]}
                >
                  <Input placeholder="例如：🏆" />
                </Form.Item>
                <LocalizedFields
                  label="资质名称"
                  name={[field.name, 'labelZh']}
                />
              </Card>
            ))}

            <Button type="dashed" icon={<PlusOutlined />} onClick={() => add()}>
              新增资质项
            </Button>
          </Space>
        )}
      </Form.List>

      <Divider orientation={'left' as never}>底部引导</Divider>
      <LocalizedFields
        label="引导标题"
        name={['cta', 'titleZh']}
      />
      <LocalizedFields
        label="按钮文案"
        name={['cta', 'buttonLabelZh']}
      />
    </>
  );
}
