import { Link as RouterLink, Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";
import { NotFound } from "~/components/ErrorPage";
import { Heading } from "~/components/Heading";
import { TastingSetupCard, TastingSummaryCard } from "~/components/tastings/TastingDetailCards";
import {
  TastingSamplesList,
  TastingSamplesListItem,
  TastingSamplesListItemContent,
} from "~/components/tastings/TastingSamplesList";
import { TastingSamplesShell } from "~/components/tastings/TastingSamplesShell";
import {
  buildBeansLookup,
  formatTastingDate,
  getNormalizedTastingSampleLabel,
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
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        {formatTastingDate(tasting.date ?? tasting.createdAt)}
      </p>

      <TastingSummaryCard tasting={tasting} variableLabel={variableLabel} />
      <TastingSetupCard tasting={tasting} />

      <TastingSamplesShell
        list={
          <TastingSamplesList variant="inbox">
            {tasting.samples.map((sample, index) => (
              <TastingSamplesListItem
                key={sample.id}
                variant="inbox"
                isSelected={selectedSampleId === sample.id}
                asChild
              >
                <RouterLink
                  to="/drinks/tastings/$tastingId/samples/$sampleId"
                  params={{ tastingId, sampleId: sample.id }}
                  resetScroll={false}
                >
                  <TastingSamplesListItemContent
                    sampleNumber={index + 1}
                    label={getNormalizedTastingSampleLabel(tasting.variable, sample, beansLookup)}
                  />
                </RouterLink>
              </TastingSamplesListItem>
            ))}
          </TastingSamplesList>
        }
      >
        <Outlet />
      </TastingSamplesShell>
    </>
  );
}
