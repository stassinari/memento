import { Link as RouterLink } from "@tanstack/react-router";
import dayjs from "dayjs";
import { chain, entries } from "lodash";

import { TagIcon } from "@heroicons/react/16/solid";
import type { Beans, Brew, Espresso } from "~/db/types";
import { Card } from "../Card";
import { BeanBagIcon } from "../icons/BeanBagIcon";
import { BeanIconSolid } from "../icons/BeanIconSolid";
import { DripperIcon } from "../icons/DripperIcon";
import { DropIcon } from "../icons/DropIcon";
import { PortafilterIcon } from "../icons/PortafilterIcon";
import { SpoonSolidIcon } from "../icons/SpoonIconSolid";

const dateFormat = "ddd DD MMM YYYY";

export interface TastingTimelineItem {
  id: string;
  date: Date;
  method: string | null;
  samplePosition: number;
  sampleOverall: number | null;
  sampleFlavours: string[];
  tastingId: string;
  sampleId: string;
}

export const mergeBrewsAndEspressoByUniqueDate = (
  brewsList: { brews: Brew; beans: Beans | null }[],
  espressoList: { espresso: Espresso; beans: Beans | null }[],
  tastingList: TastingTimelineItem[] = [],
) => {
  const brews = chain(brewsList)
    .groupBy((brew) => dayjs(brew.brews.date).format(dateFormat))
    .mapValues((values) =>
      values.map((brew) => ({
        drink: brew.brews,
        beans: brew.beans,
        type: "brew" as const,
      })),
    )
    .value();
  const espressos = chain(espressoList)
    .groupBy((espresso) => dayjs(espresso.espresso.date).format(dateFormat))
    .mapValues((values) =>
      values.map((espresso) => ({
        drink: espresso.espresso,
        beans: espresso.beans,
        type: "espresso" as const,
      })),
    )
    .value();
  const tastings = chain(tastingList)
    .groupBy((tasting) => dayjs(tasting.date).format(dateFormat))
    .mapValues((values) =>
      values.map((tasting) => ({
        drink: tasting,
        type: "tasting" as const,
      })),
    )
    .value();

  const drinks: Record<
    string,
    Array<
      | { drink: Brew; beans: Beans | null; type: "brew" }
      | { drink: Espresso; beans: Beans | null; type: "espresso" }
      | { drink: TastingTimelineItem; type: "tasting" }
    >
  > = {};

  Object.keys(brews).forEach((key) => {
    drinks[key] = brews[key];
  });

  Object.keys(espressos).forEach((key) => {
    if (drinks[key]) {
      drinks[key] = [...drinks[key], ...espressos[key]];
    } else {
      drinks[key] = espressos[key];
    }
  });
  Object.keys(tastings).forEach((key) => {
    if (drinks[key]) {
      drinks[key] = [...drinks[key], ...tastings[key]];
    } else {
      drinks[key] = tastings[key];
    }
  });

  const sortedDrinks = entries(drinks).sort(([a], [b]) => {
    if (dayjs(a).isBefore(dayjs(b))) {
      return 1;
    }
    if (dayjs(a).isAfter(dayjs(b))) {
      return -1;
    }
    return 0;
  });

  const moreSortedDrinks: Array<
    [
      string,
      Array<
        | {
            drink: Brew;
            beans: Beans | null;
            type: "brew";
          }
        | {
            drink: Espresso;
            beans: Beans | null;
            type: "espresso";
          }
        | {
            drink: TastingTimelineItem;
            type: "tasting";
          }
      >,
    ]
  > = sortedDrinks.map(([date, drinks]) => {
    return [
      date,
      drinks.sort((a, b) => {
        if (dayjs(a.drink.date).isBefore(dayjs(b.drink.date))) {
          return 1;
        }
        if (dayjs(a.drink.date).isAfter(dayjs(b.drink.date))) {
          return -1;
        }
        return 0;
      }),
    ];
  });

  return moreSortedDrinks;
};

interface DrinksListProps {
  drinks: Array<[string, DrinkItemProps[]]>;
}

export const DrinksList = ({ drinks }: DrinksListProps) => (
  <>
    {drinks.map(([date, drinks]) => (
      <div key={date} className="mt-6 sm:mt-8 @container">
        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-300 dark:border-white/15" />
          </div>
          <div className="relative flex justify-start mb-2">
            <span className="ml-2 bg-gray-50 px-2 text-sm text-gray-500 dark:bg-gray-950 dark:text-gray-400 sm:ml-4">
              {date}
            </span>
          </div>
        </div>
        <ul className="grid gap-4 @xl:grid-cols-2">
          {drinks.map((item) => (
            <DrinkItem key={item.drink.id} {...item} />
          ))}
        </ul>
      </div>
    ))}
  </>
);

type DrinkItemProps =
  | {
      drink: Brew;
      beans: Beans | null;
      type: "brew";
    }
  | {
      drink: Espresso;
      beans: Beans | null;
      type: "espresso";
    }
  | {
      drink: TastingTimelineItem;
      beans?: never;
      type: "tasting";
    };

const DrinkItem = (item: DrinkItemProps) => {
  const { drink, type } = item;

  return (
    <li key={drink.id}>
      <RouterLink
        to={
          type === "brew"
            ? "/drinks/brews/$brewId"
            : type === "espresso"
              ? "/drinks/espresso/$espressoId"
              : "/drinks/tastings/$tastingId/samples/$sampleId"
        }
        params={
          type === "brew"
            ? { brewId: drink.id ?? "" }
            : type === "espresso"
              ? { espressoId: drink.id ?? "" }
              : { tastingId: drink.tastingId, sampleId: drink.sampleId }
        }
      >
        <Card.Container className="grow text-sm">
          <Card.Content>
            {type === "brew" ? (
              <BrewCardContent brew={drink} beans={item.beans} />
            ) : type === "espresso" ? (
              <EspressoCardContent espresso={drink} beans={item.beans} />
            ) : (
              <TastingCardContent tasting={drink} />
            )}
          </Card.Content>
          <Card.Footer className="flex h-8 items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            {type === "brew" ? (
              <>
                <DripperIcon className="mr-1 h-4 w-4 text-gray-400 dark:text-gray-500" /> Brewed at
              </>
            ) : type === "espresso" ? (
              <>
                <PortafilterIcon className="mr-1 h-4 w-4 text-gray-400 dark:text-gray-500" /> Pulled
                at
              </>
            ) : (
              <>
                <SpoonSolidIcon className="mr-1 h-4 w-4 text-gray-400 dark:text-gray-500" /> Tasted
                at
              </>
            )}
            <span>{dayjs(drink.date).format("HH:mm")}</span>
          </Card.Footer>
        </Card.Container>
      </RouterLink>
    </li>
  );
};

interface BrewCardContentProps {
  brew: Brew;
  beans?: Beans | null;
}

const BrewCardContent = ({ brew, beans }: BrewCardContentProps) => (
  <div className="flex">
    <div className="grow">
      <p className="font-semibold text-gray-900 dark:text-gray-100">{brew.method}</p>
      <p className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
        <BeanBagIcon variant="solid" className="h-3 w-3 text-gray-400 dark:text-gray-500" />{" "}
        {beans?.name}
      </p>
      <p className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
        <BeanIconSolid className="h-3 w-3 text-gray-400 dark:text-gray-500" />
        {brew.beansWeight}g : {brew.waterWeight}ml
        <DropIcon className="h-3 w-3 text-gray-400 dark:text-gray-500" />
      </p>
    </div>
    {brew.rating && (
      <div>
        <span className="-mt-0.5 rounded-sm bg-orange-50 px-1 py-0.5 font-medium text-orange-600 dark:bg-orange-500/15 dark:text-orange-300">
          {brew.rating}
        </span>
      </div>
    )}
  </div>
);

interface EspressoCardContentProps {
  espresso: Espresso;
  beans?: Beans | null;
}

const EspressoCardContent = ({ espresso, beans }: EspressoCardContentProps) => (
  <div className="flex">
    <div className="grow">
      {espresso.fromDecent && (
        <p className="font-semibold text-gray-900 dark:text-gray-100">{espresso.profileName}</p>
      )}
      <p className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
        <BeanBagIcon variant="solid" className="h-3 w-3 text-gray-400 dark:text-gray-500" />{" "}
        {beans?.name}
      </p>
      <p className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
        <BeanIconSolid className="h-3 w-3 text-gray-400 dark:text-gray-500" />
        {espresso.beansWeight ?? ""}g : {espresso.targetWeight ?? ""}g
        <DropIcon className="h-3 w-3 text-gray-400 dark:text-gray-500" />
      </p>
    </div>
    <div>
      <p className="-mt-0.5 rounded-sm bg-orange-50 px-1 py-0.5 font-medium text-orange-600 dark:bg-orange-500/15 dark:text-orange-300">
        {espresso.rating}
      </p>
    </div>
  </div>
);

interface TastingCardContentProps {
  tasting: TastingTimelineItem;
}

const TastingCardContent = ({ tasting }: TastingCardContentProps) => {
  const titlePrefix = tasting.method?.trim() ? tasting.method : "Tasting";
  const sampleName = `${titlePrefix} - Sample #${tasting.samplePosition + 1}`;

  return (
    <div className="flex">
      <div className="grow">
        <p className="font-semibold text-gray-900 dark:text-gray-100">{sampleName}</p>
        <p className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
          <TagIcon className="h-3 w-3 text-gray-400 dark:text-gray-500" />
          {tasting.sampleFlavours.length > 0 ? tasting.sampleFlavours.join(", ") : "No flavours"}
        </p>
      </div>
      {tasting.sampleOverall !== null && tasting.sampleOverall > 0 && (
        <div>
          <span className="-mt-0.5 rounded-sm bg-orange-50 px-1 py-0.5 font-medium text-orange-600 dark:bg-orange-500/15 dark:text-orange-300">
            {tasting.sampleOverall}
          </span>
        </div>
      )}
    </div>
  );
};
