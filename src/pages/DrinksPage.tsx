import { ClockIcon } from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import { orderBy, where } from "firebase/firestore";
import { chain, entries } from "lodash";
import React, { useCallback, useMemo } from "react";
import { Link as RouterLink } from "react-router-dom";
import tw from "twin.macro";
import { navLinks } from "../components/BottomNav";
import { BreadcrumbsWithHome } from "../components/Breadcrumbs";
import { Card } from "../components/Card";
import { Heading } from "../components/Heading";
import { Link } from "../components/Link";
import { BeanBagIcon } from "../components/icons/BeanBagIcon";
import { BeanIcon } from "../components/icons/BeanIcon";
import { DripperIcon } from "../components/icons/DripperIcon";
import { DropIcon } from "../components/icons/DropIcon";
import { PortafilterIcon } from "../components/icons/PortafilterIcon";
import { useCollectionQuery } from "../hooks/firestore/useCollectionQuery";
import { useFirestoreCollectionRealtime } from "../hooks/firestore/useFirestoreCollectionRealtime";
import { Beans } from "../types/beans";
import { Brew } from "../types/brew";
import { Espresso } from "../types/espresso";

const dateFormat = "ddd DD MMM YYYY";

const mergeBrewsAndEspressoByUniqueDate = (
  brewsList: Brew[],
  espressoList: Espresso[]
) => {
  const brews = chain(brewsList)
    .groupBy((brew) => dayjs(brew.date.toDate()).format(dateFormat))
    .mapValues((values) =>
      values.map((brew) => ({
        drink: brew,
        type: "brew" as const,
      }))
    )
    .value();
  const espressos = chain(espressoList)
    .groupBy((espresso) => dayjs(espresso.date.toDate()).format(dateFormat))
    .mapValues((values) =>
      values.map((espresso) => ({
        drink: espresso,
        type: "espresso" as const,
      }))
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
      >
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
  console.log(sortedDrinks, moreSortedDrinks);

  return moreSortedDrinks;
};

export const DrinksPage: React.FC = () => {
  console.log("DrinksPage");

  const aMonthAgo = useCallback(
    () => dayjs(new Date()).subtract(1, "month").toDate(), // FIXME use 1 month
    []
  );

  const filters = useMemo(
    () => [orderBy("date", "desc"), where("date", ">", aMonthAgo())],
    [aMonthAgo]
  );

  const brewQuery = useCollectionQuery<Brew>("brews", filters);
  const { list: brewsList, isLoading: brewsLoading } =
    useFirestoreCollectionRealtime<Brew>(brewQuery);

  const espressoQuery = useCollectionQuery<Espresso>("espresso", filters);
  const { list: espressoList, isLoading: espressoLoading } =
    useFirestoreCollectionRealtime<Espresso>(espressoQuery);

  const beansFilters = useMemo(() => [orderBy("roastDate", "desc")], []);
  const beansQuery = useCollectionQuery<Beans>("beans", beansFilters);
  const { list: beansList, isLoading: beansLoading } =
    useFirestoreCollectionRealtime<Beans>(beansQuery);

  const drinks = useMemo(
    () => mergeBrewsAndEspressoByUniqueDate(brewsList, espressoList),
    [brewsList, espressoList]
  );

  console.log({
    drinks,
    beansList,
  });

  if (brewsLoading || espressoLoading || beansLoading) {
    return null;
  }

  return (
    <>
      <BreadcrumbsWithHome items={[navLinks.drinks]} />

      <Heading>Drinks</Heading>

      <ul tw="mt-4">
        <li>
          <Link as={RouterLink} to="brews">
            Go to brews
          </Link>
        </li>
        <li>
          <Link as={RouterLink} to="espresso">
            Go to espressos
          </Link>
        </li>
        <li>
          <Link as={RouterLink} to="tastings">
            Go to tastings
          </Link>
        </li>
      </ul>

      {drinks.map(([date, drinks]) => (
        <div key={date} tw="mt-4">
          <span tw="block mb-2 text-sm font-medium text-center text-gray-500">
            {date}
          </span>
          <ul tw="flex flex-col gap-4">
            {drinks.map((item, i) => (
              <DrinkItemWithTime
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
};

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

export const DrinkItemSimple = ({ drink, type, beans }: DrinkItemProps) => {
  console.log(beans);

  return (
    <li key={drink.id} css={[tw`w-5/6`, type === "espresso" && tw`self-end`]}>
      <RouterLink
        to={
          type === "brew"
            ? `brews/${drink.id ?? ""}`
            : `espresso/${drink.id ?? ""}`
        }
      >
        <Card tw="flex-grow text-sm">
          {type === "brew" ? (
            <BrewCardContent brew={drink} beans={beans} />
          ) : (
            <EspressoCardContent espresso={drink} beans={beans} />
          )}
        </Card>
      </RouterLink>
    </li>
  );
};

export const DrinkItemWithTime = ({ drink, type, beans }: DrinkItemProps) => (
  <li
    key={drink.id}
    // css={[tw`w-5/6`, type === "espresso" && tw`self-end`]}
  >
    <RouterLink
      to={
        type === "brew"
          ? `brews/${drink.id ?? ""}`
          : `espresso/${drink.id ?? ""}`
      }
    >
      <div
        css={[
          tw`flex items-center gap-2`,
          type === "brew" && tw`flex-row-reverse`,
        ]}
      >
        <span
          css={[
            tw`flex flex-col items-center w-16 gap-1 text-sm text-gray-500`,
            // type === "brew" && tw`flex-row-reverse`,
          ]}
        >
          {type === "brew" ? (
            <DripperIcon tw="w-5 h-5 text-gray-500" />
          ) : (
            <PortafilterIcon tw="w-5 h-5 text-gray-500" />
          )}
          <div tw="flex items-center gap-1">
            <ClockIcon tw="w-4 h-4 text-gray-400" />
            {dayjs(drink.date.toDate()).format("HH:mm")}
          </div>
        </span>
        <Card tw="flex-grow text-sm">
          {type === "brew" ? (
            <BrewCardContent brew={drink} beans={beans} />
          ) : (
            <EspressoCardContent espresso={drink} beans={beans} />
          )}
        </Card>
      </div>
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
      <p tw="font-medium text-gray-900">{brew.method}</p>
      <p tw="flex items-center gap-1 text-gray-600">
        <BeanBagIcon variant="solid" tw="w-3 h-3 text-gray-500" /> {beans?.name}
      </p>
      <p tw="flex items-center gap-1 text-gray-600">
        <BeanIcon tw="w-3 h-3 text-gray-500" />
        {brew.beansWeight}g : {brew.waterWeight}ml
        <DropIcon tw="w-3 h-3 text-gray-500" />
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
        <p tw="font-medium text-gray-900">{espresso.profileName}</p>
      )}
      <p tw="flex items-center gap-1 text-gray-600">
        <BeanBagIcon variant="solid" tw="w-3 h-3 text-gray-500" /> {beans?.name}
      </p>
      <p tw="flex items-center gap-1 text-gray-600">
        <BeanIcon tw="w-3 h-3 text-gray-500" />
        {espresso.beansWeight ?? ""}g : {espresso.targetWeight ?? ""}g
        <DropIcon tw="w-3 h-3 text-gray-500" />
      </p>
    </div>
    <div tw="flex flex-col items-end justify-between">
      <p tw="px-1 py-0.5 -mt-0.5 font-medium text-orange-600 bg-orange-50 rounded">
        {espresso.rating}
      </p>
      {/* <PortafilterIcon tw="w-5 h-5 text-gray-500" /> */}
    </div>
  </div>
);
