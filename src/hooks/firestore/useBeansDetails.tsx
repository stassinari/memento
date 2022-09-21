import { doc, DocumentReference, getDoc } from "firebase/firestore";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { Beans } from "../../types/beans";
import { userAtom } from "../useInitUser";

export const useBeansDetails = (beansId?: string): Beans | null => {
  const [user] = useAtom(userAtom);

  const [beans, setBeans] = useState<Beans | null>(null);

  const docRef = doc(
    db,
    "users",
    user?.uid || "",
    "beans",
    beansId || ""
  ) as DocumentReference<Beans>;

  useEffect(() => {
    const fetchBeans = async () => {
      const docSnap = await getDoc(docRef as DocumentReference<Beans>);

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        setBeans(docSnap.data());
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    };

    fetchBeans();
  }, []);

  return beans;
};
