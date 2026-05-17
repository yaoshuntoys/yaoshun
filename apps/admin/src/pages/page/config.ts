import type { PageMeta } from '@/types';

export const pageMetaList: PageMeta[] = [
  {
    key: 'home',
    routePath: 'home',
    title: '首页',
    description: '维护首页 SEO、首屏媒体、精选商品和业务数据来源。',
  },
  {
    key: 'products',
    routePath: 'products',
    title: '产品目录',
    description: '维护产品目录 SEO、目录媒体、精选商品和展示规则。',
  },
  {
    key: 'news',
    routePath: 'news',
    title: '新闻中心',
    description: '维护新闻中心 SEO、页面媒体和新闻展示规则。',
  },
  {
    key: 'faq',
    routePath: 'faq',
    title: '常见问题',
    description: '维护常见问题 SEO、页面媒体和 FAQ 展示规则。',
  },
  {
    key: 'about',
    routePath: 'about',
    title: '关于我们',
    description: '维护关于我们 SEO、页面媒体、企业媒体和展示规则。',
  },
  {
    key: 'solutions',
    routePath: 'solutions',
    title: '解决方案',
    description: '维护解决方案 SEO、页面媒体和服务展示规则。',
  },
  {
    key: 'privacy',
    routePath: 'privacy',
    title: '隐私政策',
    description: '维护隐私政策页面内容配置。',
  },
  {
    key: 'terms',
    routePath: 'terms',
    title: '服务条款',
    description: '维护服务条款页面内容配置。',
  },
];

export const pageMetaByRoute = Object.fromEntries(
  pageMetaList.map((item) => [item.routePath, item]),
);

export const pageMetaByKey = Object.fromEntries(
  pageMetaList.map((item) => [item.key, item]),
) as Record<PageMeta['key'], PageMeta>;
