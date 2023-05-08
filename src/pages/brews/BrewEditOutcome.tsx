import { doc } from "firebase/firestore";
import React from "react";
import { useParams } from "react-router-dom";
import "twin.macro";
import { navLinks } from "../../components/BottomNav";
import { BreadcrumbsWithHome } from "../../components/Breadcrumbs";
import { PageHeading } from "../../components/Heading";
import { BrewOutcomeForm } from "../../components/brews/BrewOutcomeForm";
import { db } from "../../firebaseConfig";
import { useDocRef } from "../../hooks/firestore/useDocRef";
import { useFirestoreDocOneTime } from "../../hooks/firestore/useFirestoreDocOneTime";
import { useCurrentUser } from "../../hooks/useInitUser";
import { Brew } from "../../types/brew";

export const BrewEditOutcome: React.FC = () => {
  console.log("BrewEditOutcome");

  const user = useCurrentUser();
  const { brewId } = useParams();

  const docRef = useDocRef<Brew>("brews", brewId);
  const { details: brew, isLoading } = useFirestoreDocOneTime<Brew>(docRef);

  if (!user) throw new Error("User is not logged in.");

  if (isLoading) return null;

  if (!brewId || !brew) {
    throw new Error("Brew does not exist.");
  }

  const brewRef = doc(db, "users", user.uid, "brews", brewId);

  return (
    <>
      <BreadcrumbsWithHome
        items={[
          navLinks.drinks,
          navLinks.brews,
          { label: brew.method, linkTo: `/drinks/brews/${brewId}` },
          { label: "Outcome", linkTo: "#" },
        ]}
      />

      <PageHeading>Edit brew outcome</PageHeading>

      <BrewOutcomeForm brew={brew} brewRef={brewRef} />
    </>
  );
};
