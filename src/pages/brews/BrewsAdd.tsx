import { doc, limit, orderBy, setDoc } from "firebase/firestore";
import React from "react";
import { useNavigate } from "react-router-dom";
import "twin.macro";
import {
  BrewForm,
  brewFormEmptyValues,
  BrewFormInputs,
} from "../../components/brews/BrewForm";
import { db } from "../../firebaseConfig";
import { useFirestoreCollection } from "../../hooks/firestore/useFirestoreCollection";
import { useNewRef } from "../../hooks/firestore/useNewBeansRef";
import { Brew } from "../../types/brews";

export const brewToFirestore = (brew: BrewFormInputs) => ({
  ...brew,
  beans: doc(db, brew.beans ?? ""),
});

export const BrewsAdd: React.FC = () => {
  const navigate = useNavigate();

  const { list: brewsList, isLoading: areBrewsLoading } =
    useFirestoreCollection<Brew>("brews", [orderBy("date", "desc"), limit(1)]);

  const newBrewRef = useNewRef("brews");

  const addBrew = async (data: BrewFormInputs) => {
    await setDoc(newBrewRef, brewToFirestore(data));
    navigate(`/drinks/brews/${newBrewRef.id}`);
  };

  if (areBrewsLoading) return null;

  return (
    <BrewForm
      defaultValues={brewFormEmptyValues(brewsList[0])}
      title="Add brew"
      buttonLabel="Add"
      mutation={addBrew}
    />
  );
};

export default BrewsAdd;
