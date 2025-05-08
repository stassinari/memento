import { setDoc } from "firebase/firestore";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import { navLinks } from "../../components/BottomNav";
import { BreadcrumbsWithHome } from "../../components/Breadcrumbs";
import { Heading } from "../../components/Heading";
import {
  BeansForm,
  BeansFormInputs,
  beansFormEmptyValues,
} from "../../components/beans/BeansForm";
import { useDocRef } from "../../hooks/firestore/useDocRef";
import { useFirestoreDocOneTime } from "../../hooks/firestore/useFirestoreDocOneTime";
import { useNewRef } from "../../hooks/firestore/useNewBeansRef";
import { Beans } from "../../types/beans";

export const BeansClone: React.FC = () => {
  console.log("BeansClone");

  const { beansId } = useParams();

  const navigate = useNavigate();

  const docRef = useDocRef<Beans>("beans", beansId);
  const { details: beans } = useFirestoreDocOneTime<Beans>(docRef);

  const newBeansRef = useNewRef("beans");

  const addBeans = async (data: BeansFormInputs) => {
    await setDoc(newBeansRef, data);
    navigate(`/beans/${newBeansRef.id}`);
  };

  if (!beans) {
    return null;
  }

  const fromFirestore: BeansFormInputs = {
    ...beansFormEmptyValues,

    name: beans.name,
    roaster: beans.roaster,
    roastDate: beans.roastDate?.toDate() ?? null,
    roastStyle: beans.roastStyle,
    roastLevel: beans.roastLevel,
    roastingNotes: beans.roastingNotes,

    origin: beans.origin,

    ...(beans.origin === "single-origin"
      ? {
          country: beans.country,
          farmer: beans.farmer,
          region: beans.region,
          process: beans.process,
          varietals: beans.varietals,
          harvestDate: beans.harvestDate?.toDate() ?? null,
          altitude: beans.altitude,
        }
      : {
          blend: beans.blend,
        }),
  };

  return (
    <>
      <BreadcrumbsWithHome
        items={[
          navLinks.beans,
          { label: beans.name, linkTo: `/beans/${beansId}` },
          { label: "Clone", linkTo: "#" },
        ]}
      />

      <Heading className="mb-4">Clone beans</Heading>

      <BeansForm
        defaultValues={fromFirestore}
        buttonLabel="Clone"
        mutation={addBeans}
        showStorageSection={false}
      />
    </>
  );
};
