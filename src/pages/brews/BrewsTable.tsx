import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";
import {
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import dayjs from "dayjs";
import { orderBy } from "firebase/firestore";
import { countBy, maxBy, mean } from "lodash";
import { useMemo, useState } from "react";
import tw from "twin.macro";
import { useCollectionQuery } from "../../hooks/firestore/useCollectionQuery";
import { useFirestoreCollectionOneTime } from "../../hooks/firestore/useFirestoreCollectionOneTime";
import { Beans } from "../../types/beans";
import { Brew } from "../../types/brew";
import { roundToDecimal } from "../../utils";

type BrewFlatForTable = Omit<Brew, "beans"> & { beans?: Beans };

const columnHelper = createColumnHelper<BrewFlatForTable>();

const columns = [
  columnHelper.accessor("method", {
    header: () => "Method",
  }),
  columnHelper.accessor((row) => (row.beans ? row.beans.name : ""), {
    id: "beansName",
    header: "Beans name",
  }),
  columnHelper.accessor((row) => (row.beans ? row.beans.roaster : ""), {
    id: "beansRoaster",
    header: "Beans roaster",
  }),
  columnHelper.accessor((row) => row.date, {
    id: "date",
    cell: (info) => dayjs(info.getValue().toDate()).format("DD MMM YYYY | H:m"),
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
    }
  ),
  columnHelper.accessor("rating", {
    header: "Rating",
  }),
];

export const BrewsTableWrapper = () => {
  console.log("BrewTableWrapper");

  const filters = useMemo(() => [orderBy("date", "desc")], []);
  const query = useCollectionQuery<Brew>("brews", filters);
  const { list: brewsList, isLoading } =
    useFirestoreCollectionOneTime<Brew>(query);

  const beansFilters = useMemo(() => [orderBy("roastDate", "desc")], []);
  const beansQuery = useCollectionQuery<Beans>("beans", beansFilters);
  const { list: beansList, isLoading: areBeansLoading } =
    useFirestoreCollectionOneTime<Beans>(beansQuery);

  if (isLoading || areBeansLoading || brewsList.length === 0) return null;

  return <BrewsTable brewsList={brewsList} beansList={beansList} />;
};

interface BrewsTableProps {
  brewsList: Brew[];
  beansList: Beans[];
}

const BrewsTable: React.FC<BrewsTableProps> = ({ brewsList, beansList }) => {
  console.log("BrewsTable");

  const [sorting, setSorting] = useState<SortingState>([]);

  const data = useMemo(
    () =>
      brewsList.map((brew) => ({
        ...brew,
        beans: beansList.find(
          (bean) => `beans/${bean.id ?? ""}` === brew.beans.path
        ),
      })),
    [beansList, brewsList]
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const totalStats: Stat[] = useMemo(() => {
    const totalNumberOfBrews = {
      name: "Total number of brews",
      stat: brewsList.length.toString(),
    };

    const averageRating = {
      name: "Average (mean) rating",
      stat: roundToDecimal(
        mean(
          brewsList.filter((b) => b.rating && b.rating > 0).map((b) => b.rating)
        ),
        2
      ).toString(),
      statSmall: "/ 10",
    };

    const methodOccurrences = countBy(brewsList.map((b) => b.method));
    const mostUsedMethod =
      maxBy(Object.keys(methodOccurrences), (o) => methodOccurrences[o]) ?? "";
    const correspondingNumber = methodOccurrences[mostUsedMethod];

    const mostUsedMethodStat = {
      name: "Most used method",
      stat: mostUsedMethod,
      statSmall: `(${correspondingNumber} times)`,
    };

    return [totalNumberOfBrews, averageRating, mostUsedMethodStat];
  }, [brewsList]);

  return (
    <div>
      <Stats title="Brew stats" stats={totalStats} />
      <div tw="flow-root mt-8">
        <div tw="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div tw="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div tw="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table tw="min-w-full divide-y divide-gray-300">
                <thead tw="bg-gray-50">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <th
                            key={header.id}
                            scope="col"
                            tw="py-3.5 px-3 text-left text-sm font-semibold text-gray-900 first-of-type:(pl-4 pr-3 sm:pl-6) last-of-type:(pl-3 pr-4 sm:pr-6)"
                          >
                            {header.isPlaceholder ? null : (
                              <div
                                css={tw`inline-flex`}
                                {...{
                                  className: header.column.getCanSort()
                                    ? "group cursor-pointer select-none"
                                    : "group",
                                  onClick:
                                    header.column.getToggleSortingHandler(),
                                }}
                              >
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                                <span tw="flex-none ml-2 text-gray-900 bg-gray-200 rounded group-hover:bg-gray-300">
                                  {header.column.getIsSorted() === "asc" ? (
                                    <ChevronUpIcon
                                      tw="w-5 h-5"
                                      aria-hidden="true"
                                    />
                                  ) : header.column.getIsSorted() === "desc" ? (
                                    <ChevronDownIcon
                                      tw="w-5 h-5"
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
                <tbody tw="bg-white divide-y divide-gray-200">
                  {table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          tw="px-3 py-4 text-sm text-gray-500 whitespace-nowrap first-of-type:(pl-4 pr-3 sm:pl-6) last-of-type:(pl-3 pr-4 sm:pr-6)"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
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

const Stats: React.FC<StatProps> = ({ title, stats }) => {
  return (
    <div>
      <h3 tw="text-base font-semibold leading-6 text-gray-900">{title}</h3>
      <dl tw="grid grid-cols-1 gap-5 mt-5 sm:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.name}
            tw="px-4 py-5 overflow-hidden bg-white rounded-lg shadow sm:p-6"
          >
            <dt tw="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
            <dd tw="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
              {item.stat}
              {item.statSmall && (
                <span tw="pl-1 text-xl ">{item.statSmall}</span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};
