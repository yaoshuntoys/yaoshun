import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Descriptions,
  Drawer,
  Form,
  Image,
  Input,
  InputNumber,
  List,
  Modal,
  Row,
  Select,
  Space,
  Typography,
  message,
} from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { translateContent } from '@/api';
import {
  createPartner,
  getPartnerDetail,
  getPartnerRevisions,
  rollbackPartnerRevision,
  updatePartner,
} from '@/api/partner';
import ContentEditorLayout from '@/components/ContentEditorLayout';
import EditorActionBar from '@/components/EditorActionBar';
import MediaSelector from '@/components/MediaSelector';
import PageContainer from '@/components/PageContainer';
import type { Partner } from '@/types';

const { Text } = Typography;

const partnerModules = [
  { key: 'basic', label: '基础信息' },
  { key: 'media-link', label: 'Logo 与链接' },
  { key: 'display', label: '展示设置' },
];

interface PartnerEditValues {
  nameZh: string;
  logo?: string;
  website?: string;
  status: Partner['status'];
  sortOrder?: number;
}

type RevisionRecord = {
  id: number;
  version: number;
  action: string;
  operatorName?: string | null;
  summary?: string | null;
  createdAt: string;
};

export default function PartnerEditPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const [form] = Form.useForm<PartnerEditValues>();
  const logoValue = Form.useWatch('logo', form);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [mediaOpen, setMediaOpen] = useState(false);
  const [revisions, setRevisions] = useState<RevisionRecord[]>([]);
  const [pendingPayload, setPendingPayload] = useState<Record<string, unknown> | null>(null);
  const [translationPreview, setTranslationPreview] = useState<Record<string, unknown>>({});

  const fetchRevisions = useCallback(async () => {
    if (!isEdit || !id) return;
    const result = await getPartnerRevisions(Number(id));
    setRevisions(result as RevisionRecord[]);
  }, [id, isEdit]);

  const fetchDetail = useCallback(async () => {
    if (!isEdit || !id) {
      form.setFieldsValue({
        status: 'active',
        sortOrder: 0,
      });
      return;
    }

    setLoading(true);
    try {
      const data = await getPartnerDetail(Number(id));
      form.setFieldsValue({
        nameZh: data.nameZh,
        logo: data.logo ?? undefined,
        website: data.website ?? undefined,
        status: data.status,
        sortOrder: data.sortOrder,
      });
      await fetchRevisions();
    } finally {
      setLoading(false);
    }
  }, [fetchRevisions, form, id, isEdit]);

  useEffect(() => {
    void fetchDetail();
  }, [fetchDetail]);

  const buildPayload = (values: PartnerEditValues) => ({
    nameZh: values.nameZh,
    logo: values.logo?.trim() || undefined,
    website: values.website?.trim() || undefined,
    status: values.status,
    sortOrder: values.sortOrder ?? 0,
  });

  const handleSubmit = async (values: PartnerEditValues) => {
    const payload = buildPayload(values);
    setSaving(true);
    try {
      const translated = await translateContent({
        name: values.nameZh,
      });
      const translatedObject =
        translated.translated && typeof translated.translated === 'object' && !Array.isArray(translated.translated)
          ? (translated.translated as Record<string, unknown>)
          : {};
      setPendingPayload({
        ...payload,
        nameEn: String(translatedObject.name || values.nameZh),
      });
      setTranslationPreview(translatedObject);
      setPreviewOpen(true);
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmSave = async () => {
    if (!pendingPayload) return;
    setSaving(true);
    try {
      if (isEdit && id) {
        await updatePartner(Number(id), pendingPayload);
        message.success('合作客户更新成功');
      } else {
        await createPartner(pendingPayload);
        message.success('合作客户创建成功');
      }
      navigate('/content/partner');
    } finally {
      setSaving(false);
    }
  };

  const handleRollback = async (revisionId: number) => {
    if (!id) return;
    const result = await rollbackPartnerRevision(Number(id), revisionId);
    form.setFieldsValue({
      nameZh: result.nameZh,
      logo: result.logo ?? undefined,
      website: result.website ?? undefined,
      status: result.status,
      sortOrder: result.sortOrder,
    });
    await fetchRevisions();
    message.success('已恢复历史版本');
  };

  return (
    <PageContainer
      title={isEdit ? '编辑合作客户' : '新增合作客户'}
      extra={(
        <EditorActionBar
          onRefresh={() => void fetchDetail()}
          refreshLoading={loading}
          showHistory={isEdit}
          onHistory={() => setHistoryOpen(true)}
          onSave={() => form.submit()}
          saveLoading={saving}
        />
      )}
    >
      <Card loading={loading}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <ContentEditorLayout modules={partnerModules}>
            <Card id="basic" size="small" title="基础信息">
              <Form.Item
                label="客户名称"
                name="nameZh"
                rules={[{ required: true, message: '请输入客户名称' }]}
              >
                <Input placeholder="请输入客户名称" />
              </Form.Item>
            </Card>

            <Card
              id="media-link"
              size="small"
              title="Logo 与链接"
              extra={(
                <Button icon={<PlusOutlined />} onClick={() => setMediaOpen(true)}>
                  选择 Logo
                </Button>
              )}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Logo URL" name="logo">
                    <Input placeholder="请输入 Logo 地址" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="官网地址" name="website">
                    <Input placeholder="请输入官网地址" />
                  </Form.Item>
                </Col>
              </Row>
              {logoValue ? (
                <Image
                  src={logoValue}
                  alt="partner-logo"
                  width={96}
                  height={96}
                  className="rounded-lg object-contain"
                  preview
                />
              ) : (
                <Text type="secondary">尚未配置 Logo。</Text>
              )}
            </Card>

            <Card id="display" size="small" title="展示设置">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="状态"
                    name="status"
                    rules={[{ required: true, message: '请选择状态' }]}
                  >
                    <Select
                      placeholder="请选择状态"
                      options={[
                        { label: '上架', value: 'active' },
                        { label: '下架', value: 'inactive' },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="排序" name="sortOrder">
                    <InputNumber className="w-full" placeholder="数字越小越靠前" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </ContentEditorLayout>
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
        width={640}
      >
        <Space direction="vertical" className="w-full">
          <Text strong>客户名称</Text>
          <Input value={String(translationPreview.name ?? '')} readOnly />
        </Space>
      </Modal>
      <Drawer title="合作客户历史版本" open={historyOpen} onClose={() => setHistoryOpen(false)} width={560}>
        <List
          dataSource={revisions}
          locale={{ emptyText: '暂无历史版本' }}
          renderItem={(item) => (
            <List.Item actions={[<Button key="rollback" onClick={() => void handleRollback(item.id)}>恢复</Button>]}>
              <List.Item.Meta
                title={`#${item.version} ${item.summary || item.action}`}
                description={(
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="操作人">{item.operatorName || '-'}</Descriptions.Item>
                    <Descriptions.Item label="时间">{new Date(item.createdAt).toLocaleString()}</Descriptions.Item>
                  </Descriptions>
                )}
              />
            </List.Item>
          )}
        />
      </Drawer>
      <MediaSelector
        open={mediaOpen}
        type="image"
        onClose={() => setMediaOpen(false)}
        onSelect={(url) => form.setFieldValue('logo', url)}
      />
    </PageContainer>
  );
}
