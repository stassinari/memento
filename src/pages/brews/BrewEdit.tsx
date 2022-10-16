import { doc, setDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { BrewForm, BrewFormInputs } from "../../components/brews/BrewForm";
import { db } from "../../firebaseConfig";
import { useFirestoreDetails } from "../../hooks/firestore/useFirestoreDetails";
import { useCurrentUser } from "../../hooks/useInitUser";
import { Brew } from "../../types/brews";
import { brewToFirestore } from "./BrewsAdd";

export const BrewEdit = () => {
  const user = useCurrentUser();
  const { brewId } = useParams();

  const navigate = useNavigate();

  const { details: brew } = useFirestoreDetails<Brew>("brews", brewId);

  if (!user) throw new Error("User is not logged in.");

  if (!brewId || !brew) {
    return null;
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
      title="Edit brew"
      buttonLabel="Edit"
      mutation={editBrew}
    />
  );
};
