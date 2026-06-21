import { createColumnHelper } from "@tanstack/react-table";
import { Badge } from "~/components/Badge";
import { BeansListItem } from "~/db/types";
import { formatAge, getBeanStatus, getFreshness, getRoastLevelLabel } from "~/lib/beans";
import { BeanScore } from "../BeanScore";
import { CountryOptionFlag } from "../CountryOptionFlag";
import { fmtStorageDate } from "../profile/format";
import { RoastLevelMeter } from "../profile/RoastLevelMeter";
import { StatusPill } from "../profile/StatusPill";

const Dash = () => <span className="text-gray-300 dark:text-gray-600">—</span>;

/** Renders a multi-value field (varietals, etc.) as small badges instead of a
 *  comma-separated string. Blank when empty. */
const Pills = ({ values }: { values: string[] }) => {
  if (values.length === 0) return <Dash />;
  return (
    <span className="inline-flex items-center gap-1">
      {values.map((value) => (
        <Badge key={value} label={value} colour="grey" size="small" />
      ))}
    </span>
  );
};

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
    enableHiding: false, // the name is the row's anchor — always shown (but movable)
    meta: { label: "Name" },
  }),
  ch.accessor("roaster", {
    id: "roaster",
    header: "Roaster",
    enableHiding: false, // roaster is always shown alongside the name
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
    header: "Archive date",
    cell: ({ row }) => <DateCell date={row.original.archiveDate} />,
    sortingFn: "datetime",
    sortUndefined: -1,
    meta: { label: "Archive date" },
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
    cell: ({ row }) => <BeanScore score={row.original.avgScore} />,
    sortingFn: "basic",
    sortUndefined: "last",
    meta: { label: "Score" },
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
    cell: ({ row }) => <Pills values={row.original.varietals} />,
    sortUndefined: "last",
    meta: { label: "Varietals" },
  }),
  ch.accessor((row) => (row.roastingNotes.length ? row.roastingNotes.join(", ") : undefined), {
    id: "roastingNotes",
    header: "Roasting notes",
    cell: ({ row }) => <Pills values={row.original.roastingNotes} />,
    sortUndefined: "last",
    meta: { label: "Roasting notes" },
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
    // Visibility is auto-managed (shown only when the result set is mixed), so
    // it's kept out of the manual column picker.
    meta: { label: "Status", hideFromPicker: true },
  }),
];

// The opt-in columns start hidden; the default set above stays on.
export const beansHistoryDefaultVisibility: Record<string, boolean> = {
  region: false,
  varietals: false,
  roastingNotes: false,
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

const DateCell = ({ date }: { date: Date | null }) => {
  if (!date) return <Dash />;
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
