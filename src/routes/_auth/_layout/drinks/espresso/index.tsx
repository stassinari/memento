import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Link as RouterLink, createFileRoute } from "@tanstack/react-router";
import { limit, orderBy } from "firebase/firestore";
import { useAtomValue } from "jotai";
import { useMemo, useState } from "react";
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
import { getEspressos } from "~/db/queries";
import type { EspressoWithBeans } from "~/db/types";
import { useCollectionQuery } from "~/hooks/firestore/useCollectionQuery";
import { useFirestoreCollectionRealtime } from "~/hooks/firestore/useFirestoreCollectionRealtime";
import { userAtom } from "~/hooks/useInitUser";
import useScreenMediaQuery from "~/hooks/useScreenMediaQuery";
import { Beans } from "~/types/beans";
import { Espresso } from "~/types/espresso";
import { flagsQueryOptions } from "../../featureFlags";

const espressosQueryOptions = (firebaseUid: string) =>
  queryOptions<EspressoWithBeans[]>({
    queryKey: ["espressos", firebaseUid],
    queryFn: () => getEspressos({ data: firebaseUid }) as Promise<EspressoWithBeans[]>,
  });

export const Route = createFileRoute("/_auth/_layout/drinks/espresso/")({
  component: EspressoList,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(flagsQueryOptions());
  },
});

function EspressoList() {
  const { data: flags } = useSuspenseQuery(flagsQueryOptions());
  const user = useAtomValue(userAtom);
  const { data: sqlEspressosWithBeans } = useSuspenseQuery<EspressoWithBeans[]>(
    espressosQueryOptions(user?.uid ?? ""),
  );

  const shouldReadFromPostgres = flags?.find(
    (flag) => flag.name === "read_from_postgres",
  )?.enabled;

  const [espressoLimit, setEspressoLimit] = useState(50);

  const filters = useMemo(
    () => [orderBy("date", "desc"), limit(espressoLimit)],
    [espressoLimit],
  );

  const query = useCollectionQuery<Espresso>("espresso", filters);
  const { list: espressoList, isLoading: espressoLoading } =
    useFirestoreCollectionRealtime<Espresso>(query);

  const beansFilters = useMemo(() => [orderBy("roastDate", "desc")], []);
  const beansQuery = useCollectionQuery<Beans>("beans", beansFilters);
  const { list: beansList, isLoading: beansLoading } =
    useFirestoreCollectionRealtime<Beans>(beansQuery);

  const firebaseDrinks = useMemo(
    () => firebaseMergeBrewsAndEspressoByUniqueDate([], espressoList),
    [espressoList],
  );

  const postgresDrinks = useMemo(
    () => postgresMergeBrewsAndEspressoByUniqueDate([], sqlEspressosWithBeans),
    [sqlEspressosWithBeans],
  );

  const isSm = useScreenMediaQuery("sm");

  console.log("espressoList");

  if (espressoLoading || beansLoading) {
    return null;
  }

  return (
    <>
      <BreadcrumbsWithHome items={[navLinks.drinks, navLinks.espresso]} />

      <Heading
        actionSlot={
          <Button
            variant="primary"
            colour="accent"
            size={isSm ? "md" : "sm"}
            asChild
          >
            <RouterLink to="/drinks/espresso/add">Add espresso</RouterLink>
          </Button>
        }
      >
        Espressos
      </Heading>

      <div className="mt-4">
        {shouldReadFromPostgres ? (
          <PostgresDrinksList drinks={postgresDrinks} />
        ) : (
          <FirebaseDrinksList drinks={firebaseDrinks} beansList={beansList} />
        )}
      </div>
      <div className="flex justify-center gap-4 mt-4">
        {espressoList.length >= espressoLimit && (
          <Button
            variant="white"
            colour="accent"
            onClick={() => setEspressoLimit(espressoLimit + 50)}
          >
            Load more
          </Button>
        )}
        <Button variant="white" colour="accent" asChild>
          <RouterLink to="/drinks/espresso">View all espresso (TBD)</RouterLink>
        </Button>
      </div>
    </>
  );
}
