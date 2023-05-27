import { doc, orderBy, setDoc } from "firebase/firestore";
import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "twin.macro";
import { navLinks } from "../../components/BottomNav";
import { BreadcrumbsWithHome } from "../../components/Breadcrumbs";
import { Heading } from "../../components/Heading";
import {
  DecentEspressoForm,
  DecentEspressoFormInputs,
} from "../../components/espresso/steps/DecentEspressoForm";
import { db } from "../../firebaseConfig";
import { useCollectionQuery } from "../../hooks/firestore/useCollectionQuery";
import { useDocRef } from "../../hooks/firestore/useDocRef";
import { useFirestoreCollectionOneTime } from "../../hooks/firestore/useFirestoreCollectionOneTime";
import { useFirestoreDocOneTime } from "../../hooks/firestore/useFirestoreDocOneTime";
import { useCurrentUser } from "../../hooks/useInitUser";
import { DecentEspresso, Espresso } from "../../types/espresso";

export const decentEspressoToFirestore = (
  espresso: DecentEspressoFormInputs
) => ({
  ...espresso,
  beans: doc(db, espresso.beans ?? ""),
});

export const DecentEspressoEditDetails: React.FC = () => {
  console.log("DecentEspressoEditDetails");

  const user = useCurrentUser();
  const { espressoId } = useParams();

  const navigate = useNavigate();

  const docRef = useDocRef<DecentEspresso>("espresso", espressoId);
  const { details: decentEspresso, isLoading } =
    useFirestoreDocOneTime<DecentEspresso>(docRef);

  const filters = useMemo(() => [orderBy("date", "desc")], []);
  const query = useCollectionQuery<Espresso>("espresso", filters);
  const { list: espressoList, isLoading: areEspressoLoading } =
    useFirestoreCollectionOneTime(query);

  if (!user) throw new Error("User is not logged in.");

  if (isLoading || areEspressoLoading) return null;

  if (!espressoId || !decentEspresso || !decentEspresso.beans) {
    throw new Error("Espresso does not exist.");
  }

  const existingEspressoRef = doc(
    db,
    "users",
    user.uid,
    "espresso",
    espressoId
  );

  const editDecentEspresso = async (data: DecentEspressoFormInputs) => {
    await setDoc(existingEspressoRef, decentEspressoToFirestore(data));
    navigate(`/drinks/espresso/${espressoId}`);
  };

  // TODO find an automated way to do this
  const fromFirestore: DecentEspressoFormInputs = {
    ...decentEspresso,
    targetWeight: decentEspresso.targetWeight ?? null,
    beansWeight: decentEspresso.beansWeight ?? null,
    date: decentEspresso.date.toDate(),
    beans: decentEspresso.beans.path,
  };

  return (
    <>
      <BreadcrumbsWithHome
        items={[
          navLinks.drinks,
          navLinks.espresso,
          {
            label: decentEspresso.profileName,
            linkTo: `/drinks/espresso/${espressoId}`,
          },
          { label: "Edit info", linkTo: "#" },
        ]}
      />

      <Heading>Edit info ({decentEspresso.profileName})</Heading>

      <DecentEspressoForm
        defaultValues={fromFirestore}
        espressoList={espressoList}
        mutation={editDecentEspresso}
        backLink={`/drinks/espresso/${espressoId}`}
      />
    </>
  );
};
