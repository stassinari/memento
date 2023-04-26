import { Query, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

interface UseFirestoreCollectionResult<T> {
  list: T[];
  isLoading: boolean;
}

export const useFirestoreCollectionOneTime = <T,>(
  query: Query<T> | null
): UseFirestoreCollectionResult<T> => {
  const [list, setList] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const retrieveData = async (query: Query<T>) => {
      const querySnap = await getDocs(query);
      const tempList: T[] = [];

      querySnap.forEach((doc) => {
        tempList.push({ ...doc.data(), id: doc.id });
      });

      setList(tempList);
      setIsLoading(false);
    };
    if (query) {
      void retrieveData(query);
    }
  }, [query]);

  return { list, isLoading };
};
