import { Query, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

interface UseFirestoreCollectionResult<T> {
  list: T[];
  isLoading: boolean;
}

export const useFirestoreCollectionNew = <T,>(
  query: Query<T> | null
): UseFirestoreCollectionResult<T> => {
  const [list, setList] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (query) {
      const unsubscribe = onSnapshot(query, (querySnap) => {
        const tempList: T[] = [];

        querySnap.forEach((doc) => {
          tempList.push({ id: doc.id, ...doc.data() });
        });

        setList(tempList);
        setIsLoading(false);
      });
      return () => unsubscribe();
    }
  }, [query]);

  return { list, isLoading };
};
