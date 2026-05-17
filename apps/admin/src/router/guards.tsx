import { useEffect } from 'react';
import { Navigate, Outlet, useMatches } from 'react-router-dom';

import { APP_NAME, menuItems, type AppMenuItem } from '@/config';
import { filterMenuItemsByPermissions } from '@/layouts/utils/menu';
import { getCurrentRouteHandle } from '@/router/helpers';
import { useAuthStore } from '@/stores';

export function AuthGuard() {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export function LoginGuard() {
  const { isAuthenticated } = useAuthStore();
  const matches = useMatches();
  const currentRouteHandle = getCurrentRouteHandle(matches);

  useEffect(() => {
    document.title = currentRouteHandle?.title
      ? `${currentRouteHandle.title} - ${APP_NAME}`
      : APP_NAME;
  }, [currentRouteHandle?.title]);

  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
}

function findFirstMenuPath(items: AppMenuItem[]): string | null {
  for (const item of items) {
    if (item.children?.length) {
      const childPath = findFirstMenuPath(item.children);
      if (childPath) {
        return childPath;
      }
      continue;
    }

    return item.key;
  }

  return null;
}

export function HomeRedirect() {
  const userPermissions = useAuthStore((state) => state.user?.permissions);
  const filteredItems = filterMenuItemsByPermissions(menuItems, userPermissions);
  const firstPath = findFirstMenuPath(filteredItems);

  return <Navigate to={firstPath || '/login'} replace />;
}
