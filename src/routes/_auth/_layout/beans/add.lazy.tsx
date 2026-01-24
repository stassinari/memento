import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { setDoc } from "firebase/firestore";
import {
  BeansForm,
  BeansFormInputs,
  beansFormEmptyValues,
} from "../../../../components/beans/BeansForm";
import { navLinks } from "../../../../components/BottomNav";
import { BreadcrumbsWithHome } from "../../../../components/Breadcrumbs";
import { Heading } from "../../../../components/Heading";
import { useNewRef } from "../../../../hooks/firestore/useNewBeansRef";

export const Route = createLazyFileRoute("/_auth/_layout/beans/add")({
  component: BeansAdd,
});

function BeansAdd() {
  const navigate = useNavigate();
  const newBeansRef = useNewRef("beans");

  const addBeans = async (data: BeansFormInputs) => {
    await setDoc(newBeansRef, data);
    navigate({ to: "/beans/$beansId", params: { beansId: newBeansRef.id } });
  };

  return (
    <>
      <BreadcrumbsWithHome
        items={[navLinks.beans, { label: "Add", linkTo: "#" }]}
      />

      <Heading className="mb-4">Add beans</Heading>

      <BeansForm
        defaultValues={beansFormEmptyValues}
        buttonLabel="Add"
        mutation={addBeans}
        showStorageSection={false}
      />
    </>
  );
}
