import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "twin.macro";
import {
  BrewForm,
  brewFormEmptyValues,
  BrewFormInputs,
} from "../../components/brews/BrewForm";
import { db } from "../../firebaseConfig";
import { useNewBeansRef } from "../../hooks/firestore/useNewBeansRef";

export const brewToFirestore = (brew: BrewFormInputs) => ({
  ...brew,
  beans: doc(db, "beans", brew.beans || ""),
});

export const BrewsAdd: React.FC = () => {
  const navigate = useNavigate();

  const newBeansRef = useNewBeansRef();

  const addBrew = async (data: BrewFormInputs) => {
    await setDoc(newBeansRef, brewToFirestore(data));
    navigate(`/drinks/brews/${newBeansRef.id}`);
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
