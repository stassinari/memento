import { Popover, Transition } from "@headlessui/react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ViewColumnsIcon,
} from "@heroicons/react/20/solid";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import dayjs from "dayjs";
import { countBy, maxBy, mean } from "lodash";
import { Fragment, useMemo, useState } from "react";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";
import { IconButton } from "~/components/IconButton";
import { ColumnVisibility } from "~/components/table/ColumnVisibility";
import { getBrews } from "~/db/queries";
import type { Brew } from "~/db/types";
import { useCurrentUser } from "~/hooks/useInitUser";
import { roundToDecimal } from "~/utils";

const brewsQueryOptions = (firebaseUid: string) =>
  queryOptions({
    queryKey: ["brews", firebaseUid],
    queryFn: () => getBrews({ data: { firebaseUid } }),
  });

export const Route = createFileRoute("/_auth/_layoutFull/drinks/brews/table")({
  component: BrewsTableWrapper,
});

type BrewForTable = Brew & {
  beansName: string | null;
  beansRoaster: string | null;
};

const columnHelper = createColumnHelper<BrewForTable>();

const columns = [
  columnHelper.accessor("method", {
    header: () => "Method",
  }),
  columnHelper.accessor("beansName", {
    header: "Beans name",
  }),
  columnHelper.accessor("beansRoaster", {
    header: "Beans roaster",
  }),
  columnHelper.accessor("date", {
    cell: (info) => dayjs(info.getValue()).format("DD MMM YYYY | H:m"),
    header: () => "Date",
  }),
  columnHelper.accessor("grinder", {
    header: () => "Grinder",
  }),
  columnHelper.accessor("grinderBurrs", {
    header: () => "Burrs",
  }),
  columnHelper.accessor("waterType", {
    header: "Water type",
  }),
  columnHelper.accessor("filterType", {
    header: "Filter type",
  }),
  columnHelper.accessor("waterWeight", {
    header: "Water weight",
  }),
  columnHelper.accessor("beansWeight", {
    header: "Beans weight",
  }),
  columnHelper.accessor("waterTemperature", {
    header: "Water temperature",
  }),
  columnHelper.accessor("grindSetting", {
    header: "Grind setting",
  }),
  columnHelper.accessor(
    (row) =>
      row.timeMinutes && row.timeSeconds
        ? `${row.timeMinutes}:${row.timeSeconds}`
        : "",
    {
      id: "time",
      header: "Time",
    },
  ),
  columnHelper.accessor("rating", {
    header: "Rating",
  }),
];

function BrewsTableWrapper() {
  const user = useCurrentUser();

  const { data: brewsList } = useSuspenseQuery(
    brewsQueryOptions(user?.uid ?? ""),
  );

  const data: BrewForTable[] = useMemo(
    () =>
      (brewsList ?? []).map((item) => ({
        ...item.brews,
        beansName: item.beans?.name ?? null,
        beansRoaster: item.beans?.roaster ?? null,
      })),
    [brewsList],
  );

  if (data.length === 0) return null;
  return <BrewsTable data={data} />;
}

const BrewsTable = ({ data }: { data: BrewForTable[] }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnVisibility },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const totalStats: Stat[] = useMemo(() => {
    const totalNumberOfBrews = {
      name: "Total number of brews",
      stat: data.length.toString(),
    };

    const averageRating = {
      name: "Average (mean) rating",
      stat: roundToDecimal(
        mean(data.filter((b) => b.rating && b.rating > 0).map((b) => b.rating)),
        2,
      ).toString(),
      statSmall: "/ 10",
    };

    const methodOccurrences = countBy(data.map((b) => b.method));
    const mostUsedMethod =
      maxBy(Object.keys(methodOccurrences), (o) => methodOccurrences[o]) ?? "";
    const correspondingNumber = methodOccurrences[mostUsedMethod];

    const mostUsedMethodStat = {
      name: "Most used method",
      stat: mostUsedMethod,
      statSmall: `(${correspondingNumber} times)`,
    };

    return [totalNumberOfBrews, averageRating, mostUsedMethodStat];
  }, [data]);

  return (
    <div className="relative">
      <BreadcrumbsWithHome
        items={[navLinks.drinks, navLinks.brews, { label: "Table" }]}
      />

      <Stats title="Brew stats" stats={totalStats} />

      <Popover className="relative my-4 text-right">
        <IconButton variant="white">
          <Popover.Button>
            <ViewColumnsIcon />
          </Popover.Button>
        </IconButton>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <Popover.Panel className="absolute right-0 z-10 mt-2">
            <div className="p-4 text-sm leading-6 text-gray-900 bg-white shadow-lg shrink rounded-xl ring-1 ring-gray-900/5">
              <ColumnVisibility table={table} />
            </div>
          </Popover.Panel>
        </Transition>
      </Popover>

      <div className="flow-root mt-4">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow-sm ring-1 ring-black/5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <th
                            key={header.id}
                            scope="col"
                            className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900 first-of-type:pl-4 first-of-type:pr-3 sm:first-of-type:pl-6 last-of-type:pl-3 last-of-type:pr-4 sm:last-of-type:pr-6"
                          >
                            {header.isPlaceholder ? null : (
                              <div
                                className={clsx(
                                  "inline-flex",
                                  header.column.getCanSort()
                                    ? "group cursor-pointer select-none"
                                    : "group",
                                )}
                                {...{
                                  onClick:
                                    header.column.getToggleSortingHandler(),
                                }}
                              >
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                                <span className="flex-none ml-2 text-gray-900 bg-gray-200 rounded-sm group-hover:bg-gray-300">
                                  {header.column.getIsSorted() === "asc" ? (
                                    <ChevronUpIcon
                                      className="w-5 h-5"
                                      aria-hidden="true"
                                    />
                                  ) : header.column.getIsSorted() === "desc" ? (
                                    <ChevronDownIcon
                                      className="w-5 h-5"
                                      aria-hidden="true"
                                    />
                                  ) : null}
                                </span>
                              </div>
                            )}
                          </th>
                        );
                      })}
                    </tr>
                  ))}
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap first-of-type:pl-4 first-of-type:pr-3 sm:first-of-type:pl-6 last-of-type:pl-3 last-of-type:pr-4 sm:last-of-type:pr-6"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface Stat {
  name: string;
  stat: string;
  statSmall?: string;
}

interface StatProps {
  title: string;
  stats: Stat[];
}

const Stats = ({ title, stats }: StatProps) => {
  return (
    <div>
      <h3 className="text-base font-semibold leading-6 text-gray-900">
        {title}
      </h3>
      <dl className="grid grid-cols-1 gap-5 mt-2 sm:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.name}
            className="px-4 py-5 overflow-hidden bg-white rounded-lg shadow-sm sm:p-6"
          >
            <dt className="text-sm font-medium text-gray-500 truncate">
              {item.name}
            </dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
              {item.stat}
              {item.statSmall && (
                <span className="pl-1 text-xl ">{item.statSmall}</span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};
