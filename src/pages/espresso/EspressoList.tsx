import { orderBy } from "firebase/firestore";
import { Link as RouterLink } from "react-router-dom";
import { Button } from "../../components/Button";
import { DataList } from "../../components/DataList";
import { espressoToDataListItem } from "../../components/espresso/utils";
import { useFirestoreCollection } from "../../hooks/firestore/useFirestoreCollection";
import { Espresso } from "../../types/espresso";

const EspressoList = () => {
  const { list: espressoList } = useFirestoreCollection<Espresso>("espresso", [
    orderBy("date", "desc"),
  ]);

  return (
    <div>
      <Button as={RouterLink} to="add" variant="primary" colour="accent">
        Add espresso
      </Button>
      <div>
        <DataList items={espressoList.map(espressoToDataListItem)} />
      </div>
    </div>
  );
};

export default EspressoList;
