import { createColumnHelper } from "@tanstack/react-table";
import { ScoreChip } from "~/components/ScoreChip";
import { BeansListItem } from "~/db/types";
import { formatAge, getBeanStatus, getFreshness, getRoastLevelLabel } from "~/lib/beans";
import { roundToDecimal } from "~/utils";
import { CountryOptionFlag } from "../CountryOptionFlag";
import { fmtStorageDate } from "../profile/format";
import { RoastLevelMeter } from "../profile/RoastLevelMeter";
import { StatusPill } from "../profile/StatusPill";

const Dash = () => <span className="text-gray-300 dark:text-gray-600">—</span>;

const ch = createColumnHelper<BeansListItem>();

// Default-visible columns (Name · Roaster · Origin · Process · Roast · Archived ·
// Score) plus opt-in depth columns, hidden until enabled in the column picker.
// accessorFns return `undefined` (never null) for missing values so TanStack's
// `sortUndefined: "last"` keeps legacy/blank rows at the bottom of every sort.
export const beansHistoryColumns = [
  ch.accessor("name", {
    id: "name",
    header: "Name",
    cell: (info) => (
      <span className="font-medium text-gray-900 dark:text-gray-100">{info.getValue()}</span>
    ),
    meta: { label: "Name" },
  }),
  ch.accessor("roaster", {
    id: "roaster",
    header: "Roaster",
    cell: (info) => info.getValue() || <Dash />,
    meta: { label: "Roaster" },
  }),
  ch.accessor((row) => (row.origin === "blend" ? "Blend" : (row.country ?? undefined)), {
    id: "origin",
    header: "Origin",
    cell: ({ row }) => <OriginCell bean={row.original} />,
    sortUndefined: "last",
    meta: { label: "Origin" },
  }),
  ch.accessor((row) => row.process ?? undefined, {
    id: "process",
    header: "Process",
    cell: (info) => info.getValue() ?? <Dash />,
    sortUndefined: "last",
    meta: { label: "Process" },
  }),
  ch.accessor((row) => row.roastLevel ?? undefined, {
    id: "roast",
    header: "Roast",
    cell: ({ row }) => <RoastCell level={row.original.roastLevel} />,
    sortingFn: "basic",
    sortUndefined: "last",
    meta: { label: "Roast" },
  }),
  // Archived is the primary sort, Roast date the secondary (see the default
  // multi-sort in BeansHistoryTable): when two beans share an archive date — or
  // both lack one — roast date breaks the tie.
  //
  // sortUndefined is the numeric `-1`, NOT the string "last": TanStack's "last"
  // returns early when *both* values are undefined, which blocks the secondary
  // sort (all-legacy rows would ignore roast date). `-1` returns 0 for
  // both-undefined (so the next sort column runs) and still sinks blanks to the
  // bottom for a descending sort.
  ch.accessor((row) => row.archiveDate ?? undefined, {
    id: "archived",
    header: "Archived",
    cell: ({ row }) => <DateCell date={row.original.archiveDate} legacy />,
    sortingFn: "datetime",
    sortUndefined: -1,
    meta: { label: "Archived" },
  }),
  ch.accessor((row) => row.roastDate ?? undefined, {
    id: "roastDate",
    header: "Roast date",
    cell: ({ row }) => <DateCell date={row.original.roastDate} />,
    sortingFn: "datetime",
    sortUndefined: -1,
    meta: { label: "Roast date" },
  }),
  ch.accessor((row) => row.avgScore ?? undefined, {
    id: "score",
    header: "Score",
    cell: ({ row }) =>
      row.original.avgScore !== null ? (
        <ScoreChip>{roundToDecimal(row.original.avgScore, 1)}</ScoreChip>
      ) : (
        <Dash />
      ),
    sortingFn: "basic",
    sortUndefined: "last",
    meta: { label: "Score", align: "right" },
  }),

  // ---- opt-in depth columns (hidden by default) ----
  ch.accessor((row) => row.region ?? undefined, {
    id: "region",
    header: "Region",
    cell: (info) => info.getValue() ?? <Dash />,
    sortUndefined: "last",
    meta: { label: "Region" },
  }),
  ch.accessor((row) => (row.varietals.length ? row.varietals.join(", ") : undefined), {
    id: "varietals",
    header: "Varietals",
    cell: (info) => info.getValue() ?? <Dash />,
    sortUndefined: "last",
    meta: { label: "Varietals" },
  }),
  ch.accessor((row) => row.altitude ?? undefined, {
    id: "altitude",
    header: "Altitude",
    cell: (info) => {
      const v = info.getValue();
      return v != null ? `${v} m` : <Dash />;
    },
    sortingFn: "basic",
    sortUndefined: "last",
    meta: { label: "Altitude", align: "right" },
  }),
  ch.accessor((row) => row.farmer ?? undefined, {
    id: "farmer",
    header: "Farmer",
    cell: (info) => info.getValue() ?? <Dash />,
    sortUndefined: "last",
    meta: { label: "Farmer" },
  }),
  ch.accessor((row) => row.harvestDate ?? undefined, {
    id: "harvest",
    header: "Harvest",
    cell: ({ row }) => <DateCell date={row.original.harvestDate} />,
    sortingFn: "datetime",
    sortUndefined: "last",
    meta: { label: "Harvest" },
  }),
  ch.accessor((row) => getFreshness(row).effectiveDays ?? undefined, {
    id: "freshness",
    header: "Freshness",
    cell: ({ row }) => <FreshnessCell bean={row.original} />,
    sortingFn: "basic",
    sortUndefined: "last",
    meta: { label: "Freshness", align: "right" },
  }),
  ch.accessor((row) => getBeanStatus(row), {
    id: "status",
    header: "Status",
    cell: ({ row }) => <StatusPill status={getBeanStatus(row.original)} size="small" />,
    meta: { label: "Status" },
  }),
];

// The opt-in columns start hidden; the default set above stays on.
export const beansHistoryDefaultVisibility: Record<string, boolean> = {
  region: false,
  varietals: false,
  altitude: false,
  farmer: false,
  harvest: false,
  freshness: false,
  status: false,
};

const OriginCell = ({ bean }: { bean: BeansListItem }) => {
  if (bean.origin === "blend") return <span>Blend</span>;
  if (!bean.country) return <Dash />;
  return (
    <span className="flex items-center gap-1.5">
      <CountryOptionFlag country={bean.country} className="h-3.5 w-auto rounded-sm" />
      {bean.country}
    </span>
  );
};

const RoastCell = ({ level }: { level: number | null }) => {
  if (level === null) return <Dash />;
  return (
    <span title={getRoastLevelLabel(level) ?? undefined} className="inline-block w-24">
      <RoastLevelMeter level={level} showEdgeLabels={false} />
    </span>
  );
};

const DateCell = ({ date, legacy }: { date: Date | null; legacy?: boolean }) => {
  if (!date) {
    return legacy ? (
      <span className="text-gray-400 dark:text-gray-500">
        — <span className="text-[11px]">(legacy)</span>
      </span>
    ) : (
      <Dash />
    );
  }
  return <span>{fmtStorageDate(date)}</span>;
};

const FreshnessCell = ({ bean }: { bean: BeansListItem }) => {
  const { effectiveDays } = getFreshness(bean);
  if (effectiveDays === null) return <Dash />;
  const { value, unit } = formatAge(effectiveDays);
  return (
    <span className="tabular-nums">
      {value} {unit}
    </span>
  );
};
