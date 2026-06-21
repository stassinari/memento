import clsx from "clsx";
import { Card } from "~/components/Card";

const bar = "animate-pulse rounded-sm bg-gray-300 dark:bg-white/20";

// Approximate widths of the default columns (name · roaster · origin · process ·
// roast · archive date · score), with a trailing spacer like the real table.
const COLS = ["w-48", "w-36", "w-32", "w-28", "w-28", "w-28", "w-20"];
const BODY_BARS = ["w-32", "w-24", "w-20", "w-16", "w-16", "w-20", "w-8"];

/**
 * Loading state for the History tab. Mirrors the real surface: stat-card strip +
 * a table-shaped skeleton on desktop, a 2-line card list on mobile. Both are
 * rendered and toggled with CSS (cheap static markup, unlike the real table that
 * must measure itself) so there's no media-query flash.
 */
export const BeansHistorySkeleton = ({ rows = 8 }: { rows?: number }) => (
  <div aria-hidden="true">
    <SummaryStripSkeleton />
    <ToolbarSkeleton />
    <TableSkeleton rows={rows} />
    <CardsSkeleton rows={Math.min(rows, 6)} />
  </div>
);

const SummaryStripSkeleton = () => (
  <div className="mb-3 hidden flex-wrap items-stretch gap-3 sm:flex">
    {Array.from({ length: 4 }).map((_, i) => (
      <Card.Container key={i} variant="flat" className="min-w-36 flex-1 px-4 py-3">
        <div className={clsx(bar, "h-2.5 w-16")} />
        <div className={clsx(bar, "mt-2 h-6 w-12")} />
        <div className={clsx(bar, "mt-2 h-2.5 w-20")} />
      </Card.Container>
    ))}
    <div className="min-w-36 flex-1 rounded-lg border border-dashed border-orange-300 px-4 py-3 dark:border-orange-500/30">
      <div className={clsx(bar, "h-2.5 w-16 bg-orange-200 dark:bg-orange-500/20")} />
      <div className={clsx(bar, "mt-2.5 h-2.5 w-full bg-orange-200/70 dark:bg-orange-500/15")} />
    </div>
  </div>
);

const ToolbarSkeleton = () => (
  <div className="mb-3 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">
    <div className={clsx(bar, "h-9 w-full rounded-lg sm:min-w-50 sm:flex-1")} />
    <div className={clsx(bar, "h-9 w-full rounded-lg sm:w-24")} />
    <div className={clsx(bar, "hidden h-9 w-24 rounded-lg sm:block")} />
  </div>
);

const TableSkeleton = ({ rows }: { rows: number }) => (
  <Card.Container variant="elevated" className="hidden overflow-hidden sm:block">
    <div className="flex border-b border-gray-100 bg-gray-50/70 dark:border-white/10 dark:bg-white/5">
      {COLS.map((w, i) => (
        <div
          key={i}
          className={clsx(
            "shrink-0 border-r border-gray-100 px-3 py-2.5 first:pl-4 dark:border-white/10",
            w,
          )}
        >
          <div className={clsx(bar, "h-2.5 w-12")} />
        </div>
      ))}
      <div className="flex-1" />
    </div>
    {Array.from({ length: rows }).map((_, r) => (
      <div key={r} className="flex border-b border-gray-100 last:border-b-0 dark:border-white/10">
        {COLS.map((w, i) => (
          <div
            key={i}
            className={clsx(
              "shrink-0 border-r border-gray-100 px-3 py-3 first:pl-4 dark:border-white/10",
              w,
            )}
          >
            <div className={clsx(bar, i === COLS.length - 1 ? "h-5 w-9" : "h-3", BODY_BARS[i])} />
          </div>
        ))}
        <div className="flex-1" />
      </div>
    ))}
  </Card.Container>
);

const cardNameWidths = ["w-44", "w-32", "w-52", "w-40"];
const cardMetaWidths = ["w-40", "w-48", "w-32", "w-44"];

const CardsSkeleton = ({ rows }: { rows: number }) => (
  <Card.Container variant="elevated" className="overflow-hidden sm:hidden">
    <div className="divide-y divide-gray-100 dark:divide-white/10">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-3.5 py-2.5">
          <div className="min-w-0 flex-1">
            <div className={clsx(bar, "h-3.5", cardNameWidths[i % cardNameWidths.length])} />
            <div className={clsx(bar, "mt-2 h-3", cardMetaWidths[i % cardMetaWidths.length])} />
          </div>
          <div className={clsx(bar, "h-5 w-9")} />
        </div>
      ))}
    </div>
  </Card.Container>
);
