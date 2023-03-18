import { orderBy } from "firebase/firestore";
import { Link as RouterLink } from "react-router-dom";
import { brewToDataListItem } from "../../components/brews/utils";
import { Button } from "../../components/Button";
import { DataList } from "../../components/DataList";
import { useFirestoreCollection } from "../../hooks/firestore/useFirestoreCollection";
import { Brew } from "../../types/brews";

export const BrewsList = () => {
  const { list: brewsList } = useFirestoreCollection<Brew>("brews", [
    orderBy("date", "desc"),
  ]);

  return (
    <div>
      <Button as={RouterLink} to="add" variant="primary" colour="accent">
        Add brew
      </Button>
      <div>
        <DataList items={brewsList.map(brewToDataListItem)} />
      </div>
    </div>
  );
};
