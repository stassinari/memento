import { limit, orderBy } from "firebase/firestore";
import { useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import "twin.macro";
import { Button } from "../../components/Button";
import { DataList } from "../../components/DataList";
import { brewToDataListItem } from "../../components/brews/utils";
import { useCollectionQuery } from "../../hooks/firestore/useCollectionQuery";
import { useFirestoreCollectionRealtime } from "../../hooks/firestore/useFirestoreCollectionRealtime";
import { Brew } from "../../types/brew";

export const BrewsList = () => {
  const [brewLimit, setBrewLimit] = useState(50);

  const filters = useMemo(
    () => [orderBy("date", "desc"), limit(brewLimit)],
    [brewLimit]
  );

  const query = useCollectionQuery<Brew>("brews", filters);
  const { list: brewsList } = useFirestoreCollectionRealtime<Brew>(query);

  console.log("brewList");
  return (
    <div>
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
        <Button as={RouterLink} to="all" variant="white" colour="accent">
          View all brews
        </Button>
      </div>
    </div>
  );
};
