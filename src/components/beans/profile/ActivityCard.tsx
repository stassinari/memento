import { Link } from "@tanstack/react-router";
import dayjs from "dayjs";
import { PlusCircleIcon } from "lucide-react";
import { useState } from "react";
import { Badge } from "~/components/Badge";
import { BigStat } from "~/components/BigStat";
import { Button } from "~/components/Button";
import { Card } from "~/components/Card";
import { ScoreChip } from "~/components/ScoreChip";
import { DripperIcon } from "~/components/icons/DripperIcon";
import { PortafilterIcon } from "~/components/icons/PortafilterIcon";
import {
  TastingSamplesList,
  TastingSamplesListItem,
} from "~/components/tastings/TastingSamplesList";
import { Beans, Brew, Espresso } from "~/db/types";
import { ActivitySummary, getActivitySummary } from "~/lib/beans";
import { ProfileCardHeader } from "./ProfileCardHeader";

type TastingSample = {
  id: string;
  position: number;
  overall: number | null;
  flavours: string[];
  tasting: { id: string };
};

type BeanWithDrinks = Beans & {
  brews: Brew[];
  espressos: Espresso[];
  sampledInTastings: TastingSample[];
};

const COLLAPSED_RECENT_LIMIT = 3;

interface ActivityCardProps {
  bean: BeanWithDrinks;
  isDesktop: boolean;
}

export const ActivityCard = ({ bean, isDesktop }: ActivityCardProps) => {
  const activity = getActivitySummary(bean);
  const [showAll, setShowAll] = useState(false);

  // ---- Empty: no drinks at all -----------------------------------------
  if (activity.totalCount === 0) {
    return (
      <Card.Container className="overflow-hidden">
        <ProfileCardHeader title="Activity" />
        <Card.Content className="py-5 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">No drinks logged yet</p>
          <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
            Brews &amp; shots with these beans show here
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <Button variant="white" size="sm" asChild>
              <Link to="/drinks/brews/add">
                <PlusCircleIcon />
                Log a brew
              </Link>
            </Button>
            <Button variant="white" size="sm" asChild>
              <Link to="/drinks/espresso/add">
                <PlusCircleIcon />
                Log an espresso
              </Link>
            </Button>
          </div>
        </Card.Content>
      </Card.Container>
    );
  }

  const samples = bean.sampledInTastings;
  const recent = getRecentDrinks(bean);
  const visible = showAll ? recent : recent.slice(0, COLLAPSED_RECENT_LIMIT);
  const expandable = recent.length > COLLAPSED_RECENT_LIMIT;

  return (
    <Card.Container className="overflow-hidden">
      <ProfileCardHeader title="Activity" />
      <Card.Content>
        <AvgAndBreakdown activity={activity} />

        {samples.length > 0 && (
          <div className="mt-4 border-t border-gray-100 pt-3 dark:border-white/10">
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
              Tasting
            </p>
            <TastingSamplesList variant="card">
              {samples.map((sample) => (
                <TastingSamplesListItem key={sample.id} variant="card" asChild>
                  <Link
                    to="/drinks/tastings/$tastingId/samples/$sampleId"
                    params={{ tastingId: sample.tasting.id, sampleId: sample.id }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-800 dark:text-gray-200">
                          Sample #{sample.position + 1}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">
                          {sample.flavours.length > 0 ? sample.flavours.join(", ") : "No flavours"}
                        </p>
                      </div>
                      {sample.overall !== null && (
                        <ScoreChip className="shrink-0">{sample.overall.toFixed(1)}</ScoreChip>
                      )}
                    </div>
                  </Link>
                </TastingSamplesListItem>
              ))}
            </TastingSamplesList>
          </div>
        )}

        {recent.length > 0 && (
          <div className="mt-4 border-t border-gray-100 pt-3 dark:border-white/10">
            <div className="mb-1.5 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                Drinks
              </p>
              {expandable && (
                <Button variant="link" size="xs" onClick={() => setShowAll((v) => !v)}>
                  {showAll ? "Show less" : `Show all (${recent.length})`}
                </Button>
              )}
            </div>
            <ul className="-mx-2">
              {visible.map((item) => (
                <RecentRow key={`${item.type}-${item.drink.id}`} {...item} isDesktop={isDesktop} />
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
      {activity.avgScore === null ? (
        <BigStat
          value={"/"}
          subtitle={`unrated · ${activity.totalCount} drinks`}
          valueClassName="text-gray-300 dark:text-gray-600"
        />
      ) : (
        <BigStat
          value={activity.avgScore.toFixed(1)}
          subtitle={`avg · ${activity.totalCount} drinks`}
          valueClassName="text-orange-600 dark:text-orange-300"
        />
      )}
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

const RecentRow = (item: RecentDrink & { isDesktop: boolean }) => {
  const isBrew = item.type === "brew";
  const { drink } = item;
  const title = isBrew ? (item.drink.method ?? "Brew") : (item.drink.profileName ?? "Espresso");
  const dose = isBrew
    ? `${item.drink.beansWeight}g : ${item.drink.waterWeight}ml`
    : `${item.drink.beansWeight ?? "?"}g : ${item.drink.targetWeight ?? "?"}g`;
  const date = dayjs(drink.date).format("D MMM");
  const ratingChip =
    drink.rating !== null ? <ScoreChip className="w-full">{drink.rating}</ScoreChip> : null;

  const iconBadge = (
    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-gray-100 text-gray-500 group-hover:bg-gray-200 dark:bg-white/10 dark:text-gray-400 dark:group-hover:bg-white/20">
      {isBrew ? <DripperIcon className="h-4 w-4" /> : <PortafilterIcon className="h-4 w-4" />}
    </span>
  );

  // Mobile: stack into two lines — name + rating on top, dose · date as a quiet subline.
  if (!item.isDesktop) {
    return (
      <li>
        <Link
          to={isBrew ? "/drinks/brews/$brewId" : "/drinks/espresso/$espressoId"}
          params={isBrew ? { brewId: drink.id } : { espressoId: drink.id }}
          className="group flex items-center gap-3 rounded-md px-2 py-2 hover:bg-gray-50 dark:hover:bg-white/5"
        >
          {iconBadge}
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="min-w-0 flex-1 truncate text-sm font-semibold text-gray-800 dark:text-gray-200">
                {title}
              </span>
              <span className="flex shrink-0 justify-end">{ratingChip}</span>
            </div>
            <p className="mt-0.5 truncate text-xs text-gray-400 dark:text-gray-500">
              {dose} · {date}
            </p>
          </div>
        </Link>
      </li>
    );
  }

  return (
    <li>
      <Link
        to={isBrew ? "/drinks/brews/$brewId" : "/drinks/espresso/$espressoId"}
        params={isBrew ? { brewId: drink.id } : { espressoId: drink.id }}
        className="group flex items-center gap-3 rounded-md px-2 py-2 hover:bg-gray-50 dark:hover:bg-white/5"
      >
        {iconBadge}
        <span className="min-w-0 flex-1 truncate text-sm font-semibold text-gray-800 dark:text-gray-200">
          {title}
        </span>
        <span className="w-20 shrink-0 text-right text-xs text-gray-500 dark:text-gray-400">
          {dose}
        </span>
        <span className="w-12 shrink-0 text-right text-xs text-gray-400 dark:text-gray-500">
          {date}
        </span>
        <span className="flex w-8 shrink-0 justify-end">{ratingChip}</span>
      </Link>
    </li>
  );
};
