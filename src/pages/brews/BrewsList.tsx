import { limit, orderBy } from "firebase/firestore";
import React, { useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import { navLinks } from "../../components/BottomNav";
import { BreadcrumbsWithHome } from "../../components/Breadcrumbs";
import { Button } from "../../components/Button";
import {
  DrinksList,
  mergeBrewsAndEspressoByUniqueDate,
} from "../../components/DrinksList";
import { Heading } from "../../components/Heading";
import { useCollectionQuery } from "../../hooks/firestore/useCollectionQuery";
import { useFirestoreCollectionRealtime } from "../../hooks/firestore/useFirestoreCollectionRealtime";
import useScreenMediaQuery from "../../hooks/useScreenMediaQuery";
import { Beans } from "../../types/beans";
import { type Brew } from "../../types/brew";

export const BrewsList: React.FC = () => {
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

  const drinks = useMemo(
    () => mergeBrewsAndEspressoByUniqueDate(brewsList, []),
    [brewsList],
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
            as={RouterLink}
            to="add"
            variant="primary"
            colour="accent"
            size={isSm ? "md" : "sm"}
          >
            Add brew
          </Button>
        }
      >
        Brews
      </Heading>

      <div className="mt-4">
        <DrinksList drinks={drinks} beansList={beansList} />
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
        <Button as={RouterLink} to="table" variant="white" colour="accent">
          View all brews
        </Button>
      </div>
    </>
  );
};
