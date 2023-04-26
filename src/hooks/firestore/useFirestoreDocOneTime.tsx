import { DocumentReference, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { UseFirestoreDocReturn } from "./useFirestoreDocRealtime";

export const useFirestoreDocOneTime = <T,>(
  docRef: DocumentReference<T>
): UseFirestoreDocReturn<T> => {
  const [details, setDetails] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const retrieveData = async (docRef: DocumentReference<T>) => {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setDetails({ ...docSnap.data(), id: docRef.id });
      } else {
        console.log("No such document!");
      }
      setIsLoading(false);
    };
    void retrieveData(docRef);
  }, [docRef]);

  return { details, isLoading };
};
