import {
  collection,
  CollectionReference,
  onSnapshot,
  query as fbQuery,
  QueryConstraint,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { useCurrentUser } from "../useInitUser";

interface UseFirestoreListResult<T> {
  list: T[];
  isLoading: boolean;
}

export const useFirestoreList = <T,>(
  type: "brews" | "beans",
  filters: QueryConstraint[] = []
): UseFirestoreListResult<T> => {
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
      let tempList: T[] = [];

      querySnap.forEach((doc) => {
        tempList.push({ id: doc.id, ...doc.data() });
      });

      setList(tempList);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { list, isLoading };
};
