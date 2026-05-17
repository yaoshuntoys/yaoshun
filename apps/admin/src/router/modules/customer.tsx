import type { RouteObject } from 'react-router-dom';

import { permissionCodes } from '@/config';
import { lazyPage } from '@/router/helpers';

export const customerRoutes: RouteObject[] = [
  {
    path: 'customer',
    children: [
      {
        path: 'message',
        element: lazyPage(() => import('@/pages/customer/message')),
        handle: {
          title: '客户留言',
          permissionCodes: [permissionCodes.customerMessageManage],
        },
      },
    ],
  },
];
