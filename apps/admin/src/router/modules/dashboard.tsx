import type { RouteObject } from 'react-router-dom';

import { permissionCodes } from '@/config';
import { lazyPage } from '@/router/helpers';

export const dashboardRoutes: RouteObject[] = [
  {
    path: 'dashboard',
    element: lazyPage(() => import('@/pages/dashboard')),
    handle: {
      title: '仪表盘',
      permissionCodes: [permissionCodes.dashboardView],
    },
  },
];
