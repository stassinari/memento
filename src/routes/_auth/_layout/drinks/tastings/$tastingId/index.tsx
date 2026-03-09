import { createFileRoute } from "@tanstack/react-router";
import { NotFound } from "~/components/ErrorPage";
import { TastingSetupCard } from "~/components/tastings/TastingDetailCards";
import { TastingDetailDesktopLayout } from "~/components/tastings/TastingDetailDesktopLayout";
import { TastingDetailHeader } from "~/components/tastings/TastingDetailHeader";
import { TastingSamplesLinks } from "~/components/tastings/TastingSamplesLinks";
import { buildBeansLookup } from "~/components/tastings/utils";
import { useTastingDetailData } from "~/hooks/queries/tastings";
import useScreenMediaQuery from "~/hooks/useScreenMediaQuery";

export const Route = createFileRoute("/_auth/_layout/drinks/tastings/$tastingId/")({
  component: TastingIndexPage,
});

function TastingIndexPage() {
  const { tastingId } = Route.useParams();
  const isSm = useScreenMediaQuery("sm");

  if (isSm) {
    return (
      <TastingDetailDesktopLayout tastingId={tastingId}>
        {() => (
          <div className="grid min-h-64 place-items-center px-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Select a sample from the left to view its details.
            </p>
          </div>
        )}
      </TastingDetailDesktopLayout>
    );
  }

  return <TastingIndexMobile tastingId={tastingId} />;
}

function TastingIndexMobile({ tastingId }: { tastingId: string }) {
  const { tasting, beans, isLoadingTasting } = useTastingDetailData({ tastingId });

  if (isLoadingTasting) {
    return null;
  }

  if (!tasting) {
    return <NotFound />;
  }

  const beansLookup = buildBeansLookup(beans);

  return (
    <>
      <TastingDetailHeader
        tastingId={tasting.id}
        variable={tasting.variable}
        date={tasting.date}
        createdAt={tasting.createdAt}
      />

      <div className="grid gap-4">
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
