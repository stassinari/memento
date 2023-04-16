import { doc, limit, orderBy, setDoc } from "firebase/firestore";
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "twin.macro";
import {
  EspressoForm,
  EspressoFormInputs,
  espressoFormEmptyValues,
} from "../../components/espresso/EspressoForm";
import { db } from "../../firebaseConfig";
import { useCollectionQuery } from "../../hooks/firestore/useCollectionQuery";
import { useFirestoreCollectionOneTime } from "../../hooks/firestore/useFirestoreCollectionOneTime";
import { useNewRef } from "../../hooks/firestore/useNewBeansRef";
import { Espresso } from "../../types/espresso";

export const espressoToFirestore = (espresso: EspressoFormInputs) => ({
  ...espresso,
  beans: doc(db, espresso.beans ?? ""),
});

export const EspressoAdd: React.FC = () => {
  console.log("EspressoAdd");

  const navigate = useNavigate();

  const filters = useMemo(() => [orderBy("date", "desc"), limit(1)], []);
  const query = useCollectionQuery<Espresso>("espresso", filters);
  const { list: espressoList, isLoading } =
    useFirestoreCollectionOneTime<Espresso>(query);

  const newEspressoRef = useNewRef("espresso");

  const addEspresso = async (data: EspressoFormInputs) => {
    await setDoc(newEspressoRef, espressoToFirestore(data));
    navigate(`/drinks/espresso/${newEspressoRef.id}`);
  };

  if (isLoading) return null;

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
