import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";
import {
  BrewForm,
  brewFormEmptyValues,
  BrewFormInputs,
} from "~/components/brews/BrewForm";
import { Heading } from "~/components/Heading";
import { addBrew } from "~/db/mutations";
import { getBrew } from "~/db/queries";
import { userAtom } from "~/hooks/useInitUser";

const brewQueryOptions = (brewId: string, userId: string) =>
  queryOptions({
    queryKey: ["brews", brewId],
    queryFn: () =>
      getBrew({
        data: { brewId, userId },
      }),
  });

export const Route = createFileRoute(
  "/_auth/_layout/drinks/brews/$brewId/clone",
)({
  component: BrewClone,
});

function BrewClone() {
  console.log("BrewClone");

  const { brewId } = Route.useParams();
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const user = useAtomValue(userAtom);

  const { data: brewToClone, isLoading } = useSuspenseQuery(
    brewQueryOptions(brewId ?? "", user?.dbId ?? ""),
  );

  const mutation = useMutation({
    mutationFn: async (data: BrewFormInputs) => {
      return await addBrew({
        data: { data, userId: user?.dbId ?? "" },
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
      console.error("Clone brew - mutation error:", error);
    },
  });

  const handleClone = (data: BrewFormInputs) => {
    mutation.mutate(data);
  };

  if (!brewToClone || !brewId || isLoading) {
    return null;
  }

  // Convert to form inputs based on data source
  const defaultValues: BrewFormInputs = {
    // From PostgreSQL
    ...brewFormEmptyValues(),
    method: brewToClone.method,
    beans: brewToClone.beans.id,

    grinder: brewToClone.grinder,
    grinderBurrs: brewToClone.grinderBurrs,
    waterType: brewToClone.waterType,
    filterType: brewToClone.filterType,

    waterWeight: brewToClone.waterWeight,
    beansWeight: brewToClone.beansWeight,
    waterTemperature: brewToClone.waterTemperature,
    grindSetting: brewToClone.grindSetting,
  };

  return (
    <>
      <BreadcrumbsWithHome
        items={[
          navLinks.drinks,
          navLinks.brews,
          { label: brewToClone.method, linkTo: "/drinks/brews/$brewId" },
          { label: "Clone" },
        ]}
      />

      <Heading className="mb-4">Clone brew</Heading>

      <BrewForm
        defaultValues={defaultValues}
        buttonLabel="Clone"
        mutation={handleClone}
      />
    </>
  );
}
