import { orderBy } from "firebase/firestore";
import { Link as RouterLink } from "react-router-dom";
import "twin.macro";
import { Button } from "../../components/Button";
import { DataList } from "../../components/DataList";
import { brewToDataListItem } from "../../components/brews/utils";
import { useFirestoreCollection } from "../../hooks/firestore/useFirestoreCollection";
import { Brew } from "../../types/brew";

export const BrewsListAll = () => {
  const { list: brewsList } = useFirestoreCollection<Brew>("brews", [
    orderBy("date", "desc"),
  ]);

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
