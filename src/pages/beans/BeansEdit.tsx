import { DocumentReference, setDoc } from "firebase/firestore";
import { omit } from "lodash";
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
import { Beans } from "../../types/beans";

export const BeansEdit: React.FC = () => {
  console.log("BeansEdit");

  const { beansId } = useParams();

  const navigate = useNavigate();

  const docRef = useDocRef<Beans>("beans", beansId);
  const { details: beans } = useFirestoreDocOneTime<Beans>(docRef);

  const editBeans = async (data: BeansFormInputs) => {
    await setDoc(docRef as DocumentReference, data);
    navigate(`/beans/${docRef.id}`);
  };

  if (!beans) {
    return null;
  }

  // TODO find an automated way to do this
  const fromFirestore: BeansFormInputs = {
    ...beansFormEmptyValues,
    ...omit(beans, "id"),
    roastDate: beans.roastDate?.toDate() ?? null,
    freezeDate: beans.freezeDate?.toDate() ?? null,
    thawDate: beans.thawDate?.toDate() ?? null,
    harvestDate:
      beans.origin === "single-origin"
        ? beans.harvestDate?.toDate() ?? null
        : null,
  };

  return (
    <>
      <BreadcrumbsWithHome
        items={[
          navLinks.beans,
          { label: beans.name, linkTo: `/beans/${beansId}` },
          { label: "Edit", linkTo: "#" },
        ]}
      />

      <Heading>Edit beans</Heading>

      <BeansForm
        defaultValues={fromFirestore}
        buttonLabel="Edit"
        mutation={editBeans}
      />
    </>
  );
};
