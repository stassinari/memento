import { doc, setDoc } from "firebase/firestore";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "twin.macro";
import { BrewFormInputs } from "../../components/brews/BrewForm";
import { BrewOutcomeForm } from "../../components/brews/BrewOutcomeForm";
import { db } from "../../firebaseConfig";
import { useFirestoreDetails } from "../../hooks/firestore/useFirestoreDetails";
import { useCurrentUser } from "../../hooks/useInitUser";
import { Brew } from "../../types/brews";
import { brewToFirestore } from "./BrewsAdd";

export const BrewEditOutcome: React.FC = () => {
  const user = useCurrentUser();
  const { brewId } = useParams();

  const navigate = useNavigate();

  const { details: brew, isLoading } = useFirestoreDetails<Brew>(
    "brews",
    brewId
  );

  if (!user) throw new Error("User is not logged in.");

  if (isLoading) return null;

  if (!brewId || !brew) {
    throw new Error("Brew does not exist.");
  }

  const existingBrewRef = doc(db, "users", user.uid, "brews", brewId);

  const editBrew = async (data: BrewFormInputs) => {
    await setDoc(existingBrewRef, brewToFirestore(data));
    navigate(`/drinks/brews/${brewId}`);
  };

  // TODO find an automated way to do this
  const fromFirestore: BrewFormInputs = {
    ...brew,
    date: brew.date.toDate(),
    beans: brew.beans.path,
  };

  return (
    // <BrewForm
    //   defaultValues={fromFirestore}
    //   title="Edit brew details"
    //   buttonLabel="Edit"
    //   mutation={editBrew}
    // />
    <>
      <h1 tw="text-3xl font-bold tracking-tight text-gray-900">
        Edit brew outcome
      </h1>

      <BrewOutcomeForm />
    </>
  );
};
