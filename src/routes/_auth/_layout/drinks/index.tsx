import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Link as RouterLink, createFileRoute } from "@tanstack/react-router";
import { limit, orderBy } from "firebase/firestore";
import { useMemo } from "react";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";
import {
  DrinksList as DrinksListFirebase,
  mergeBrewsAndEspressoByUniqueDate as mergeFirebase,
} from "~/components/drinks/DrinksList.Firebase";
import {
  DrinksList as DrinksListPostgres,
  mergeBrewsAndEspressoByUniqueDate as mergePostgres,
} from "~/components/drinks/DrinksList.Postgres";
import { Heading } from "~/components/Heading";
import { Link } from "~/components/Link";
import { getBrews, getEspressos } from "~/db/queries";
import type { BrewWithBeans, EspressoWithBeans } from "~/db/types";
import { useCollectionQuery } from "~/hooks/firestore/useCollectionQuery";
import { useFirestoreCollectionRealtime } from "~/hooks/firestore/useFirestoreCollectionRealtime";
import { useCurrentUser } from "~/hooks/useInitUser";
import { Beans } from "~/types/beans";
import { Brew } from "~/types/brew";
import { Espresso } from "~/types/espresso";
import { flagsQueryOptions } from "../featureFlags";

const brewsQueryOptions = (firebaseUid: string) =>
  queryOptions<BrewWithBeans[]>({
    queryKey: ["brews", firebaseUid],
    queryFn: () => getBrews({ data: firebaseUid }) as Promise<BrewWithBeans[]>,
  });

const espressosQueryOptions = (firebaseUid: string) =>
  queryOptions<EspressoWithBeans[]>({
    queryKey: ["espressos", firebaseUid],
    queryFn: () =>
      getEspressos({ data: firebaseUid }) as Promise<EspressoWithBeans[]>,
  });

export const Route = createFileRoute("/_auth/_layout/drinks/")({
  component: DrinksPage,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(flagsQueryOptions());
  },
});

function DrinksPage() {
  console.log("DrinksPage");
  const user = useCurrentUser();

  const { data: flags } = useSuspenseQuery(flagsQueryOptions());
  const readFromPostgres = flags?.find(
    (flag) => flag.name === "read_from_postgres",
  )?.enabled;

  // PostgreSQL data
  const { data: sqlBrewsList } = useSuspenseQuery(
    brewsQueryOptions(user?.uid ?? ""),
  );
  const { data: sqlEspressoList } = useSuspenseQuery(
    espressosQueryOptions(user?.uid ?? ""),
  );

  // Firestore data
  const filters = useMemo(() => [orderBy("date", "desc"), limit(30)], []);

  const brewQuery = useCollectionQuery<Brew>("brews", filters);
  const { list: fbBrewsList, isLoading: brewsLoading } =
    useFirestoreCollectionRealtime<Brew>(brewQuery);

  const espressoQuery = useCollectionQuery<Espresso>("espresso", filters);
  const { list: fbEspressoList, isLoading: espressoLoading } =
    useFirestoreCollectionRealtime<Espresso>(espressoQuery);

  const beansFilters = useMemo(() => [orderBy("roastDate", "desc")], []);
  const beansQuery = useCollectionQuery<Beans>("beans", beansFilters);
  const { list: fbBeansList, isLoading: beansLoading } =
    useFirestoreCollectionRealtime<Beans>(beansQuery);

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

      {readFromPostgres ? (
        <DrinksListPostgres
          drinks={mergePostgres(sqlBrewsList ?? [], sqlEspressoList ?? [])}
        />
      ) : (
        <DrinksListFirebase
          drinks={mergeFirebase(fbBrewsList, fbEspressoList)}
          beansList={fbBeansList}
        />
      )}
    </>
  );
}
