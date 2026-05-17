import type { PageKey } from '@/types';

type PageContent = Record<string, unknown>;

export const pageModuleLabels: Record<PageKey, Array<{ key: string; label: string }>> = {
  home: [
    { key: 'seo', label: 'SEO' },
    { key: 'heroMedia', label: '首屏媒体' },
    { key: 'featuredProducts', label: '精选商品' },
    { key: 'contentSources', label: '业务内容' },
  ],
  products: [
    { key: 'seo', label: 'SEO' },
    { key: 'heroMedia', label: '目录媒体' },
    { key: 'featuredProducts', label: '精选商品' },
    { key: 'catalogRules', label: '目录规则' },
  ],
  news: [
    { key: 'seo', label: 'SEO' },
    { key: 'heroMedia', label: '页面媒体' },
    { key: 'newsRules', label: '新闻规则' },
  ],
  faq: [
    { key: 'seo', label: 'SEO' },
    { key: 'heroMedia', label: '页面媒体' },
    { key: 'faqRules', label: 'FAQ 规则' },
  ],
  about: [
    { key: 'seo', label: 'SEO' },
    { key: 'heroMedia', label: '页面媒体' },
    { key: 'businessMedia', label: '企业媒体' },
    { key: 'displayRules', label: '展示规则' },
  ],
  solutions: [
    { key: 'seo', label: 'SEO' },
    { key: 'heroMedia', label: '页面媒体' },
    { key: 'solutionRules', label: '服务规则' },
  ],
  privacy: [
    { key: 'seo', label: 'SEO' },
    { key: 'document', label: '文档信息' },
  ],
  terms: [
    { key: 'seo', label: 'SEO' },
    { key: 'document', label: '文档信息' },
  ],
};

const seo = {
  title: '',
  description: '',
  keywords: [''],
  canonicalUrl: '',
  ogImage: '',
};

const heroMedia = {
  image: '',
  video: '',
};

const featuredProducts = {
  enabled: true,
  productIds: [''],
  fallbackLimit: 8,
};

export const pageContentDefaults: Record<PageKey, PageContent> = {
  home: {
    seo,
    heroMedia,
    featuredProducts,
    contentSources: {
      useEnterpriseSetting: true,
      useProductCatalog: true,
      usePartnerList: true,
      showLeadForm: true,
    },
  },
  products: {
    seo: {
      ...seo,
      detailTitleTemplate: '',
      detailDescriptionTemplate: '',
    },
    heroMedia,
    featuredProducts,
    catalogRules: {
      defaultSort: 'sortOrder',
      pageSize: 12,
      showInactiveProducts: false,
      fallbackImage: '',
    },
  },
  news: {
    seo,
    heroMedia,
    newsRules: {
      featuredNewsIds: [''],
      pageSize: 12,
      defaultCategory: '',
      showArchivedNews: false,
    },
  },
  faq: {
    seo,
    heroMedia,
    faqRules: {
      categoryKeys: [''],
      defaultOpenFirst: true,
      showInactiveFaqs: false,
    },
  },
  about: {
    seo,
    heroMedia,
    businessMedia: {
      galleryImages: [''],
      certificateImages: [''],
      factoryVideo: '',
    },
    displayRules: {
      useEnterpriseSetting: true,
      showPartners: true,
      showCertificates: true,
    },
  },
  solutions: {
    seo,
    heroMedia,
    solutionRules: {
      enabledServiceKeys: ['oem-odm', 'mold-development', 'quality-control'],
      featuredProductIds: [''],
      showLeadForm: true,
    },
  },
  privacy: {
    seo,
    document: {
      updatedDate: '',
      body: '',
    },
  },
  terms: {
    seo,
    document: {
      updatedDate: '',
      body: '',
    },
  },
};

export const fieldLabels: Record<string, string> = {
  seo: 'SEO',
  title: '页面标题',
  description: '页面描述',
  keywords: '关键词',
  canonicalUrl: 'Canonical URL',
  ogImage: 'OG 图片',
  detailTitleTemplate: '详情标题模板',
  detailDescriptionTemplate: '详情描述模板',
  heroMedia: '页面媒体',
  image: '图片',
  video: '视频',
  featuredProducts: '精选商品',
  enabled: '启用',
  productIds: '商品',
  featuredProductIds: '精选商品',
  fallbackLimit: '兜底数量',
  contentSources: '业务内容',
  useEnterpriseSetting: '使用企业设置',
  useProductCatalog: '使用商品数据',
  usePartnerList: '使用合作客户',
  showLeadForm: '显示询盘表单',
  catalogRules: '目录规则',
  defaultSort: '默认排序',
  pageSize: '每页数量',
  showInactiveProducts: '显示下架商品',
  fallbackImage: '兜底图片',
  newsRules: '新闻规则',
  featuredNewsIds: '推荐新闻 ID',
  defaultCategory: '默认分类',
  showArchivedNews: '显示归档新闻',
  faqRules: 'FAQ 规则',
  categoryKeys: 'FAQ 分类',
  defaultOpenFirst: '默认展开第一项',
  showInactiveFaqs: '显示下架 FAQ',
  businessMedia: '企业媒体',
  galleryImages: '企业图片',
  certificateImages: '证书图片',
  factoryVideo: '工厂视频',
  displayRules: '展示规则',
  showPartners: '显示合作客户',
  showCertificates: '显示证书',
  solutionRules: '服务规则',
  enabledServiceKeys: '服务 Key',
  document: '文档信息',
  updatedDate: '更新时间',
  body: '正文',
};

export function toChinesePageValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => toChinesePageValue(item));
  }

  if (isRecord(value)) {
    const keys = Object.keys(value);
    if (
      keys.length <= 2 &&
      ('zh' in value || 'en' in value) &&
      (typeof value.zh === 'string' || typeof value.en === 'string')
    ) {
      return value.zh ?? value.en ?? '';
    }

    if (
      keys.length <= 2 &&
      ('zh' in value || 'en' in value) &&
      (Array.isArray(value.zh) || Array.isArray(value.en))
    ) {
      return value.zh ?? value.en ?? [];
    }

    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, toChinesePageValue(entry)]),
    );
  }

  return value;
}

export function buildPageEditorContent(
  pageKey: PageKey,
  content?: Record<string, unknown>,
): PageContent {
  const normalized = toChinesePageValue(content ?? {}) as PageContent;
  return deepPick(pageContentDefaults[pageKey], normalized) as PageContent;
}

function deepPick(template: unknown, source: unknown): unknown {
  if (Array.isArray(template)) {
    if (Array.isArray(source) && source.length > 0) {
      return source;
    }
    return template;
  }

  if (!isRecord(template)) {
    return source ?? template;
  }

  const sourceRecord = isRecord(source) ? source : {};
  return Object.fromEntries(
    Object.entries(template).map(([key, value]) => [
      key,
      deepPick(value, sourceRecord[key]),
    ]),
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}
