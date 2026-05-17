import type { HttpContext } from '@/utils/request/httpClient/client/types';

export async function executeRequest<T>(context: HttpContext<T>) {
  try {
    context.response = await context.client.request<T>(context.request);
  } catch (error) {
    context.error = error;
  }
}
