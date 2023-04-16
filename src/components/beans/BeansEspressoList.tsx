import { doc, orderBy, where } from "firebase/firestore";
import { useMemo } from "react";
import "twin.macro";
import { db } from "../../firebaseConfig";
import { useCollectionQuery } from "../../hooks/firestore/useCollectionQuery";
import { useFirestoreCollectionRealtime } from "../../hooks/firestore/useFirestoreCollectionRealtime";
import { Espresso } from "../../types/espresso";
import { DataList } from "../DataList";
import { espressoToDataListItem } from "../espresso/utils";

interface BeansEspressoListProps {
  beansId: string;
}

export const BeansEspressoList: React.FC<BeansEspressoListProps> = ({
  beansId,
}) => {
  const filters = useMemo(() => {
    return [
      where("beans", "==", doc(db, "beans", beansId)),
      orderBy("date", "desc"),
    ];
  }, [beansId]);

  const query = useCollectionQuery<Espresso>("espresso", filters);
  const { list: espressoList } =
    useFirestoreCollectionRealtime<Espresso>(query);

  console.log("BeansEspressoList");

  return (
    <div>
      <h3 tw="mb-5 text-lg font-medium leading-6 text-gray-900">Espresso</h3>

      <DataList items={espressoList.map(espressoToDataListItem)} />
    </div>
  );
};
