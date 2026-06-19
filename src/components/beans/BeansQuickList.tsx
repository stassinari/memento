import { Link } from "@tanstack/react-router";
import clsx from "clsx";
import { Card } from "~/components/Card";
import { ScoreChip } from "~/components/ScoreChip";
import { BeansListItem } from "~/db/types";
import { UseBeanActions } from "~/hooks/useBeanActions";
import { formatAge, getBeanDescriptor, getFreshness } from "~/lib/beans";
import { roundToDecimal } from "~/utils";
import { CountryOptionFlag } from "./CountryOptionFlag";
import { BeanRowActionsMenu } from "./BeanRowActionsMenu";

const labelStyles = "text-[10px] font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500";
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
    <div className="flex items-center gap-3.5 border-b border-gray-100 px-4 pb-2 pt-3 dark:border-white/10">
      <span className="flex-1" />
      <span className={clsx(labelStyles, "w-16 text-right")}>Freshness</span>
      <span className={clsx(labelStyles, "w-16 text-center")}>Avg score</span>
      <span className="w-7" />
    </div>
    <div className="divide-y divide-gray-100 dark:divide-white/10">
      {beans.map((bean) => (
        <BeansQuickListRow key={bean.id} bean={bean} actions={actions} />
      ))}
    </div>
  </Card.Container>
);

const BeansQuickListRow = ({ bean, actions }: { bean: BeansListItem; actions: UseBeanActions }) => {
  const freshness = getFreshness(bean);

  return (
    <div
      className={clsx(
        "flex items-center gap-3.5 px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-white/5",
        !freshness.hasRoastDate && "bg-gray-50/60 dark:bg-white/[0.03]",
      )}
    >
      <Link
        to="/beans/$beansId"
        params={{ beansId: bean.id }}
        className="min-w-0 flex-1 focus:outline-hidden"
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

      <div className="w-16 text-right">
        <FreshnessFigure
          hasRoastDate={freshness.hasRoastDate}
          days={freshness.effectiveDays}
          frozen={freshness.state === "frozen"}
        />
      </div>

      <div className="flex w-16 justify-center">
        {bean.avgScore !== null ? (
          <ScoreChip>{roundToDecimal(bean.avgScore, 1)}</ScoreChip>
        ) : (
          <span className="rounded-sm bg-gray-100 px-1 py-0.5 text-sm font-medium text-gray-400 dark:bg-white/10 dark:text-gray-500">
            —
          </span>
        )}
      </div>

      <div className="flex w-7 justify-center">
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
      <p className="mt-1 text-[12.5px] text-gray-500 dark:text-gray-400">{getBeanDescriptor(bean)}</p>
    );
  }
  if (!bean.country && !bean.process) {
    return (
      <p className="mt-1 text-[12.5px] italic text-gray-400 dark:text-gray-500">
        Origin &amp; process not recorded
      </p>
    );
  }
  return (
    <p className="mt-1 flex items-center gap-1.5 text-[12.5px] text-gray-500 dark:text-gray-400">
      {bean.country && <CountryOptionFlag country={bean.country} className="h-3.5 w-auto rounded-sm" />}
      <span className="truncate">{getBeanDescriptor(bean)}</span>
    </p>
  );
};

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
