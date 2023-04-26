import { DocumentReference, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

interface UseFirestoreDocReturn<T> {
  details: T | null;
  isLoading: boolean;
}

export const useFirestoreDocRealtime = <T,>(
  docRef: DocumentReference<T>
): UseFirestoreDocReturn<T> => {
  const [details, setDetails] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setDetails({ ...docSnap.data(), id: docRef.id });
      } else {
        console.log("No such document!");
        setDetails(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [docRef]);

  return { details, isLoading };
};
