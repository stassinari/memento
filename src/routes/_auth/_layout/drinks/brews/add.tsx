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
  BrewForm,
  brewFormEmptyValues,
  BrewFormInputs,
} from "~/components/brews/BrewForm";
import { Heading } from "~/components/Heading";
import { addBrew } from "~/db/mutations";
import { getLastBrew } from "~/db/queries";

export const Route = createFileRoute("/_auth/_layout/drinks/brews/add")({
  component: BrewsAdd,
});

const lastBrewQueryOptions = () =>
  queryOptions({
    queryKey: ["brews", "last"],
    queryFn: () =>
      getLastBrew(),
  });

function BrewsAdd() {
  console.log("BrewsAdd");

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: lastBrew } = useSuspenseQuery(
    lastBrewQueryOptions(),
  );

  const mutation = useMutation({
    mutationFn: async (data: BrewFormInputs) => {
      return await addBrew({
        data: { data },
      });
    },
    onSuccess: (result) => {
      // Invalidate all brews queries
      queryClient.invalidateQueries({ queryKey: ["brews"] });

      // Navigate to detail view
      navigate({
        to: "/drinks/brews/$brewId",
        params: { brewId: result.id },
      });
    },
    onError: (error) => {
      console.error("Add brew - mutation error:", error);
    },
  });

  const handleAdd = (data: BrewFormInputs) => {
    mutation.mutate(data);
  };

  return (
    <>
      <BreadcrumbsWithHome
        items={[navLinks.drinks, navLinks.brews, { label: "Add" }]}
      />

      <Heading className="mb-4">Add brew</Heading>

      <BrewForm
        defaultValues={brewFormEmptyValues(lastBrew)}
        buttonLabel="Add"
        mutation={handleAdd}
      />
    </>
  );
}
