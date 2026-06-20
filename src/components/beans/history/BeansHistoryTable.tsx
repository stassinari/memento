import {
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { DataTable } from "~/components/table/DataTable";
import { BeansListItem } from "~/db/types";
import { beansHistoryColumns, beansHistoryDefaultVisibility } from "./columns";

interface BeansHistoryTableProps {
  beans: BeansListItem[];
}

/**
 * The History surface: a dense, sortable table over the cellar. Defaults to the
 * archived view (the status filter to fold Open/Frozen back in, search, facets
 * and summary stats land in later slices). Sorting/visibility are client-side.
 */
export const BeansHistoryTable = ({ beans }: BeansHistoryTableProps) => {
  // Opt out of the React Compiler: this component holds the mutable TanStack
  // table instance, whose referential stability would otherwise let the
  // compiler skip state-driven re-renders (sorting indicators going stale).
  "use no memo";

  // Default multi-sort: Archived primary, Roast date secondary (shift-click a
  // header to build your own multi-sort; a plain click replaces with a single).
  const [sorting, setSorting] = useState<SortingState>([
    { id: "archived", desc: true },
    { id: "roastDate", desc: true },
  ]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    beansHistoryDefaultVisibility,
  );

  const data = useMemo(() => beans.filter((bean) => bean.isArchived), [beans]);

  const table = useReactTable({
    data,
    columns: beansHistoryColumns,
    state: { sorting, columnVisibility },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <DataTable
      table={table}
      rowLink={(bean) => ({ to: "/beans/$beansId", params: { beansId: bean.id } })}
      rowLinkLabel={(bean) => `View ${bean.name}`}
      footer={<span>{data.length} results</span>}
      emptyState={<p className="text-center text-sm text-gray-500 dark:text-gray-400">No beans match.</p>}
    />
  );
};
