import { limit, orderBy } from "firebase/firestore";
import { useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import "twin.macro";
import { Button } from "../../components/Button";
import { DataList } from "../../components/DataList";
import { espressoToDataListItem } from "../../components/espresso/utils";
import { useBuildQuery } from "../../hooks/firestore/useBuildQuery";
import { useFirestoreCollectionNew } from "../../hooks/firestore/useFirestoreCollectionNew";
import { Espresso } from "../../types/espresso";

const EspressoList = () => {
  const [espressoLimit, setEspressoLimit] = useState(50);

  const filters = useMemo(() => {
    return [orderBy("date", "desc"), limit(espressoLimit)];
  }, [espressoLimit]);

  const query = useBuildQuery<Espresso>("espresso", filters);
  const { list: espressoList } = useFirestoreCollectionNew<Espresso>(query);

  console.log("espressoList");

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
      <div tw="flex justify-center gap-4 mt-4">
        <Button
          variant="white"
          colour="accent"
          onClick={() => setEspressoLimit(espressoLimit + 50)}
        >
          Load more
        </Button>
        <Button as={RouterLink} to="all" variant="white" colour="accent">
          View all espresso
        </Button>
      </div>
    </div>
  );
};

export default EspressoList;
