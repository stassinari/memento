import { collection, doc, setDoc } from "firebase/firestore";
import { useAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import "twin.macro";
import {
  BrewForm,
  brewFormEmptyValues,
  BrewFormInputs,
} from "../components/brews/BrewForm";
import { db } from "../firebaseConfig";
import { userAtom } from "../hooks/useInitUser";

export const BrewsAdd: React.FC = () => {
  const [user] = useAtom(userAtom);

  const navigate = useNavigate();

  const newBeansRef = doc(collection(db, "users", user?.uid || "lol", "brews"));

  const addBrew = async (data: BrewFormInputs) => {
    await setDoc(newBeansRef, data);
    // navigate(`/drinks/brews/${newBeansRef.id}`); // TODO doesn't exist yet
    navigate(`/drinks/brews`);
  };

  return (
    <BrewForm
      defaultValues={brewFormEmptyValues()}
      title="Add brew"
      buttonLabel="Add"
      mutation={addBrew}
    />
  );
};

export default BrewsAdd;
