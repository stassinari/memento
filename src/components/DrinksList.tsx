import dayjs from "dayjs";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import "twin.macro";
import { Beans } from "../types/beans";
import { Brew } from "../types/brew";
import { Espresso } from "../types/espresso";
import { Card } from "./Card";
import { BeanBagIcon } from "./icons/BeanBagIcon";
import { BeanIcon } from "./icons/BeanIcon";
import { DripperIcon } from "./icons/DripperIcon";
import { DropIcon } from "./icons/DropIcon";
import { PortafilterIcon } from "./icons/PortafilterIcon";

interface DrinksListProps {
  drinks: Array<[string, DrinkItemProps[]]>;
  beansList: Beans[];
}

export const DrinksList: React.FC<DrinksListProps> = ({
  drinks,
  beansList,
}) => (
  <>
    {drinks.map(([date, drinks]) => (
      <div key={date} tw="mt-4">
        <span tw="block mb-2 text-sm font-medium text-center text-gray-500">
          {date}
        </span>
        <ul tw="flex flex-col gap-4">
          {drinks.map((item, i) => (
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
          ? `brews/${drink.id ?? ""}`
          : `espresso/${drink.id ?? ""}`
      }
    >
      <Card.Container tw="flex-grow text-sm">
        <Card.Content>
          {type === "brew" ? (
            <BrewCardContent brew={drink} beans={beans} />
          ) : (
            <EspressoCardContent espresso={drink} beans={beans} />
          )}
        </Card.Content>
        <Card.Footer tw="flex items-center h-8 gap-1 text-xs text-gray-500">
          {type === "brew" ? (
            <>
              <DripperIcon tw="w-4 h-4 mr-1 text-gray-400" /> Brewed at
            </>
          ) : (
            <>
              <PortafilterIcon tw="w-4 h-4 mr-1 text-gray-400" /> Pulled at
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

const BrewCardContent: React.FC<BrewCardContentProps> = ({ brew, beans }) => (
  <div tw="flex">
    <div tw="flex-grow">
      <p tw="font-semibold text-gray-900">{brew.method}</p>
      <p tw="flex items-center gap-1 text-gray-600">
        <BeanBagIcon variant="solid" tw="w-3 h-3 text-gray-400" /> {beans?.name}
      </p>
      <p tw="flex items-center gap-1 text-gray-600">
        <BeanIcon tw="w-3 h-3 text-gray-400" />
        {brew.beansWeight}g : {brew.waterWeight}ml
        <DropIcon tw="w-3 h-3 text-gray-400" />
      </p>
    </div>
    {brew.rating && (
      <div>
        <p tw="px-1 py-0.5 -mt-0.5 font-medium text-orange-600 bg-orange-50 rounded">
          {brew.rating}
        </p>
      </div>
    )}
  </div>
);

interface EspressoCardContentProps {
  espresso: Espresso;
  beans?: Beans;
}

const EspressoCardContent: React.FC<EspressoCardContentProps> = ({
  espresso,
  beans,
}) => (
  <div tw="flex">
    <div tw="flex-grow">
      {espresso.fromDecent && (
        <p tw="font-semibold text-gray-900">{espresso.profileName}</p>
      )}
      <p tw="flex items-center gap-1 text-gray-600">
        <BeanBagIcon variant="solid" tw="w-3 h-3 text-gray-400" /> {beans?.name}
      </p>
      <p tw="flex items-center gap-1 text-gray-600">
        <BeanIcon tw="w-3 h-3 text-gray-400" />
        {espresso.beansWeight ?? ""}g : {espresso.targetWeight ?? ""}g
        <DropIcon tw="w-3 h-3 text-gray-400" />
      </p>
    </div>
    <div tw="flex flex-col items-end justify-between">
      <p tw="px-1 py-0.5 -mt-0.5 font-medium text-orange-600 bg-orange-50 rounded">
        {espresso.rating}
      </p>
    </div>
  </div>
);
