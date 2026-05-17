import type { RouteObject } from 'react-router-dom';

import { permissionCodes } from '@/config';
import { lazyPage } from '@/router/helpers';

export const contentRoutes: RouteObject[] = [
  {
    path: 'content',
    children: [
      {
        path: 'product',
        element: lazyPage(() => import('@/pages/content/product')),
        handle: {
          title: '商品管理',
          permissionCodes: [permissionCodes.contentProductManage],
        },
      },
      {
        path: 'product/create',
        element: lazyPage(() => import('@/pages/content/product/edit')),
        handle: {
          title: '新建产品',
          permissionCodes: [permissionCodes.contentProductManage],
        },
      },
      {
        path: 'product/edit/:id',
        element: lazyPage(() => import('@/pages/content/product/edit')),
        handle: {
          title: '编辑产品',
          permissionCodes: [permissionCodes.contentProductManage],
        },
      },
      {
        path: 'news',
        element: lazyPage(() => import('@/pages/content/news')),
        handle: {
          title: '新闻管理',
          permissionCodes: [permissionCodes.contentNewsManage],
        },
      },
      {
        path: 'news/create',
        element: lazyPage(() => import('@/pages/content/news/edit')),
        handle: {
          title: '新建新闻',
          permissionCodes: [permissionCodes.contentNewsManage],
        },
      },
      {
        path: 'news/edit/:id',
        element: lazyPage(() => import('@/pages/content/news/edit')),
        handle: {
          title: '编辑新闻',
          permissionCodes: [permissionCodes.contentNewsManage],
        },
      },
      {
        path: 'faq',
        element: lazyPage(() => import('@/pages/content/faq')),
        handle: {
          title: '常见问题',
          permissionCodes: [permissionCodes.contentFaqManage],
        },
      },
      {
        path: 'faq/create',
        element: lazyPage(() => import('@/pages/content/faq/edit')),
        handle: {
          title: '新增 FAQ',
          permissionCodes: [permissionCodes.contentFaqManage],
        },
      },
      {
        path: 'faq/edit/:id',
        element: lazyPage(() => import('@/pages/content/faq/edit')),
        handle: {
          title: '编辑 FAQ',
          permissionCodes: [permissionCodes.contentFaqManage],
        },
      },
      {
        path: 'partner',
        element: lazyPage(() => import('@/pages/content/partner')),
        handle: {
          title: '合作客户',
          permissionCodes: [permissionCodes.contentPartnerManage],
        },
      },
      {
        path: 'partner/create',
        element: lazyPage(() => import('@/pages/content/partner/edit')),
        handle: {
          title: '新增合作客户',
          permissionCodes: [permissionCodes.contentPartnerManage],
        },
      },
      {
        path: 'partner/edit/:id',
        element: lazyPage(() => import('@/pages/content/partner/edit')),
        handle: {
          title: '编辑合作客户',
          permissionCodes: [permissionCodes.contentPartnerManage],
        },
      },
      {
        path: 'media',
        element: lazyPage(() => import('@/pages/content/media')),
        handle: {
          title: '多媒体库',
          permissionCodes: [permissionCodes.contentMediaManage],
        },
      },
    ],
  },
];
