import {
  useFirestoreDocumentData,
  useFirestoreDocumentMutation,
} from "@react-query-firebase/firestore";
import { doc, DocumentReference } from "firebase/firestore";
import { useAtom } from "jotai";
import { useNavigate, useParams } from "react-router-dom";
import { BeansForm, BeansFormInputs } from "../components/BeansForm";
import { db } from "../firebaseConfig";
import { userAtom } from "../hooks/useInitUser";
import { Beans } from "../types/beans";

export const BeansEdit = () => {
  const { beansId } = useParams();
  const [user] = useAtom(userAtom);

  const navigate = useNavigate();

  const ref = doc(
    db,
    "users",
    user?.uid || "",
    "beans",
    beansId || ""
  ) as DocumentReference<Beans>;

  const mutation = useFirestoreDocumentMutation(
    ref,
    {},
    {
      onSuccess() {
        navigate(`/beans/${beansId}`);
      },
    }
  );

  const { data: beans } = useFirestoreDocumentData(
    ["beansDetails", beansId],
    ref
  );

  if (!beans) {
    return null;
  }

  const fromFirestore: BeansFormInputs = {
    ...beans,
    roastDate: beans.roastDate?.toDate() || null,
    harvestDate: beans.harvestDate?.toDate() || null,
  };

  return (
    <BeansForm
      defaultValues={fromFirestore}
      title="Edit beans"
      buttonLabel="Edit"
      mutation={mutation}
    />
  );
};
