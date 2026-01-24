import { Link as RouterLink } from "@tanstack/react-router";
import dayjs from "dayjs";
import { chain, entries } from "lodash";

import { Beans } from "../types/beans";
import { Brew } from "../types/brew";
import { Espresso } from "../types/espresso";
import { Card } from "./Card";
import { BeanBagIcon } from "./icons/BeanBagIcon";
import { BeanIcon } from "./icons/BeanIcon";
import { DripperIcon } from "./icons/DripperIcon";
import { DropIcon } from "./icons/DropIcon";
import { PortafilterIcon } from "./icons/PortafilterIcon";

const dateFormat = "ddd DD MMM YYYY";

export const mergeBrewsAndEspressoByUniqueDate = (
  brewsList: Brew[],
  espressoList: Espresso[],
) => {
  const brews = chain(brewsList)
    .groupBy((brew) => dayjs(brew.date.toDate()).format(dateFormat))
    .mapValues((values) =>
      values.map((brew) => ({
        drink: brew,
        type: "brew" as const,
      })),
    )
    .value();
  const espressos = chain(espressoList)
    .groupBy((espresso) => dayjs(espresso.date.toDate()).format(dateFormat))
    .mapValues((values) =>
      values.map((espresso) => ({
        drink: espresso,
        type: "espresso" as const,
      })),
    )
    .value();

  const drinks: Record<
    string,
    Array<{ drink: Brew; type: "brew" } | { drink: Espresso; type: "espresso" }>
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
            type: "brew";
          }
        | {
            drink: Espresso;
            type: "espresso";
          }
      >,
    ]
  > = sortedDrinks.map(([date, drinks]) => {
    return [
      date,
      drinks.sort((a, b) => {
        if (
          dayjs(a.drink.date.toDate()).isBefore(dayjs(b.drink.date.toDate()))
        ) {
          return 1;
        }
        if (
          dayjs(a.drink.date.toDate()).isAfter(dayjs(b.drink.date.toDate()))
        ) {
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
  beansList: Beans[];
}

export const DrinksList = ({ drinks, beansList }: DrinksListProps) => (
  <>
    {drinks.map(([date, drinks]) => (
      <div key={date} className="mt-6 sm:mt-8 @container">
        <div className="relative">
          <div
            className="absolute inset-0 flex items-center"
            aria-hidden="true"
          >
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-start mb-2">
            <span className="px-2 ml-2 text-sm text-gray-500 bg-gray-50 sm:ml-4">
              {date}
            </span>
          </div>
        </div>
        <ul className="grid gap-4 @xl:grid-cols-2">
          {drinks.map((item) => (
            <DrinkItem
              key={item.drink.id}
              {...item}
              beans={beansList.find((b) => b.id === item.drink.beans?.id)}
            />
          ))}
        </ul>
      </div>
    ))}
  </>
);

type DrinkItemProps =
  | {
      drink: Brew;
      beans?: Beans;
      type: "brew";
    }
  | {
      drink: Espresso;
      beans?: Beans;
      type: "espresso";
    };

const DrinkItem = ({ drink, type, beans }: DrinkItemProps) => (
  <li key={drink.id}>
    <RouterLink
      to={
        type === "brew"
          ? "/drinks/brews/$brewId"
          : "/drinks/espresso/$espressoId"
      }
      params={
        type === "brew"
          ? { brewId: drink.id ?? "" }
          : { espressoId: drink.id ?? "" }
      }
    >
      <Card.Container className="grow text-sm">
        <Card.Content>
          {type === "brew" ? (
            <BrewCardContent brew={drink} beans={beans} />
          ) : (
            <EspressoCardContent espresso={drink} beans={beans} />
          )}
        </Card.Content>
        <Card.Footer className="flex items-center h-8 gap-1 text-xs text-gray-500">
          {type === "brew" ? (
            <>
              <DripperIcon className="w-4 h-4 mr-1 text-gray-400" /> Brewed at
            </>
          ) : (
            <>
              <PortafilterIcon className="w-4 h-4 mr-1 text-gray-400" /> Pulled
              at
            </>
          )}
          <span>{dayjs(drink.date.toDate()).format("HH:mm")}</span>
        </Card.Footer>
      </Card.Container>
    </RouterLink>
  </li>
);

interface BrewCardContentProps {
  brew: Brew;
  beans?: Beans;
}

const BrewCardContent = ({ brew, beans }: BrewCardContentProps) => (
  <div className="flex">
    <div className="grow">
      <p className="font-semibold text-gray-900">{brew.method}</p>
      <p className="flex items-center gap-1 text-gray-600">
        <BeanBagIcon variant="solid" className="w-3 h-3 text-gray-400" />{" "}
        {beans?.name}
      </p>
      <p className="flex items-center gap-1 text-gray-600">
        <BeanIcon className="w-3 h-3 text-gray-400" />
        {brew.beansWeight}g : {brew.waterWeight}ml
        <DropIcon className="w-3 h-3 text-gray-400" />
      </p>
    </div>
    {brew.rating && (
      <div>
        <span className="px-1 py-0.5 -mt-0.5 font-medium text-orange-600 bg-orange-50 rounded-sm">
          {brew.rating}
        </span>
      </div>
    )}
  </div>
);

interface EspressoCardContentProps {
  espresso: Espresso;
  beans?: Beans;
}

const EspressoCardContent = ({ espresso, beans }: EspressoCardContentProps) => (
  <div className="flex">
    <div className="grow">
      {espresso.fromDecent && (
        <p className="font-semibold text-gray-900">{espresso.profileName}</p>
      )}
      <p className="flex items-center gap-1 text-gray-600">
        <BeanBagIcon variant="solid" className="w-3 h-3 text-gray-400" />{" "}
        {beans?.name}
      </p>
      <p className="flex items-center gap-1 text-gray-600">
        <BeanIcon className="w-3 h-3 text-gray-400" />
        {espresso.beansWeight ?? ""}g : {espresso.targetWeight ?? ""}g
        <DropIcon className="w-3 h-3 text-gray-400" />
      </p>
    </div>
    <div>
      <p className="px-1 py-0.5 -mt-0.5 font-medium text-orange-600 bg-orange-50 rounded-sm">
        {espresso.rating}
      </p>
    </div>
  </div>
);
