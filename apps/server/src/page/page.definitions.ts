import type { PageKey } from './page.types';

export const PAGE_DEFINITIONS: Record<
  PageKey,
  { title: string; description: string; path: string }
> = {
  home: {
    title: '首页',
    description: '维护首页 SEO、首屏媒体、精选商品和业务数据来源。',
    path: '/',
  },
  products: {
    title: '产品目录',
    description: '维护产品目录 SEO、目录媒体、精选商品和展示规则。',
    path: '/products',
  },
  news: {
    title: '新闻中心',
    description: '维护新闻中心 SEO、页面媒体和新闻展示规则。',
    path: '/news',
  },
  faq: {
    title: '常见问题',
    description: '维护常见问题 SEO、页面媒体和 FAQ 展示规则。',
    path: '/faq',
  },
  about: {
    title: '关于我们',
    description: '维护关于我们 SEO、页面媒体、企业媒体和展示规则。',
    path: '/about',
  },
  solutions: {
    title: '解决方案',
    description: '维护解决方案 SEO、页面媒体和服务展示规则。',
    path: '/solutions',
  },
  privacy: {
    title: '隐私政策',
    description: '维护隐私政策 SEO、正文富文本和更新时间。',
    path: '/privacy',
  },
  terms: {
    title: '服务条款',
    description: '维护服务条款 SEO、正文富文本和更新时间。',
    path: '/terms',
  },
};
