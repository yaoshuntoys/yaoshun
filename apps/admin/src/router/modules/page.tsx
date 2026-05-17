import type { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

import { permissionCodes } from '@/config';
import { lazyPage } from '@/router/helpers';

export const pageRoutes: RouteObject[] = [
  {
    path: 'page',
    children: [
      { index: true, element: <Navigate to="/page/home" replace /> },
      {
        path: ':pageRoute',
        element: lazyPage(() => import('@/pages/page/generic')),
        handle: {
          title: '页面配置',
          permissionCodes: [permissionCodes.pageManage],
        },
      },
    ],
  },
];
