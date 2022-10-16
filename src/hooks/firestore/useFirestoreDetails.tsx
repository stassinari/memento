import { doc, DocumentReference, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { useCurrentUser } from "../useInitUser";

interface UseFirestoreDetailsReturn<T> {
  details: T | null;
  isLoading: boolean;
  docRef: DocumentReference<T>;
}

export const useFirestoreDetails = <T,>(
  type: "brews" | "beans",
  id?: string
): UseFirestoreDetailsReturn<T> => {
  const user = useCurrentUser();

  const [details, setDetails] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const docRef = doc(
    db,
    "users",
    user?.uid || "",
    type,
    id || ""
  ) as DocumentReference<T>;

  useEffect(() => {
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setDetails(docSnap.data());
      } else {
        console.log("No such document!");
        setDetails(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { details, isLoading, docRef };
};
