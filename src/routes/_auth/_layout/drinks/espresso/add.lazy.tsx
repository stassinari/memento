import { navLinks } from "@/components/BottomNav";
import { BreadcrumbsWithHome } from "@/components/Breadcrumbs";
import {
  EspressoForm,
  EspressoFormInputs,
  espressoFormEmptyValues,
} from "@/components/espresso/EspressoForm";
import { Heading } from "@/components/Heading";
import { db } from "@/firebaseConfig";
import { useCollectionQuery } from "@/hooks/firestore/useCollectionQuery";
import { useFirestoreCollectionOneTime } from "@/hooks/firestore/useFirestoreCollectionOneTime";
import { useNewRef } from "@/hooks/firestore/useNewBeansRef";
import { Espresso } from "@/types/espresso";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { doc, limit, orderBy, setDoc } from "firebase/firestore";
import { useMemo } from "react";

export const Route = createLazyFileRoute("/_auth/_layout/drinks/espresso/add")({
  component: EspressoAdd,
});

export const espressoToFirestore = (espresso: EspressoFormInputs) => ({
  ...espresso,
  beans: doc(db, espresso.beans ?? ""),
});

function EspressoAdd() {
  console.log("EspressoAdd");

  const navigate = useNavigate();

  const filters = useMemo(() => [orderBy("date", "desc"), limit(1)], []);
  const query = useCollectionQuery<Espresso>("espresso", filters);
  const { list: espressoList, isLoading } =
    useFirestoreCollectionOneTime<Espresso>(query);

  const newEspressoRef = useNewRef("espresso");

  const addEspresso = async (data: EspressoFormInputs) => {
    await setDoc(newEspressoRef, espressoToFirestore(data));
    navigate({
      to: "/drinks/espresso/$espressoId",
      params: { espressoId: newEspressoRef.id },
    });
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

      <Heading className="mb-4">Add espresso</Heading>

      <EspressoForm
        defaultValues={espressoFormEmptyValues(espressoList[0])}
        buttonLabel="Add"
        mutation={addEspresso}
      />
    </>
  );
}

EspressoAdd;
