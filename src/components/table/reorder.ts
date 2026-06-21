import type { Modifier } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Table } from "@tanstack/react-table";

/** Axis locks (we don't depend on @dnd-kit/modifiers — a modifier is just a
 *  function). Keep header drags on X and picker drags on Y so columns can't be
 *  flung off-axis mid-drag. */
export const lockXAxis: Modifier = ({ transform }) => ({ ...transform, y: 0 });
export const lockYAxis: Modifier = ({ transform }) => ({ ...transform, x: 0 });

/**
 * Column-reorder helpers shared by the header drag (DataTable) and the column
 * picker drag (ColumnVisibility), so both write the same persisted
 * `columnOrder`. Columns flagged `meta.lockPosition` (e.g. the name column,
 * which carries the row's stretched link) are always forced back to the front.
 */

/** Full current order, falling back to the natural definition order when the
 *  table has no explicit order yet. Includes hidden columns so their relative
 *  position is preserved when toggled back on. */
// eslint-disable-next-line no-unused-vars
export const getColumnOrder = <T,>(table: Table<T>): string[] => {
  const order = table.getState().columnOrder;
  return order.length ? order : table.getAllLeafColumns().map((c) => c.id);
};

// eslint-disable-next-line no-unused-vars
const lockedIds = <T,>(table: Table<T>): string[] =>
  table
    .getAllLeafColumns()
    .filter((c) => c.columnDef.meta?.lockPosition)
    .map((c) => c.id);

// eslint-disable-next-line no-unused-vars
export const isReorderable = <T,>(table: Table<T>, id: string): boolean =>
  !table.getColumn(id)?.columnDef.meta?.lockPosition;

/** Leaf columns in the current order (hidden included). Used by the picker,
 *  whose `getAllLeafColumns()` would otherwise ignore the reorder. */
// eslint-disable-next-line no-unused-vars
export const orderedLeafColumns = <T,>(table: Table<T>) => {
  const order = getColumnOrder(table);
  return [...table.getAllLeafColumns()].sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
};

/** Move `activeId` into `overId`'s slot, then pin locked columns to the front.
 *  No-op when the ids are equal or unknown. */
// eslint-disable-next-line no-unused-vars
export const reorderColumn = <T,>(table: Table<T>, activeId: string, overId: string) => {
  if (activeId === overId) return;
  const order = getColumnOrder(table);
  const from = order.indexOf(activeId);
  const to = order.indexOf(overId);
  if (from === -1 || to === -1) return;
  const moved = arrayMove(order, from, to);
  const locked = lockedIds(table);
  table.setColumnOrder([...locked, ...moved.filter((id) => !locked.includes(id))]);
};
