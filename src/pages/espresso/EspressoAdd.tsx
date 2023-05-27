import { doc, limit, orderBy, setDoc } from "firebase/firestore";
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "twin.macro";
import { navLinks } from "../../components/BottomNav";
import { BreadcrumbsWithHome } from "../../components/Breadcrumbs";
import { Heading } from "../../components/Heading";
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
    <>
      <BreadcrumbsWithHome
        items={[
          navLinks.drinks,
          navLinks.espresso,
          { label: "Add", linkTo: "#" },
        ]}
      />

      <Heading>Add espresso</Heading>

      <EspressoForm
        defaultValues={espressoFormEmptyValues(espressoList[0])}
        buttonLabel="Add"
        mutation={addEspresso}
      />
    </>
  );
};

export default EspressoAdd;
