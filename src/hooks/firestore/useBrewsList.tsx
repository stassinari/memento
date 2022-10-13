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
import { Brew } from "../../types/brews";
import { userAtom } from "../useInitUser";

interface UseBrewsListResult {
  brewsList: Brew[];
  isLoading: boolean;
}

export const useBrewsList = (
  filters: QueryConstraint[] = []
): UseBrewsListResult => {
  const [user] = useAtom(userAtom);

  const [brewsList, setBrewsList] = useState<Brew[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const collectionRef = collection(
    db,
    "users",
    user?.uid || "lol",
    "brews"
  ) as CollectionReference<Brew>;

  const query = fbQuery(collectionRef, ...filters);

  useEffect(() => {
    const unsubscribe = onSnapshot(query, (querySnap) => {
      let list: Brew[] = [];

      querySnap.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });

      setBrewsList(list);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { brewsList, isLoading };
};
