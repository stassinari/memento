import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { Link, LinkProps } from "@tanstack/react-router";
import { Header, RowData, SortingState, Table, flexRender } from "@tanstack/react-table";
import clsx from "clsx";
import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";
import { ReactNode, useState } from "react";
import { Card } from "~/components/Card";
import { isReorderable, lockXAxis, reorderColumn } from "./reorder";

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
    /** Pin to the front and exclude from drag-reordering (e.g. the name column,
     *  which carries the row's stretched link in the first cell). */
    lockPosition?: boolean;
  }
}

interface DataTableProps<TData> {
  /** A TanStack table instance the parent owns (sorting, visibility, order, the
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
  // eslint-disable-next-line no-unused-vars
  rowLink?: (row: TData) => LinkProps;
  /** Accessible label for the row link (it has no visible text of its own). */
  // eslint-disable-next-line no-unused-vars
  rowLinkLabel?: (row: TData) => string;
  /** Enable drag-to-reorder columns via header grips (writes the table's
   *  `columnOrder`; the parent persists it). */
  enableColumnReorder?: boolean;
}

/**
 * Generic, presentational data table: a card-wrapped, horizontally-scrollable
 * table with uppercase, click-to-sort headers and optional drag-to-reorder
 * columns. Visuals follow the Beans-list mock (dense uppercase headers, orange
 * active-sort) merged with Tailwind Plus table conventions. All state lives on
 * the passed-in `table` instance.
 */
export function DataTable<TData>({
  table,
  footer,
  emptyState,
  rowLink,
  rowLinkLabel,
  enableColumnReorder = false,
}: DataTableProps<TData>) {
  // TanStack Table's instance is mutable and referentially stable, so the React
  // Compiler would memoize this component and miss state changes read via the
  // table (sorting, row model). Opt out so it re-runs on every render.
  "use no memo";

  // Pointer only — the whole header is the drag activator (tap to sort,
  // press-and-drag past 6px to reorder). A KeyboardSensor would bind Enter/Space
  // to "pick up", colliding with Enter-to-sort, so keyboard reorder lives in the
  // column picker instead (which keeps explicit grips).
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  // Google-Sheets-style drag: nothing in the table moves. The dragged column
  // dims in place, a ghost (DragOverlay) follows the cursor, and a blue
  // insertion line marks where it'll land.
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  const rows = table.getRowModel().rows;
  const visibleColumns = table.getVisibleLeafColumns();
  const columnCount = visibleColumns.length;
  const sortingState = table.getState().sorting;
  const multiSort = sortingState.length > 1;

  // Reorderable header ids in display order — the SortableContext item set.
  const reorderItems = enableColumnReorder
    ? visibleColumns.filter((c) => isReorderable(table, c.id)).map((c) => c.id)
    : [];

  const visibleIds = visibleColumns.map((c) => c.id);
  const activeIndex = activeId ? visibleIds.indexOf(activeId) : -1;
  // Which edge of the hovered column gets the insertion line: dragging rightward
  // lands after the target (right edge), leftward lands before it (left edge).
  const indicatorFor = (id: string): "left" | "right" | null => {
    if (!activeId || !overId || activeId === overId || id !== overId) return null;
    return activeIndex < visibleIds.indexOf(overId) ? "right" : "left";
  };
  const activeLabel = activeId
    ? (table.getColumn(activeId)?.columnDef.meta?.label ?? activeId)
    : null;

  const onDragStart = ({ active }: DragStartEvent) => setActiveId(String(active.id));
  const onDragOver = ({ over }: DragOverEvent) => setOverId(over ? String(over.id) : null);
  const resetDrag = () => {
    setActiveId(null);
    setOverId(null);
  };
  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over.id) {
      reorderColumn(table, String(active.id), String(over.id));
    }
    resetDrag();
  };

  return (
    <Card.Container variant="elevated" className="overflow-hidden">
      <div className="overflow-x-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[lockXAxis]}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
          onDragCancel={resetDrag}
        >
          <table className="min-w-full border-separate border-spacing-0 text-sm">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  <SortableContext items={reorderItems} strategy={horizontalListSortingStrategy}>
                    {headerGroup.headers.map((header) => (
                      <HeaderCell
                        key={header.id}
                        header={header}
                        sortingState={sortingState}
                        multiSort={multiSort}
                        enableReorder={enableColumnReorder}
                        dragging={activeId === header.column.id}
                        indicator={indicatorFor(header.column.id)}
                      />
                    ))}
                  </SortableContext>
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
                      const indicator = indicatorFor(cell.column.id);
                      return (
                        <td
                          key={cell.id}
                          className={clsx(
                            "relative whitespace-nowrap border-b border-gray-100 px-3 py-2.5 align-middle text-gray-600 first:pl-4 last:pr-4 dark:border-white/10 dark:text-gray-300",
                            align === "right" && "text-right",
                            activeId === cell.column.id && "opacity-40",
                          )}
                        >
                          {/* Stretched link in the first cell covers the whole row
                              (the <tr> is the positioned ancestor) — a real anchor,
                              so cmd/middle-click and "open in new tab" all work. */}
                          {i === 0 && rowLink && (
                            <Link {...rowLink(row.original)} className="absolute inset-0">
                              <span className="sr-only">
                                {rowLinkLabel?.(row.original) ?? "Open"}
                              </span>
                            </Link>
                          )}
                          {indicator && <DropLine side={indicator} />}
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* The ghost that tracks the cursor (locked to the header row by the
              x-axis modifier), styled like a floating header chip. */}
          <DragOverlay dropAnimation={null} modifiers={[lockXAxis]}>
            {activeLabel ? (
              <div className="inline-flex cursor-grabbing items-center rounded-md bg-white px-3 py-2 text-[10.5px] font-bold uppercase tracking-wide text-gray-600 shadow-lg ring-1 ring-black/10 dark:bg-gray-800 dark:text-gray-200 dark:ring-white/10">
                {activeLabel}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
      {footer && (
        <div className="flex items-center justify-between border-t border-gray-100 px-4 py-2.5 text-xs text-gray-500 dark:border-white/10 dark:text-gray-400">
          {footer}
        </div>
      )}
    </Card.Container>
  );
}

interface HeaderCellProps<TData> {
  header: Header<TData, unknown>;
  sortingState: SortingState;
  multiSort: boolean;
  enableReorder: boolean;
  /** This column is the one being dragged (dim it in place). */
  dragging: boolean;
  /** Show the drop insertion line on this edge of the column. */
  indicator: "left" | "right" | null;
}

function HeaderCell<TData>({
  header,
  sortingState,
  multiSort,
  enableReorder,
  dragging,
  indicator,
}: HeaderCellProps<TData>) {
  "use no memo";

  const column = header.column;
  const reorderable = enableReorder && !column.columnDef.meta?.lockPosition;
  // Hit-testing only — we deliberately ignore `transform`/`transition` so the
  // header never shifts during a drag (the ghost moves instead).
  const { listeners, setNodeRef, setActivatorNodeRef } = useSortable({
    id: column.id,
    disabled: !reorderable,
  });

  const canSort = column.getCanSort();
  const sortIndex = sortingState.findIndex((s) => s.id === column.id);
  const sortEntry = sortIndex === -1 ? undefined : sortingState[sortIndex];
  const sorted: "asc" | "desc" | false = sortEntry ? (sortEntry.desc ? "desc" : "asc") : false;
  const align = column.columnDef.meta?.align;

  return (
    <th
      ref={setNodeRef}
      scope="col"
      className={clsx(
        "relative whitespace-nowrap border-b border-gray-100 bg-gray-50/70 px-3 py-2.5 text-[10.5px] font-bold uppercase tracking-wide first:pl-4 last:pr-4 dark:border-white/10 dark:bg-white/5",
        align === "right" ? "text-right" : "text-left",
        sorted ? "text-orange-600 dark:text-orange-400" : "text-gray-400",
        dragging && "opacity-40",
      )}
    >
      {indicator && <DropLine side={indicator} />}
      {header.isPlaceholder ? null : (
        // One target: tap sorts, press-and-drag reorders (pointer sensor's 6px
        // activation distance disambiguates). The button is the drag activator.
        <button
          ref={reorderable ? setActivatorNodeRef : undefined}
          type="button"
          disabled={!canSort}
          onClick={header.column.getToggleSortingHandler()}
          className={clsx(
            "group flex w-full items-center gap-1 uppercase",
            align === "right" && "flex-row-reverse",
            reorderable && "touch-none",
            canSort
              ? "cursor-pointer select-none hover:text-gray-600 dark:hover:text-gray-300"
              : "cursor-default",
          )}
          {...(reorderable ? listeners : {})}
        >
          {flexRender(header.column.columnDef.header, header.getContext())}
          {canSort &&
            (sorted ? (
              <span className="inline-flex items-center gap-0.5">
                <SortIcon state={sorted} />
                {multiSort && (
                  <span className="text-[9px] font-bold tabular-nums">{sortIndex + 1}</span>
                )}
              </span>
            ) : (
              // Neutral hint only on hover/focus, so active sort columns are the
              // only persistent indicators.
              <ChevronsUpDown
                className="h-3.5 w-3.5 text-gray-300 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 dark:text-gray-600"
                aria-hidden="true"
              />
            ))}
        </button>
      )}
    </th>
  );
}

/** The thick blue insertion line marking where a dragged column will land,
 *  straddling the target column's leading or trailing edge. */
const DropLine = ({ side }: { side: "left" | "right" }) => (
  <span
    aria-hidden="true"
    className={clsx(
      "pointer-events-none absolute inset-y-0 z-20 w-0.5 -translate-x-1/2 rounded-full bg-blue-500 dark:bg-blue-400",
      side === "left" ? "left-0" : "left-full",
    )}
  />
);

const SortIcon = ({ state }: { state: "asc" | "desc" }) =>
  state === "asc" ? (
    <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
  ) : (
    <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
  );
