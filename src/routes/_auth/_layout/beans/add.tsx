import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import {
  BeansForm,
  BeansFormInputs,
  beansFormEmptyValues,
} from "~/components/beans/BeansForm";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";
import { Heading } from "~/components/Heading";
import { addBeans } from "~/db/mutations";
import { userAtom } from "~/hooks/useInitUser";

export const Route = createFileRoute("/_auth/_layout/beans/add")({
  component: BeansAdd,
});

function BeansAdd() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAtomValue(userAtom);

  const mutation = useMutation({
    mutationFn: async (data: BeansFormInputs) => {
      // 1. Call server function (handles PostgreSQL write)
      return await addBeans({
        data: { data, userId: user?.dbId ?? "" },
      });
    },
    onSuccess: (result) => {
      // Invalidate all beans queries
      queryClient.invalidateQueries({ queryKey: ["beans"] });

      // Navigate to detail view
      navigate({ to: "/beans/$beansId", params: { beansId: result.id } });
    },
    onError: (error) => {
      console.error("Mutation error:", error);
    },
  });

  const handleAdd = (data: BeansFormInputs) => {
    mutation.mutate(data);
  };

  return (
    <>
      <BreadcrumbsWithHome items={[navLinks.beans, { label: "Add" }]} />

      <Heading className="mb-4">Add beans</Heading>

      <BeansForm
        defaultValues={beansFormEmptyValues}
        buttonLabel="Add"
        mutation={handleAdd}
        showStorageSection={false}
      />
    </>
  );
}
