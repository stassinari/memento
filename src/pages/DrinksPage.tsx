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
import { useCollectionQuery } from "../hooks/firestore/useCollectionQuery";
import { useFirestoreCollectionRealtime } from "../hooks/firestore/useFirestoreCollectionRealtime";
import { Beans } from "../types/beans";
import { Brew } from "../types/brew";
import { Espresso } from "../types/espresso";

const mergeBrewsAndEspressoByUniqueDate = (
  brewsList: Brew[],
  espressoList: Espresso[]
) => {
  const brews = chain(brewsList)
    .groupBy((brew) => dayjs(brew.date.toDate()).format("DD MMM YYYY"))
    .mapValues((values) =>
      values.map((brew) => ({
        drink: brew,
        type: "brew" as const,
      }))
    )
    .value();
  const espressos = chain(espressoList)
    .groupBy((espresso) => dayjs(espresso.date.toDate()).format("DD MMM YYYY"))
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
            {drinks.map(({ drink, type }) => (
              <li
                key={drink.id}
                css={[tw`w-5/6`, type === "espresso" && tw`self-end`]}
              >
                <RouterLink
                  to={
                    type === "brew"
                      ? `brews/${drink.id ?? ""}`
                      : `espresso/${drink.id ?? ""}`
                  }
                >
                  <Card>
                    <span tw="text-sm">
                      {type === "brew"
                        ? drink.method
                        : `${drink.beansWeight ?? ""}g : ${
                            drink.targetWeight ?? ""
                          }g`}{" "}
                      @ {dayjs(drink.date.toDate()).format("HH:mm")}
                    </span>
                  </Card>
                </RouterLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
};
