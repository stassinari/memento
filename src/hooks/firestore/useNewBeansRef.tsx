import { collection, doc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useCurrentUser } from "../useInitUser";

export const useNewBeansRef = () => {
  const user = useCurrentUser();
  return doc(collection(db, "users", user.uid, "beans"));
};
