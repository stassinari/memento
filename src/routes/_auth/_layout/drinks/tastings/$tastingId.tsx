import { Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { NotFound } from "~/components/ErrorPage";
import { TastingSetupCard } from "~/components/tastings/TastingDetailCards";
import { TastingDetailHeader } from "~/components/tastings/TastingDetailHeader";
import { TastingSamplesLinks } from "~/components/tastings/TastingSamplesLinks";
import { TastingSamplesShell } from "~/components/tastings/TastingSamplesShell";
import { buildBeansLookup } from "~/components/tastings/utils";
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

  return (
    <>
      <TastingDetailHeader
        tastingId={tasting.id}
        variable={tasting.variable}
        date={tasting.date}
        createdAt={tasting.createdAt}
      />

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
