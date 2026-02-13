import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";
import {
  EspressoForm,
  espressoFormEmptyValues,
  EspressoFormInputs,
} from "~/components/espresso/EspressoForm";
import { Heading } from "~/components/Heading";
import { addEspresso } from "~/db/mutations";
import { userAtom } from "~/hooks/useInitUser";

export const Route = createFileRoute("/_auth/_layout/drinks/espresso/add")({
  component: EspressoAdd,
});

function EspressoAdd() {
  console.log("EspressoAdd");

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAtomValue(userAtom);

  const mutation = useMutation({
    mutationFn: async (data: EspressoFormInputs) => {
      return await addEspresso({
        data: { data, firebaseUid: user?.uid ?? "" },
      });
    },
    onSuccess: (result) => {
      console.log("Add espresso - onSuccess called, navigating to:", result.id);
      // Invalidate all espresso queries
      queryClient.invalidateQueries({ queryKey: ["espresso"] });

      // Navigate to detail view
      navigate({
        to: "/drinks/espresso/$espressoId",
        params: { espressoId: result.id },
      });
    },
    onError: (error) => {
      console.error("Add espresso - mutation error:", error);
    },
  });

  const handleAdd = (data: EspressoFormInputs) => {
    mutation.mutate(data);
  };

  return (
    <>
      <BreadcrumbsWithHome
        items={[navLinks.drinks, navLinks.espresso, { label: "Add" }]}
      />

      <Heading className="mb-4">Add espresso</Heading>

      <EspressoForm
        defaultValues={espressoFormEmptyValues()}
        buttonLabel="Add"
        mutation={handleAdd}
      />
    </>
  );
}
