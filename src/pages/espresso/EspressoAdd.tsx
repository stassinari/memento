import { doc, limit, orderBy, setDoc } from "firebase/firestore";
import React from "react";
import { useNavigate } from "react-router-dom";
import "twin.macro";
import {
  EspressoForm,
  espressoFormEmptyValues,
  EspressoFormInputs,
} from "../../components/espresso/EspressoForm";
import { db } from "../../firebaseConfig";
import { useFirestoreCollection } from "../../hooks/firestore/useFirestoreCollection";
import { useNewRef } from "../../hooks/firestore/useNewBeansRef";
import { Espresso } from "../../types/espresso";

export const espressoToFirestore = (espresso: EspressoFormInputs) => ({
  ...espresso,
  beans: doc(db, espresso.beans ?? ""),
});

export const EspressoAdd: React.FC = () => {
  const navigate = useNavigate();

  const { list: espressoList, isLoading: areEspressoLoading } =
    useFirestoreCollection<Espresso>("espresso", [
      orderBy("date", "desc"),
      limit(1),
    ]);

  const newEspressoRef = useNewRef("espresso");

  const addEspresso = async (data: EspressoFormInputs) => {
    await setDoc(newEspressoRef, espressoToFirestore(data));
    navigate(`/drinks/espresso/${newEspressoRef.id}`);
  };

  if (areEspressoLoading) return null;

  return (
    <EspressoForm
      defaultValues={espressoFormEmptyValues(espressoList[0])}
      title="Add espresso"
      buttonLabel="Add"
      mutation={addEspresso}
    />
  );
};

export default EspressoAdd;
