import { setDoc } from "firebase/firestore";
import React from "react";
import { useNavigate } from "react-router-dom";
import "twin.macro";
import {
  BeansForm,
  beansFormEmptyValues,
  BeansFormInputs,
} from "../../components/beans/BeansForm";
import { navLinks } from "../../components/BottomNav";
import { BreadcrumbsWithHome } from "../../components/Breadcrumbs";
import { PageHeading } from "../../components/Heading";
import { useNewRef } from "../../hooks/firestore/useNewBeansRef";

export const BeansAdd: React.FC = () => {
  const navigate = useNavigate();
  const newBeansRef = useNewRef("beans");

  const addBeans = async (data: BeansFormInputs) => {
    await setDoc(newBeansRef, data);
    navigate(`/beans/${newBeansRef.id}`);
  };

  return (
    <>
      <BreadcrumbsWithHome
        items={[navLinks.beans, { label: "Add", linkTo: "#" }]}
      />

      <PageHeading>Add beans</PageHeading>

      <BeansForm
        defaultValues={beansFormEmptyValues}
        buttonLabel="Add"
        mutation={addBeans}
        showStorageSection={false}
      />
    </>
  );
};

export default BeansAdd;
