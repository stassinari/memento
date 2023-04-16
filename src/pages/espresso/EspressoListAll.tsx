import { orderBy } from "firebase/firestore";
import { useMemo } from "react";
import { Link as RouterLink } from "react-router-dom";
import "twin.macro";
import { Button } from "../../components/Button";
import { DataList } from "../../components/DataList";
import { espressoToDataListItem } from "../../components/espresso/utils";
import { useCollectionQuery } from "../../hooks/firestore/useCollectionQuery";
import { useFirestoreCollectionRealtime } from "../../hooks/firestore/useFirestoreCollectionRealtime";
import { Espresso } from "../../types/espresso";

const EspressoListAll = () => {
  console.log("EspressoListAll");

  const filters = useMemo(() => [orderBy("date", "desc")], []);
  const query = useCollectionQuery<Espresso>("espresso", filters);
  const { list: espressoList } =
    useFirestoreCollectionRealtime<Espresso>(query);

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
    </div>
  );
};

export default EspressoListAll;
