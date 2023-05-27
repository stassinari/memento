import { setDoc } from "firebase/firestore";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "twin.macro";
import { navLinks } from "../../components/BottomNav";
import { BreadcrumbsWithHome } from "../../components/Breadcrumbs";
import { Heading } from "../../components/Heading";
import {
  BrewForm,
  BrewFormInputs,
  brewFormEmptyValues,
} from "../../components/brews/BrewForm";
import { useDocRef } from "../../hooks/firestore/useDocRef";
import { useFirestoreDocOneTime } from "../../hooks/firestore/useFirestoreDocOneTime";
import { useNewRef } from "../../hooks/firestore/useNewBeansRef";
import { Brew } from "../../types/brew";
import { brewToFirestore } from "./BrewsAdd";

export const BrewClone: React.FC = () => {
  console.log("BrewClone");

  const { brewId } = useParams();
  const navigate = useNavigate();

  const docRef = useDocRef<Brew>("brews", brewId);
  const { details: brew } = useFirestoreDocOneTime<Brew>(docRef);

  const newBrewRef = useNewRef("brews");

  const addBrew = async (data: BrewFormInputs) => {
    await setDoc(newBrewRef, brewToFirestore(data));
    navigate(`/drinks/brews/${newBrewRef.id}`);
  };

  if (!brew || !brewId) {
    return null;
  }

  // TODO find an automated way to do this
  const fromFirestore: BrewFormInputs = {
    ...brewFormEmptyValues(),
    method: brew.method,
    beans: brew.beans.path,

    grinder: brew.grinder,
    grinderBurrs: brew.grinderBurrs,
    waterType: brew.waterType,
    filterType: brew.filterType,

    waterWeight: brew.waterWeight,
    beansWeight: brew.beansWeight,
    waterTemperature: brew.waterTemperature,
    grindSetting: brew.grindSetting,
  };

  return (
    <>
      <BreadcrumbsWithHome
        items={[
          navLinks.drinks,
          navLinks.brews,
          { label: brew.method, linkTo: `/drinks/brews/${brewId}` },
          { label: "Clone", linkTo: "#" },
        ]}
      />

      <Heading tw="mb-4">Clone brew</Heading>

      <BrewForm
        defaultValues={fromFirestore}
        buttonLabel="Clone"
        mutation={addBrew}
      />
    </>
  );
};
