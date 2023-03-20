import { doc, setDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { BrewForm, BrewFormInputs } from "../../components/brews/BrewForm";
import { db } from "../../firebaseConfig";
import { useFirestoreDoc } from "../../hooks/firestore/useFirestoreDoc";
import { useCurrentUser } from "../../hooks/useInitUser";
import { Brew } from "../../types/brew";
import { brewToFirestore } from "./BrewsAdd";

export const BrewEditDetails = () => {
  const user = useCurrentUser();
  const { brewId } = useParams();

  const navigate = useNavigate();

  const { details: brew, isLoading } = useFirestoreDoc<Brew>("brews", brewId);

  if (!user) throw new Error("User is not logged in.");

  if (isLoading) return null;

  if (!brewId || !brew) {
    throw new Error("Brew does not exist.");
  }

  const existingBrewRef = doc(db, "users", user.uid, "brews", brewId);

  const editBrew = async (data: BrewFormInputs) => {
    await setDoc(existingBrewRef, brewToFirestore(data));
    navigate(`/drinks/brews/${brewId}`);
  };

  // TODO find an automated way to do this
  const fromFirestore: BrewFormInputs = {
    ...brew,
    date: brew.date.toDate(),
    beans: brew.beans.path,
  };

  return (
    <BrewForm
      defaultValues={fromFirestore}
      title="Edit brew details"
      buttonLabel="Edit"
      mutation={editBrew}
    />
  );
};
