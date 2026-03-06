import { Link as RouterLink, createFileRoute } from "@tanstack/react-router";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";
import { Button } from "~/components/Button";
import { NotFound } from "~/components/ErrorPage";
import { Heading } from "~/components/Heading";
import { TastingSetupCard } from "~/components/tastings/TastingDetailCards";
import { TastingSamplesLinks } from "~/components/tastings/TastingSamplesLinks";
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
      <div className="grid min-h-64 place-items-center px-2">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Select a sample from the left to view its details.
        </p>
      </div>
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

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-700 ring-1 ring-inset ring-orange-200 dark:bg-orange-500/15 dark:text-orange-200 dark:ring-orange-400/40">
          {variableLabel}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {formatTastingDate(tasting.date ?? tasting.createdAt)}
        </span>
      </div>

      <div className="grid gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="primary" colour="accent" size="sm" asChild>
            <RouterLink to="/drinks/tastings/$tastingId/scoring" params={{ tastingId }}>
              Edit scoring
            </RouterLink>
          </Button>
          <Button variant="white" size="sm" disabled>
            Edit setup
          </Button>
          <Button variant="white" size="sm" disabled>
            Clone
          </Button>
          <Button variant="white" size="sm" disabled>
            Delete
          </Button>
        </div>

        <TastingSetupCard tasting={tasting} />

        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-white/10 dark:bg-gray-900">
          <div className="border-b border-gray-200 px-4 py-2 text-sm font-semibold text-gray-900 dark:border-white/10 dark:text-gray-100">
            Samples
          </div>
          <div className="bg-gray-50/50 dark:bg-white/5">
            <TastingSamplesLinks
              variant="inbox"
              tastingId={tasting.id}
              variable={tasting.variable}
              samples={tasting.samples}
              beansLookup={beansLookup}
            />
          </div>
        </div>
      </div>
    </>
  );
}
