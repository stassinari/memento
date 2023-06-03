import dayjs from "dayjs";
import { orderBy, where } from "firebase/firestore";
import { entries, groupBy, mapValues } from "lodash";
import React, { useCallback, useMemo } from "react";
import { Link as RouterLink } from "react-router-dom";
import "twin.macro";
import { navLinks } from "../components/BottomNav";
import { BreadcrumbsWithHome } from "../components/Breadcrumbs";
import { Heading } from "../components/Heading";
import { Link } from "../components/Link";
import { useCollectionQuery } from "../hooks/firestore/useCollectionQuery";
import { useFirestoreCollectionRealtime } from "../hooks/firestore/useFirestoreCollectionRealtime";
import { Brew } from "../types/brew";
import { Espresso } from "../types/espresso";

const mergeBrewsAndEspressoByUniqueDate = (
  brews: Brew[],
  espresso: Espresso[]
) => {};

export const DrinksPage: React.FC = () => {
  console.log("DrinksPage");

  const aMonthAgo = useCallback(
    () => dayjs(new Date()).subtract(12, "month").toDate(), // FIXME use 1 month
    []
  );

  const filters = useMemo(
    () => [orderBy("date", "desc"), where("date", ">", aMonthAgo())],
    [aMonthAgo]
  );

  const brewQuery = useCollectionQuery<Brew>("brews", filters);
  const { list: brewsList } = useFirestoreCollectionRealtime<Brew>(brewQuery);

  const espressoQuery = useCollectionQuery<Espresso>("espresso", filters);
  const { list: espressoList } =
    useFirestoreCollectionRealtime<Espresso>(espressoQuery);

  const brews = groupBy(brewsList, (brew) =>
    dayjs(brew.date.toDate()).format("DD MMM YYYY")
  );
  const brewsWithType = mapValues(brews, (values) =>
    values.map((brew) => ({
      brew,
      type: "brew" as const,
    }))
  );
  const espressos = groupBy(espressoList, (espresso) =>
    dayjs(espresso.date.toDate()).format("DD MMM YYYY")
  );
  const espressoWithType = mapValues(espressos, (values) =>
    values.map((espresso) => ({
      espresso,
      type: "espresso" as const,
    }))
  );

  const drinks: Record<
    string,
    Array<
      { brew: Brew; type: "brew" } | { espresso: Espresso; type: "espresso" }
    >
  > = {};

  Object.keys(brews).forEach((key) => {
    drinks[key] = brewsWithType[key];
  });

  Object.keys(espressos).forEach((key) => {
    if (drinks[key]) {
      drinks[key] = [...drinks[key], ...espressoWithType[key]];
    } else {
      drinks[key] = espressoWithType[key];
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

  console.log({
    drinks,
    sortedDrinks,
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
    </>
  );
};
