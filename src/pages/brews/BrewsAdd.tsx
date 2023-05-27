import { doc, limit, orderBy, setDoc } from "firebase/firestore";
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "twin.macro";
import { navLinks } from "../../components/BottomNav";
import { BreadcrumbsWithHome } from "../../components/Breadcrumbs";
import { Heading } from "../../components/Heading";
import {
  BrewForm,
  BrewFormInputs,
  brewFormEmptyValues,
} from "../../components/brews/BrewForm";
import { db } from "../../firebaseConfig";
import { useCollectionQuery } from "../../hooks/firestore/useCollectionQuery";
import { useFirestoreCollectionOneTime } from "../../hooks/firestore/useFirestoreCollectionOneTime";
import { useNewRef } from "../../hooks/firestore/useNewBeansRef";
import { Brew } from "../../types/brew";

export const brewToFirestore = (brew: BrewFormInputs) => ({
  ...brew,
  beans: doc(db, brew.beans ?? ""),
});

export const BrewsAdd: React.FC = () => {
  console.log("BrewsAdd");

  const navigate = useNavigate();

  const filters = useMemo(() => [orderBy("date", "desc"), limit(1)], []);

  const query = useCollectionQuery<Brew>("brews", filters);
  const { list: brewsList, isLoading } =
    useFirestoreCollectionOneTime<Brew>(query);

  const newBrewRef = useNewRef("brews");

  const addBrew = async (data: BrewFormInputs) => {
    await setDoc(newBrewRef, brewToFirestore(data));
    navigate(`/drinks/brews/${newBrewRef.id}`);
  };

  if (isLoading) return null;

  return (
    <>
      <BreadcrumbsWithHome
        items={[navLinks.drinks, navLinks.brews, { label: "Add", linkTo: "#" }]}
      />

      <Heading>Add brew</Heading>

      <BrewForm
        defaultValues={brewFormEmptyValues(brewsList[0])}
        buttonLabel="Add"
        mutation={addBrew}
      />
    </>
  );
};

export default BrewsAdd;
