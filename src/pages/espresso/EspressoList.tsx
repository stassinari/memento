import { limit, orderBy } from "firebase/firestore";
import React, { useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import "twin.macro";
import { navLinks } from "../../components/BottomNav";
import { BreadcrumbsWithHome } from "../../components/Breadcrumbs";
import { Button } from "../../components/Button";
import { DataList } from "../../components/DataList";
import { PageHeading } from "../../components/Heading";
import { espressoToDataListItem } from "../../components/espresso/utils";
import { useCollectionQuery } from "../../hooks/firestore/useCollectionQuery";
import { useFirestoreCollectionRealtime } from "../../hooks/firestore/useFirestoreCollectionRealtime";
import { Espresso } from "../../types/espresso";

const EspressoList: React.FC = () => {
  const [espressoLimit, setEspressoLimit] = useState(50);

  const filters = useMemo(
    () => [orderBy("date", "desc"), limit(espressoLimit)],
    [espressoLimit]
  );

  const query = useCollectionQuery<Espresso>("espresso", filters);
  const { list: espressoList } =
    useFirestoreCollectionRealtime<Espresso>(query);

  console.log("espressoList");

  return (
    <>
      <BreadcrumbsWithHome items={[navLinks.drinks, navLinks.espresso]} />

      <PageHeading>Espressos</PageHeading>

      <div tw="mb-4 text-right">
        <Button as={RouterLink} to="add" variant="primary" colour="accent">
          Add espresso
        </Button>
      </div>
      <div>
        <DataList items={espressoList.map(espressoToDataListItem)} />
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
        <Button as={RouterLink} to="all" variant="white" colour="accent">
          View all espresso
        </Button>
      </div>
    </>
  );
};

export default EspressoList;
