import type { FormField } from '@/components/ConfigurableForm/types';

const SEARCHBAR_ACTIONS_NAME = '__searchbar_actions';

export function getDefaultSpan(columns: number) {
  const safeColumns = columns > 0 ? columns : 1;
  return Math.max(1, Math.floor(24 / safeColumns));
}

export function normalizeSpan(rawSpan: unknown, defaultSpan: number) {
  const span = typeof rawSpan === 'number' ? rawSpan : defaultSpan;
  return Math.min(24, Math.max(1, span));
}

export function computeEndRowSpan(fields: FormField[], defaultSpan: number) {
  let endRowSpan = 0;
  for (const field of fields) {
    if (field.hidden) continue;
    if (field.name === SEARCHBAR_ACTIONS_NAME) continue;

    const s = normalizeSpan(field.colProps?.span, defaultSpan);
    if (endRowSpan + s > 24) endRowSpan = 0;
    endRowSpan += s;
    if (endRowSpan === 24) endRowSpan = 0;
  }
  return endRowSpan;
}

/**
 * Greedy layout simulation.
 * - Iterates fields in order
 * - Places visible (non-hidden) fields into rows of 24-grid
 * - Stops when exceeding maxRows
 * - Optionally reserves at least 1 span for actions in the last row
 *
 * Hidden fields are always preserved in the returned array (they do not consume grid).
 */
export function greedyPickCollapsedFields(params: {
  fields: FormField[];
  defaultSpan: number;
  collapsedRows: number;
  reserveActionsInLastRow: boolean;
}) {
  const { fields, defaultSpan, collapsedRows, reserveActionsInLastRow } = params;
  const maxRows = Math.max(1, collapsedRows);

  const picked: FormField[] = [];
  let row = 1;
  let rowSpan = 0;
  let pickedVisibleCount = 0;

  for (const field of fields) {
    if (field.hidden) {
      picked.push(field);
      continue;
    }

    const s = normalizeSpan(field.colProps?.span, defaultSpan);
    if (rowSpan + s > 24) {
      row += 1;
      rowSpan = 0;
    }

    if (row > maxRows) break;

    if (reserveActionsInLastRow && row === maxRows && rowSpan + s >= 24) {
      break;
    }

    picked.push(field);
    pickedVisibleCount += 1;
    rowSpan += s;

    if (rowSpan === 24) {
      row += 1;
      rowSpan = 0;
    }
  }

  return {
    picked,
    endRowSpan: rowSpan,
    pickedVisibleCount,
  };
}
