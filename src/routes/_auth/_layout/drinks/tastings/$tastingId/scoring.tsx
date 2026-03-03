import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";
import { NotFound } from "~/components/ErrorPage";
import { Heading } from "~/components/Heading";
import { TastingScoringForm } from "~/components/tastings/TastingScoringForm";
import { formatTastingDate, getTastingVariableLabel } from "~/components/tastings/utils";
import { TastingScoringFormInputs } from "~/components/tastings/form-types";
import { updateTastingScoring } from "~/db/mutations";
import { useTastingDetailData } from "~/hooks/queries/tastings";

export const Route = createFileRoute("/_auth/_layout/drinks/tastings/$tastingId/scoring")({
  component: TastingScoringPage,
});

function TastingScoringPage() {
  const { tastingId } = Route.useParams();
  const queryClient = useQueryClient();

  const { tasting, beans, isLoadingTasting } = useTastingDetailData({
    tastingId,
    enabledTasting: true,
    enabledBeans: true,
  });

  const mutation = useMutation({
    mutationFn: async (data: TastingScoringFormInputs) =>
      updateTastingScoring({ data: { tastingId, data } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tastings"] });
      queryClient.invalidateQueries({ queryKey: ["tastings", tastingId] });
      queryClient.invalidateQueries({ queryKey: ["beans"] });
    },
    onError: (error) => {
      console.error("Update tasting scoring - mutation error:", error);
    },
  });

  if (isLoadingTasting) {
    return null;
  }

  if (!tasting) {
    return <NotFound />;
  }

  const variableLabel = getTastingVariableLabel(tasting.variable ?? "unknown");

  return (
    <>
      <BreadcrumbsWithHome
        items={[navLinks.drinks, navLinks.tastings, { label: variableLabel }, { label: "Scoring" }]}
      />
      <Heading>Tasting scoring</Heading>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        {formatTastingDate(tasting.date ?? tasting.createdAt)}
      </p>

      <TastingScoringForm
        tasting={tasting}
        beansLookup={beans}
        onSubmit={(data) => mutation.mutate(data)}
        isSubmitting={mutation.isPending}
      />
    </>
  );
}
