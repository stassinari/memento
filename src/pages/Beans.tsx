import {
  collection,
  CollectionReference,
  orderBy,
  query,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import { useFirestore, useFirestoreCollectionData, useUser } from "reactfire";
import { Beans } from "../types/beans";

export const BeansList = () => {
  const { data: user } = useUser();
  const firestore = useFirestore();
  const beansRef = collection(
    firestore,
    "users",
    user?.uid || "",
    "beans"
  ) as CollectionReference<Beans>;
  const beansQuery = query(beansRef, orderBy("roastDate", "desc"));
  const { data: beans } = useFirestoreCollectionData(beansQuery, {
    idField: "id",
  });

  return (
    <div>
      These are all your beans
      {beans.map((b) => (
        <div key={b.id}>
          <Link to={`/beans/${b.id}`}>
            {b.name} - {b.roaster}
          </Link>
        </div>
      ))}
    </div>
  );
};
