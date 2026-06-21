import { Link } from "@tanstack/react-router";
import clsx from "clsx";
import { Card } from "~/components/Card";
import { BeansListItem } from "~/db/types";
import { UseBeanActions } from "~/hooks/useBeanActions";
import {
  formatAge,
  getBeanDescriptor,
  getFreshness,
  getRoastLevelLabel,
  getRoastStyleLabel,
} from "~/lib/beans";
import { BeanRowActionsMenu } from "./BeanRowActionsMenu";
import { BeanScore } from "./BeanScore";
import { CountryOptionFlag } from "./CountryOptionFlag";
import { RoastLevelMeter } from "./profile/RoastLevelMeter";

const labelStyles =
  "text-[10px] font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500";
const ageUnitShort: Record<string, string> = {
  day: "d",
  days: "d",
  month: "mo",
  months: "mo",
  year: "y",
  years: "y",
};

interface BeansQuickListProps {
  beans: BeansListItem[];
  actions: UseBeanActions;
}

/**
 * The warm, scannable list behind the Open & Frozen tabs (a list, not a table):
 * name · roaster, origin · process, the single freshness number, the avg-score
 * chip, and a per-row ⋯ menu. Two right-hand metrics carry column labels so the
 * header-less figures aren't a mystery. Rows degrade gracefully when origin /
 * process / roast date are missing.
 */
export const BeansQuickList = ({ beans, actions }: BeansQuickListProps) => (
  <Card.Container variant="elevated" className="overflow-hidden">
    <QuickListHeader />
    <div className="divide-y divide-gray-100 dark:divide-white/10">
      {beans.map((bean) => (
        <BeansQuickListRow key={bean.id} bean={bean} actions={actions} />
      ))}
    </div>
  </Card.Container>
);

/** The labelled column header shared by the list and its loading skeleton. */
const QuickListHeader = () => (
  <div className="flex items-center gap-2 border-b border-gray-100 px-3.5 pb-2 pt-3 sm:gap-3.5 sm:px-4 dark:border-white/10">
    <span className="flex-1" />
    <span className={clsx(labelStyles, "hidden w-40 lg:block lg:mr-8 xl:mr-16")}>Roast</span>
    <span className={clsx(labelStyles, "w-12 text-right sm:w-16")}>
      <span className="sm:hidden">Age</span>
      <span className="hidden sm:inline">Freshness</span>
    </span>
    <span className={clsx(labelStyles, "w-12 text-center sm:w-16")}>
      <span className="sm:hidden">Score</span>
      <span className="hidden sm:inline">Avg score</span>
    </span>
    <span className="w-7" />
  </div>
);

const BeansQuickListRow = ({ bean, actions }: { bean: BeansListItem; actions: UseBeanActions }) => {
  const freshness = getFreshness(bean);

  return (
    <div
      className={clsx(
        "relative flex items-center gap-2 px-3.5 py-3.5 hover:bg-gray-50 has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-inset has-[a:focus-visible]:ring-orange-500 sm:gap-3.5 sm:px-4 dark:hover:bg-white/5",
        !freshness.hasRoastDate && "bg-gray-50/60 dark:bg-white/[0.03]",
      )}
    >
      {/* Stretched link: its ::after covers the whole row (padding included) so
          the entire row navigates; the ⋯ button sits above it via z-10. */}
      <Link
        to="/beans/$beansId"
        params={{ beansId: bean.id }}
        className="min-w-0 flex-1 after:absolute after:inset-0 focus:outline-hidden"
      >
        <p className="truncate text-[15px]">
          <span
            className={clsx(
              "font-semibold",
              freshness.hasRoastDate
                ? "text-gray-900 dark:text-gray-100"
                : "text-gray-600 dark:text-gray-400",
            )}
          >
            {bean.name}
          </span>{" "}
          <span className="text-gray-500 dark:text-gray-400">· {bean.roaster}</span>
        </p>
        <BeanSubline bean={bean} />
      </Link>

      <RoastCell bean={bean} />

      <div className="w-10 text-right sm:w-16">
        <FreshnessFigure
          hasRoastDate={freshness.hasRoastDate}
          days={freshness.effectiveDays}
          frozen={freshness.state === "frozen"}
        />
      </div>

      <div className="flex w-10 justify-center sm:w-16">
        <BeanScore score={bean.avgScore} />
      </div>

      <div className="relative z-10 flex w-7 justify-center">
        <BeanRowActionsMenu bean={bean} actions={actions} />
      </div>
    </div>
  );
};

/** The origin/process subline: flag + "Country · Process" for single origin,
 *  "Blend · N parts" for blends, an italic "not recorded" note when empty. */
const BeanSubline = ({ bean }: { bean: BeansListItem }) => {
  if (bean.origin === "blend") {
    return (
      <p className="mt-1 text-[12.5px] text-gray-500 dark:text-gray-400">
        {getBeanDescriptor(bean)}
      </p>
    );
  }
  if (!bean.country && !bean.process) {
    return (
      <p className="mt-1 text-[12.5px] italic text-gray-400 dark:text-gray-500">
        No origin details
      </p>
    );
  }
  return (
    <p className="mt-1 flex items-center gap-1.5 text-[12.5px] text-gray-500 dark:text-gray-400">
      {bean.country && (
        <CountryOptionFlag country={bean.country} className="h-3.5 w-auto rounded-sm" />
      )}
      <span className="truncate">{getBeanDescriptor(bean)}</span>
    </p>
  );
};

/** Desktop-only roast column: compact meter + "Style · Level" text. Each part
 *  is optional — the meter needs a level, the text shows whichever parts exist;
 *  the whole cell is blank when nothing is recorded. */
const RoastCell = ({ bean }: { bean: BeansListItem }) => {
  const text = [getRoastStyleLabel(bean.roastStyle), getRoastLevelLabel(bean.roastLevel)]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="hidden w-40 lg:block lg:mr-8 xl:mr-16">
      {(bean.roastLevel !== null || text) && (
        <div className="flex flex-col gap-1">
          {bean.roastLevel !== null && (
            <RoastLevelMeter level={bean.roastLevel} showEdgeLabels={false} />
          )}
          {text && (
            <span className="truncate text-[11px] text-gray-500 dark:text-gray-400">{text}</span>
          )}
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Loading skeleton — mirrors the list (same card, header and row geometry) so
// the page doesn't reflow when data lands. Row count is caller-driven so it can
// roughly match the real result via the cheap counts query.
// ---------------------------------------------------------------------------

const bar = "animate-pulse rounded-sm bg-gray-300 dark:bg-white/20";
const skeletonNameWidths = ["w-44", "w-32", "w-52", "w-40"];
const skeletonSubWidths = ["w-24", "w-32", "w-20", "w-28"];

export const BeansQuickListSkeleton = ({ rows = 4 }: { rows?: number }) => (
  <Card.Container variant="elevated" className="overflow-hidden">
    <QuickListHeader />
    <div className="divide-y divide-gray-100 dark:divide-white/10" aria-hidden="true">
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow key={i} index={i} />
      ))}
    </div>
  </Card.Container>
);

const SkeletonRow = ({ index }: { index: number }) => (
  <div className="flex items-center gap-2 px-3.5 py-3.5 sm:gap-3.5 sm:px-4">
    <div className="min-w-0 flex-1">
      <div className={clsx(bar, "h-3.5", skeletonNameWidths[index % skeletonNameWidths.length])} />
      <div className={clsx(bar, "mt-2 h-3", skeletonSubWidths[index % skeletonSubWidths.length])} />
    </div>
    <div className="hidden w-40 lg:block lg:mr-8 xl:mr-16">
      <div className={clsx(bar, "h-2 w-full rounded-full")} />
      <div className={clsx(bar, "mt-2 h-3 w-24")} />
    </div>
    <div className="flex w-10 justify-end sm:w-16">
      <div className={clsx(bar, "h-4 w-8")} />
    </div>
    <div className="flex w-10 justify-center sm:w-16">
      <div className={clsx(bar, "h-5 w-9")} />
    </div>
    <div className="flex w-7 justify-center">
      <div className={clsx(bar, "h-4 w-1.5")} />
    </div>
  </div>
);

const FreshnessFigure = ({
  hasRoastDate,
  days,
  frozen,
}: {
  hasRoastDate: boolean;
  days: number | null;
  frozen: boolean;
}) => {
  if (!hasRoastDate || days === null) {
    return <span className="text-[11.5px] italic leading-tight text-gray-400">no roast date</span>;
  }
  const { value, unit } = formatAge(days);
  return (
    <span
      className={clsx(
        "font-heading text-base font-bold tabular-nums leading-none",
        frozen ? "text-blue-700 dark:text-blue-400" : "text-gray-900 dark:text-gray-100",
      )}
    >
      {value}
      <small className="ml-0.5 text-[11px] font-semibold text-gray-400">{ageUnitShort[unit]}</small>
    </span>
  );
};
