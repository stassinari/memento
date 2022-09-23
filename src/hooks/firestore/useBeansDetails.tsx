import { doc, DocumentReference, onSnapshot } from "firebase/firestore";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { Beans } from "../../types/beans";
import { userAtom } from "../useInitUser";

interface UseBeansReturn {
  beans: Beans | null;
  isLoading: boolean;
  docRef: DocumentReference<Beans>;
}

export const useBeansDetails = (beansId?: string): UseBeansReturn => {
  const [user] = useAtom(userAtom);

  const [beans, setBeans] = useState<Beans | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const docRef = doc(
    db,
    "users",
    user?.uid || "",
    "beans",
    beansId || ""
  ) as DocumentReference<Beans>;

  useEffect(() => {
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setBeans(docSnap.data());
      } else {
        console.log("No such document!");
        setBeans(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { beans, isLoading, docRef };
};
