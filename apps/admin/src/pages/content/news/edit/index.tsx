import {
  PlusOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  DatePicker,
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
  Switch,
  Typography,
  message,
} from 'antd';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  createNews,
  getNewsDetail,
  getNewsRevisions,
  rollbackNewsRevision,
  updateNews,
} from '@/api/article';
import { getProductList, translateContent } from '@/api';
import ContentEditorLayout from '@/components/ContentEditorLayout';
import EditorActionBar from '@/components/EditorActionBar';
import MediaSelector from '@/components/MediaSelector';
import PageContainer from '@/components/PageContainer';
import RichTextEditor from '@/components/RichTextEditor';
import type { Article, Product, WebsiteNewsArticleSeed } from '@/types';
import {
  buildNewsRawData,
  localized,
  localizedList,
  splitLines,
} from '@/utils/websiteContract';

const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;

const newsModules = [
  { key: 'website-basic', label: '官网基础信息' },
  { key: 'content', label: '文章内容' },
  { key: 'media', label: '封面与图库' },
  { key: 'seo-related', label: 'SEO 与关联产品' },
  { key: 'display', label: '展示规则' },
];

type RevisionRecord = {
  id: number;
  version: number;
  action: string;
  operatorName?: string | null;
  summary?: string | null;
  createdAt: string;
};

interface NewsEditValues {
  slug: string;
  category: Article['category'];
  titleZh: string;
  excerptZh?: string;
  bodyZh: string;
  publishedAt?: dayjs.Dayjs | null;
  image?: string;
  galleryImagesText?: string;
  featuredTopic?: boolean;
  seoKeywordsZh?: string;
  relatedProductId?: string;
  relatedProductLabelZh?: string;
  relatedProductDescriptionZh?: string;
  detailConfig?: Record<string, unknown>;
  status: Article['status'];
  sortOrder?: number;
}

function firstText(value?: Partial<Record<'zh' | 'en', string>>) {
  return value?.zh || value?.en || '';
}

function buildInitialValues(article: Article): Partial<NewsEditValues> {
  const raw = article.rawData as WebsiteNewsArticleSeed | undefined;
  return {
    slug: article.slug,
    category: article.category,
    titleZh: firstText(raw?.title) || article.titleZh,
    excerptZh: firstText(raw?.excerpt) || article.summaryZh,
    bodyZh: firstText(raw?.body) || article.contentZh,
    publishedAt: article.publishedAt ? dayjs(article.publishedAt) : null,
    image: raw?.image || article.cover,
    galleryImagesText: (raw?.galleryImages || article.galleryImages || []).join('\n'),
    featuredTopic: raw?.featuredTopic ?? article.featuredTopic,
    seoKeywordsZh: (raw?.seoKeywords?.zh || article.seoKeywords?.zh || []).join('\n'),
    relatedProductId: raw?.relatedProduct?.productId || String(article.relatedProduct?.productId || ''),
    relatedProductLabelZh: firstText(raw?.relatedProduct?.label) || String(article.relatedProduct?.label || ''),
    relatedProductDescriptionZh: firstText(raw?.relatedProduct?.description),
    detailConfig: article.detailConfig ?? {},
    status: article.status,
    sortOrder: article.sortOrder,
  };
}

export default function NewsEditPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const [form] = Form.useForm<NewsEditValues>();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [revisions, setRevisions] = useState<RevisionRecord[]>([]);
  const [pendingPayload, setPendingPayload] = useState<Record<string, unknown> | null>(null);
  const [translationPreview, setTranslationPreview] = useState<Record<string, unknown>>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [mediaSelector, setMediaSelector] = useState<{
    open: boolean;
    target: 'image' | 'gallery';
  }>({ open: false, target: 'image' });

  const fetchRevisions = useCallback(async () => {
    if (!isEdit || !id) return;
    const result = await getNewsRevisions(Number(id));
    setRevisions(result as RevisionRecord[]);
  }, [id, isEdit]);

  const fetchDetail = useCallback(async () => {
    if (!isEdit || !id) {
      form.setFieldsValue({
        category: 'company',
        status: 'published',
        sortOrder: 0,
        publishedAt: dayjs(),
      });
      return;
    }

    setLoading(true);
    try {
      const data = await getNewsDetail(Number(id));
      form.setFieldsValue(buildInitialValues(data));
      await fetchRevisions();
    } finally {
      setLoading(false);
    }
  }, [fetchRevisions, form, id, isEdit]);

  useEffect(() => {
    void getProductList({ pageSize: 100, publicOnly: true }).then((result) => {
      setProducts(result.list);
    });

    void fetchDetail();
  }, [fetchDetail]);

  const buildPayload = (values: NewsEditValues, translated: Record<string, unknown>) => {
    const titleEn = String(translated.title || values.titleZh);
    const excerptEn = String(translated.excerpt || values.excerptZh || '');
    const bodyEn = String(translated.body || values.bodyZh);
    const publishedAt = values.publishedAt?.format('YYYY-MM-DD') || dayjs().format('YYYY-MM-DD');
    const galleryImages = splitLines(values.galleryImagesText);
    const selectedProduct = products.find((item) => item.productId === values.relatedProductId || item.slug === values.relatedProductId);
    const relatedProduct = values.relatedProductId
      ? {
          productId: values.relatedProductId,
          label: localized(
            values.relatedProductLabelZh || selectedProduct?.titleZh || values.relatedProductId,
            selectedProduct?.titleEn || values.relatedProductLabelZh || values.relatedProductId,
          ),
          description: localized(
            values.relatedProductDescriptionZh,
            String(translated.relatedProductDescription || values.relatedProductDescriptionZh || ''),
          ),
        }
      : undefined;
    const seoKeywords = localizedList(splitLines(values.seoKeywordsZh), []);
    const rawData = buildNewsRawData({
      slug: values.slug,
      category: values.category,
      titleZh: values.titleZh,
      titleEn,
      excerptZh: values.excerptZh,
      excerptEn,
      publishedAt,
      image: values.image || galleryImages[0] || '',
      galleryImages,
      featuredTopic: values.featuredTopic,
      seoKeywords,
      bodyZh: values.bodyZh,
      bodyEn,
      relatedProduct,
    });

    return {
      slug: values.slug,
      category: values.category,
      titleZh: values.titleZh,
      titleEn,
      summaryZh: values.excerptZh?.trim() || undefined,
      summaryEn: excerptEn,
      contentZh: values.bodyZh,
      contentEn: bodyEn,
      cover: values.image || galleryImages[0],
      galleryImages,
      featuredTopic: values.featuredTopic ?? false,
      seoKeywords,
      relatedProduct,
      detailConfig: values.detailConfig ?? {},
      rawData,
      status: values.status,
      publishedAt,
      sortOrder: values.sortOrder ?? 0,
    };
  };

  const handleSubmit = async (values: NewsEditValues) => {
    setSaving(true);
    try {
      const translated = await translateContent({
        title: values.titleZh,
        excerpt: values.excerptZh ?? '',
        body: values.bodyZh,
        relatedProductDescription: values.relatedProductDescriptionZh ?? '',
      });
      const translatedObject =
        translated.translated && typeof translated.translated === 'object' && !Array.isArray(translated.translated)
          ? (translated.translated as Record<string, unknown>)
          : {};
      setPendingPayload(buildPayload(values, translatedObject));
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
        await updateNews(Number(id), pendingPayload);
        message.success('新闻已按官网结构更新');
      } else {
        await createNews(pendingPayload);
        message.success('新闻已按官网结构创建');
      }
      navigate('/content/news');
    } finally {
      setSaving(false);
    }
  };

  const appendMediaUrl = (url: string) => {
    if (mediaSelector.target === 'image') {
      form.setFieldValue('image', url);
      if (!form.getFieldValue('galleryImagesText')) {
        form.setFieldValue('galleryImagesText', url);
      }
      return;
    }
    form.setFieldValue('galleryImagesText', [...splitLines(form.getFieldValue('galleryImagesText')), url].join('\n'));
  };

  const handleRollback = async (revisionId: number) => {
    if (!id) return;
    const result = await rollbackNewsRevision(Number(id), revisionId);
    form.setFieldsValue(buildInitialValues(result));
    await fetchRevisions();
    message.success('已恢复历史版本');
  };

  return (
    <PageContainer
      title={isEdit ? '新闻详情配置' : '新建新闻'}
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
          <ContentEditorLayout
            modules={newsModules}
          >
            <Card id="website-basic" size="small" title="官网基础信息">
              <Form.Item name="titleZh" label="文章标题" rules={[{ required: true, message: '请输入标题' }]}>
                <Input placeholder="工厂审核记录完成更新，方便客户尽调" />
              </Form.Item>
              <Row gutter={16}>
                <Col span={10}>
                  <Form.Item name="slug" label="Slug / 详情路由" rules={[{ required: true, message: '请输入 slug' }]}>
                    <Input placeholder="factory-audit-records-refreshed-for-buyer-due-diligence" />
                  </Form.Item>
                </Col>
                <Col span={7}>
                  <Form.Item name="category" label="新闻分类" rules={[{ required: true }]}>
                    <Select>
                      <Option value="company">工厂与交付</Option>
                      <Option value="product">产品与定制</Option>
                      <Option value="events">活动与展会</Option>
                      <Option value="insights">行业洞察</Option>
                      <Option value="awards">资质与荣誉</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={7}>
                  <Form.Item name="publishedAt" label="发布日期" rules={[{ required: true }]}>
                    <DatePicker className="w-full" />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item name="excerptZh" label="新闻摘要" rules={[{ required: true, message: '请输入摘要' }]}>
                <TextArea rows={3} placeholder="用于新闻列表、详情页导语和 SEO 描述" />
              </Form.Item>
            </Card>

            <Card id="content" size="small" title="文章内容">
              <Form.Item name="bodyZh" label="正文 HTML / 富文本" rules={[{ required: true, message: '请输入正文' }]}>
                <RichTextEditor placeholder="请输入新闻正文..." />
              </Form.Item>
            </Card>

            <Card
              id="media"
              size="small"
              title="封面与图库"
              extra={(
                <Space>
                  <Button icon={<PlusOutlined />} onClick={() => setMediaSelector({ open: true, target: 'image' })}>选封面</Button>
                  <Button onClick={() => setMediaSelector({ open: true, target: 'gallery' })}>选图库</Button>
                </Space>
              )}
            >
              <Form.Item name="image" label="封面图" rules={[{ required: true, message: '请选择封面图' }]}>
                <Input placeholder="从多媒体库选择或粘贴 URL" />
              </Form.Item>
              <Form.Item name="galleryImagesText" label="图库图片" extra="每行一个，详情页图文内容可引用。">
                <TextArea rows={4} />
              </Form.Item>
            </Card>

            <Card id="seo-related" size="small" title="SEO 与关联产品">
              <Form.Item name="seoKeywordsZh" label="SEO 关键词" extra="每行一个中文关键词，保存前自动翻译。">
                <TextArea rows={4} />
              </Form.Item>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="relatedProductId" label="关联产品">
                    <Select allowClear showSearch optionFilterProp="label" options={products.map((item) => ({
                      label: `${item.productId || item.slug} - ${item.titleZh}`,
                      value: item.productId || item.slug,
                    }))} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="relatedProductLabelZh" label="关联产品展示名">
                    <Input placeholder="默认使用商品标题" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="relatedProductDescriptionZh" label="关联产品说明">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            <Card id="display" size="small" title="展示规则">
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="featuredTopic" label="推荐主题" valuePropName="checked">
                    <Switch />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="status" label="状态" rules={[{ required: true }]}>
                    <Select>
                      <Option value="draft">草稿</Option>
                      <Option value="published">发布</Option>
                      <Option value="archived">归档</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="sortOrder" label="排序">
                    <InputNumber className="w-full" min={0} />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item name={['detailConfig', 'seoTitleTemplate']} label="详情 SEO 模板">
                <Input placeholder="{title} | 尧顺新闻中心" />
              </Form.Item>
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
        width={780}
      >
        <Space direction="vertical" className="w-full">
          <Text strong>标题</Text>
          <Input value={String(translationPreview.title ?? '')} readOnly />
          <Text strong>摘要</Text>
          <Input.TextArea rows={3} value={String(translationPreview.excerpt ?? '')} readOnly />
          <Text strong>正文</Text>
          <Input.TextArea rows={8} value={String(translationPreview.body ?? '')} readOnly />
        </Space>
      </Modal>

      <Drawer title="新闻历史版本" open={historyOpen} onClose={() => setHistoryOpen(false)} width={560}>
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
        open={mediaSelector.open}
        type="image"
        onClose={() => setMediaSelector((value) => ({ ...value, open: false }))}
        onSelect={appendMediaUrl}
      />
    </PageContainer>
  );
}
