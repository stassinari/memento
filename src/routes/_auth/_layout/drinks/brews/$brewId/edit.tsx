import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";
import { Heading } from "~/components/Heading";
import { BrewForm, BrewFormInputs } from "~/components/brews/BrewForm";
import { updateBrew } from "~/db/mutations";
import { getBrew } from "~/db/queries";

const brewQueryOptions = (brewId: string) =>
  queryOptions({
    queryKey: ["brews", brewId],
    queryFn: () =>
      getBrew({
        data: { brewId },
      }),
  });

export const Route = createFileRoute("/_auth/_layout/drinks/brews/$brewId/edit")({
  component: BrewEditDetails,
});

function BrewEditDetails() {
  console.log("BrewEditDetails");

  const { brewId } = Route.useParams();

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: brew, isLoading } = useSuspenseQuery(brewQueryOptions(brewId ?? ""));

  const mutation = useMutation({
    mutationFn: async (data: BrewFormInputs) => {
      await updateBrew({
        data: {
          data,
          brewId,
        },
      });
    },
    onSuccess: () => {
      // Invalidate all brews queries
      queryClient.invalidateQueries({ queryKey: ["brews"] });

      // Navigate to detail view
      navigate({ to: "/drinks/brews/$brewId", params: { brewId: brewId! } });
    },
  });

  const handleEdit = (data: BrewFormInputs) => {
    mutation.mutate(data);
  };

  if (isLoading) return null;

  if (!brewId || !brew) {
    throw new Error("Brew does not exist.");
  }

  return (
    <>
      <BreadcrumbsWithHome
        items={[
          navLinks.drinks,
          navLinks.brews,
          { label: brew.method, linkTo: "/drinks/brews/$brewId" },
          { label: "Edit" },
        ]}
      />

      <Heading className="mb-4">Edit brew details</Heading>

      <BrewForm
        defaultValues={{ ...brew, beans: brew.beans.id }}
        existingBeans={brew.beans}
        buttonLabel="Edit"
        mutation={handleEdit}
      />
    </>
  );
}
