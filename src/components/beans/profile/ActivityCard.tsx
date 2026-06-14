import { Link } from "@tanstack/react-router";
import dayjs from "dayjs";
import { useState } from "react";
import { Badge } from "~/components/Badge";
import { Button } from "~/components/Button";
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
  /** How many recent rows to show before "View all" reveals the rest. */
  initialCount: number;
}

export const ActivityCard = ({ bean, initialCount }: ActivityCardProps) => {
  const activity = getActivitySummary(bean);
  const [showAll, setShowAll] = useState(false);

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
            <Button variant="white" size="sm" asChild>
              <Link to="/drinks/brews/add">+ Log a brew</Link>
            </Button>
            <Button variant="white" size="sm" asChild>
              <Link to="/drinks/espresso/add">+ Log an espresso</Link>
            </Button>
          </div>
        </Card.Content>
      </Card.Container>
    );
  }

  const topTasting = bean.sampledInTastings[0];
  const recent = getRecentDrinks(bean);
  const visible = showAll ? recent : recent.slice(0, initialCount);
  const canExpand = recent.length > initialCount;

  return (
    <Card.Container className="overflow-hidden">
      <ProfileCardHeader title="Activity" />
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
              <Badge colour="orange" size="large" label={topTasting.overall.toFixed(1)} />
            )}
          </Link>
        )}

        {recent.length > 0 && (
          <div className="mt-4 border-t border-gray-100 pt-3 dark:border-white/10">
            <div className="mb-1.5 flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                Recent
              </p>
              {canExpand && (
                <button
                  type="button"
                  onClick={() => setShowAll((v) => !v)}
                  className="text-xs font-medium text-orange-600 hover:text-orange-500 dark:text-orange-300 dark:hover:text-orange-200"
                >
                  {showAll ? "Show less" : `View all (${recent.length}) ›`}
                </button>
              )}
            </div>
            <ul className="-mx-2">
              {visible.map((item) => (
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
          <Badge key={pill} colour="grey" label={pill} />
        ))}
      </div>
    </div>
  );
};

type RecentDrink = { type: "brew"; drink: Brew } | { type: "espresso"; drink: Espresso };

function getRecentDrinks(bean: BeanWithDrinks): RecentDrink[] {
  return [
    ...bean.brews.map((drink) => ({ type: "brew" as const, drink })),
    ...bean.espressos.map((drink) => ({ type: "espresso" as const, drink })),
  ].sort((a, b) => dayjs(b.drink.date).valueOf() - dayjs(a.drink.date).valueOf());
}

const RecentRow = (item: RecentDrink) => {
  const isBrew = item.type === "brew";
  const { drink } = item;
  const title = isBrew
    ? (item.drink.method ?? "Brew")
    : (item.drink.profileName ?? "Espresso");
  const dose = isBrew
    ? `${item.drink.beansWeight}g : ${item.drink.waterWeight}ml`
    : `${item.drink.beansWeight ?? "?"}g : ${item.drink.targetWeight ?? "?"}g`;

  return (
    <li>
      <Link
        to={isBrew ? "/drinks/brews/$brewId" : "/drinks/espresso/$espressoId"}
        params={isBrew ? { brewId: drink.id } : { espressoId: drink.id }}
        className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-gray-100 dark:hover:bg-white/5"
      >
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-gray-400">
          {isBrew ? <DripperIcon className="h-4 w-4" /> : <PortafilterIcon className="h-4 w-4" />}
        </span>
        <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-gray-800 dark:text-gray-200">
          {title}
        </span>
        <span className="shrink-0 text-[12.5px] text-gray-500 dark:text-gray-400">{dose}</span>
        <span className="shrink-0 text-[12px] text-gray-400 dark:text-gray-500">
          {dayjs(drink.date).format("D MMM · HH:mm")}
        </span>
        {drink.rating !== null && (
          <Badge colour="orange" label={String(drink.rating)} />
        )}
      </Link>
    </li>
  );
};
