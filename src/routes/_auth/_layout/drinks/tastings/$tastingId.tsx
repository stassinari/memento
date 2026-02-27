import { queryOptions, useQuery } from "@tanstack/react-query";
import { Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";
import { NotFound } from "~/components/ErrorPage";
import { Heading } from "~/components/Heading";
import { TastingSetupCard, TastingSummaryCard } from "~/components/tastings/TastingDetailCards";
import { TastingSamplesList } from "~/components/tastings/TastingSamplesList";
import {
  buildBeansLookup,
  formatTastingDate,
  getTastingVariableLabel,
} from "~/components/tastings/utils";
import { getBeansLookup, getTasting } from "~/db/queries";
import useScreenMediaQuery from "~/hooks/useScreenMediaQuery";

const tastingQueryOptions = (tastingId: string) =>
  queryOptions({
    queryKey: ["tastings", tastingId],
    queryFn: () =>
      getTasting({
        data: { tastingId },
      }),
  });

const beansLookupQueryOptions = () =>
  queryOptions({
    queryKey: ["beans", "lookup"],
    queryFn: () => getBeansLookup(),
  });

export const Route = createFileRoute("/_auth/_layout/drinks/tastings/$tastingId")({
  component: TastingLayoutPage,
});

function TastingLayoutPage() {
  const { tastingId } = Route.useParams();
  const isSm = useScreenMediaQuery("sm");
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  const { data: tasting, isLoading: isLoadingTasting } = useQuery({
    ...tastingQueryOptions(tastingId),
    enabled: isSm,
  });
  const { data: beans = [] } = useQuery({
    ...beansLookupQueryOptions(),
    enabled: isSm,
  });

  if (!isSm) {
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

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs dark:border-white/10 dark:bg-gray-900">
        <div className="grid grid-cols-12">
          <aside className="col-span-4 border-r border-gray-200 bg-gray-50/60 dark:border-white/10 dark:bg-white/5">
            <div className="border-b border-gray-200 px-4 py-3 dark:border-white/10">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Samples</h2>
            </div>
            <TastingSamplesList
              tasting={tasting}
              tastingId={tastingId}
              beansLookup={beansLookup}
              selectedSampleId={selectedSampleId}
              variant="inbox"
            />
          </aside>

          <main className="col-span-8 bg-white p-4 dark:bg-gray-900">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}
