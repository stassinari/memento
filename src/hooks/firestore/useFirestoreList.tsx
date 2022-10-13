import {
  collection,
  CollectionReference,
  onSnapshot,
  query as fbQuery,
  QueryConstraint,
} from "firebase/firestore";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { userAtom } from "../useInitUser";

interface UseFirestoreListResult<T> {
  list: T[];
  isLoading: boolean;
}

export const useFirestoreList = <T,>(
  path: "brews" | "beans",
  filters: QueryConstraint[] = []
): UseFirestoreListResult<T> => {
  const [user] = useAtom(userAtom);

  const [list, setList] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const collectionRef = collection(
    db,
    "users",
    user?.uid || "lol",
    path
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
