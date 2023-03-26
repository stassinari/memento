import { DocumentReference, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

interface UseFirestoreDocReturn<T> {
  details: T | null;
  isLoading: boolean;
  docRef: DocumentReference<T>;
}

// FIXME this name sucks
export const useFirestoreAnyDoc = <T,>(
  docRef: DocumentReference<T>,
  id?: string
): UseFirestoreDocReturn<T> => {
  const [details, setDetails] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setDetails({ ...docSnap.data(), id });
      } else {
        console.log("No such document!");
        setDetails(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { details, isLoading, docRef };
};
