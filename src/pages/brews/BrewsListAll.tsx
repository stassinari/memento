import { orderBy } from "firebase/firestore";
import { useMemo } from "react";
import { Link as RouterLink } from "react-router-dom";
import "twin.macro";
import { Button } from "../../components/Button";
import { DataList } from "../../components/DataList";
import { brewToDataListItem } from "../../components/brews/utils";
import { useCollectionQuery } from "../../hooks/firestore/useCollectionQuery";
import { useFirestoreCollectionRealtime } from "../../hooks/firestore/useFirestoreCollectionRealtime";
import { Brew } from "../../types/brew";

export const BrewsListAll = () => {
  console.log("BrewsListAll");

  const filters = useMemo(() => [orderBy("date", "desc")], []);
  const query = useCollectionQuery<Brew>("brews", filters);
  const { list: brewsList } = useFirestoreCollectionRealtime<Brew>(query);

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
    </div>
  );
};
