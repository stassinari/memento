import { doc } from "firebase/firestore";
import React from "react";
import { useParams } from "react-router-dom";
import "twin.macro";
import { navLinks } from "../../components/BottomNav";
import { BreadcrumbsWithHome } from "../../components/Breadcrumbs";
import { Heading } from "../../components/Heading";
import { EspressoOutcomeForm } from "../../components/espresso/EspressoOutcomeForm";
import { db } from "../../firebaseConfig";
import { useDocRef } from "../../hooks/firestore/useDocRef";
import { useFirestoreDocOneTime } from "../../hooks/firestore/useFirestoreDocOneTime";
import { useCurrentUser } from "../../hooks/useInitUser";
import { Espresso } from "../../types/espresso";

export const EspressoEditOutcome: React.FC = () => {
  console.log("EspressoEditOutcome");

  const user = useCurrentUser();
  const { espressoId } = useParams();

  const docRef = useDocRef<Espresso>("espresso", espressoId);
  const { details: espresso, isLoading } =
    useFirestoreDocOneTime<Espresso>(docRef);

  if (!user) throw new Error("User is not logged in.");

  if (isLoading) return null;

  if (!espressoId || !espresso) {
    throw new Error("Espresso does not exist.");
  }

  const espressoRef = doc(db, "users", user.uid, "espresso", espressoId);

  return (
    <>
      <BreadcrumbsWithHome
        items={[
          navLinks.drinks,
          navLinks.espresso,
          { label: "Detail", linkTo: `/drinks/espresso/${espressoId}` },
          { label: "Outcome", linkTo: "#" },
        ]}
      />

      <Heading tw="mb-4">Edit espresso outcome</Heading>

      <EspressoOutcomeForm espresso={espresso} espressoRef={espressoRef} />
    </>
  );
};
