import {
  Button,
  Card,
  Col,
  Descriptions,
  Drawer,
  Form,
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
import ContentEditorLayout from '@/components/ContentEditorLayout';
import EditorActionBar from '@/components/EditorActionBar';
import {
  createFaq,
  getFaqDetail,
  getFaqRevisions,
  rollbackFaqRevision,
  updateFaq,
} from '@/api/faq';
import PageContainer from '@/components/PageContainer';
import RichTextEditor from '@/components/RichTextEditor';
import type { FaqItem } from '@/types';

const { Text } = Typography;

const faqModules = [
  { key: 'basic', label: '基础信息' },
  { key: 'question-answer', label: '问答内容' },
  { key: 'display', label: '展示设置' },
];

interface FaqEditValues {
  categoryKey: string;
  categoryLabelZh: string;
  questionZh: string;
  answerZh: string;
  status: FaqItem['status'];
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

export default function FaqEditPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [revisions, setRevisions] = useState<RevisionRecord[]>([]);
  const [pendingPayload, setPendingPayload] = useState<Record<string, unknown> | null>(null);
  const [translationPreview, setTranslationPreview] = useState<Record<string, unknown>>({});

  const fetchRevisions = useCallback(async () => {
    if (!isEdit || !id) return;
    const result = await getFaqRevisions(Number(id));
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
      const data = await getFaqDetail(Number(id));
      form.setFieldsValue(data);
      await fetchRevisions();
    } finally {
      setLoading(false);
    }
  }, [fetchRevisions, id, isEdit, form]);

  useEffect(() => {
    void fetchDetail();
  }, [fetchDetail]);

  const buildPayload = (values: FaqEditValues) => ({
    categoryKey: values.categoryKey,
    categoryLabelZh: values.categoryLabelZh,
    questionZh: values.questionZh,
    answerZh: values.answerZh,
    status: values.status,
    sortOrder: values.sortOrder ?? 0,
  });

  const handleSubmit = async (values: FaqEditValues) => {
    const payload = {
      ...buildPayload(values),
    };

    setSaving(true);
    try {
      const translated = await translateContent({
        categoryLabel: values.categoryLabelZh,
        question: values.questionZh,
        answer: values.answerZh,
      });
      const translatedObject =
        translated.translated && typeof translated.translated === 'object' && !Array.isArray(translated.translated)
          ? (translated.translated as Record<string, unknown>)
          : {};
      setPendingPayload({
        ...payload,
        categoryLabelEn: String(translatedObject.categoryLabel || values.categoryLabelZh),
        questionEn: String(translatedObject.question || values.questionZh),
        answerEn: String(translatedObject.answer || values.answerZh),
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
        await updateFaq(Number(id), pendingPayload);
        message.success('更新成功');
      } else {
        await createFaq(pendingPayload);
        message.success('创建成功');
      }
      navigate('/content/faq');
    } finally {
      setSaving(false);
    }
  };

  const handleRollback = async (revisionId: number) => {
    if (!id) return;
    const result = await rollbackFaqRevision(Number(id), revisionId);
    form.setFieldsValue(result);
    await fetchRevisions();
    message.success('已恢复历史版本');
  };

  return (
    <PageContainer
      title={isEdit ? '编辑常见问题' : '新增常见问题'}
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
          <ContentEditorLayout modules={faqModules}>
            <Card id="basic" size="small" title="基础信息">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="分类标识"
                    name="categoryKey"
                    rules={[{ required: true, message: '请输入分类标识' }]}
                  >
                    <Input placeholder="如：service / quality" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="分类名称"
                    name="categoryLabelZh"
                    rules={[{ required: true, message: '请输入分类名称' }]}
                  >
                    <Input placeholder="请输入分类名称" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            <Card id="question-answer" size="small" title="问答内容">
              <Form.Item
                label="问题"
                name="questionZh"
                rules={[{ required: true, message: '请输入问题' }]}
              >
                <Input placeholder="请输入问题" />
              </Form.Item>

              <Form.Item
                label="答案"
                name="answerZh"
                rules={[{ required: true, message: '请输入答案' }]}
              >
                <RichTextEditor placeholder="请输入答案..." />
              </Form.Item>
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
        width={760}
      >
        <Space direction="vertical" className="w-full">
          <Text strong>分类名称</Text>
          <Input value={String(translationPreview.categoryLabel ?? '')} readOnly />
          <Text strong>问题</Text>
          <Input value={String(translationPreview.question ?? '')} readOnly />
          <Text strong>答案</Text>
          <Input.TextArea rows={8} value={String(translationPreview.answer ?? '')} readOnly />
        </Space>
      </Modal>
      <Drawer title="FAQ 历史版本" open={historyOpen} onClose={() => setHistoryOpen(false)} width={560}>
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
    </PageContainer>
  );
}
