import type { ColumnsType } from 'antd/es/table';

type TableColumn<T extends object> = ColumnsType<T>[number];

const DEFAULT_COLUMN_MIN_WIDTH = 120;
const DEFAULT_ACTION_COLUMN_WIDTH = 180;

function isActionColumn<T extends object>(column: TableColumn<T>) {
  const title =
    typeof column?.title === 'string' ? column.title.trim() : undefined;
  const key =
    typeof column?.key === 'string' ? column.key : undefined;
  const dataIndex =
    'dataIndex' in column && typeof column.dataIndex === 'string'
      ? column.dataIndex
      : undefined;

  return title === '操作' || key === 'action' || dataIndex === 'action';
}

export function normalizeSearchTableColumns<T extends object>(
  columns: ColumnsType<T>,
): ColumnsType<T> {
  return columns.map((column) => {
    const nextColumn = { ...column } as TableColumn<T> & {
      minWidth?: number;
      width?: number;
      fixed?: 'left' | 'right';
      children?: ColumnsType<T>;
    };

    if (nextColumn.children?.length) {
      nextColumn.children = normalizeSearchTableColumns(nextColumn.children);
      return nextColumn;
    }

    if (isActionColumn(nextColumn)) {
      nextColumn.width = nextColumn.width ?? DEFAULT_ACTION_COLUMN_WIDTH;
      nextColumn.minWidth = nextColumn.minWidth ?? nextColumn.width;
      nextColumn.fixed = nextColumn.fixed ?? 'right';
      return nextColumn;
    }

    nextColumn.minWidth =
      nextColumn.minWidth ?? nextColumn.width ?? DEFAULT_COLUMN_MIN_WIDTH;

    return nextColumn;
  });
}
