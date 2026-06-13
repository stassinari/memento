import { Link } from "@tanstack/react-router";
import dayjs from "dayjs";
import { Card } from "~/components/Card";
import { DripperIcon } from "~/components/icons/DripperIcon";
import { PortafilterIcon } from "~/components/icons/PortafilterIcon";
import { Beans, Brew, Espresso } from "~/db/types";
import { ActivitySummary, getActivitySummary } from "~/lib/beans";
import { ProfileCardHeader } from "./ProfileCardHeader";

type BeanWithDrinks = Beans & {
  brews: Brew[];
  espressos: Espresso[];
  sampledInTastings: {
    id: string;
    position: number;
    overall: number | null;
    flavours: string[];
    tasting: { id: string };
  }[];
};

interface ActivityCardProps {
  bean: BeanWithDrinks;
  onViewAll?: () => void;
}

const RECENT_LIMIT = 4;

export const ActivityCard = ({ bean, onViewAll }: ActivityCardProps) => {
  const activity = getActivitySummary(bean);

  // ---- Empty: no drinks at all -----------------------------------------
  if (activity.totalCount === 0) {
    return (
      <Card.Container className="overflow-hidden">
        <ProfileCardHeader title="Activity" muted />
        <Card.Content className="py-5 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">No drinks logged yet</p>
          <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
            Brews &amp; shots with these beans show here
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <Link
              to="/drinks/brews/add"
              className="inline-flex items-center rounded-lg border-[1.5px] border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 dark:border-white/15 dark:text-gray-300 dark:hover:bg-white/5"
            >
              + Log a brew
            </Link>
            <Link
              to="/drinks/espresso/add"
              className="inline-flex items-center rounded-lg border-[1.5px] border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 dark:border-white/15 dark:text-gray-300 dark:hover:bg-white/5"
            >
              + Log an espresso
            </Link>
          </div>
        </Card.Content>
      </Card.Container>
    );
  }

  const topTasting = bean.sampledInTastings[0];
  const recent = getRecentDrinks(bean);

  return (
    <Card.Container className="overflow-hidden">
      <ProfileCardHeader
        title="Activity"
        right={
          onViewAll && (
            <button
              type="button"
              onClick={onViewAll}
              className="text-xs font-medium text-orange-600 hover:text-orange-500 dark:text-orange-300 dark:hover:text-orange-200"
            >
              View all ›
            </button>
          )
        }
      />
      <Card.Content>
        <AvgAndBreakdown activity={activity} />

        {topTasting && (
          <Link
            to="/drinks/tastings/$tastingId/samples/$sampleId"
            params={{ tastingId: topTasting.tasting.id, sampleId: topTasting.id }}
            className="mt-3.5 flex items-center justify-between gap-3 rounded-xl border border-orange-100 bg-orange-50/40 px-3 py-2.5 hover:bg-orange-50 dark:border-orange-400/20 dark:bg-orange-500/10 dark:hover:bg-orange-500/15"
          >
            <div className="min-w-0">
              <p className="truncate text-[12.5px] font-semibold text-gray-800 dark:text-gray-200">
                Beans tasting · sample #{topTasting.position + 1}
              </p>
              <p className="truncate text-[11px] text-gray-500 dark:text-gray-400">
                {topTasting.flavours.length > 0 ? topTasting.flavours.join(", ") : "No flavours"}
              </p>
            </div>
            {topTasting.overall !== null && (
              <span className="shrink-0 rounded-lg bg-white px-2 py-1 text-sm font-bold text-orange-600 ring-1 ring-orange-200 dark:bg-gray-900 dark:text-orange-300 dark:ring-orange-400/30">
                {topTasting.overall.toFixed(1)}
              </span>
            )}
          </Link>
        )}

        {recent.length > 0 && (
          <div className="mt-4 border-t border-gray-100 pt-3 dark:border-white/10">
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
              Recent
            </p>
            <ul className="divide-y divide-gray-100 dark:divide-white/10">
              {recent.map((item) => (
                <RecentRow key={`${item.type}-${item.drink.id}`} {...item} />
              ))}
            </ul>
          </div>
        )}
      </Card.Content>
    </Card.Container>
  );
};

const AvgAndBreakdown = ({ activity }: { activity: ActivitySummary }) => {
  const pills = [
    activity.brewCount > 0 && `${activity.brewCount} brew${activity.brewCount === 1 ? "" : "s"}`,
    activity.espressoCount > 0 &&
      `${activity.espressoCount} espresso${activity.espressoCount === 1 ? "" : "s"}`,
    activity.tastingCount > 0 &&
      `${activity.tastingCount} tasting${activity.tastingCount === 1 ? "" : "s"}`,
  ].filter((p): p is string => !!p);

  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="flex items-end gap-2">
        {activity.avgScore === null ? (
          <>
            <span className="font-heading text-[34px] font-bold leading-none tracking-tight text-gray-300 dark:text-gray-600">
              —
            </span>
            <span className="pb-0.5 text-xs text-gray-500 dark:text-gray-400">
              unrated · {activity.totalCount} drinks
            </span>
          </>
        ) : (
          <>
            <span className="font-heading text-[34px] font-bold leading-none tracking-tight text-orange-600 dark:text-orange-300">
              {activity.avgScore.toFixed(1)}
            </span>
            <span className="pb-0.5 text-xs text-gray-500 dark:text-gray-400">
              avg · {activity.totalCount} drinks
            </span>
          </>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {pills.map((pill) => (
          <span
            key={pill}
            className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-white/10 dark:text-gray-300"
          >
            {pill}
          </span>
        ))}
      </div>
    </div>
  );
};

type RecentDrink =
  | { type: "brew"; drink: Brew }
  | { type: "espresso"; drink: Espresso };

function getRecentDrinks(bean: BeanWithDrinks): RecentDrink[] {
  return [
    ...bean.brews.map((drink) => ({ type: "brew" as const, drink })),
    ...bean.espressos.map((drink) => ({ type: "espresso" as const, drink })),
  ]
    .sort((a, b) => dayjs(b.drink.date).valueOf() - dayjs(a.drink.date).valueOf())
    .slice(0, RECENT_LIMIT);
}

const RecentRow = (item: RecentDrink) => {
  const isBrew = item.type === "brew";
  const { drink } = item;
  const title = isBrew
    ? (item.drink.method ?? "Brew")
    : (item.drink.profileName ?? "Espresso");
  const dose = isBrew
    ? `${item.drink.beansWeight}g : ${item.drink.waterWeight}ml`
    : `${item.drink.beansWeight ?? ""}g : ${item.drink.targetWeight ?? ""}g`;

  return (
    <li>
      <Link
        to={isBrew ? "/drinks/brews/$brewId" : "/drinks/espresso/$espressoId"}
        params={isBrew ? { brewId: drink.id } : { espressoId: drink.id }}
        className="flex items-center gap-3 py-2 hover:opacity-80"
      >
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-gray-400">
          {isBrew ? (
            <DripperIcon className="h-4 w-4" />
          ) : (
            <PortafilterIcon className="h-4 w-4" />
          )}
        </span>
        <span className="w-24 truncate text-[13px] font-semibold text-gray-800 dark:text-gray-200">
          {title}
        </span>
        <span className="flex-1 truncate text-[12.5px] text-gray-500 dark:text-gray-400">
          {dose}
        </span>
        <span className="shrink-0 text-[12px] text-gray-400 dark:text-gray-500">
          {dayjs(drink.date).format("D MMM · HH:mm")}
        </span>
        {drink.rating !== null && (
          <span className="w-9 shrink-0 rounded-md bg-orange-50 px-1.5 py-0.5 text-center text-xs font-bold text-orange-600 dark:bg-orange-500/15 dark:text-orange-300">
            {drink.rating}
          </span>
        )}
      </Link>
    </li>
  );
};
