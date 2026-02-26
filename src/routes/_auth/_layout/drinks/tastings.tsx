import { queryOptions, useQuery } from "@tanstack/react-query";
import { Link as RouterLink, createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";
import { Button } from "~/components/Button";
import { Card } from "~/components/Card";
import { EmptyState } from "~/components/EmptyState";
import { NotFound } from "~/components/ErrorPage";
import { Heading } from "~/components/Heading";
import { ListCard } from "~/components/ListCard";
import {
  buildBeansLookup,
  formatTastingDate,
  getTastingSampleLabel,
  getTastingVariableLabel,
  hasMeaningfulPrep,
  hasMeaningfulRating,
  parseTastingData,
} from "~/components/tastings/utils";
import { getBeansLookup, getTasting, getTastings } from "~/db/queries";
import type { Beans, Tasting } from "~/db/types";
import useScreenMediaQuery from "~/hooks/useScreenMediaQuery";

type TastingWithBeans = { tastings: Tasting; beans: Beans | null };
type TastingWithOptionalBeans = Tasting & { beans: Beans | null };

const PAGE_SIZE = 15;

const tastingsQueryOptions = (limit: number, offset: number) =>
  queryOptions({
    queryKey: ["tastings", limit, offset],
    queryFn: async (): Promise<TastingWithBeans[]> =>
      (await getTastings({ data: { limit, offset } })) as TastingWithBeans[],
  });

const beansLookupQueryOptions = () =>
  queryOptions({
    queryKey: ["beans", "lookup"],
    queryFn: () => getBeansLookup(),
  });

const tastingQueryOptions = (tastingId: string) =>
  queryOptions({
    queryKey: ["tastings", tastingId],
    queryFn: async (): Promise<TastingWithOptionalBeans | null> =>
      (await getTasting({
        data: { tastingId },
      })) as TastingWithOptionalBeans | null,
  });

export const Route = createFileRoute("/_auth/_layout/drinks/tastings")({
  validateSearch: (search: Record<string, unknown>): { tastingId?: string } => {
    if (typeof search.tastingId === "string") {
      return { tastingId: search.tastingId };
    }
    return {};
  },
  component: TastingsPage,
});

function TastingsPage() {
  const search = Route.useSearch();
  const tastingId = search.tastingId;

  const [offset, setOffset] = useState(0);
  const [allTastings, setAllTastings] = useState<TastingWithBeans[]>([]);

  const { data: tastings = [], isLoading: isLoadingTastings } = useQuery(
    tastingsQueryOptions(PAGE_SIZE, offset),
  );

  const { data: selectedTasting, isLoading: isLoadingSelectedTasting } = useQuery({
    ...tastingQueryOptions(tastingId ?? ""),
    enabled: Boolean(tastingId),
  });

  const { data: beans = [] } = useQuery(beansLookupQueryOptions());

  useEffect(() => {
    if (!tastings) {
      return;
    }

    setAllTastings((prev) => {
      if (offset === 0) return tastings;
      return [...prev, ...tastings];
    });
  }, [tastings, offset]);

  const beansLookup = useMemo(() => buildBeansLookup(beans), [beans]);
  const isSm = useScreenMediaQuery("sm");

  const hasMore = tastings.length >= PAGE_SIZE;

  if (tastingId) {
    if (isLoadingSelectedTasting) {
      return null;
    }

    if (!selectedTasting) {
      return <NotFound />;
    }

    const parsed = parseTastingData(selectedTasting.data);

    const sampleRows = parsed.samples.map((sample, index) => {
      return {
        sampleName: `Sample #${index + 1}`,
        variableValue: getTastingSampleLabel(parsed.variable, sample, beansLookup),
        hasPrep: hasMeaningfulPrep(sample.prep),
        hasRating: hasMeaningfulRating(sample.rating),
        overall: sample.rating.overall > 0 ? sample.rating.overall : null,
        flavours: sample.rating.flavours,
      };
    });

    return (
      <>
        <BreadcrumbsWithHome items={[navLinks.drinks, navLinks.tastings, { label: "Detail" }]} />

        <Heading
          actionSlot={
            <Button variant="white" colour="accent" size={isSm ? "md" : "sm"} asChild>
              <RouterLink to="/drinks/tastings" search={{ tastingId: undefined }}>
                Back to list
              </RouterLink>
            </Button>
          }
        >
          Tasting detail
        </Heading>

        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          {formatTastingDate(parsed.date ?? selectedTasting.createdAt)}
        </p>

        <div className="grid gap-4">
          <Card.Container>
            <Card.Header title="Summary" />
            <Card.Content>
              <Card.DescriptionList
                rows={[
                  {
                    label: "Variable",
                    value: getTastingVariableLabel(parsed.variable),
                  },
                  {
                    label: "Samples",
                    value: String(parsed.samples.length),
                  },
                  {
                    label: "Prep completed",
                    value: parsed.prepDone ? "Yes" : "No",
                  },
                ]}
              />
            </Card.Content>
          </Card.Container>

          <Card.Container>
            <Card.Header title="Samples" />
            <Card.Content>
              {sampleRows.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">No samples found in tasting data.</p>
              ) : (
                <ul className="space-y-4">
                  {sampleRows.map((sample) => (
                    <li
                      key={sample.sampleName}
                      className="rounded-md border border-gray-200 p-3 dark:border-white/10"
                    >
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{sample.sampleName}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{sample.variableValue || "-"}</p>
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        Prep: {sample.hasPrep ? "yes" : "no"} | Rating: {sample.hasRating ? "yes" : "no"}
                        {sample.overall !== null ? ` | Overall: ${sample.overall}` : ""}
                      </p>
                      {sample.flavours.length > 0 && (
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          Flavours: {sample.flavours.join(", ")}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </Card.Content>
          </Card.Container>

          <Card.Container>
            <Card.Header title="Raw tasting JSON" />
            <Card.Content>
              <pre className="overflow-auto rounded-md bg-gray-50 p-3 text-xs dark:bg-gray-950/50">
                {JSON.stringify(selectedTasting.data, null, 2)}
              </pre>
            </Card.Content>
          </Card.Container>
        </div>
      </>
    );
  }

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
          {allTastings.map(({ tastings: tasting }) => {
            const parsed = parseTastingData(tasting.data);
            const sampleLabels = parsed.samples
              .map((sample) => getTastingSampleLabel(parsed.variable, sample, beansLookup))
              .filter(Boolean);
            const preview =
              sampleLabels.length > 3
                ? `${sampleLabels.slice(0, 3).join(", ")} +${sampleLabels.length - 3} more`
                : sampleLabels.join(", ");

            return (
              <li key={tasting.id}>
                <ListCard
                  linkProps={{
                    to: "/drinks/tastings",
                    search: { tastingId: tasting.id },
                  }}
                  footerSlot={
                    <ListCard.Footer>
                      Tasted on {formatTastingDate(parsed.date ?? tasting.createdAt)}
                    </ListCard.Footer>
                  }
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="grow">
                      <ListCard.Title>{getTastingVariableLabel(parsed.variable)}</ListCard.Title>
                      <ListCard.Row className="line-clamp-2">
                        {preview || `${parsed.samples.length} samples`}
                      </ListCard.Row>
                    </div>
                    {parsed.samples.length > 0 && (
                      <ListCard.Rating className="shrink-0">{parsed.samples.length}</ListCard.Rating>
                    )}
                  </div>
                </ListCard>
              </li>
            );
          })}
        </ul>
      )}

      <div className="flex justify-center mt-4">
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
