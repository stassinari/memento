import { doc, orderBy, updateDoc } from "firebase/firestore";
import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "twin.macro";
import { navLinks } from "../../components/BottomNav";
import { BreadcrumbsWithHome } from "../../components/Breadcrumbs";
import { Heading } from "../../components/Heading";
import {
  DecentEspressoForm,
  DecentEspressoFormInputs,
  decentEspressoFormEmptyValues,
} from "../../components/espresso/steps/DecentEspressoForm";
import { db } from "../../firebaseConfig";
import { useCollectionQuery } from "../../hooks/firestore/useCollectionQuery";
import { useDocRef } from "../../hooks/firestore/useDocRef";
import { useFirestoreCollectionOneTime } from "../../hooks/firestore/useFirestoreCollectionOneTime";
import { useFirestoreDocOneTime } from "../../hooks/firestore/useFirestoreDocOneTime";
import { useCurrentUser } from "../../hooks/useInitUser";
import { DecentEspressoPrep, Espresso } from "../../types/espresso";

export const decentEspressoToFirestore = (
  espresso: DecentEspressoFormInputs
) => ({
  ...espresso,
  partial: false,
  beans: doc(db, espresso.beans ?? ""),
});

export const DecentEspressoAddDetails: React.FC = () => {
  console.log("DecentEspressoAddDetails");

  const user = useCurrentUser();
  const { espressoId } = useParams();

  const navigate = useNavigate();

  const existingEspressoRef = useDocRef<DecentEspressoPrep>(
    "espresso",
    espressoId
  );
  const { details: partialEspresso, isLoading } =
    useFirestoreDocOneTime<DecentEspressoPrep>(existingEspressoRef);

  const filters = useMemo(() => [orderBy("date", "desc")], []);
  const query = useCollectionQuery<Espresso>("espresso", filters);
  const { list: espressoList, isLoading: areEspressoLoading } =
    useFirestoreCollectionOneTime(query);

  const lastNonPartialEspresso = useMemo(
    () => espressoList.filter((e) => e.fromDecent && !e.partial)[0],
    [espressoList]
  );

  if (!user) throw new Error("User is not logged in.");

  if (isLoading || areEspressoLoading) return null;

  if (!espressoId || !partialEspresso) {
    throw new Error("Espresso does not exist.");
  }

  const editDecentEspresso = async (data: DecentEspressoFormInputs) => {
    await updateDoc(existingEspressoRef, decentEspressoToFirestore(data));
    navigate(`/drinks/espresso/${espressoId}`);
  };

  return (
    <>
      <BreadcrumbsWithHome
        items={[
          navLinks.drinks,
          navLinks.espresso,
          { label: "Detail", linkTo: `/drinks/espresso/${espressoId}` },
          { label: "Add info", linkTo: "#" },
        ]}
      />

      <Heading tw="mb-4">Add info ({partialEspresso.profileName})</Heading>

      <DecentEspressoForm
        defaultValues={decentEspressoFormEmptyValues(
          partialEspresso,
          lastNonPartialEspresso
        )}
        espressoList={espressoList}
        mutation={editDecentEspresso}
        backLink={"/drinks/espresso"}
      />
    </>
  );
};
