import type { FormField } from '@/components/ConfigurableForm/types';

/** 分页信息 */
export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}

/** 查询结果 */
export interface SearchResult<T> {
  data: T[];
  pagination: Pagination;
}

export interface SearchTableInstance {
  reload: () => void;
  refresh: () => void;
  getFieldsValue: () => Record<string, unknown>;
}

/** 查询函数类型 */
export type SearchFn<T, F extends Record<string, unknown>> = (
  params: F & { page: number; pageSize: number },
) => Promise<SearchResult<T>>;

/** SearchTable 组件属性 */
export interface SearchTableProps<T extends object, F extends Record<string, unknown>> {
  /** 查询字段配置 */
  fields: FormField[];
  /** 初始查询参数（类似 ProTable 的 initialValues） */
  initialValues?: Partial<F>;
  /** 表格列定义（Ant Design Table 风格） */
  columns: import('antd/es/table').ColumnsType<T>;
  /** 查询函数 */
  searchFn: SearchFn<T, F>;
  /** 默认分页大小 */
  defaultPageSize?: number;
  /** 是否启用表格多选 */
  enableRowSelection?: boolean;
  /** SearchBar 右侧额外渲染（如新增、导出按钮） */
  searchBarExtra?: React.ReactNode;
  /** 多选时选中行变化回调 */
  onSelectionChange?: (selectedRows: T[]) => void;
  /** 查询表单值变化回调（节流/防抖由上层自行处理，需要时） */
  onSearchValuesChange?: (values: F) => void;
}
