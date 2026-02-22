import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";
import {
  DecentEspressoForm,
  DecentEspressoFormInputs,
} from "~/components/espresso/steps/DecentEspressoForm";
import { Heading } from "~/components/Heading";
import { updateDecentEspressoDetails } from "~/db/mutations";
import { getEspresso } from "~/db/queries";

const espressoQueryOptions = (espressoId: string) =>
  queryOptions({
    queryKey: ["espresso", espressoId],
    queryFn: () =>
      getEspresso({
        data: { espressoId },
      }),
  });

export const Route = createFileRoute(
  "/_auth/_layout/drinks/espresso/$espressoId/decent/edit",
)({
  component: DecentEspressoEditDetails,
});

function DecentEspressoEditDetails() {
  console.log("DecentEspressoEditDetails");

  const { espressoId } = Route.useParams();
  const navigate = useNavigate();

  const { data: decentEspresso } = useSuspenseQuery(
    espressoQueryOptions(espressoId ?? ""),
  );

  if (!decentEspresso) return null;

  const editDecentEspresso = async (data: DecentEspressoFormInputs) => {
    if (!espressoId) {
      throw new Error("Espresso ID missing");
    }

    await updateDecentEspressoDetails({
      data: {
        data: {
          date: decentEspresso.date,
          beans: data.beans,
          grindSetting: data.grindSetting,
          machine: data.machine,
          grinder: data.grinder,
          grinderBurrs: data.grinderBurrs,
          portafilter: data.portafilter,
          basket: data.basket,
          actualWeight: data.actualWeight,
          targetWeight: data.targetWeight,
          beansWeight: data.beansWeight,
        },
        espressoId,
      },
    });

    navigate({
      to: "/drinks/espresso/$espressoId",
      params: { espressoId: espressoId! },
    });
  };

  return (
    <>
      <BreadcrumbsWithHome
        items={[
          navLinks.drinks,
          navLinks.espresso,
          { label: "Detail", linkTo: "/drinks/espresso/$espressoId" },
          { label: "Edit info" },
        ]}
      />

      <Heading className="mb-4">
        Edit info ({decentEspresso.profileName})
      </Heading>

      <DecentEspressoForm
        defaultValues={{
          ...decentEspresso,
          beans: decentEspresso.beans?.id ?? null,
        }}
        existingBeans={decentEspresso.beans ?? undefined}
        mutation={editDecentEspresso}
        backLinkProps={{
          to: "/drinks/espresso/$espressoId",
          params: { espressoId },
        }}
      />
    </>
  );
}
