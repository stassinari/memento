import { Link as RouterLink, createFileRoute } from "@tanstack/react-router";
import dayjs from "dayjs";
import { orderBy, where } from "firebase/firestore";
import { useCallback, useMemo } from "react";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";
import {
  DrinksList,
  mergeBrewsAndEspressoByUniqueDate,
} from "~/components/DrinksList";
import { Heading } from "~/components/Heading";
import { Link } from "~/components/Link";
import { useCollectionQuery } from "~/hooks/firestore/useCollectionQuery";
import { useFirestoreCollectionRealtime } from "~/hooks/firestore/useFirestoreCollectionRealtime";
import { Beans } from "~/types/beans";
import { Brew } from "~/types/brew";
import { Espresso } from "~/types/espresso";

export const Route = createFileRoute("/_auth/_layout/drinks/")({
  component: DrinksPage,
});

function DrinksPage() {
  console.log("DrinksPage");

  const aMonthAgo = useCallback(
    () => dayjs(new Date()).subtract(1, "month").toDate(), // FIXME use 1 month
    [],
  );

  const filters = useMemo(
    () => [orderBy("date", "desc"), where("date", ">", aMonthAgo())],
    [aMonthAgo],
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
    [brewsList, espressoList],
  );

  if (brewsLoading || espressoLoading || beansLoading) {
    return null;
  }

  return (
    <>
      <BreadcrumbsWithHome items={[navLinks.drinks]} />

      <Heading>Drinks</Heading>

      <ul className="mt-4">
        <li>
          <Link asChild>
            <RouterLink to="/drinks/brews">Go to brews</RouterLink>
          </Link>
        </li>
        <li>
          <Link asChild>
            <RouterLink to="/drinks/espresso">Go to espressos</RouterLink>
          </Link>
        </li>
        <li>
          <Link asChild>
            <RouterLink to="/drinks/tastings">Go to tastings</RouterLink>
          </Link>
        </li>
      </ul>

      <DrinksList drinks={drinks} beansList={beansList} />
    </>
  );
}
