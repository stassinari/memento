import {
  CollectionReference,
  Query,
  QueryConstraint,
  collection,
  query as fbQuery,
} from "firebase/firestore";
import { useMemo } from "react";
import { db } from "../../firebaseConfig";
import { useCurrentUser } from "../useInitUser";

export const useBuildQuery = <T,>(
  type: "brews" | "beans" | "espresso",
  filters: QueryConstraint[] = []
): Query<T> | null => {
  const user = useCurrentUser();

  return useMemo(() => {
    if (!user?.uid) return null;
    const collectionRef = collection(
      db,
      "users",
      user?.uid || "",
      type
    ) as CollectionReference<T>;

    const query = fbQuery(collectionRef, ...filters);

    return query;
  }, [filters, type, user?.uid]);
};
