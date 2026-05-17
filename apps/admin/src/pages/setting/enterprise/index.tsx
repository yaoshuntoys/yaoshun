import {
  Button,
  Card,
  Col,
  Drawer,
  Form,
  Input,
  List,
  Modal,
  Row,
  Space,
  Typography,
  message,
} from 'antd';
import { useCallback, useEffect, useState } from 'react';

import { translateContent } from '@/api';
import {
  getEnterpriseConfig,
  getEnterpriseRevisions,
  rollbackEnterpriseConfig,
  saveEnterpriseConfig,
} from '@/api/setting';
import EditorActionBar from '@/components/EditorActionBar';
import PageContainer from '@/components/PageContainer';
import type { EnterpriseConfig } from '@/types';

const { Text } = Typography;

type EnterpriseRevision = {
  id: number;
  version: number;
  action: string;
  operatorName?: string | null;
  summary?: string | null;
  createdAt: string;
};

const defaultEnterpriseConfig: EnterpriseConfig = {
  companyName: '东莞市尧顺科技有限公司',
  companyNameEn: 'Dongguan Yaoshun Technology Co., Ltd.',
  brandName: '尧顺玩具',
  brandNameEn: 'Yaoshun Toys',
  companyLogo: '/favicon-rounded-192.png',
  contactEmail: 'yaoshuntoys@gmail.com',
  contactPhone: '+86 18780083256',
  whatsapp: '+86 18780083256',
  wechat: '',
  address: '中国广东省东莞市茶山镇伟兴路3号',
  addressEn: 'No. 3, Weixing Road, Chashan Town, Dongguan, Guangdong, China',
  foundedAt: '2016-08-26',
  registeredCapital: '300 万元人民币',
  businessScope:
    '搭建玩具、定制玩具、益智玩具、拼插类塑胶玩具、定制管材型材、高精密注塑件以及玩具 OEM/ODM 定制化开发。',
  keywords:
    '东莞市尧顺科技有限公司,Yaoshun Toys,Dongguan Yaoshun Technology,玩具OEM,玩具ODM,搭建玩具,定制玩具,益智玩具,塑胶玩具,精密注塑',
  description:
    '东莞市尧顺科技有限公司成立于 2016 年，是一家集设计、开模、生产、质控与出口协同于一体的东莞源头玩具工厂，为全球客户提供搭建玩具、定制玩具与玩具 OEM/ODM 定制化开发服务。',
  website: 'https://www.yaoshuntoys.com',
  copyright: 'Copyright © Dongguan Yaoshun Technology Co., Ltd.',
  icp: '',
};

export default function EnterpriseSettingPage() {
  const [form] = Form.useForm<EnterpriseConfig>();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [pendingConfig, setPendingConfig] = useState<EnterpriseConfig | null>(null);
  const [translationPreview, setTranslationPreview] = useState<Record<string, unknown>>({});
  const [revisions, setRevisions] = useState<EnterpriseRevision[]>([]);

  const fetchRevisions = useCallback(async () => {
    const result = await getEnterpriseRevisions();
    setRevisions(result);
  }, []);

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getEnterpriseConfig();
      form.setFieldsValue(result);
      await fetchRevisions();
    } catch {
      form.setFieldsValue(defaultEnterpriseConfig);
    } finally {
      setLoading(false);
    }
  }, [fetchRevisions, form]);

  useEffect(() => {
    void fetchConfig();
  }, [fetchConfig]);

  const handleSubmit = async (values: EnterpriseConfig) => {
    setSaving(true);
    try {
      const translated = await translateContent({
        companyName: values.companyName,
        brandName: values.brandName ?? '',
        address: values.address ?? '',
      });
      const translatedObject =
        translated.translated && typeof translated.translated === 'object' && !Array.isArray(translated.translated)
          ? (translated.translated as Record<string, unknown>)
          : {};
      const nextConfig: EnterpriseConfig = {
        ...values,
        companyNameEn: String(translatedObject.companyName || values.companyName),
        brandNameEn: String(translatedObject.brandName || values.brandName || ''),
        addressEn: String(translatedObject.address || values.address || ''),
      };

      setPendingConfig(nextConfig);
      setTranslationPreview(translatedObject);
      setPreviewOpen(true);
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmSave = async () => {
    if (!pendingConfig) return;
    setSaving(true);
    try {
      const saved = await saveEnterpriseConfig(pendingConfig);
      form.setFieldsValue(saved);
      setPreviewOpen(false);
      setPendingConfig(null);
      await fetchRevisions();
      message.success('企业设置保存成功');
    } finally {
      setSaving(false);
    }
  };

  const handleRollback = async (revisionId: number) => {
    const restored = await rollbackEnterpriseConfig(revisionId);
    form.setFieldsValue(restored);
    await fetchRevisions();
    message.success('已恢复企业设置历史版本');
  };

  return (
    <PageContainer
      title="企业设置"
      description="维护企业名称、Logo、联系方式和 SEO 等基础信息。"
      extra={(
        <EditorActionBar
          onRefresh={() => void fetchConfig()}
          refreshLoading={loading}
          onHistory={() => setHistoryOpen(true)}
          onSave={() => form.submit()}
          saveLoading={saving}
          saveText="保存企业设置"
        />
      )}
    >
      <Card loading={loading}>
        <Form
          form={form}
          layout="vertical"
          initialValues={defaultEnterpriseConfig}
          onFinish={(values) => void handleSubmit(values)}
        >
          <Form.Item
            name="companyName"
            label="企业全称"
            rules={[{ required: true, message: '请输入企业名称' }]}
          >
            <Input placeholder="请输入企业全称" />
          </Form.Item>

          <Form.Item name="brandName" label="品牌名">
            <Input placeholder="请输入品牌名" />
          </Form.Item>

          <Form.Item name="companyLogo" label="企业 Logo">
            <Input placeholder="请输入 Logo 地址" />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="contactEmail" label="联系邮箱">
                <Input placeholder="请输入联系邮箱" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="contactPhone" label="联系电话">
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="whatsapp" label="WhatsApp">
                <Input placeholder="请输入 WhatsApp 联系方式" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="wechat" label="微信">
                <Input placeholder="请输入微信联系方式" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="address" label="企业地址">
            <Input placeholder="请输入企业地址" />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="foundedAt" label="成立日期">
                <Input placeholder="例如：2016-08-26" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="registeredCapital" label="注册资本">
                <Input placeholder="请输入注册资本" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="website" label="官网地址">
            <Input placeholder="请输入官网地址" />
          </Form.Item>

          <Form.Item name="businessScope" label="主营业务">
            <Input.TextArea rows={3} placeholder="请输入主营业务范围" />
          </Form.Item>

          <Form.Item name="keywords" label="SEO 关键字">
            <Input placeholder="请输入关键字，使用英文逗号分隔" />
          </Form.Item>

          <Form.Item name="description" label="企业简介 / SEO 描述">
            <Input.TextArea rows={4} placeholder="请输入企业简介或 SEO 描述" />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="copyright" label="版权信息">
                <Input placeholder="请输入版权信息" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="icp" label="备案号">
                <Input placeholder="请输入备案号" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      <Modal
        title="英文翻译预览"
        open={previewOpen}
        okText="确认保存"
        cancelText="继续编辑"
        confirmLoading={saving}
        onOk={() => void handleConfirmSave()}
        onCancel={() => setPreviewOpen(false)}
        width={720}
      >
        <Space direction="vertical" className="w-full">
          <Text strong>企业全称</Text>
          <Input value={String(translationPreview.companyName ?? '')} readOnly />
          <Text strong>品牌名</Text>
          <Input value={String(translationPreview.brandName ?? '')} readOnly />
          <Text strong>企业地址</Text>
          <Input.TextArea rows={3} value={String(translationPreview.address ?? '')} readOnly />
        </Space>
      </Modal>

      <Drawer
        title="企业设置历史版本"
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        width={560}
      >
        <List
          dataSource={revisions}
          locale={{ emptyText: '暂无历史版本' }}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button key="rollback" onClick={() => void handleRollback(item.id)}>
                  恢复
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={`版本 #${item.version} · ${item.summary || item.action}`}
                description={(
                  <Space direction="vertical" size={2}>
                    <Text type="secondary">
                      {new Date(item.createdAt).toLocaleString()}
                    </Text>
                    <Text type="secondary">
                      操作人：{item.operatorName || '-'}
                    </Text>
                  </Space>
                )}
              />
            </List.Item>
          )}
        />
      </Drawer>
    </PageContainer>
  );
}
