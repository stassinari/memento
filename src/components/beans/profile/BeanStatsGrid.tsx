import clsx from "clsx";
import { ActivitySummary, Freshness } from "~/lib/beans";

/**
 * Two glance-stats under the hero (mobile): effective age · avg score. Each
 * shows a `—` placeholder when its source is missing — never hidden, so the gap
 * invites input.
 */

interface StatProps {
  value: string;
  unit?: string;
  caption: React.ReactNode;
  emphasised?: boolean; // orange (score)
  muted?: boolean; // gray placeholder
}

const Stat = ({ value, unit, caption, emphasised, muted }: StatProps) => (
  <div className="px-4 py-3.5">
    <div className="flex items-baseline gap-1">
      <span
        className={clsx(
          "font-heading text-[28px] font-bold leading-none tracking-tight",
          muted
            ? "text-gray-300 dark:text-gray-600"
            : emphasised
              ? "text-orange-600 dark:text-orange-300"
              : "text-gray-900 dark:text-gray-100",
        )}
      >
        {value}
      </span>
      {unit && <span className="text-sm font-semibold text-gray-400">{unit}</span>}
    </div>
    <p className="mt-1.5 text-[11px] font-medium text-gray-400 dark:text-gray-500">{caption}</p>
  </div>
);

const ageCaption = (freshness: Freshness): string => {
  if (!freshness.hasRoastDate) return "no roast date";
  if (freshness.isArchived) return "days at archive";
  switch (freshness.state) {
    case "frozen":
      return "effective · paused";
    case "thawed":
      return "effective age";
    default:
      return "since roast";
  }
};

interface BeanStatsGridProps {
  freshness: Freshness;
  activity: ActivitySummary;
}

export const BeanStatsGrid = ({ freshness, activity }: BeanStatsGridProps) => (
  <div className="grid grid-cols-2 divide-x divide-gray-100 rounded-2xl bg-white shadow-sm ring-1 ring-gray-900/5 dark:divide-white/10 dark:bg-gray-900 dark:ring-white/10">
    {freshness.hasRoastDate ? (
      <Stat value={String(freshness.effectiveDays)} unit="days" caption={ageCaption(freshness)} />
    ) : (
      <Stat value="—" caption="no roast date" muted />
    )}

    {activity.totalCount === 0 ? (
      <Stat value="—" caption="no drinks yet" muted />
    ) : activity.avgScore === null ? (
      <Stat value="—" caption={`unrated · ${activity.totalCount} drinks`} muted />
    ) : (
      <Stat
        value={activity.avgScore.toFixed(1)}
        unit="avg"
        caption={`score · ${activity.totalCount} drinks`}
        emphasised
      />
    )}
  </div>
);
