import type { HttpContext, HttpMiddleware } from '@/utils/request/httpClient/client/types';

export function compose<T>(middlewares: HttpMiddleware<T>[]) {
  return async (context: HttpContext<T>) => {
    let index = -1;
    const dispatch = async (i: number): Promise<void> => {
      if (i <= index) {
        throw new Error('next() called multiple times');
      }
      index = i;
      const middleware = middlewares[i];
      if (!middleware) {
        return;
      }
      await middleware(context, () => dispatch(i + 1));
    };
    await dispatch(0);
  };
}
