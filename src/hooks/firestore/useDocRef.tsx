import { db } from "@/firebaseConfig";
import { DocumentReference, doc } from "firebase/firestore";
import { useMemo } from "react";
import { useCurrentUser } from "../useInitUser";

export const useDocRef = <T,>(
  type: "brews" | "beans" | "espresso",
  id?: string,
): DocumentReference<T> => {
  const user = useCurrentUser();

  return useMemo(() => {
    if (!user?.uid || !id) throw new Error("Missing user or id");
    const docRef = doc(db, "users", user.uid, type, id) as DocumentReference<T>;

    return docRef;
  }, [id, type, user.uid]);
};
