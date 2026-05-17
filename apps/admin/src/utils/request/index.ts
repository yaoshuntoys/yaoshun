import { message } from 'antd';

import { useAuthStore } from '@/stores';

import {
  createHttpClient,
  withAuthToken,
  withAxiosErrorNormalize,
  withBizStatus,
  withErrorMessage,
  withUnauthorizedRedirect,
} from '@/utils/request/httpClient';

// 默认超时时间：2 分钟
const DEFAULT_TIMEOUT = 2 * 60 * 1000;

let isRedirecting = false;

function buildRedirectParam(): string {
  try {
    const { pathname, search } = window.location;
    const current = `${pathname}${search ?? ''}` || '/';

    // 已在登录页时，不再把登录页作为 redirect，避免无限 /login?redirect=/login
    if (pathname.startsWith('/login')) {
      return encodeURIComponent('/');
    }

    return encodeURIComponent(current);
  } catch {
    return encodeURIComponent('/');
  }
}

function handleAuthError(): void {
  if (isRedirecting) return;
  isRedirecting = true;

  useAuthStore.getState().logout();

  const redirect = buildRedirectParam();
  window.location.href = `/login?redirect=${redirect}`;
}

export const httpClient = createHttpClient({
  axiosConfig: {
    baseURL: import.meta.env.VITE_API_BASE_URL || '',
    timeout: DEFAULT_TIMEOUT,
  },
  middlewares: [
    withAuthToken(() => useAuthStore.getState().token),
    withBizStatus(),
    withUnauthorizedRedirect({
      onUnauthorized: () => {
        if (useAuthStore.getState().token) {
          handleAuthError();
        }
      },
    }),
    withErrorMessage({
      showMessage: (msg) => {
        message.error(msg);
      },
    }),
    withAxiosErrorNormalize(),
  ],
});
export const http = httpClient;

export * from '@/utils/request/httpClient';
