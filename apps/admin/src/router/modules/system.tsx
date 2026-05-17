import type { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

import { permissionCodes } from '@/config';
import { lazyPage } from '@/router/helpers';

export const systemRoutes: RouteObject[] = [
  {
    path: 'system',
    children: [
      { index: true, element: <Navigate to="/system/account" replace /> },
      {
        path: 'account',
        element: lazyPage(() => import('@/pages/system/account')),
        handle: {
          title: '账号管理',
          permissionCodes: [permissionCodes.systemAccountManage],
        },
      },
      {
        path: 'role',
        element: lazyPage(() => import('@/pages/system/role')),
        handle: {
          title: '角色管理',
          permissionCodes: [permissionCodes.systemRoleManage],
        },
      },
      { path: 'mail', element: <Navigate to="/setting/mail" replace /> },
    ],
  },
];
