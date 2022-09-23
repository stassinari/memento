import {
  collection,
  CollectionReference,
  getDocs,
  query as fbQuery,
  QueryConstraint,
} from "firebase/firestore";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { Beans } from "../../types/beans";
import { userAtom } from "../useInitUser";

export const useBeansList = (filters: QueryConstraint[] = []): Beans[] => {
  const [user] = useAtom(userAtom);

  const [beansList, setBeansList] = useState<Beans[]>([]);

  const collectionRef = collection(
    db,
    "users",
    user?.uid || "lol",
    "beans"
  ) as CollectionReference<Beans>;

  const query = fbQuery(collectionRef, ...filters);

  useEffect(() => {
    const fetchBeansList = async () => {
      const querySnapshot = await getDocs(query);

      let list: Beans[] = [];

      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });

      setBeansList(list);
    };

    fetchBeansList();
  }, []);

  return beansList;
};
