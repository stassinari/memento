import { Table } from "@tanstack/react-table";
import clsx from "clsx";

interface ColumnVisibilityProps {
  table: Table<any>;
}

const checkboxClass =
  "h-3.5 w-3.5 rounded-sm border-gray-300 text-orange-600 focus:ring-orange-500 disabled:opacity-60 dark:border-white/20 dark:bg-gray-900 dark:text-orange-400";
const rowClass = "flex items-center gap-2 py-1 text-sm";

/**
 * Column on/off list for a TanStack table. Labels come from each column's
 * `meta.label` (falling back to its id); columns with `enableHiding: false` are
 * shown locked-on (disabled), and "Reset" restores the table's initial set.
 * Reads live table state, so it opts out of the React Compiler (the table
 * instance is referentially stable — see DataTable).
 */
export const ColumnVisibility = ({ table }: ColumnVisibilityProps) => {
  "use no memo";

  // Only the columns shown in the picker — excludes auto-managed columns (e.g.
  // a Status column whose visibility is driven by filters), which would
  // otherwise make the built-in "all visible" check never settle.
  const pickerColumns = table
    .getAllLeafColumns()
    .filter((column) => !column.columnDef.meta?.hideFromPicker);
  const toggleable = pickerColumns.filter((column) => column.getCanHide());
  const allSelected = toggleable.every((column) => column.getIsVisible());

  const setAll = () => {
    const next: Record<string, boolean> = {};
    toggleable.forEach((column) => {
      next[column.id] = !allSelected;
    });
    table.setColumnVisibility((old) => ({ ...old, ...next }));
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
          onClick={() => table.resetColumnVisibility()}
          className="text-xs font-semibold text-orange-600 hover:text-orange-500 dark:text-orange-400"
        >
          Reset
        </button>
      </div>

      <div className="my-1.5 border-t border-gray-100 dark:border-white/10" />

      {pickerColumns.map((column) => {
        const label = column.columnDef.meta?.label ?? column.id;
        const locked = !column.getCanHide();
        return (
          <label
            key={column.id}
            className={clsx(
              rowClass,
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
            {label}
          </label>
        );
      })}
    </div>
  );
};
