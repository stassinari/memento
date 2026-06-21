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
import { Header, Row, RowData, SortingState, Table, flexRender } from "@tanstack/react-table";
import clsx from "clsx";
import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";
import { PointerEvent as ReactPointerEvent, ReactNode, useEffect, useRef, useState } from "react";
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

const MIN_COLUMN_WIDTH = 64;

interface DataTableProps<TData> {
  /** A TanStack table instance the parent owns (sorting, visibility, order,
   *  sizing, the already-filtered data). This component is purely presentational
   *  so it can back any table — beans history today, brews/espresso later. */
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
  /** Enable drag-to-reorder columns via header drag (writes the table's
   *  `columnOrder`; the parent persists it). */
  enableColumnReorder?: boolean;
  /** Enable drag-to-resize columns via header edge handles (writes the table's
   *  `columnSizing`; the parent persists it). Columns are measured once and
   *  pinned to fixed widths so they can actually shrink. */
  enableColumnResize?: boolean;
}

/** Measured geometry for the reorder overlays, in the scroll container's content
 *  coordinates. Recomputed only when the dragged/hovered column changes, so the
 *  per-frame cursor tracking is left entirely to dnd-kit. */
interface DragGeometry {
  /** Full column height (static dim veil + insertion line). */
  height: number;
  /** Ghost height, capped to the viewport: the ghost moves every frame, and a
   *  full-table-tall layer (thousands of px) can exceed GPU texture limits and
   *  re-rasterize on each move. */
  ghostHeight: number;
  /** The dragged column's box (for the dim veil + ghost width). */
  source: { left: number; width: number };
  /** X of the insertion line, or null while hovering the source itself. */
  lineLeft: number | null;
}

/** In-flight resize, held in a ref so pointer-move math never re-renders. */
interface ResizeSession {
  colId: string;
  startX: number;
  startWidth: number;
  min: number;
  max: number;
  colLeft: number;
  height: number;
}

/**
 * Generic, presentational data table: a card-wrapped, horizontally-scrollable
 * table with uppercase, click-to-sort headers and optional drag-to-reorder /
 * drag-to-resize columns. Reorder & resize mimic Google Sheets — nothing in the
 * grid shifts mid-drag; only a ghost/line moves, and the change applies on drop.
 * All state lives on the passed-in `table` instance.
 */
export function DataTable<TData>({
  table,
  footer,
  emptyState,
  rowLink,
  rowLinkLabel,
  enableColumnReorder = false,
  enableColumnResize = false,
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

  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [geometry, setGeometry] = useState<DragGeometry | null>(null);

  const rows = table.getRowModel().rows;
  const visibleColumns = table.getVisibleLeafColumns();
  const columnCount = visibleColumns.length;
  const sortingState = table.getState().sorting;
  const multiSort = sortingState.length > 1;

  // --- column sizing -------------------------------------------------------
  // Natural (content) widths, measured once in auto-layout. They seed the fixed
  // widths (no visible jump) and serve as each column's max. Remeasured only
  // when the visible-column set changes.
  const [natural, setNatural] = useState<Record<string, number>>({});
  const measuredKeyRef = useRef("");
  const measureKey = enableColumnResize ? visibleColumns.map((c) => c.id).join("|") : "";
  const measured = enableColumnResize && measureKey !== "" && measuredKeyRef.current === measureKey;

  useEffect(() => {
    if (!enableColumnResize || measuredKeyRef.current === measureKey) return;
    const container = scrollRef.current;
    if (!container) return;
    const widths: Record<string, number> = {};
    table.getVisibleLeafColumns().forEach((c) => {
      const el = container.querySelector<HTMLElement>(`thead [data-col-id="${c.id}"]`);
      if (el) widths[c.id] = el.offsetWidth;
    });
    measuredKeyRef.current = measureKey;
    setNatural(widths);
  }, [enableColumnResize, measureKey, table]);

  const sizing = table.getState().columnSizing;
  const widthFor = (id: string) => sizing[id] ?? natural[id];
  // Size the table to the sum of its columns (not the container). With
  // `min-w-full` + `table-fixed`, the browser redistributes any slack back into
  // the columns, so a shrunk column would silently spring back — sizing to the
  // total lets it actually shrink (leaving a gap, Sheets-style).
  const totalWidth = measured
    ? visibleColumns.reduce((sum, c) => sum + (widthFor(c.id) ?? 0), 0)
    : undefined;

  const resizeRef = useRef<ResizeSession | null>(null);
  const [resizeLineX, setResizeLineX] = useState<number | null>(null);

  const onResizeStart = (colId: string, e: ReactPointerEvent) => {
    const container = scrollRef.current;
    if (!container) return;
    e.preventDefault();
    e.stopPropagation();
    const containerRect = container.getBoundingClientRect();
    const th = container.querySelector<HTMLElement>(`thead [data-col-id="${colId}"]`);
    if (!th) return;
    const rect = th.getBoundingClientRect();
    const colLeft = rect.left - containerRect.left + container.scrollLeft;
    const startWidth = widthFor(colId) ?? rect.width;
    resizeRef.current = {
      colId,
      startX: e.clientX,
      startWidth,
      min: MIN_COLUMN_WIDTH,
      max: natural[colId] ?? Infinity,
      colLeft,
      // Capped to the viewport — the line moves every pointer-move, so a
      // full-table-tall element would relayout needlessly.
      height: Math.min(container.scrollHeight, window.innerHeight),
    };
    setResizeLineX(colLeft + startWidth);
    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";

    const clampWidth = (s: ResizeSession, clientX: number) =>
      Math.max(s.min, Math.min(s.max, s.startWidth + (clientX - s.startX)));
    const move = (ev: PointerEvent) => {
      const s = resizeRef.current;
      if (s) setResizeLineX(s.colLeft + clampWidth(s, ev.clientX));
    };
    const end = (ev: PointerEvent) => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", end);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
      const s = resizeRef.current;
      resizeRef.current = null;
      setResizeLineX(null);
      if (s) table.setColumnSizing((old) => ({ ...old, [s.colId]: Math.round(clampWidth(s, ev.clientX)) }));
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", end);
  };

  // --- reorder -------------------------------------------------------------
  const reorderItems = enableColumnReorder
    ? visibleColumns.filter((c) => isReorderable(table, c.id)).map((c) => c.id)
    : [];

  const activeLabel = activeId
    ? (table.getColumn(activeId)?.columnDef.meta?.label ?? activeId)
    : null;

  // Measure once per dragged/hovered-column change. Tracking the cursor itself is
  // dnd-kit's job (a transform on the overlay), so this never runs per frame.
  useEffect(() => {
    const container = scrollRef.current;
    if (!activeId || !container) {
      setGeometry(null);
      return;
    }
    const containerRect = container.getBoundingClientRect();
    const colBox = (id: string) => {
      const el = container.querySelector<HTMLElement>(`thead [data-col-id="${id}"]`);
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      return { left: rect.left - containerRect.left + container.scrollLeft, width: el.offsetWidth };
    };

    const source = colBox(activeId);
    if (!source) {
      setGeometry(null);
      return;
    }

    let lineLeft: number | null = null;
    if (overId && overId !== activeId) {
      const over = colBox(overId);
      if (over) {
        const ids = table.getVisibleLeafColumns().map((c) => c.id);
        const after = ids.indexOf(activeId) < ids.indexOf(overId);
        lineLeft = after ? over.left + over.width : over.left;
      }
    }
    const height = container.scrollHeight;
    setGeometry({ height, ghostHeight: Math.min(height, window.innerHeight), source, lineLeft });
  }, [activeId, overId, table]);

  const resetDrag = () => {
    setActiveId(null);
    setOverId(null);
  };
  const onDragStart = ({ active }: DragStartEvent) => setActiveId(String(active.id));
  const onDragOver = ({ over }: DragOverEvent) => setOverId(over ? String(over.id) : null);
  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over.id) {
      reorderColumn(table, String(active.id), String(over.id));
    }
    resetDrag();
  };

  return (
    <Card.Container variant="elevated" className="overflow-hidden">
      <div ref={scrollRef} className="relative overflow-x-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[lockXAxis]}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
          onDragCancel={resetDrag}
        >
          <table
            className={clsx(
              "border-separate border-spacing-0 text-sm",
              measured ? "table-fixed" : "min-w-full",
            )}
            style={totalWidth ? { width: totalWidth } : undefined}
          >
            {measured && (
              <colgroup>
                {visibleColumns.map((c) => (
                  <col key={c.id} style={{ width: widthFor(c.id) }} />
                ))}
              </colgroup>
            )}
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
                        onResizeStart={measured ? onResizeStart : undefined}
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
                  <DataRow key={row.id} row={row} rowLink={rowLink} rowLinkLabel={rowLinkLabel} />
                ))
              )}
            </tbody>
          </table>

          {/* Reorder overlays, in the scroll container's content space so they
              line up with (and scroll with) the columns. Single elements — the
              body carries no drag state, so rows don't re-render mid-drag. */}
          {geometry && (
            <>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-0 z-10 bg-gray-900/5 dark:bg-white/10"
                style={{
                  left: geometry.source.left,
                  width: geometry.source.width,
                  height: geometry.height,
                }}
              />
              {geometry.lineLeft != null && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute top-0 z-20 w-0.5 -translate-x-1/2 rounded-full bg-blue-500 dark:bg-blue-400"
                  style={{ left: geometry.lineLeft, height: geometry.height }}
                />
              )}
            </>
          )}

          {/* Resize indicator: a full-height line that tracks the drag; the
              column itself only changes width on release. */}
          {resizeLineX != null && resizeRef.current && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-0 z-20 w-0.5 -translate-x-1/2 rounded-full bg-blue-500 dark:bg-blue-400"
              style={{ left: resizeLineX, height: resizeRef.current.height }}
            />
          )}

          {/* The ghost that tracks the cursor (locked to the header row by the
              x-axis modifier) — a translucent full-height column. */}
          <DragOverlay dropAnimation={null} modifiers={[lockXAxis]}>
            {activeLabel && geometry ? (
              <div
                className="overflow-hidden rounded-md bg-blue-500/5 shadow-2xl ring-1 ring-blue-500/40 dark:bg-blue-400/10"
                style={{ width: geometry.source.width, height: geometry.ghostHeight }}
              >
                <div className="border-b border-blue-500/20 bg-blue-500/15 px-3 py-2.5 text-[10.5px] font-bold uppercase tracking-wide text-blue-700 dark:text-blue-200">
                  {activeLabel}
                </div>
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

interface DataRowProps<TData> {
  row: Row<TData>;
  // eslint-disable-next-line no-unused-vars
  rowLink?: (row: TData) => LinkProps;
  // eslint-disable-next-line no-unused-vars
  rowLinkLabel?: (row: TData) => string;
}

/** A single body row. Deliberately drag-state-free so the React Compiler can
 *  memoize it — the body then skips re-rendering while a column is dragged or
 *  resized (the overlays live at the table level). */
function DataRow<TData>({ row, rowLink, rowLinkLabel }: DataRowProps<TData>) {
  return (
    <tr
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
              "overflow-hidden border-b border-r border-gray-100 px-3 py-2.5 align-middle whitespace-nowrap text-gray-600 first:pl-4 last:border-r-0 last:pr-4 dark:border-white/10 dark:text-gray-300",
              align === "right" && "text-right",
            )}
          >
            {/* Stretched link in the first cell covers the whole row (the <tr> is
                the positioned ancestor) — a real anchor, so cmd/middle-click and
                "open in new tab" all work. */}
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
  );
}

interface HeaderCellProps<TData> {
  header: Header<TData, unknown>;
  sortingState: SortingState;
  multiSort: boolean;
  enableReorder: boolean;
  // eslint-disable-next-line no-unused-vars
  onResizeStart?: (colId: string, e: ReactPointerEvent) => void;
}

function HeaderCell<TData>({
  header,
  sortingState,
  multiSort,
  enableReorder,
  onResizeStart,
}: HeaderCellProps<TData>) {
  "use no memo";

  const column = header.column;
  const reorderable = enableReorder && !column.columnDef.meta?.lockPosition;
  // Hit-testing + activator only — we deliberately ignore `transform`, so the
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
      data-col-id={column.id}
      className={clsx(
        "group relative overflow-hidden border-b border-r border-gray-100 bg-gray-50/70 px-3 py-2.5 text-[10.5px] font-bold uppercase tracking-wide first:pl-4 last:border-r-0 last:pr-4 dark:border-white/10 dark:bg-white/5",
        align === "right" ? "text-right" : "text-left",
        sorted ? "text-orange-600 dark:text-orange-400" : "text-gray-400",
      )}
    >
      {header.isPlaceholder ? null : (
        // One target: tap sorts, press-and-drag reorders (pointer sensor's 6px
        // activation distance disambiguates). The button is the drag activator.
        <button
          ref={reorderable ? setActivatorNodeRef : undefined}
          type="button"
          disabled={!canSort}
          onClick={header.column.getToggleSortingHandler()}
          className={clsx(
            "group/sort flex w-full items-center gap-1 uppercase",
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
                className="h-3.5 w-3.5 text-gray-300 opacity-0 transition-opacity group-hover/sort:opacity-100 group-focus-visible/sort:opacity-100 dark:text-gray-600"
                aria-hidden="true"
              />
            ))}
        </button>
      )}
      {onResizeStart && (
        // Resize grip on the trailing edge — appears on header hover.
        <span
          onPointerDown={(e) => onResizeStart(column.id, e)}
          aria-hidden="true"
          className="absolute inset-y-0 right-0 z-10 flex w-2 cursor-col-resize touch-none justify-center opacity-0 group-hover:opacity-100"
        >
          <span className="h-1/2 w-0.5 self-center rounded-full bg-gray-300 dark:bg-white/25" />
        </span>
      )}
    </th>
  );
}

const SortIcon = ({ state }: { state: "asc" | "desc" }) =>
  state === "asc" ? (
    <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
  ) : (
    <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
  );
