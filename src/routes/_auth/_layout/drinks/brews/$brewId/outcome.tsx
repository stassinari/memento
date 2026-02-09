import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";
import { Heading } from "~/components/Heading";
import { BrewOutcomeForm } from "~/components/brews/BrewOutcomeForm";
import { getBrew } from "~/db/queries";
import type { BrewWithBeans } from "~/db/types";
import { useDocRef } from "~/hooks/firestore/useDocRef";
import { useFirestoreDocOneTime } from "~/hooks/firestore/useFirestoreDocOneTime";
import { userAtom } from "~/hooks/useInitUser";
import { Brew } from "~/types/brew";
import { flagsQueryOptions } from "../../../feature-flags";

const brewQueryOptions = (brewId: string, firebaseUid: string) =>
  queryOptions<BrewWithBeans | null>({
    queryKey: ["brews", brewId, firebaseUid],
    queryFn: () =>
      getBrew({
        data: { brewFbId: brewId, firebaseUid },
      }) as Promise<BrewWithBeans | null>,
  });

export const Route = createFileRoute(
  "/_auth/_layout/drinks/brews/$brewId/outcome",
)({
  component: BrewEditOutcome,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(flagsQueryOptions());
  },
});

function BrewEditOutcome() {
  console.log("BrewEditOutcome");

  const user = useAtomValue(userAtom);
  const { brewId } = useParams({ strict: false });

  const { data: flags } = useSuspenseQuery(flagsQueryOptions());
  const { data: sqlBrew } = useSuspenseQuery<BrewWithBeans | null>(
    brewQueryOptions(brewId ?? "", user?.uid ?? ""),
  );

  const shouldReadFromPostgres = flags?.find(
    (flag) => flag.name === "read_from_postgres",
  )?.enabled;

  const docRef = useDocRef<Brew>("brews", brewId);
  const { details: fbBrew, isLoading } = useFirestoreDocOneTime<Brew>(docRef);

  // Check the appropriate data source based on flag
  const brew = shouldReadFromPostgres ? sqlBrew?.brews : fbBrew;

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
          { label: brew.method, linkTo: `/drinks/brews/${brewId}` },
          { label: "Outcome", linkTo: "#" },
        ]}
      />

      <Heading className="mb-4">Edit brew outcome</Heading>

      <BrewOutcomeForm brew={brew as any} brewId={brewId} />
    </>
  );
}
