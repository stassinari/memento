import { doc, DocumentReference, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { useCurrentUser } from "../useInitUser";

interface UseFirestoreDocReturn<T> {
  details: T | null;
  isLoading: boolean;
  docRef: DocumentReference<T>;
}

export const useFirestoreDoc = <T,>(
  type: "brews" | "beans",
  id?: string
): UseFirestoreDocReturn<T> => {
  const user = useCurrentUser();

  const [details, setDetails] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const docRef = doc(
    db,
    "users",
    user?.uid || "",
    type,
    id ?? ""
  ) as DocumentReference<T>;

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
