import { queryOptions, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";
import { Button } from "~/components/Button";
import { EmptyState } from "~/components/EmptyState";
import { Heading } from "~/components/Heading";
import { ListCard } from "~/components/ListCard";
import {
  buildBeansLookup,
  formatTastingDate,
  getNormalizedTastingSampleLabel,
  getTastingVariableLabel,
} from "~/components/tastings/utils";
import { getBeansLookup, getTastings } from "~/db/queries";
import useScreenMediaQuery from "~/hooks/useScreenMediaQuery";

type TastingWithSamples = Awaited<ReturnType<typeof getTastings>>[number];

const PAGE_SIZE = 15;

const tastingsQueryOptions = (limit: number, offset: number) =>
  queryOptions({
    queryKey: ["tastings", limit, offset],
    queryFn: () => getTastings({ data: { limit, offset } }),
  });

const beansLookupQueryOptions = () =>
  queryOptions({
    queryKey: ["beans", "lookup"],
    queryFn: () => getBeansLookup(),
  });

export const Route = createFileRoute("/_auth/_layout/drinks/tastings/")({
  component: TastingsListPage,
});

function TastingsListPage() {
  const [offset, setOffset] = useState(0);
  const [allTastings, setAllTastings] = useState<TastingWithSamples[]>([]);
  const isSm = useScreenMediaQuery("sm");

  const { data: tastings = [], isLoading: isLoadingTastings } = useQuery(
    tastingsQueryOptions(PAGE_SIZE, offset),
  );
  const { data: beans = [] } = useQuery(beansLookupQueryOptions());

  useEffect(() => {
    setAllTastings((prev) => {
      if (offset === 0) return tastings;
      return [...prev, ...tastings];
    });
  }, [tastings, offset]);

  const beansLookup = useMemo(() => buildBeansLookup(beans), [beans]);
  const hasMore = tastings.length >= PAGE_SIZE;

  return (
    <>
      <BreadcrumbsWithHome items={[navLinks.drinks, navLinks.tastings]} />
      <Heading>Tastings</Heading>

      {allTastings.length === 0 && !isLoadingTastings ? (
        <EmptyState
          title="No tastings yet"
          description="Imported tastings will appear here. Creation/editing is coming in a later step."
        />
      ) : (
        <ul className="mt-4 space-y-4">
          {allTastings.map((tasting) => {
            const sampleLabels = tasting.samples
              .map((sample) =>
                getNormalizedTastingSampleLabel(tasting.variable, sample, beansLookup),
              )
              .filter(Boolean);
            const preview =
              sampleLabels.length > 3
                ? `${sampleLabels.slice(0, 3).join(", ")} +${sampleLabels.length - 3} more`
                : sampleLabels.join(", ");

            return (
              <li key={tasting.id}>
                <ListCard
                  linkProps={{
                    to: "/drinks/tastings/$tastingId",
                    params: { tastingId: tasting.id },
                  }}
                  footerSlot={
                    <ListCard.Footer>
                      Tasted on {formatTastingDate(tasting.date ?? tasting.createdAt)}
                    </ListCard.Footer>
                  }
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="grow">
                      <ListCard.Title>
                        {getTastingVariableLabel(tasting.variable ?? "unknown")}
                      </ListCard.Title>
                      <ListCard.Row className="line-clamp-2">
                        {preview || `${tasting.samples.length} samples`}
                      </ListCard.Row>
                    </div>
                    {tasting.samples.length > 0 && (
                      <ListCard.Rating className="shrink-0">{tasting.samples.length}</ListCard.Rating>
                    )}
                  </div>
                </ListCard>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-4 flex justify-center">
        {hasMore && (
          <Button
            variant="white"
            colour="accent"
            onClick={() => setOffset((prev) => prev + PAGE_SIZE)}
            disabled={isLoadingTastings}
          >
            {isLoadingTastings ? "Loading..." : isSm ? "Load more tastings" : "Load more"}
          </Button>
        )}
      </div>

    </>
  );
}
