import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link as RouterLink } from "@tanstack/react-router";
import { limit, orderBy } from "firebase/firestore";
import { queryOptions } from "node_modules/@tanstack/react-query/build/modern/queryOptions";
import { useAtomValue } from "jotai";
import { useMemo, useState } from "react";
import { userAtom } from "~/hooks/useInitUser";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";
import { Button } from "~/components/Button";
import {
  DrinksList as FirebaseDrinksList,
  mergeBrewsAndEspressoByUniqueDate as firebaseMergeBrewsAndEspressoByUniqueDate,
} from "~/components/drinks/DrinksList.Firebase";
import {
  DrinksList as PostgresDrinksList,
  mergeBrewsAndEspressoByUniqueDate as postgresMergeBrewsAndEspressoByUniqueDate,
} from "~/components/drinks/DrinksList.Postgres";
import { Heading } from "~/components/Heading";
import { getBrews } from "~/db/queries";
import { useCollectionQuery } from "~/hooks/firestore/useCollectionQuery";
import { useFirestoreCollectionRealtime } from "~/hooks/firestore/useFirestoreCollectionRealtime";
import useScreenMediaQuery from "~/hooks/useScreenMediaQuery";
import { Beans } from "~/types/beans";
import { type Brew } from "~/types/brew";
import { flagsQueryOptions } from "../../featureFlags";

const brewsQueryOptions = (firebaseUid: string) =>
  queryOptions({
    queryKey: ["brews", firebaseUid],
    queryFn: () => getBrews({ data: firebaseUid }),
  });

export const Route = createFileRoute("/_auth/_layout/drinks/brews/")({
  component: BrewsList,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(flagsQueryOptions());
    // User data will be loaded in component since it's client-side only
  },
});

function BrewsList() {
  const { data: flags } = useSuspenseQuery(flagsQueryOptions());
  const user = useAtomValue(userAtom);
  const brewsQuery = useSuspenseQuery(brewsQueryOptions(user?.uid ?? ""));
  const sqlBrewsWithBeans = brewsQuery.data;

  const shouldReadFromPostgres = flags?.find(
    (flag) => flag.name === "read_from_postgres",
  )?.enabled;

  const [brewLimit, setBrewLimit] = useState(50);

  const filters = useMemo(
    () => [orderBy("date", "desc"), limit(brewLimit)],
    [brewLimit],
  );

  const query = useCollectionQuery<Brew>("brews", filters);
  const { list: brewsList, isLoading: brewsLoading } =
    useFirestoreCollectionRealtime<Brew>(query);

  const beansFilters = useMemo(() => [orderBy("roastDate", "desc")], []);
  const beansQuery = useCollectionQuery<Beans>("beans", beansFilters);
  const { list: beansList, isLoading: beansLoading } =
    useFirestoreCollectionRealtime<Beans>(beansQuery);

  const firebaseDrinks = useMemo(
    () => firebaseMergeBrewsAndEspressoByUniqueDate(brewsList, []),
    [brewsList],
  );

  const postgresDrinks = useMemo(
    () => postgresMergeBrewsAndEspressoByUniqueDate(sqlBrewsWithBeans, []),
    [sqlBrewsWithBeans],
  );

  const isSm = useScreenMediaQuery("sm");

  console.log("brewList");

  if (brewsLoading || beansLoading) {
    return null;
  }
  return (
    <>
      <BreadcrumbsWithHome items={[navLinks.drinks, navLinks.brews]} />

      <Heading
        actionSlot={
          <Button
            variant="primary"
            colour="accent"
            size={isSm ? "md" : "sm"}
            asChild
          >
            <RouterLink to="/drinks/brews/add">Add brew</RouterLink>
          </Button>
        }
      >
        Brews
      </Heading>

      <div className="mt-4">
        {shouldReadFromPostgres ? (
          <PostgresDrinksList drinks={postgresDrinks} />
        ) : (
          <FirebaseDrinksList drinks={firebaseDrinks} beansList={beansList} />
        )}
      </div>
      <div className="flex justify-center gap-4 mt-4">
        {brewsList.length >= brewLimit && (
          <Button
            variant="white"
            colour="accent"
            onClick={() => setBrewLimit(brewLimit + 50)}
          >
            Load more
          </Button>
        )}
        <Button variant="white" colour="accent" asChild>
          <RouterLink to="/drinks/brews/table">View all brews</RouterLink>
        </Button>
      </div>
    </>
  );
}
