import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";
import { Heading } from "~/components/Heading";
import { EspressoOutcomeForm } from "~/components/espresso/EspressoOutcomeForm";
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
  "/_auth/_layout/drinks/espresso/$espressoId/outcome",
)({
  component: EspressoEditOutcome,
});

function EspressoEditOutcome() {
  console.log("EspressoEditOutcome");

  const { espressoId } = Route.useParams();

  const { data: espresso, isLoading } = useSuspenseQuery(
    espressoQueryOptions(espressoId ?? ""),
  );

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
          { label: "Outcome" },
        ]}
      />

      <Heading className="mb-4">Edit espresso outcome</Heading>

      <EspressoOutcomeForm espresso={espresso} espressoId={espressoId} />
    </>
  );
}
