import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "twin.macro";
import {
  BrewForm,
  brewFormEmptyValues,
  BrewFormInputs,
} from "../../components/brews/BrewForm";
import { db } from "../../firebaseConfig";
import { useNewRef } from "../../hooks/firestore/useNewBeansRef";

export const brewToFirestore = (brew: BrewFormInputs) => ({
  ...brew,
  beans: doc(db, brew.beans || ""),
});

export const BrewsAdd: React.FC = () => {
  const navigate = useNavigate();

  const newBrewRef = useNewRef("brews");

  const addBrew = async (data: BrewFormInputs) => {
    await setDoc(newBrewRef, brewToFirestore(data));
    navigate(`/drinks/brews/${newBrewRef.id}`);
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
