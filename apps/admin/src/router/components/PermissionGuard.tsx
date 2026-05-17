import { Suspense, type ReactNode } from 'react';

import RouteForbidden from '@/router/components/RouteForbidden';
import RouteLoading from '@/router/components/RouteLoading';

interface Props {
  allowed: boolean;
  title?: string;
  children: ReactNode;
}

export default function PermissionGuard({
  allowed,
  title,
  children,
}: Props) {
  if (!allowed) {
    return <RouteForbidden title={title} />;
  }

  return (
    <Suspense fallback={<RouteLoading />}>
      {children}
    </Suspense>
  );
}
