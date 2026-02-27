import { Link as RouterLink, createFileRoute } from "@tanstack/react-router";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";
import { Button } from "~/components/Button";
import { Card } from "~/components/Card";
import { NotFound } from "~/components/ErrorPage";
import { Heading } from "~/components/Heading";
import { TastingSetupCard, TastingSummaryCard } from "~/components/tastings/TastingDetailCards";
import { TastingSamplesList } from "~/components/tastings/TastingSamplesList";
import {
  buildBeansLookup,
  formatTastingDate,
  getTastingVariableLabel,
} from "~/components/tastings/utils";
import { useTastingDetailData } from "~/hooks/queries/tastings";
import useScreenMediaQuery from "~/hooks/useScreenMediaQuery";

export const Route = createFileRoute("/_auth/_layout/drinks/tastings/$tastingId/")({
  component: TastingIndexPage,
});

function TastingIndexPage() {
  const { tastingId } = Route.useParams();
  const isSm = useScreenMediaQuery("sm");

  const { tasting, beans, isLoadingTasting } = useTastingDetailData({
    tastingId,
    enabledTasting: !isSm,
    enabledBeans: !isSm,
  });

  if (isSm) {
    return (
      <Card.Container className="h-full min-h-64">
        <Card.Content className="flex h-full items-center justify-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Select a sample from the left to view its details.
          </p>
        </Card.Content>
      </Card.Container>
    );
  }

  if (isLoadingTasting) {
    return null;
  }

  if (!tasting) {
    return <NotFound />;
  }

  const beansLookup = buildBeansLookup(beans);
  const variableLabel = getTastingVariableLabel(tasting.variable ?? "unknown");

  return (
    <>
      <BreadcrumbsWithHome items={[navLinks.drinks, navLinks.tastings, { label: variableLabel }]} />
      <Heading
        actionSlot={
          <Button variant="white" colour="accent" size="sm" asChild>
            <RouterLink to="/drinks/tastings">Back to list</RouterLink>
          </Button>
        }
      >
        Tasting detail
      </Heading>

      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        {formatTastingDate(tasting.date ?? tasting.createdAt)}
      </p>

      <div className="grid gap-4">
        <TastingSummaryCard tasting={tasting} variableLabel={variableLabel} />
        <TastingSetupCard tasting={tasting} />

        <Card.Container>
          <Card.Header title="Samples" />
          <Card.Content>
            <TastingSamplesList
              tasting={tasting}
              tastingId={tasting.id}
              beansLookup={beansLookup}
              variant="card"
            />
          </Card.Content>
        </Card.Container>
      </div>
    </>
  );
}
