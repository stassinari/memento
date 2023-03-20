import { doc } from "firebase/firestore";
import React from "react";
import { useParams } from "react-router-dom";
import "twin.macro";
import { EspressoOutcomeForm } from "../../components/espresso/EspressoOutcomeForm";
import { db } from "../../firebaseConfig";
import { useFirestoreDoc } from "../../hooks/firestore/useFirestoreDoc";
import { useCurrentUser } from "../../hooks/useInitUser";
import { Espresso } from "../../types/espresso";

export const EspressoEditOutcome: React.FC = () => {
  const user = useCurrentUser();
  const { espressoId } = useParams();

  const { details: espresso, isLoading } = useFirestoreDoc<Espresso>(
    "espresso",
    espressoId
  );

  if (!user) throw new Error("User is not logged in.");

  if (isLoading) return null;

  if (!espressoId || !espresso) {
    throw new Error("Espresso does not exist.");
  }

  const espressoRef = doc(db, "users", user.uid, "espresso", espressoId);

  return (
    <>
      <h1 tw="text-3xl font-bold tracking-tight text-gray-900">
        Edit espresso outcome
      </h1>

      <EspressoOutcomeForm espresso={espresso} espressoRef={espressoRef} />
    </>
  );
};
