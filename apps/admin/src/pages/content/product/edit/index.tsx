import { PlusOutlined } from '@ant-design/icons';
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

import {
  createProduct,
  getProductDetail,
  getProductRevisions,
  rollbackProductRevision,
  updateProduct,
} from '@/api/product';
import { translateContent } from '@/api';
import ContentEditorLayout from '@/components/ContentEditorLayout';
import EditorActionBar from '@/components/EditorActionBar';
import MediaSelector from '@/components/MediaSelector';
import PageContainer from '@/components/PageContainer';
import type { LocalizedList, WebsiteProductJson } from '@/types';
import {
  mergeTranslatedLocalizedFields,
  splitLines,
  stringifyJson,
} from '@/utils/websiteContract';
import {
  buildProductInitialValues,
  productModules,
  type ProductEditValues,
  type ProductPayload,
  type RevisionRecord,
} from './product-edit.model';
import { buildProductPayload } from './product-edit.payload';

const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;

export default function ProductEditPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const [form] = Form.useForm<ProductEditValues>();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [revisions, setRevisions] = useState<RevisionRecord[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [pendingPayload, setPendingPayload] = useState<ProductPayload | null>(null);
  const [translationPreview, setTranslationPreview] = useState<Record<string, unknown>>({});
  const [mediaSelector, setMediaSelector] = useState<{
    open: boolean;
    target: 'cover' | 'images' | 'videos';
    type: 'image' | 'video';
  }>({ open: false, target: 'cover', type: 'image' });

  const fetchRevisions = useCallback(async () => {
    if (!isEdit || !id) return;
    const result = await getProductRevisions(Number(id));
    setRevisions(result as RevisionRecord[]);
  }, [id, isEdit]);

  const fetchDetail = useCallback(async () => {
    if (!isEdit || !id) {
      form.setFieldsValue({
        category: 'finished-toys',
        status: 'active',
        sortOrder: 0,
        priority: 0,
        currency: '$',
        isRange: false,
      });
      return;
    }

    setLoading(true);
    try {
      const data = await getProductDetail(Number(id));
      form.setFieldsValue(buildProductInitialValues(data));
      await fetchRevisions();
    } finally {
      setLoading(false);
    }
  }, [fetchRevisions, form, id, isEdit]);

  useEffect(() => {
    void fetchDetail();
  }, [fetchDetail]);

  const handleSubmit = async (values: ProductEditValues) => {
    setSaving(true);
    try {
      const chinesePayload = buildProductPayload(values);
      const translated = await translateContent({
        rawData: chinesePayload.rawData,
        seoKeywords: chinesePayload.seoKeywords,
      });
      const translatedObject =
        translated.translated && typeof translated.translated === 'object' && !Array.isArray(translated.translated)
          ? (translated.translated as Record<string, unknown>)
          : {};
      const translatedRawData = mergeTranslatedLocalizedFields(
        chinesePayload.rawData as WebsiteProductJson,
        translatedObject.rawData,
      );
      const translatedSeoKeywords = mergeTranslatedLocalizedFields(
        chinesePayload.seoKeywords as LocalizedList,
        translatedObject.seoKeywords,
      );

      setPendingPayload(buildProductPayload(values, translatedRawData, translatedSeoKeywords));
      setTranslationPreview({
        rawData: translatedRawData,
        seoKeywords: translatedSeoKeywords,
      });
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
        await updateProduct(Number(id), pendingPayload);
        message.success('商品已按官网结构更新');
      } else {
        await createProduct(pendingPayload);
        message.success('商品已按官网结构创建');
      }
      navigate('/content/product');
    } finally {
      setSaving(false);
    }
  };

  const appendMediaUrl = (url: string) => {
    if (mediaSelector.target === 'cover') {
      form.setFieldValue('cover', url);
      if (!form.getFieldValue('imagesText')) {
        form.setFieldValue('imagesText', url);
      }
      return;
    }

    const fieldName = mediaSelector.target === 'videos' ? 'videosText' : 'imagesText';
    const current = splitLines(form.getFieldValue(fieldName));
    form.setFieldValue(fieldName, [...current, url].join('\n'));
  };

  const handleRollback = async (revisionId: number) => {
    if (!id) return;
    const result = await rollbackProductRevision(Number(id), revisionId);
    form.setFieldsValue(buildProductInitialValues(result));
    await fetchRevisions();
    message.success('已恢复历史版本');
  };

  return (
    <PageContainer
      title={isEdit ? '商品详情配置' : '新建商品'}
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
            modules={productModules}
          >
            <Card id="website-basic" size="small" title="官网基础信息">
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="productId" label="产品 ID / 详情路由" rules={[{ required: true, message: '请输入产品 ID' }]}>
                    <Input placeholder="例如 2026050708" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="slug" label="后台唯一 Slug">
                    <Input placeholder="默认可与产品 ID 一致" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="priority" label="官网排序优先级">
                    <InputNumber className="w-full" min={0} />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item name="titleZh" label="官网标题" rules={[{ required: true, message: '请输入标题' }]}>
                <Input placeholder="定制130件夜光堡垒拼搭套装" />
              </Form.Item>
              <Form.Item name="summaryZh" label="目录卡片摘要">
                <TextArea rows={2} placeholder="用于产品目录和精选产品卡片" />
              </Form.Item>
              <Form.Item name="descriptionLinesZh" label="详情页描述" rules={[{ required: true, message: '请输入描述' }]} extra="每行一段，官网详情页会按段落/亮点使用。">
                <TextArea rows={5} placeholder="中等件数配置适合礼品渠道..." />
              </Form.Item>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="category" label="后台状态分类" rules={[{ required: true }]}>
                    <Select>
                      <Option value="finished-toys">成品玩具项目</Option>
                      <Option value="parts-structures">玩具结构件与部件</Option>
                      <Option value="process-support">工艺配套能力</Option>
                      <Option value="accessories">配件与包装</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="status" label="状态" rules={[{ required: true }]}>
                    <Select>
                      <Option value="active">上架</Option>
                      <Option value="inactive">下架</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="sortOrder" label="后台排序">
                    <InputNumber className="w-full" min={0} />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item name="sourceUrl" label="来源链接">
                <Input placeholder="1688 或其他来源链接" />
              </Form.Item>
            </Card>

            <Card id="seo-category" size="small" title="SEO 与分类">
              <Form.Item name="categoriesZh" label="官网业务分类" extra="每行一个，影响目录筛选、面包屑与 SEO。">
                <TextArea rows={4} placeholder={'building block sets\noutdoor toys structures'} />
              </Form.Item>
              <Form.Item name="tagsText" label="官网标签" extra="每行：key|中文|英文">
                <TextArea rows={4} placeholder={'oem|OEM/ODM|OEM/ODM\nstem|STEM益智玩具|STEM educational toys'} />
              </Form.Item>
              <Form.Item name="seoKeywordsZh" label="SEO 关键词" extra="每行一个中文关键词，英文保存前自动翻译。">
                <TextArea rows={4} placeholder={'130件夜光堡垒套装\n贴牌夜光堡垒玩具'} />
              </Form.Item>
            </Card>

            <Card id="price-moq" size="small" title="价格与 MOQ">
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="priceDisplayZh" label="展示价格">
                    <Input placeholder="按数量报价 / 询价" />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item name="currency" label="币种">
                    <Input placeholder="$" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="priceMin" label="最低价">
                    <InputNumber className="w-full" min={0} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="priceMax" label="最高价">
                    <InputNumber className="w-full" min={0} />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item name="minOrderZh" label="MOQ 文案">
                <Input placeholder="1000 套 / 请与业务确认" />
              </Form.Item>
              <Form.Item name="priceTiersText" label="阶梯价格" extra="每行：数量中文|价格|数量英文">
                <TextArea rows={4} placeholder={'100-499 箱|2.80|100-499 boxes\n500+ 箱|2.50|500+ boxes'} />
              </Form.Item>
            </Card>

            <Card
              id="media"
              size="small"
              title="媒体资源"
              extra={(
                <Space>
                  <Button icon={<PlusOutlined />} onClick={() => setMediaSelector({ open: true, target: 'cover', type: 'image' })}>选主图</Button>
                  <Button onClick={() => setMediaSelector({ open: true, target: 'images', type: 'image' })}>选图片</Button>
                  <Button onClick={() => setMediaSelector({ open: true, target: 'videos', type: 'video' })}>选视频</Button>
                </Space>
              )}
            >
              <Form.Item name="cover" label="封面图">
                <Input placeholder="从多媒体库选择或粘贴 URL" />
              </Form.Item>
              <Form.Item name="imagesText" label="产品图片" extra="每行一个，官网详情页画廊、目录卡片、精选产品都会使用。">
                <TextArea rows={5} />
              </Form.Item>
              <Form.Item name="videosText" label="产品视频">
                <TextArea rows={3} />
              </Form.Item>
            </Card>

            <Card id="attributes" size="small" title="属性表">
              <Form.Item name="attributePairsText" label="详情属性表" extra="每行：中文字段|中文值|英文字段|英文值。官网详情页 Product Attributes 会使用。">
                <TextArea rows={6} placeholder={'适用年龄|5岁以上|Age Range|Ages 5+\n材质|PP塑料|Material|PP plastic'} />
              </Form.Item>
              <Form.Item name="productAttributesText" label="产品属性补充">
                <TextArea rows={5} />
              </Form.Item>
              <Form.Item name="specificationsText" label="规格参数">
                <TextArea rows={5} />
              </Form.Item>
            </Card>

            <Card id="customization" size="small" title="定制选项">
              <Form.Item name="customizationOptionsText" label="定制能力" extra="每行：中文选项|中文 MOQ|英文选项|英文 MOQ">
                <TextArea rows={5} placeholder={'太空主题彩盒|1000套起|Space-theme color box|1000 sets MOQ'} />
              </Form.Item>
            </Card>

            <Card id="packaging-leadtime" size="small" title="包装与交期">
              <Form.Item name="packagingPairsText" label="包装参数" extra="每行：中文字段|中文值|英文字段|英文值">
                <TextArea rows={5} placeholder={'单件包装尺寸|30*20*8cm|Single package size|30*20*8cm'} />
              </Form.Item>
              <Form.Item name="leadTimeJson" label="交期 JSON" extra="官网结构：{ tiers: [{ minQuantity, maxQuantity, processPeriodDays }] }">
                <TextArea rows={5} />
              </Form.Item>
              <Row gutter={16}>
                <Col span={10}>
                  <Form.Item name="videoDescriptionTitleZh" label="视频标题">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item name="videoDescriptionUrl" label="视频地址">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item name="videoDescriptionDuration" label="时长">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            <Card id="details" size="small" title="详情内容">
              <Form.Item name="productDetailsText" label="详情区块" extra="每行：中文标题|中文正文|图片URL|英文标题|英文正文">
                <TextArea rows={8} placeholder={'结构稳定|杆件与连接球适合反复拼搭|/site/products/demo/1.webp|Stable structure|Rods and connectors support repeated building'} />
              </Form.Item>
              <Form.Item name={['detailConfig', 'seoTemplate']} label="详情 SEO 模板">
                <Input placeholder="{title} | 尧顺玩具" />
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
          <Text strong>完整官网结构英文预览</Text>
          <Input.TextArea rows={20} value={stringifyJson(translationPreview)} readOnly />
        </Space>
      </Modal>

      <Drawer
        title="商品历史版本"
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        width={560}
      >
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
        type={mediaSelector.type}
        onClose={() => setMediaSelector((value) => ({ ...value, open: false }))}
        onSelect={appendMediaUrl}
      />
    </PageContainer>
  );
}
