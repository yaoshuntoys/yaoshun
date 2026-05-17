import type { RouteObject } from 'react-router-dom';

import LoginPage from '@/pages/login';
import ResetPasswordPage from '@/pages/login/reset-password';
import { LoginGuard } from '@/router/guards';

export const authRoutes: RouteObject[] = [
  {
    path: '/login',
    element: <LoginGuard />,
    children: [
      {
        index: true,
        element: <LoginPage />,
        handle: {
          title: '登录',
        },
      },
    ],
  },
  {
    path: '/reset-password',
    element: <LoginGuard />,
    children: [
      {
        index: true,
        element: <ResetPasswordPage />,
        handle: {
          title: '重置密码',
        },
      },
    ],
  },
];
