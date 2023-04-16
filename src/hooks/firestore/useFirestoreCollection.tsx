import {
  CollectionReference,
  QueryConstraint,
  collection,
  query as fbQuery,
  onSnapshot,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { useCurrentUser } from "../useInitUser";

interface UseFirestoreCollectionResult<T> {
  list: T[];
  isLoading: boolean;
}

export const useFirestoreCollection = <T,>(
  type: "brews" | "beans" | "espresso",
  filters: QueryConstraint[] = []
): UseFirestoreCollectionResult<T> => {
  const user = useCurrentUser();

  const [list, setList] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const collectionRef = collection(
    db,
    "users",
    user?.uid || "",
    type
  ) as CollectionReference<T>;

  const query = fbQuery(collectionRef, ...filters);

  useEffect(() => {
    const unsubscribe = onSnapshot(query, (querySnap) => {
      const tempList: T[] = [];

      querySnap.forEach((doc) => {
        tempList.push({ id: doc.id, ...doc.data() });
      });

      setList(tempList);
      setIsLoading(false);
    });
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { list, isLoading };
};
