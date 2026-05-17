export interface PaginatedResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

export function getPaginationParams(dto: { page?: number; pageSize?: number }) {
  const page = Math.max(Number(dto.page ?? 1), 1);
  const pageSize = Math.min(Math.max(Number(dto.pageSize ?? 20), 1), 100);
  return { page, pageSize, skip: (page - 1) * pageSize };
}

export function buildPaginatedResult<T>(
  items: T[],
  total: number,
  page: number,
  pageSize: number,
): PaginatedResult<T> {
  return { list: items, total, page, pageSize };
}
