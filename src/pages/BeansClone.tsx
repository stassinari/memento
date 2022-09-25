import { collection, doc, setDoc } from "firebase/firestore";
import { useAtom } from "jotai";
import { useNavigate, useParams } from "react-router-dom";
import { BeansForm, BeansFormInputs } from "../components/beans/BeansForm";
import { db } from "../firebaseConfig";
import { useBeansDetails } from "../hooks/firestore/useBeansDetails";
import { userAtom } from "../hooks/useInitUser";

export const BeansClone = () => {
  const { beansId } = useParams();
  const [user] = useAtom(userAtom);

  const navigate = useNavigate();

  const { beans } = useBeansDetails(beansId);

  const newBeansRef = doc(collection(db, "users", user?.uid || "lol", "beans"));
  const addBeans = async (data: BeansFormInputs) => {
    await setDoc(newBeansRef, data);
    navigate(`/beans/${newBeansRef.id}`);
  };

  if (!beans) {
    return null;
  }

  // TODO find an automated way to do this
  const fromFirestore: BeansFormInputs = {
    ...beans,
    roastDate: beans.roastDate?.toDate() || null,
    freezeDate: null,
    thawDate: null,
    harvestDate: beans.harvestDate?.toDate() || null,
  };

  return (
    <BeansForm
      defaultValues={fromFirestore}
      title="Clone beans"
      buttonLabel="Clone"
      mutation={addBeans}
      showStorageSection={false}
    />
  );
};
