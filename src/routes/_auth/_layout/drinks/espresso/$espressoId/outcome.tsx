import { createFileRoute } from "@tanstack/react-router";
import { useParams } from "@tanstack/react-router";
import React from "react";
import { doc } from "firebase/firestore";
import { db } from "../../../../../../firebaseConfig";
import { navLinks } from "../../../../../../components/BottomNav";
import { BreadcrumbsWithHome } from "../../../../../../components/Breadcrumbs";
import { Heading } from "../../../../../../components/Heading";
import { EspressoOutcomeForm } from "../../../../../../components/espresso/EspressoOutcomeForm";
import { useDocRef } from "../../../../../../hooks/firestore/useDocRef";
import { useFirestoreDocOneTime } from "../../../../../../hooks/firestore/useFirestoreDocOneTime";
import { useCurrentUser } from "../../../../../../hooks/useInitUser";
import { Espresso } from "../../../../../../types/espresso";

export const Route = createFileRoute(
  "/_auth/_layout/drinks/espresso/$espressoId/outcome",
)({
  component: EspressoEditOutcome,
});

function EspressoEditOutcome()  {
  console.log("EspressoEditOutcome");

  const user = useCurrentUser();
  const { espressoId } = useParams({ strict: false });

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

      <Heading className="mb-4">Edit espresso outcome</Heading>

      <EspressoOutcomeForm espresso={espresso} espressoRef={espressoRef} />
    </>
  );
};
