import { Link as RouterLink, Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";
import { Button } from "~/components/Button";
import { NotFound } from "~/components/ErrorPage";
import { Heading } from "~/components/Heading";
import { TastingSetupCard } from "~/components/tastings/TastingDetailCards";
import { TastingSamplesLinks } from "~/components/tastings/TastingSamplesLinks";
import { TastingSamplesShell } from "~/components/tastings/TastingSamplesShell";
import {
  buildBeansLookup,
  formatTastingDate,
  getTastingVariableLabel,
} from "~/components/tastings/utils";
import { useTastingDetailData } from "~/hooks/queries/tastings";
import useScreenMediaQuery from "~/hooks/useScreenMediaQuery";

export const Route = createFileRoute("/_auth/_layout/drinks/tastings/$tastingId")({
  component: TastingLayoutPage,
});

function TastingLayoutPage() {
  const { tastingId } = Route.useParams();
  const isSm = useScreenMediaQuery("sm");
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const isScoringRoute = pathname.endsWith("/scoring");

  const { tasting, beans, isLoadingTasting } = useTastingDetailData({
    tastingId,
    enabledTasting: isSm && !isScoringRoute,
    enabledBeans: isSm && !isScoringRoute,
  });

  if (!isSm || isScoringRoute) {
    return <Outlet />;
  }

  if (isLoadingTasting) {
    return null;
  }

  if (!tasting) {
    return <NotFound />;
  }

  const beansLookup = buildBeansLookup(beans);
  const selectedSampleId = pathname.split("/samples/")[1]?.split("/")[0];

  const variableLabel = getTastingVariableLabel(tasting.variable ?? "unknown");

  return (
    <>
      <BreadcrumbsWithHome
        items={[
          navLinks.drinks,
          navLinks.tastings,
          {
            label: variableLabel,
          },
        ]}
      />
      <Heading>Tasting detail</Heading>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-700 ring-1 ring-inset ring-orange-200 dark:bg-orange-500/15 dark:text-orange-200 dark:ring-orange-400/40">
          {variableLabel}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {formatTastingDate(tasting.date ?? tasting.createdAt)}
        </span>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2">
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

      <TastingSamplesShell
        list={
          <TastingSamplesLinks
            variant="inbox"
            tastingId={tastingId}
            variable={tasting.variable}
            samples={tasting.samples}
            beansLookup={beansLookup}
            selectedSampleId={selectedSampleId}
          />
        }
      >
        <Outlet />
      </TastingSamplesShell>
    </>
  );
}
