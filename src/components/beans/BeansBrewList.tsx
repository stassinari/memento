import { doc, orderBy, where } from "firebase/firestore";
import { useMemo } from "react";
import "twin.macro";
import { db } from "../../firebaseConfig";
import { useCollectionQuery } from "../../hooks/firestore/useCollectionQuery";
import { useFirestoreCollectionRealtime } from "../../hooks/firestore/useFirestoreCollectionRealtime";
import { Brew } from "../../types/brew";
import { DataList } from "../DataList";
import { brewToDataListItem } from "../brews/utils";

interface BeansBrewListProps {
  beansId: string;
}

export const BeansBrewList: React.FC<BeansBrewListProps> = ({ beansId }) => {
  const filters = useMemo(
    () => [
      where("beans", "==", doc(db, "beans", beansId)),
      orderBy("date", "desc"),
    ],
    [beansId]
  );

  const query = useCollectionQuery<Brew>("brews", filters);
  const { list: brewsList } = useFirestoreCollectionRealtime<Brew>(query);

  console.log("BeansBrewList");

  return (
    <div>
      <h3 tw="mb-5 text-lg font-medium leading-6 text-gray-900">Brews</h3>

      <DataList items={brewsList.map(brewToDataListItem)} />
    </div>
  );
};
