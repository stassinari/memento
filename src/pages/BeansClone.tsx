import {
  useFirestoreCollectionMutation,
  useFirestoreDocumentData,
} from "@react-query-firebase/firestore";
import { collection, doc, DocumentReference } from "firebase/firestore";
import { useAtom } from "jotai";
import { useNavigate, useParams } from "react-router-dom";
import { BeansForm, BeansFormInputs } from "../components/BeansForm";
import { db } from "../firebaseConfig";
import { userAtom } from "../hooks/useInitUser";
import { Beans } from "../types/beans";

export const BeansClone = () => {
  const { beansId } = useParams();
  const [user] = useAtom(userAtom);

  const navigate = useNavigate();

  const existingRef = doc(
    db,
    "users",
    user?.uid || "",
    "beans",
    beansId || ""
  ) as DocumentReference<Beans>;

  const { data: beans } = useFirestoreDocumentData(
    ["beans", beansId],
    existingRef
  );

  const addBeansRef = collection(db, "users", user?.uid || "lol", "beans");
  const mutation = useFirestoreCollectionMutation(addBeansRef, {
    onSuccess(data) {
      console.log("new document with ID: ", data.id);
      navigate(`/beans/${data.id}`);
    },
  });

  if (!beans) {
    return null;
  }

  // TODO find an automated way to do this
  const fromFirestore: BeansFormInputs = {
    ...beans,
    roastDate: beans.roastDate?.toDate() || null,
    harvestDate: beans.harvestDate?.toDate() || null,
  };

  return (
    <BeansForm
      defaultValues={fromFirestore}
      title="Clone beans"
      buttonLabel="Clone"
      mutation={mutation}
    />
  );
};
