import { doc, setDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import {
  EspressoForm,
  EspressoFormInputs,
} from "../../components/espresso/EspressoForm";
import { db } from "../../firebaseConfig";
import { useFirestoreDoc } from "../../hooks/firestore/useFirestoreDoc";
import { useCurrentUser } from "../../hooks/useInitUser";
import { Espresso } from "../../types/espresso";
import { espressoToFirestore } from "./EspressoAdd";

export const EspressoEditDetails = () => {
  const user = useCurrentUser();
  const { espressoId } = useParams();

  const navigate = useNavigate();

  const { details: espresso, isLoading } = useFirestoreDoc<Espresso>(
    "espresso",
    espressoId
  );

  if (!user) throw new Error("User is not logged in.");

  if (isLoading) return null;

  if (!espressoId || !espresso) {
    throw new Error("Espresso does not exist.");
  }

  const existingEspressoRef = doc(
    db,
    "users",
    user.uid,
    "espresso",
    espressoId
  );

  const editEspresso = async (data: EspressoFormInputs) => {
    await setDoc(existingEspressoRef, espressoToFirestore(data));
    navigate(`/drinks/espresso/${espressoId}`);
  };

  // TODO find an automated way to do this
  const fromFirestore: EspressoFormInputs = {
    ...espresso,
    date: espresso.date.toDate(),
    beans: espresso.beans.path,
  };

  return (
    <EspressoForm
      defaultValues={fromFirestore}
      title="Edit espresso details"
      buttonLabel="Edit"
      mutation={editEspresso}
    />
  );
};
