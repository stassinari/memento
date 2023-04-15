import { limit, orderBy } from "firebase/firestore";
import { Link as RouterLink } from "react-router-dom";
import "twin.macro";
import { Button } from "../../components/Button";
import { DataList } from "../../components/DataList";
import { espressoToDataListItem } from "../../components/espresso/utils";
import { useFirestoreCollection } from "../../hooks/firestore/useFirestoreCollection";
import { Espresso } from "../../types/espresso";

const EspressoList = () => {
  const { list: espressoList } = useFirestoreCollection<Espresso>("espresso", [
    orderBy("date", "desc"),
    limit(50),
  ]);

  return (
    <div>
      <div tw="mb-4 text-right">
        <Button as={RouterLink} to="add" variant="primary" colour="accent">
          Add espresso
        </Button>
      </div>
      <div>
        <DataList items={espressoList.map(espressoToDataListItem)} />
      </div>
      <div tw="mt-4 text-center">
        <Button as={RouterLink} to="all" variant="white" colour="accent">
          View all espresso
        </Button>
      </div>
    </div>
  );
};

export default EspressoList;
