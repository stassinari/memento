import { doc, setDoc } from "firebase/firestore";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "twin.macro";
import { navLinks } from "../../components/BottomNav";
import { BreadcrumbsWithHome } from "../../components/Breadcrumbs";
import { Heading } from "../../components/Heading";
import { BrewForm, BrewFormInputs } from "../../components/brews/BrewForm";
import { db } from "../../firebaseConfig";
import { useDocRef } from "../../hooks/firestore/useDocRef";
import { useFirestoreDocOneTime } from "../../hooks/firestore/useFirestoreDocOneTime";
import { useCurrentUser } from "../../hooks/useInitUser";
import { Brew } from "../../types/brew";
import { brewToFirestore } from "./BrewsAdd";

export const BrewEditDetails: React.FC = () => {
  console.log("BrewEditDetails");

  const user = useCurrentUser();
  const { brewId } = useParams();

  const navigate = useNavigate();

  const docRef = useDocRef<Brew>("brews", brewId);
  const { details: brew, isLoading } = useFirestoreDocOneTime<Brew>(docRef);

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
    <>
      <BreadcrumbsWithHome
        items={[
          navLinks.drinks,
          navLinks.brews,
          { label: brew.method, linkTo: `/drinks/brews/${brewId}` },
          { label: "Edit", linkTo: "#" },
        ]}
      />

      <Heading tw="mb-4">Edit brew details</Heading>

      <BrewForm
        defaultValues={fromFirestore}
        buttonLabel="Edit"
        mutation={editBrew}
      />
    </>
  );
};
