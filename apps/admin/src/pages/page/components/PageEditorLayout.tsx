import {
  RocketOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Descriptions,
  Drawer,
  Form,
  Input,
  List,
  Modal,
  Row,
  Space,
  Tag,
  Typography,
  message,
} from 'antd';
import { useCallback, useEffect, useState } from 'react';

import {
  getPageDraftDetail,
  getPageRevisions,
  publishPageDraft,
  rollbackPageRevision,
  savePageDraft,
  translateContent,
} from '@/api';
import EditorActionBar from '@/components/EditorActionBar';
import PageContainer from '@/components/PageContainer';
import PageConfigForm from '@/pages/page/components/PageConfigForm';
import {
  buildPageEditorContent,
  toChinesePageValue,
} from '@/pages/page/components/pageSchema';
import type {
  PageContentMap,
  PageDraftRecord,
  PageKey,
  PageRevisionRecord,
} from '@/types';

const { Title, Text } = Typography;

interface Props {
  pageKey: PageKey;
  title: string;
  description: string;
}

const statusMeta: Record<PageDraftRecord['status'], { color: string; label: string }> = {
  unconfigured: { color: 'default', label: '未配置' },
  draft: { color: 'gold', label: '有草稿' },
  published: { color: 'green', label: '已发布' },
  published_with_draft: { color: 'blue', label: '已发布但有新草稿' },
};

function stringify(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function stripDerivedEditorValues(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => stripDerivedEditorValues(item));
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([key]) => key !== 'brand')
        .map(([key, entry]) => [
          key,
          stripDerivedEditorValues(entry),
        ]),
    );
  }

  return value;
}

export default function PageEditorLayout({
  pageKey,
  title,
  description,
}: Props) {
  const [form] = Form.useForm<PageContentMap[PageKey]>();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [config, setConfig] = useState<PageDraftRecord | null>(null);
  const [revisions, setRevisions] = useState<PageRevisionRecord[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewZh, setPreviewZh] = useState<Record<string, unknown>>({});
  const [previewEn, setPreviewEn] = useState<Record<string, unknown>>({});

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getPageDraftDetail(pageKey);
      setConfig(result);
      form.resetFields();
      form.setFieldsValue(
        buildPageEditorContent(pageKey, result.draft.zh) as PageContentMap[PageKey],
      );
    } finally {
      setLoading(false);
    }
  }, [form, pageKey]);

  const fetchRevisions = useCallback(async () => {
    const result = await getPageRevisions(pageKey);
    setRevisions(result);
  }, [pageKey]);

  useEffect(() => {
    void fetchConfig();
    void fetchRevisions();
  }, [fetchConfig, fetchRevisions]);

  const handleSave = async () => {
    const values = stripDerivedEditorValues(
      form.getFieldsValue(true),
    ) as Record<string, unknown>;
    setSaving(true);
    try {
      const translated = await translateContent(values);
      const en =
        translated.translated && typeof translated.translated === 'object' && !Array.isArray(translated.translated)
          ? (translated.translated as Record<string, unknown>)
          : values;
      setPreviewZh(values);
      setPreviewEn(en);
      setPreviewOpen(true);
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmSave = async () => {
    setSaving(true);
    try {
      const result = await savePageDraft(pageKey, {
        zh: previewZh,
        en: previewEn,
      });
      setConfig(result);
      setPreviewOpen(false);
      await fetchRevisions();
      message.success('中英文草稿已保存');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      const result = await publishPageDraft(pageKey);
      setConfig(result);
      await fetchRevisions();
      message.success('页面已发布');
    } finally {
      setPublishing(false);
    }
  };

  const handleRollback = async (revisionId: string | number) => {
    const result = await rollbackPageRevision(pageKey, revisionId);
    setConfig(result);
    form.resetFields();
    form.setFieldsValue(
      buildPageEditorContent(pageKey, result.draft.zh) as PageContentMap[PageKey],
    );
    await fetchRevisions();
    message.success('已恢复为草稿，请确认后发布');
  };

  const status = config ? statusMeta[config.status] : statusMeta.unconfigured;

  return (
    <PageContainer
      title={(
        <Space align="center">
          <Title level={4} className="admin-section-title">
            {title}
          </Title>
          <Tag color={status.color}>{status.label}</Tag>
        </Space>
      )}
      description={description}
      extra={(
        <EditorActionBar
          onRefresh={() => void fetchConfig()}
          refreshLoading={loading}
          onHistory={() => setHistoryOpen(true)}
          onSave={() => void handleSave()}
          saveLoading={saving}
          saveText="保存草稿"
          saveType="default"
          extra={(
          <Button
            type="primary"
            icon={<RocketOutlined />}
            loading={publishing}
            onClick={() => void handlePublish()}
          >
            发布
          </Button>
          )}
        />
      )}
    >
      <Card loading={loading}>
        <Descriptions size="small" column={3} className="mb-4">
          <Descriptions.Item label="最后保存">
            {config?.lastSavedAt ?? '-'}
          </Descriptions.Item>
          <Descriptions.Item label="最后发布">
            {config?.lastPublishedAt ?? '-'}
          </Descriptions.Item>
          <Descriptions.Item label="最后操作人">
            {config?.lastOperatorName ?? '-'}
          </Descriptions.Item>
        </Descriptions>

        <Form form={form} layout="vertical" preserve>
          <PageConfigForm
            content={toChinesePageValue(config?.draft.zh) as Record<string, unknown>}
            pageKey={pageKey}
          />
        </Form>
      </Card>

      <Modal
        title="中英文草稿预览"
        open={previewOpen}
        width={980}
        okText="确认保存草稿"
        cancelText="继续编辑"
        confirmLoading={saving}
        onOk={() => void handleConfirmSave()}
        onCancel={() => setPreviewOpen(false)}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Text strong>中文</Text>
            <Input.TextArea rows={22} value={stringify(previewZh)} readOnly />
          </Col>
          <Col span={12}>
            <Text strong>英文翻译</Text>
            <Input.TextArea rows={22} value={stringify(previewEn)} readOnly />
          </Col>
        </Row>
      </Modal>

      <Drawer
        title="历史版本"
        open={historyOpen}
        width={520}
        onClose={() => setHistoryOpen(false)}
      >
        <List
          dataSource={revisions}
          locale={{ emptyText: '暂无历史版本' }}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button
                  key="rollback"
                  type="link"
                  onClick={() => void handleRollback(item.id)}
                >
                  恢复为草稿
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={`#${item.version} ${item.summary}`}
                description={`${item.createdAt} · ${item.operatorName ?? 'unknown'} · ${item.action}`}
              />
            </List.Item>
          )}
        />
      </Drawer>
    </PageContainer>
  );
}
