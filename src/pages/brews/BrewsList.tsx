import { limit, orderBy } from "firebase/firestore";
import { Link as RouterLink } from "react-router-dom";
import "twin.macro";
import { Button } from "../../components/Button";
import { DataList } from "../../components/DataList";
import { brewToDataListItem } from "../../components/brews/utils";
import { useFirestoreCollection } from "../../hooks/firestore/useFirestoreCollection";
import { Brew } from "../../types/brew";

export const BrewsList = () => {
  const { list: brewsList } = useFirestoreCollection<Brew>("brews", [
    orderBy("date", "desc"),
    limit(50),
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
      <div tw="mt-4 text-center">
        <Button as={RouterLink} to="all" variant="white" colour="accent">
          View all brews
        </Button>
      </div>
    </div>
  );
};
