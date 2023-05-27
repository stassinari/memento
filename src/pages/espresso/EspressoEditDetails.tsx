import { doc, setDoc } from "firebase/firestore";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { navLinks } from "../../components/BottomNav";
import { BreadcrumbsWithHome } from "../../components/Breadcrumbs";
import { Heading } from "../../components/Heading";
import {
  EspressoForm,
  EspressoFormInputs,
} from "../../components/espresso/EspressoForm";
import { db } from "../../firebaseConfig";
import { useDocRef } from "../../hooks/firestore/useDocRef";
import { useFirestoreDocOneTime } from "../../hooks/firestore/useFirestoreDocOneTime";
import { useCurrentUser } from "../../hooks/useInitUser";
import { BaseEspresso } from "../../types/espresso";
import { espressoToFirestore } from "./EspressoAdd";

export const EspressoEditDetails: React.FC = () => {
  const user = useCurrentUser();
  const { espressoId } = useParams();

  const navigate = useNavigate();

  const docRef = useDocRef<BaseEspresso>("espresso", espressoId);
  const { details: espresso, isLoading } =
    useFirestoreDocOneTime<BaseEspresso>(docRef);

  if (!user) throw new Error("User is not logged in.");

  if (isLoading) return null;

  if (!espressoId || !espresso) {
    throw new Error("Espresso does not exist.");
  }

  const existingEspressoRef = doc(
    db,
    "users",
    user.uid,
    "espresso",
    espressoId
  );

  const editEspresso = async (data: EspressoFormInputs) => {
    await setDoc(existingEspressoRef, espressoToFirestore(data));
    navigate(`/drinks/espresso/${espressoId}`);
  };

  // TODO find an automated way to do this
  const fromFirestore: EspressoFormInputs = {
    ...espresso,
    date: espresso.date.toDate(),
    beans: espresso.beans.path,
  };

  return (
    <>
      <BreadcrumbsWithHome
        items={[
          navLinks.drinks,
          navLinks.espresso,
          { label: "Boh", linkTo: `/drinks/espresso/${espressoId}` },
          { label: "Edit", linkTo: "#" },
        ]}
      />

      <Heading>Edit espresso details</Heading>

      <EspressoForm
        defaultValues={fromFirestore}
        buttonLabel="Edit"
        mutation={editEspresso}
      />
    </>
  );
};
