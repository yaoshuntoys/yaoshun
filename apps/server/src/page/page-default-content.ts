import type { PageKey } from './page.types';

const defaultSeo = {
  title: { zh: '' },
  description: { zh: '' },
  keywords: { zh: [] },
  canonicalUrl: '',
  ogImage: '',
};

const heroMedia = {
  image: '',
  video: '',
};

const featuredProducts = {
  enabled: true,
  productIds: [],
  fallbackLimit: 8,
};

const DEFAULT_PAGE_CONTENT: Record<PageKey, Record<string, unknown>> = {
  home: {
    seo: defaultSeo,
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
      ...defaultSeo,
      detailTitleTemplate: { zh: '' },
      detailDescriptionTemplate: { zh: '' },
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
    seo: defaultSeo,
    heroMedia,
    newsRules: {
      featuredNewsIds: [],
      pageSize: 12,
      defaultCategory: '',
      showArchivedNews: false,
    },
  },
  faq: {
    seo: defaultSeo,
    heroMedia,
    faqRules: {
      categoryKeys: [],
      defaultOpenFirst: true,
      showInactiveFaqs: false,
    },
  },
  about: {
    seo: defaultSeo,
    heroMedia,
    businessMedia: {
      galleryImages: [],
      certificateImages: [],
      factoryVideo: '',
    },
    displayRules: {
      useEnterpriseSetting: true,
      showPartners: true,
      showCertificates: true,
    },
  },
  solutions: {
    seo: defaultSeo,
    heroMedia,
    solutionRules: {
      enabledServiceKeys: ['oem-odm', 'mold-development', 'quality-control'],
      featuredProductIds: [],
      showLeadForm: true,
    },
  },
  privacy: {
    seo: defaultSeo,
    document: {
      updatedDate: '',
      body: { zh: '' },
    },
  },
  terms: {
    seo: defaultSeo,
    document: {
      updatedDate: '',
      body: { zh: '' },
    },
  },
};

export function getDefaultPageContent(key: PageKey) {
  return JSON.parse(JSON.stringify(DEFAULT_PAGE_CONTENT[key])) as Record<
    string,
    unknown
  >;
}
