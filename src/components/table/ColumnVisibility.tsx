import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Column, Table } from "@tanstack/react-table";
import clsx from "clsx";
import { DragHandleDots2Icon } from "~/components/icons/DragHandleDots2Icon";
import { isReorderable, lockYAxis, orderedLeafColumns, reorderColumn } from "./reorder";

interface ColumnVisibilityProps {
  table: Table<any>;
}

const checkboxClass =
  "h-3.5 w-3.5 rounded-sm border-gray-300 text-orange-600 focus:ring-orange-500 disabled:opacity-60 dark:border-white/20 dark:bg-gray-900 dark:text-orange-400";
const rowClass = "flex items-center gap-2 py-1 text-sm";

/**
 * Column on/off + reorder list for a TanStack table. Labels come from each
 * column's `meta.label` (falling back to its id); columns with
 * `enableHiding: false` are shown locked-on (disabled), `meta.lockPosition`
 * columns can't be dragged, and "Reset" restores the table's initial set and
 * order. Drag here and drag in the header share one `columnOrder`. Reads live
 * table state, so it opts out of the React Compiler (the table instance is
 * referentially stable — see DataTable).
 */
export const ColumnVisibility = ({ table }: ColumnVisibilityProps) => {
  "use no memo";

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  // Picker columns in the current (reordered) order — excludes auto-managed
  // columns (e.g. a Status column whose visibility is driven by filters), which
  // would otherwise make the built-in "all visible" check never settle.
  const pickerColumns = orderedLeafColumns(table).filter(
    (column) => !column.columnDef.meta?.hideFromPicker,
  );
  const toggleable = pickerColumns.filter((column) => column.getCanHide());
  const allSelected = toggleable.every((column) => column.getIsVisible());
  const reorderItems = pickerColumns
    .filter((column) => isReorderable(table, column.id))
    .map((column) => column.id);

  const setAll = () => {
    const next: Record<string, boolean> = {};
    toggleable.forEach((column) => {
      next[column.id] = !allSelected;
    });
    table.setColumnVisibility((old) => ({ ...old, ...next }));
  };

  const reset = () => {
    table.resetColumnVisibility();
    table.resetColumnOrder();
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over.id) {
      reorderColumn(table, String(active.id), String(over.id));
    }
  };

  return (
    <div className="text-left">
      <div className="flex items-center justify-between gap-3">
        <label className={clsx(rowClass, "font-medium text-gray-700 dark:text-gray-200")}>
          <input type="checkbox" className={checkboxClass} checked={allSelected} onChange={setAll} />
          Select all
        </label>
        <button
          type="button"
          onClick={reset}
          className="text-xs font-semibold text-orange-600 hover:text-orange-500 dark:text-orange-400"
        >
          Reset
        </button>
      </div>

      <div className="my-1.5 border-t border-gray-100 dark:border-white/10" />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[lockYAxis]}
        onDragEnd={onDragEnd}
      >
        <SortableContext items={reorderItems} strategy={verticalListSortingStrategy}>
          {pickerColumns.map((column) => (
            <ColumnRow key={column.id} column={column} reorderable={reorderItems.includes(column.id)} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

const ColumnRow = ({ column, reorderable }: { column: Column<any>; reorderable: boolean }) => {
  "use no memo";

  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } =
    useSortable({ id: column.id, disabled: !reorderable });
  const label = column.columnDef.meta?.label ?? column.id;
  const locked = !column.getCanHide();

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={clsx(
        "group flex items-center gap-1.5",
        isDragging && "relative z-10 rounded bg-gray-50 dark:bg-white/5",
      )}
    >
      <button
        ref={setActivatorNodeRef}
        type="button"
        disabled={!reorderable}
        aria-label={`Reorder ${label}`}
        className="shrink-0 cursor-grab touch-none rounded p-0.5 text-gray-400 transition-colors hover:text-gray-600 active:cursor-grabbing disabled:cursor-default disabled:opacity-0 dark:text-gray-500 dark:hover:text-gray-300"
        {...attributes}
        {...listeners}
      >
        <DragHandleDots2Icon className="h-3.5 w-3.5" />
      </button>
      <label
        className={clsx(
          rowClass,
          "min-w-0 flex-1",
          locked ? "text-gray-400 dark:text-gray-500" : "text-gray-700 dark:text-gray-300",
        )}
      >
        <input
          type="checkbox"
          className={checkboxClass}
          disabled={locked}
          checked={column.getIsVisible()}
          onChange={column.getToggleVisibilityHandler()}
        />
        <span className="truncate">{label}</span>
      </label>
    </div>
  );
};
