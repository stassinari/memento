import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import {
  SortingState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useAtom } from "jotai";
import { Columns3, ListFilter, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge, BadgeTimesIcon } from "~/components/Badge";
import { Button } from "~/components/Button";
import { Drawer } from "~/components/Drawer";
import { ColumnVisibility } from "~/components/table/ColumnVisibility";
import { DataTable } from "~/components/table/DataTable";
import { BeansListItem } from "~/db/types";
import useScreenMediaQuery from "~/hooks/useScreenMediaQuery";
import {
  beansHistoryColumnOrderAtom,
  beansHistoryColumnSizingAtom,
  beansHistoryColumnVisibilityAtom,
} from "./atoms";
import { BeansHistoryCards } from "./BeansHistoryCards";
import { BeansHistoryFilters } from "./BeansHistoryFilters";
import { BeansHistorySort } from "./BeansHistorySort";
import { BeansHistorySummary } from "./BeansHistorySummary";
import { beansHistoryColumns, beansHistoryDefaultVisibility } from "./columns";
import {
  applyFacets,
  countActiveFilters,
  defaultBeansFilters,
  deriveFacetOptions,
  deriveStatusCounts,
  filterByStatus,
  getActiveFilterChips,
  matchesSearch,
  type BeansFilters,
} from "./filters";
import { matchSortPreset } from "./sortPresets";
import { deriveBeansSummary } from "./summary";

interface BeansHistoryTableProps {
  beans: BeansListItem[];
}

/**
 * The History surface: a dense, sortable table over the cellar. Status defaults
 * to the archived view; folding Open/Frozen back in reveals the Status column.
 * Search + facets pre-filter rows client-side; sorting is client-side; column
 * visibility persists per-user.
 */
export const BeansHistoryTable = ({ beans }: BeansHistoryTableProps) => {
  // Opt out of the React Compiler: this component holds the mutable TanStack
  // table instance, whose referential stability would otherwise let the
  // compiler skip state-driven re-renders (sorting indicators going stale).
  "use no memo";

  const [sorting, setSorting] = useState<SortingState>([
    { id: "archived", desc: true },
    { id: "roastDate", desc: true },
  ]);
  const [columnVisibility, setColumnVisibility] = useAtom(beansHistoryColumnVisibilityAtom);
  const [columnOrder, setColumnOrder] = useAtom(beansHistoryColumnOrderAtom);
  const [columnSizing, setColumnSizing] = useAtom(beansHistoryColumnSizingAtom);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<BeansFilters>(defaultBeansFilters);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const statusCounts = useMemo(() => deriveStatusCounts(beans), [beans]);
  const scoped = useMemo(() => filterByStatus(beans, filters.statuses), [beans, filters.statuses]);
  const options = useMemo(() => deriveFacetOptions(scoped), [scoped]);
  const rows = useMemo(
    () => applyFacets(scoped, filters).filter((bean) => matchesSearch(bean, search)),
    [scoped, filters, search],
  );

  const summary = useMemo(
    () => deriveBeansSummary(rows, filters.statuses),
    [rows, filters.statuses],
  );

  const activeCount = countActiveFilters(filters);
  const activeChips = getActiveFilterChips(filters);
  // Status column shows only when the result set spans more than one status.
  const showStatusColumn = filters.statuses.length > 1;

  const table = useReactTable({
    data: rows,
    columns: beansHistoryColumns,
    state: {
      sorting,
      columnVisibility: { ...columnVisibility, status: showStatusColumn },
      columnOrder,
      columnSizing,
    },
    // Seeds "Reset to default" in the column picker (resetColumnVisibility /
    // resetColumnOrder / resetColumnSizing restore these).
    initialState: {
      columnVisibility: beansHistoryDefaultVisibility,
      columnOrder: [],
      columnSizing: {},
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    onColumnSizingChange: setColumnSizing,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // Desktop gets the table; mobile gets a card list. Conditional render (not a
  // CSS hide) avoids mounting the table off-screen — its width-measurement reads
  // 0 on a `display:none` table, and it'd double the DOM.
  const isDesktop = useScreenMediaQuery("sm");
  const sortedBeans = table.getRowModel().rows.map((r) => r.original);
  const sortLabel = matchSortPreset(sorting)?.label ?? "Custom";

  return (
    <div>
      <BeansHistorySummary summary={summary} />

      {/* Toolbar: Search · Filters · Columns (mobile stacks; sort folds into the
          filter button, and the Columns picker is desktop-only). */}
      <div className="mb-3 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative w-full sm:min-w-50 sm:flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search (name or roaster)"
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pr-3 pl-9 text-sm placeholder-gray-400 focus:border-blue-400 focus:outline-hidden dark:border-white/10 dark:bg-gray-900 dark:placeholder-gray-500"
          />
        </div>

        <Button
          variant={activeCount > 0 ? "secondary" : "white"}
          colour="main"
          size="sm"
          className="w-full sm:w-auto"
          onClick={() => setFiltersOpen(true)}
        >
          <ListFilter />
          <span className="sm:hidden">Sort &amp; filter</span>
          <span className="hidden sm:inline">Filters</span>
          {activeCount > 0 && (
            <span className="rounded-full bg-orange-200/80 px-1.5 py-0.5 text-[10px] font-bold text-orange-800 dark:bg-orange-500/30 dark:text-orange-100">
              {activeCount}
            </span>
          )}
        </Button>

        <Popover className="relative hidden sm:block">
          <PopoverButton as={Button} variant="white" size="sm">
            <Columns3 />
            Columns
          </PopoverButton>
          <PopoverPanel
            anchor="bottom end"
            portal
            transition
            className="z-30 w-56 rounded-lg bg-white p-3 shadow-lg outline-1 outline-black/5 transition [--anchor-gap:0.5rem] data-closed:scale-95 data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in dark:bg-gray-900 dark:outline-white/10"
          >
            <ColumnVisibility table={table} />
          </PopoverPanel>
        </Popover>
      </div>

      {/* Active filter chips + showing count */}
      <div className="mb-2.5 flex flex-wrap items-center gap-2 text-xs">
        {/* Desktop: removable filter chips. On mobile filters are managed in the
            sheet, so we show a compact "Sorted by …" line instead. */}
        <div className="hidden flex-wrap items-center gap-2 sm:flex">
          {activeChips.length > 0 && (
            <>
              <span className="font-medium text-gray-400 dark:text-gray-500">Filtering:</span>
              {activeChips.map((chip) => (
                <Badge
                  key={chip.id}
                  label={chip.label}
                  colour="blue"
                  icon={{
                    Element: <BadgeTimesIcon className="h-full w-full" />,
                    position: "right",
                    onClick: () => setFilters(chip.remove(filters)),
                    label: `Remove ${chip.label}`,
                  }}
                />
              ))}
              <button
                type="button"
                onClick={() => setFilters(defaultBeansFilters)}
                className="font-medium text-gray-400 underline underline-offset-2 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              >
                clear all
              </button>
            </>
          )}
        </div>
        <span className="text-gray-400 sm:hidden dark:text-gray-500">
          Sorted by <b className="text-gray-600 dark:text-gray-300">{sortLabel}</b>
        </span>
        <span className="ml-auto text-gray-400 dark:text-gray-500">
          Showing <b className="text-gray-600 dark:text-gray-300">{rows.length}</b> of{" "}
          {scoped.length}
        </span>
      </div>

      {isDesktop ? (
        <DataTable
          table={table}
          enableColumnReorder
          enableColumnResize
          rowLink={(bean) => ({ to: "/beans/$beansId", params: { beansId: bean.id } })}
          rowLinkLabel={(bean) => `View ${bean.name}`}
          footer={<span>{rows.length} results</span>}
          emptyState={
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              No beans match these filters.
            </p>
          }
        />
      ) : (
        <BeansHistoryCards beans={sortedBeans} />
      )}

      <Drawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title={isDesktop ? "Filters" : "Sort & filter"}
        headerAction={
          activeCount > 0 ? (
            <button
              type="button"
              onClick={() => setFilters(defaultBeansFilters)}
              className="text-xs font-semibold text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
              Clear all
            </button>
          ) : undefined
        }
        footer={
          <Button
            variant="primary"
            colour="accent"
            width="full"
            onClick={() => setFiltersOpen(false)}
          >
            Show {rows.length} results
          </Button>
        }
      >
        {/* No column headers on mobile, so sorting lives in the sheet. */}
        {!isDesktop && (
          <div className="mb-5">
            <BeansHistorySort sorting={sorting} setSorting={setSorting} />
          </div>
        )}
        <BeansHistoryFilters
          filters={filters}
          setFilters={setFilters}
          statusCounts={statusCounts}
          options={options}
        />
      </Drawer>
    </div>
  );
};
