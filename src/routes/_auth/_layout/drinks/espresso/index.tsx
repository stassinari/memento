import { Link as RouterLink, createFileRoute } from "@tanstack/react-router";
import { limit, orderBy } from "firebase/firestore";
import { useMemo, useState } from "react";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";
import { Button } from "~/components/Button";
import {
  DrinksList,
  mergeBrewsAndEspressoByUniqueDate,
} from "~/components/drinks/DrinksList.Firebase";
import { Heading } from "~/components/Heading";
import { useCollectionQuery } from "~/hooks/firestore/useCollectionQuery";
import { useFirestoreCollectionRealtime } from "~/hooks/firestore/useFirestoreCollectionRealtime";
import useScreenMediaQuery from "~/hooks/useScreenMediaQuery";
import { Beans } from "~/types/beans";
import { Espresso } from "~/types/espresso";

export const Route = createFileRoute("/_auth/_layout/drinks/espresso/")({
  component: EspressoList,
});

function EspressoList() {
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

  const drinks = useMemo(
    () => mergeBrewsAndEspressoByUniqueDate([], espressoList),
    [espressoList],
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
        <DrinksList drinks={drinks} beansList={beansList} />
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
