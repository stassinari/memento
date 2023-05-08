import { limit, orderBy } from "firebase/firestore";
import React, { useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import "twin.macro";
import { navLinks } from "../../components/BottomNav";
import { BreadcrumbsWithHome } from "../../components/Breadcrumbs";
import { Button } from "../../components/Button";
import { DataList } from "../../components/DataList";
import { PageHeading } from "../../components/Heading";
import { brewToDataListItem } from "../../components/brews/utils";
import { useCollectionQuery } from "../../hooks/firestore/useCollectionQuery";
import { useFirestoreCollectionRealtime } from "../../hooks/firestore/useFirestoreCollectionRealtime";
import { Brew } from "../../types/brew";

export const BrewsList: React.FC = () => {
  const [brewLimit, setBrewLimit] = useState(50);

  const filters = useMemo(
    () => [orderBy("date", "desc"), limit(brewLimit)],
    [brewLimit]
  );

  const query = useCollectionQuery<Brew>("brews", filters);
  const { list: brewsList } = useFirestoreCollectionRealtime<Brew>(query);

  console.log("brewList");
  return (
    <>
      <BreadcrumbsWithHome items={[navLinks.drinks, navLinks.brews]} />

      <PageHeading>Brews</PageHeading>

      <div tw="mb-4 text-right">
        <Button as={RouterLink} to="add" variant="primary" colour="accent">
          Add brew
        </Button>
      </div>
      <div>
        <DataList items={brewsList.map(brewToDataListItem)} />
      </div>
      <div tw="flex justify-center gap-4 mt-4">
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
