import { doc, setDoc } from "firebase/firestore";
import { useAtom } from "jotai";
import { useNavigate, useParams } from "react-router-dom";
import { BeansForm, BeansFormInputs } from "../../components/beans/BeansForm";
import { db } from "../../firebaseConfig";
import { useFirestoreDetails } from "../../hooks/firestore/useFirestoreDetails";
import { userAtom } from "../../hooks/useInitUser";
import { Beans } from "../../types/beans";

export const BeansEdit = () => {
  const [user] = useAtom(userAtom);
  const { beansId } = useParams();

  const navigate = useNavigate();

  const { details: beans } = useFirestoreDetails<Beans>("beans", beansId);

  const existingBeansRef = doc(
    db,
    "users",
    user?.uid || "",
    "beans",
    beansId || ""
  );

  const editBeans = async (data: BeansFormInputs) => {
    await setDoc(existingBeansRef, data);
    navigate(`/beans/${beansId}`);
  };

  if (!beans) {
    return null;
  }

  // TODO find an automated way to do this
  const fromFirestore: BeansFormInputs = {
    ...beans,
    roastDate: beans.roastDate?.toDate() || null,
    freezeDate: beans.freezeDate?.toDate() || null,
    thawDate: beans.thawDate?.toDate() || null,
    harvestDate: beans.harvestDate?.toDate() || null,
  };

  return (
    <BeansForm
      defaultValues={fromFirestore}
      title="Edit beans"
      buttonLabel="Edit"
      mutation={editBeans}
    />
  );
};
