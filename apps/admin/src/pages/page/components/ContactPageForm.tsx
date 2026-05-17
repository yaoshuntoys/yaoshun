import { Divider, Form, Input } from 'antd';

import LocalizedFields from '@/pages/page/components/LocalizedFields';

export default function ContactPageForm() {
  return (
    <>
      <Divider orientation={'left' as never}>首屏信息</Divider>
      <LocalizedFields
        label="页面标题"
        name={['hero', 'titleZh']}
      />
      <LocalizedFields
        label="副标题"
        name={['hero', 'subtitleZh']}
        textarea
      />

      <Divider orientation={'left' as never}>联系信息</Divider>
      <Form.Item
        label="联系电话"
        name={['info', 'phone']}
        rules={[{ required: true, message: '请输入联系电话' }]}
      >
        <Input placeholder="例如：+86 0755-86027418" />
      </Form.Item>
      <Form.Item
        label="联系邮箱"
        name={['info', 'email']}
        rules={[{ required: true, message: '请输入联系邮箱' }]}
      >
        <Input placeholder="例如：service@example.com" />
      </Form.Item>
      <Form.Item
        label="微信号"
        name={['info', 'wechat']}
        rules={[{ required: true, message: '请输入微信号' }]}
      >
        <Input placeholder="例如：YaoshunToys" />
      </Form.Item>
      <LocalizedFields
        label="联系地址"
        name={['info', 'addressZh']}
        textarea
      />
      <LocalizedFields
        label="服务时间"
        name={['info', 'hoursZh']}
      />
      <Form.Item
        label="地图链接"
        name={['info', 'mapUrl']}
        rules={[{ required: true, message: '请输入地图链接' }]}
      >
        <Input placeholder="https://maps.google.com/..." />
      </Form.Item>

      <Divider orientation={'left' as never}>表单文案</Divider>
      <LocalizedFields
        label="表单标题"
        name={['form', 'titleZh']}
      />
      <LocalizedFields
        label="姓名占位文案"
        name={['form', 'namePlaceholderZh']}
      />
      <LocalizedFields
        label="邮箱占位文案"
        name={['form', 'emailPlaceholderZh']}
      />
      <LocalizedFields
        label="留言占位文案"
        name={['form', 'messagePlaceholderZh']}
        textarea
      />
      <LocalizedFields
        label="提交按钮文案"
        name={['form', 'submitTextZh']}
      />
      <LocalizedFields
        label="提交中提示"
        name={['form', 'submittingTextZh']}
      />
      <LocalizedFields
        label="成功提示"
        name={['form', 'successTextZh']}
        textarea
      />
      <LocalizedFields
        label="失败提示"
        name={['form', 'errorTextZh']}
      />
    </>
  );
}
