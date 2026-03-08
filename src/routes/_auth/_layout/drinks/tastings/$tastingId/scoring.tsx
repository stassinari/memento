import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link as RouterLink, createFileRoute, useNavigate } from "@tanstack/react-router";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";
import { Button } from "~/components/Button";
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
  const navigate = useNavigate();
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
      <Heading
        actionSlot={
          <Button variant="white" colour="accent" size="sm" asChild>
            <RouterLink to="/drinks/tastings/$tastingId" params={{ tastingId }}>
              Back to tasting
            </RouterLink>
          </Button>
        }
      >
        Tasting scoring
      </Heading>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        {formatTastingDate(tasting.date ?? tasting.createdAt)}
      </p>

      <TastingScoringForm
        tasting={tasting}
        beansLookup={beans}
        onSubmit={(data) => mutation.mutate(data)}
        onBack={() => navigate({ to: "/drinks/tastings/$tastingId", params: { tastingId } })}
        isSubmitting={mutation.isPending}
      />
    </>
  );
}
