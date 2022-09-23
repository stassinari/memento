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
import { Beans } from "../../types/beans";
import { userAtom } from "../useInitUser";

interface UseBeansListProps {
  beansList: Beans[];
  isLoading: boolean;
}

export const useBeansList = (
  filters: QueryConstraint[] = []
): UseBeansListProps => {
  const [user] = useAtom(userAtom);

  const [beansList, setBeansList] = useState<Beans[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const collectionRef = collection(
    db,
    "users",
    user?.uid || "lol",
    "beans"
  ) as CollectionReference<Beans>;

  const query = fbQuery(collectionRef, ...filters);

  useEffect(() => {
    const unsubscribe = onSnapshot(query, (querySnap) => {
      let list: Beans[] = [];

      querySnap.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });

      setBeansList(list);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { beansList, isLoading };
};
