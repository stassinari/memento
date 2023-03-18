import { doc, orderBy, where } from "firebase/firestore";
import "twin.macro";
import { db } from "../../firebaseConfig";
import { useFirestoreCollection } from "../../hooks/firestore/useFirestoreCollection";
import { Brew } from "../../types/brews";
import { brewToDataListItem } from "../brews/utils";
import { DataList } from "../DataList";

interface BeansBrewListProps {
  beansId: string;
}

export const BeansBrewList: React.FC<BeansBrewListProps> = ({ beansId }) => {
  const { list: brewsList } = useFirestoreCollection<Brew>("brews", [
    where("beans", "==", doc(db, "beans", beansId)),
    orderBy("date", "desc"),
  ]);

  return (
    <div>
      <h3 tw="mb-5 text-lg font-medium leading-6 text-gray-900">Brews</h3>

      <DataList items={brewsList.map(brewToDataListItem)} />
    </div>
  );
};
