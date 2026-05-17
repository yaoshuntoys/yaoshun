import type { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

import { permissionCodes } from '@/config';
import { lazyPage } from '@/router/helpers';

export const settingRoutes: RouteObject[] = [
  {
    path: 'setting',
    children: [
      { index: true, element: <Navigate to="/setting/enterprise" replace /> },
      {
        path: 'enterprise',
        element: lazyPage(() => import('@/pages/setting/enterprise')),
        handle: {
          title: '企业设置',
          permissionCodes: [permissionCodes.settingEnterpriseManage],
        },
      },
      {
        path: 'mail',
        element: lazyPage(() => import('@/pages/setting/mail')),
        handle: {
          title: '邮件设置',
          permissionCodes: [permissionCodes.settingMailManage],
        },
      },
    ],
  },
];
