import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import { AuthGuard, HomeRedirect } from '@/router/guards';
import { authRoutes } from '@/router/modules/auth';
import { contentRoutes } from '@/router/modules/content';
import { customerRoutes } from '@/router/modules/customer';
import { dashboardRoutes } from '@/router/modules/dashboard';
import { pageRoutes } from '@/router/modules/page';
import { recordRoutes } from '@/router/modules/record';
import { settingRoutes } from '@/router/modules/setting';
import { systemRoutes } from '@/router/modules/system';

export const router = createBrowserRouter([
  ...authRoutes,
  {
    element: <AuthGuard />,
    children: [
      {
        path: '/',
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <HomeRedirect />,
          },
          ...dashboardRoutes,
          ...contentRoutes,
          ...pageRoutes,
          ...customerRoutes,
          ...recordRoutes,
          ...systemRoutes,
          ...settingRoutes,
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
