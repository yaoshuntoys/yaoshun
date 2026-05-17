import axios from 'axios';

import type { HttpMiddleware } from '@/utils/request/httpClient/client/types';

export function withAuthToken(
  getToken: () => string | null | undefined,
  scheme = 'Bearer',
): HttpMiddleware {
  return async (context, next) => {
    const token = getToken();
    if (token) {
      const requestHeaders = axios.AxiosHeaders.from(context.request.headers);
      requestHeaders.set('Authorization', `${scheme} ${token}`);
      context.request.headers = requestHeaders;
    }
    await next();
  };
}
