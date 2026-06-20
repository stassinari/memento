import { Link, LinkProps } from "@tanstack/react-router";
import { RowData, Table, flexRender } from "@tanstack/react-table";
import clsx from "clsx";
import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";
import { ReactNode } from "react";
import { Card } from "~/components/Card";

declare module "@tanstack/react-table" {
  // Per-column display hints read by DataTable (and the column picker). The type
  // params must match the augmented interface verbatim (TS2428) even though
  // they're unused here, so the lint rule is disabled for this line.
  // eslint-disable-next-line no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    /** Cell + header alignment. Default left. */
    align?: "left" | "right";
    /** Human label for the column picker (falls back to the column id). */
    label?: string;
    /** Omit from the column picker (visibility is controlled elsewhere). */
    hideFromPicker?: boolean;
  }
}

interface DataTableProps<TData> {
  /** A TanStack table instance the parent owns (sorting, visibility, the
   *  already-filtered data). This component is purely presentational so it can
   *  back any table — beans history today, brews/espresso/tastings later. */
  table: Table<TData>;
  /** Footer content (e.g. "42 results"); omit for none. */
  footer?: ReactNode;
  /** Shown in place of the body when there are no rows. */
  emptyState?: ReactNode;
  /** When set, each row becomes a real link: a stretched `<Link>` covers the
   *  row, so it's a proper anchor (cmd/middle-click, "open in new tab", context
   *  menu) and natively keyboard-focusable — not a JS onClick. */
  rowLink?: (row: TData) => LinkProps;
  /** Accessible label for the row link (it has no visible text of its own). */
  rowLinkLabel?: (row: TData) => string;
}

/**
 * Generic, presentational data table: a card-wrapped, horizontally-scrollable
 * table with uppercase, click-to-sort headers. Visuals follow the Beans-list
 * mock (dense uppercase headers, orange active-sort) merged with Tailwind Plus
 * table conventions. All state lives on the passed-in `table` instance.
 */
export function DataTable<TData>({
  table,
  footer,
  emptyState,
  rowLink,
  rowLinkLabel,
}: DataTableProps<TData>) {
  // TanStack Table's instance is mutable and referentially stable, so the React
  // Compiler would memoize this component and miss state changes read via the
  // table (sorting, row model). Opt out so it re-runs on every render.
  "use no memo";

  const rows = table.getRowModel().rows;
  const columnCount = table.getVisibleLeafColumns().length;
  const sortingState = table.getState().sorting;
  const multiSort = sortingState.length > 1;

  return (
    <Card.Container variant="elevated" className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0 text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sortIndex = sortingState.findIndex((s) => s.id === header.column.id);
                  const sortEntry = sortIndex === -1 ? undefined : sortingState[sortIndex];
                  const sorted: "asc" | "desc" | false = sortEntry
                    ? sortEntry.desc
                      ? "desc"
                      : "asc"
                    : false;
                  const align = header.column.columnDef.meta?.align;
                  return (
                    <th
                      key={header.id}
                      scope="col"
                      className={clsx(
                        "whitespace-nowrap border-b border-gray-100 bg-gray-50/70 px-3 py-2.5 text-[10.5px] font-bold uppercase tracking-wide first:pl-4 last:pr-4 dark:border-white/10 dark:bg-white/5",
                        align === "right" ? "text-right" : "text-left",
                        sorted ? "text-orange-600 dark:text-orange-400" : "text-gray-400",
                      )}
                    >
                      {header.isPlaceholder ? null : (
                        <button
                          type="button"
                          disabled={!canSort}
                          onClick={header.column.getToggleSortingHandler()}
                          className={clsx(
                            "group flex w-full items-center gap-1 uppercase",
                            align === "right" && "flex-row-reverse",
                            canSort
                              ? "cursor-pointer select-none hover:text-gray-600 dark:hover:text-gray-300"
                              : "cursor-default",
                          )}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {canSort &&
                            (sorted ? (
                              <span className="inline-flex items-center gap-0.5">
                                <SortIcon state={sorted} />
                                {multiSort && (
                                  <span className="text-[9px] font-bold tabular-nums">
                                    {sortIndex + 1}
                                  </span>
                                )}
                              </span>
                            ) : (
                              // Neutral hint only on hover/focus, so active sort
                              // columns are the only persistent indicators.
                              <ChevronsUpDown
                                className="h-3.5 w-3.5 text-gray-300 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 dark:text-gray-600"
                                aria-hidden="true"
                              />
                            ))}
                        </button>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columnCount} className="px-4 py-10">
                  {emptyState}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row.id}
                  className={clsx(
                    "hover:bg-gray-50 dark:hover:bg-white/5",
                    rowLink &&
                      "relative has-[a:focus-visible]:outline-2 has-[a:focus-visible]:-outline-offset-2 has-[a:focus-visible]:outline-orange-500",
                  )}
                >
                  {row.getVisibleCells().map((cell, i) => {
                    const align = cell.column.columnDef.meta?.align;
                    return (
                      <td
                        key={cell.id}
                        className={clsx(
                          "whitespace-nowrap border-b border-gray-100 px-3 py-2.5 align-middle text-gray-600 first:pl-4 last:pr-4 dark:border-white/10 dark:text-gray-300",
                          align === "right" && "text-right",
                        )}
                      >
                        {/* Stretched link in the first cell covers the whole row
                            (the <tr> is the positioned ancestor) — a real anchor,
                            so cmd/middle-click and "open in new tab" all work. */}
                        {i === 0 && rowLink && (
                          <Link {...rowLink(row.original)} className="absolute inset-0">
                            <span className="sr-only">{rowLinkLabel?.(row.original) ?? "Open"}</span>
                          </Link>
                        )}
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {footer && (
        <div className="flex items-center justify-between border-t border-gray-100 px-4 py-2.5 text-xs text-gray-500 dark:border-white/10 dark:text-gray-400">
          {footer}
        </div>
      )}
    </Card.Container>
  );
}

const SortIcon = ({ state }: { state: "asc" | "desc" }) =>
  state === "asc" ? (
    <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
  ) : (
    <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
  );
