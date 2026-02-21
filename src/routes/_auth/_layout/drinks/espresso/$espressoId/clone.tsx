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
  EspressoForm,
  espressoFormEmptyValues,
  EspressoFormInputs,
} from "~/components/espresso/EspressoForm";
import { Heading } from "~/components/Heading";
import { addEspresso } from "~/db/mutations";
import { getEspresso } from "~/db/queries";
import { userAtom } from "~/hooks/useInitUser";

const espressoQueryOptions = (espressoId: string, userId: string) =>
  queryOptions({
    queryKey: ["espresso", espressoId],
    queryFn: () =>
      getEspresso({
        data: { espressoId: espressoId, userId },
      }),
  });

export const Route = createFileRoute(
  "/_auth/_layout/drinks/espresso/$espressoId/clone",
)({
  component: EspressoClone,
});

function EspressoClone() {
  const { espressoId } = Route.useParams();
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const user = useAtomValue(userAtom);

  const { data: espressoToClone, isLoading } = useSuspenseQuery(
    espressoQueryOptions(espressoId ?? "", user?.dbId ?? ""),
  );

  const mutation = useMutation({
    mutationFn: async (data: EspressoFormInputs) => {
      return await addEspresso({
        data: { data, userId: user?.dbId ?? "" },
      });
    },
    onSuccess: (result) => {
      // Invalidate all espresso queries
      queryClient.invalidateQueries({ queryKey: ["espresso"] });

      // Navigate to detail view
      navigate({
        to: "/drinks/espresso/$espressoId",
        params: { espressoId: result.id },
      });
    },
    onError: (error) => {
      console.error("Clone espresso - mutation error:", error);
    },
  });

  const handleClone = (data: EspressoFormInputs) => {
    mutation.mutate(data);
  };

  if (!espressoToClone || !espressoId || isLoading) {
    return null;
  }

  // Convert to form inputs based on data source
  const defaultValues: EspressoFormInputs = {
    // From PostgreSQL
    ...espressoFormEmptyValues(),
    beans: espressoToClone.beans?.id ?? null,
    machine: espressoToClone.machine,
    grinder: espressoToClone.grinder,
    grinderBurrs: espressoToClone.grinderBurrs,
    portafilter: espressoToClone.portafilter,
    basket: espressoToClone.basket,
    targetWeight: espressoToClone.targetWeight ?? null,
    beansWeight: espressoToClone.beansWeight ?? null,
    waterTemperature: espressoToClone.waterTemperature,
    grindSetting: espressoToClone.grindSetting,
  };

  return (
    <>
      <BreadcrumbsWithHome
        items={[
          navLinks.drinks,
          navLinks.espresso,
          { label: "Detail", linkTo: "/drinks/espresso/$espressoId" },
          { label: "Clone" },
        ]}
      />

      <Heading className="mb-4">Clone espresso</Heading>

      <EspressoForm
        defaultValues={defaultValues}
        buttonLabel="Clone"
        mutation={handleClone}
      />
    </>
  );
}
