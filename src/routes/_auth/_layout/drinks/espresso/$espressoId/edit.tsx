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
import { updateEspresso } from "~/db/mutations";
import { getEspresso } from "~/db/queries";
import { userAtom } from "~/hooks/useInitUser";

const espressoQueryOptions = (espressoId: string, firebaseUid: string) =>
  queryOptions({
    queryKey: ["espresso", espressoId],
    queryFn: () =>
      getEspresso({
        data: { espressoId, firebaseUid },
      }),
  });

export const Route = createFileRoute(
  "/_auth/_layout/drinks/espresso/$espressoId/edit",
)({
  component: EspressoEditDetails,
});

function EspressoEditDetails() {
  const user = useAtomValue(userAtom);
  const { espressoId } = Route.useParams();

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: espresso, isLoading } = useSuspenseQuery(
    espressoQueryOptions(espressoId ?? "", user?.uid ?? ""),
  );

  const mutation = useMutation({
    mutationFn: async (data: EspressoFormInputs) => {
      await updateEspresso({
        data: {
          data,
          espressoId,
          firebaseUid: user?.uid ?? "",
        },
      });
    },
    onSuccess: () => {
      // Invalidate all espresso queries
      queryClient.invalidateQueries({ queryKey: ["espresso"] });

      // Navigate to detail view
      navigate({
        to: "/drinks/espresso/$espressoId",
        params: { espressoId: espressoId! },
      });
    },
  });

  const handleEdit = (data: EspressoFormInputs) => {
    mutation.mutate(data);
  };

  if (isLoading) return null;

  if (!espressoId || !espresso) {
    throw new Error("Espresso does not exist.");
  }
  return (
    <>
      <BreadcrumbsWithHome
        items={[
          navLinks.drinks,
          navLinks.espresso,
          { label: "Detail", linkTo: "/drinks/espresso/$espressoId" },
          { label: "Edit" },
        ]}
      />

      <Heading className="mb-4">Edit espresso details</Heading>

      <EspressoForm
        defaultValues={{
          ...espresso,
          beans: espresso.beans ? espresso.beans.id : null,
        }}
        buttonLabel="Edit"
        mutation={handleEdit}
      />
    </>
  );
}
