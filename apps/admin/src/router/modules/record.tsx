import type { RouteObject } from 'react-router-dom';

import { permissionCodes } from '@/config';
import { lazyPage } from '@/router/helpers';

export const recordRoutes: RouteObject[] = [
  {
    path: 'record',
    children: [
      {
        path: 'log',
        element: lazyPage(() => import('@/pages/record/log')),
        handle: {
          title: '操作日志',
          permissionCodes: [permissionCodes.recordLogView],
        },
      },
      {
        path: 'mail',
        element: lazyPage(() => import('@/pages/record/mail')),
        handle: {
          title: '邮件记录',
          permissionCodes: [permissionCodes.recordMailView],
        },
      },
    ],
  },
];
