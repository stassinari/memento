import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";
import { Heading } from "~/components/Heading";
import { BrewOutcomeForm } from "~/components/brews/BrewOutcomeForm";
import { getBrew } from "~/db/queries";
import { userAtom } from "~/hooks/useInitUser";
import { flagsQueryOptions } from "../../../feature-flags";

const brewQueryOptions = (brewId: string, firebaseUid: string) =>
  queryOptions({
    queryKey: ["brews", brewId],
    queryFn: () =>
      getBrew({
        data: { brewId, firebaseUid },
      }),
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
  const { brewId } = Route.useParams();

  const { data: brew, isLoading } = useSuspenseQuery(
    brewQueryOptions(brewId, user?.uid ?? ""),
  );

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
          { label: "Outcome" },
        ]}
      />

      <Heading className="mb-4">Edit brew outcome</Heading>

      <BrewOutcomeForm brew={brew} brewId={brewId} />
    </>
  );
}
