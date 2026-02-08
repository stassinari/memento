import { createFileRoute, useParams } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";
import { Heading } from "~/components/Heading";
import { EspressoOutcomeForm } from "~/components/espresso/EspressoOutcomeForm";
import { getEspresso } from "~/db/queries";
import type { EspressoWithBeans } from "~/db/types";
import { useDocRef } from "~/hooks/firestore/useDocRef";
import { useFirestoreDocOneTime } from "~/hooks/firestore/useFirestoreDocOneTime";
import { userAtom } from "~/hooks/useInitUser";
import { Espresso } from "~/types/espresso";
import { flagsQueryOptions } from "../../../featureFlags";

const espressoQueryOptions = (espressoId: string, firebaseUid: string) =>
  queryOptions<EspressoWithBeans | null>({
    queryKey: ["espresso", espressoId, firebaseUid],
    queryFn: () =>
      getEspresso({ data: { espressoFbId: espressoId, firebaseUid } }) as Promise<EspressoWithBeans | null>,
  });

export const Route = createFileRoute(
  "/_auth/_layout/drinks/espresso/$espressoId/outcome",
)({
  component: EspressoEditOutcome,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(flagsQueryOptions());
  },
});

function EspressoEditOutcome() {
  console.log("EspressoEditOutcome");

  const user = useAtomValue(userAtom);
  const { espressoId } = useParams({ strict: false });

  const { data: flags } = useSuspenseQuery(flagsQueryOptions());
  const { data: sqlEspresso } = useSuspenseQuery<EspressoWithBeans | null>(
    espressoQueryOptions(espressoId ?? "", user?.uid ?? ""),
  );

  const shouldReadFromPostgres = flags?.find(
    (flag) => flag.name === "read_from_postgres",
  )?.enabled;

  const docRef = useDocRef<Espresso>("espresso", espressoId);
  const { details: fbEspresso, isLoading } =
    useFirestoreDocOneTime<Espresso>(docRef);

  // Check the appropriate data source based on flag
  const espresso = shouldReadFromPostgres ? sqlEspresso?.espresso : fbEspresso;

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
          { label: "Detail", linkTo: `/drinks/espresso/${espressoId}` },
          { label: "Outcome", linkTo: "#" },
        ]}
      />

      <Heading className="mb-4">Edit espresso outcome</Heading>

      <EspressoOutcomeForm espresso={espresso as any} espressoId={espressoId} />
    </>
  );
}
