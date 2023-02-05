import { doc } from "firebase/firestore";
import React from "react";
import { useParams } from "react-router-dom";
import "twin.macro";
import { BrewOutcomeForm } from "../../components/brews/BrewOutcomeForm";
import { db } from "../../firebaseConfig";
import { useFirestoreDoc } from "../../hooks/firestore/useFirestoreDoc";
import { useCurrentUser } from "../../hooks/useInitUser";
import { Brew } from "../../types/brews";

export const BrewEditOutcome: React.FC = () => {
  const user = useCurrentUser();
  const { brewId } = useParams();

  const { details: brew, isLoading } = useFirestoreDoc<Brew>("brews", brewId);

  if (!user) throw new Error("User is not logged in.");

  if (isLoading) return null;

  if (!brewId || !brew) {
    throw new Error("Brew does not exist.");
  }

  const brewRef = doc(db, "users", user.uid, "brews", brewId);

  return (
    <>
      <h1 tw="text-3xl font-bold tracking-tight text-gray-900">
        Edit brew outcome
      </h1>

      <BrewOutcomeForm brew={brew} brewRef={brewRef} />
    </>
  );
};
