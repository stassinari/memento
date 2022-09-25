import { doc, setDoc } from "firebase/firestore";
import { useAtom } from "jotai";
import { useNavigate, useParams } from "react-router-dom";
import { BeansForm, BeansFormInputs } from "../components/beans/BeansForm";
import { db } from "../firebaseConfig";
import { useBeansDetails } from "../hooks/firestore/useBeansDetails";
import { userAtom } from "../hooks/useInitUser";

export const BeansEdit = () => {
  const [user] = useAtom(userAtom);
  const { beansId } = useParams();

  const navigate = useNavigate();

  const { beans } = useBeansDetails(beansId);

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
