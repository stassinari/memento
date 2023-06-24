import { limit, orderBy } from "firebase/firestore";
import React, { useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import "twin.macro";
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
import { Espresso } from "../../types/espresso";

const EspressoList: React.FC = () => {
  const [espressoLimit, setEspressoLimit] = useState(50);

  const filters = useMemo(
    () => [orderBy("date", "desc"), limit(espressoLimit)],
    [espressoLimit]
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
    [espressoList]
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
            as={RouterLink}
            to="add"
            variant="primary"
            colour="accent"
            size={isSm ? "md" : "sm"}
          >
            Add espresso
          </Button>
        }
      >
        Espressos
      </Heading>

      <div tw="mt-4">
        <DrinksList drinks={drinks} beansList={beansList} />
      </div>
      <div tw="flex justify-center gap-4 mt-4">
        {espressoList.length >= espressoLimit && (
          <Button
            variant="white"
            colour="accent"
            onClick={() => setEspressoLimit(espressoLimit + 50)}
          >
            Load more
          </Button>
        )}
        <Button as={RouterLink} to="#" variant="white" colour="accent">
          View all espresso (TBD)
        </Button>
      </div>
    </>
  );
};

export default EspressoList;
