import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";
import {
  EspressoForm,
  espressoFormEmptyValues,
  EspressoFormInputs,
} from "~/components/espresso/EspressoForm";
import { Heading } from "~/components/Heading";
import { addEspresso } from "~/db/mutations";
import { getLastEspresso } from "~/db/queries";

export const Route = createFileRoute("/_auth/_layout/drinks/espresso/add")({
  component: EspressoAdd,
});

export const lastEspressoQueryOptions = () =>
  queryOptions({
    queryKey: ["espresso", "last"],
    queryFn: () =>
      getLastEspresso(),
  });

function EspressoAdd() {
  console.log("EspressoAdd");

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: lastEspresso } = useSuspenseQuery(
    lastEspressoQueryOptions(),
  );

  const mutation = useMutation({
    mutationFn: async (data: EspressoFormInputs) => {
      return await addEspresso({
        data: { data },
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
        defaultValues={espressoFormEmptyValues(lastEspresso)}
        buttonLabel="Add"
        mutation={handleAdd}
      />
    </>
  );
}
