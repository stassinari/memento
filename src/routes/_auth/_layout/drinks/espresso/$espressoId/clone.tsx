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
  EspressoFormInputs,
} from "~/components/espresso/EspressoForm";
import { Heading } from "~/components/Heading";
import { addEspresso } from "~/db/mutations";
import { getEspresso } from "~/db/queries";
import { userAtom } from "~/hooks/useInitUser";
import { flagsQueryOptions } from "../../../feature-flags";

const espressoQueryOptions = (espressoId: string, firebaseUid: string) =>
  queryOptions({
    queryKey: ["espresso", espressoId],
    queryFn: () =>
      getEspresso({
        data: { espressoId: espressoId, firebaseUid },
      }),
  });

export const Route = createFileRoute(
  "/_auth/_layout/drinks/espresso/$espressoId/clone",
)({
  component: EspressoClone,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(flagsQueryOptions());
  },
});

function EspressoClone() {
  const { espressoId } = Route.useParams();
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const user = useAtomValue(userAtom);

  const { data: espresso, isLoading } = useSuspenseQuery(
    espressoQueryOptions(espressoId ?? "", user?.uid ?? ""),
  );

  const mutation = useMutation({
    mutationFn: async (data: EspressoFormInputs) => {
      return await addEspresso({
        data: { data, firebaseUid: user?.uid ?? "" },
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

  if (!espresso || !espressoId || isLoading) {
    return null;
  }

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
        defaultValues={{
          ...espresso,
          beans: espresso.beans ? espresso.beans.id : null,
        }}
        buttonLabel="Clone"
        mutation={handleClone}
      />
    </>
  );
}
