import { lazy } from 'react';
import type { ComponentType, ReactElement } from 'react';
import type { UIMatch } from 'react-router-dom';

import type { AppRouteHandle } from '@/router/types';

interface LazyModule {
  default: ComponentType;
}

export function lazyPage(
  importer: () => Promise<LazyModule>,
): ReactElement {
  const Component = lazy(importer);

  return <Component />;
}

export function getCurrentRouteHandle(
  matches: UIMatch[],
): AppRouteHandle | undefined {
  const matchedRoute = [...matches]
    .reverse()
    .find((match) => {
      const handle = match.handle as AppRouteHandle | undefined;
      return Boolean(handle?.title || handle?.permissionCodes?.length);
    });

  return matchedRoute?.handle as AppRouteHandle | undefined;
}
