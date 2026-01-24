import { db } from "@/firebaseConfig";
import { collection, doc } from "firebase/firestore";
import { useCurrentUser } from "../useInitUser";

// TODO extract this type, it's used somewhere else
export const useNewRef = (type: "beans" | "brews" | "espresso") => {
  const user = useCurrentUser();
  return doc(collection(db, "users", user.uid, type));
};
