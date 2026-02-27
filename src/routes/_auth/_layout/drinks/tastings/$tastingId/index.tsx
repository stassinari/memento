import { queryOptions, useQuery } from "@tanstack/react-query";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Link as RouterLink, createFileRoute } from "@tanstack/react-router";
import ReactMarkdown from "react-markdown";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";
import { Button } from "~/components/Button";
import { Card } from "~/components/Card";
import { NotFound } from "~/components/ErrorPage";
import { Heading } from "~/components/Heading";
import {
  buildBeansLookup,
  formatTastingDate,
  getNormalizedTastingSampleLabel,
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

export const Route = createFileRoute("/_auth/_layout/drinks/tastings/$tastingId/")({
  component: TastingIndexPage,
});

function TastingIndexPage() {
  const { tastingId } = Route.useParams();
  const isSm = useScreenMediaQuery("sm");

  const { data: tasting, isLoading: isLoadingTasting } = useQuery({
    ...tastingQueryOptions(tastingId),
    enabled: !isSm,
  });
  const { data: beans = [] } = useQuery({
    ...beansLookupQueryOptions(),
    enabled: !isSm,
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
  const targetTime =
    tasting.targetTimeMinutes !== null || tasting.targetTimeSeconds !== null
      ? `${tasting.targetTimeMinutes ?? 0}:${String(tasting.targetTimeSeconds ?? 0).padStart(2, "0")}`
      : "-";

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
        <Card.Container>
          <Card.Header title="Summary" />
          <Card.Content>
            <Card.DescriptionList
              rows={[
                {
                  label: "Variable",
                  value: variableLabel,
                },
                {
                  label: "Samples",
                  value: String(tasting.samples.length),
                },
                {
                  label: "Date",
                  value: formatTastingDate(tasting.date ?? tasting.createdAt),
                },
              ]}
            />
            {tasting.note && (
              <article className="prose prose-sm mt-4 max-w-none dark:prose-invert">
                <ReactMarkdown>{tasting.note}</ReactMarkdown>
              </article>
            )}
          </Card.Content>
        </Card.Container>

        <Card.Container className="overflow-hidden">
          <details className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between border-b border-gray-100 bg-gray-50/50 px-4 py-2 dark:border-white/10 dark:bg-white/5 sm:px-6">
              <h3 className="text-sm font-bold leading-6 text-gray-900 dark:text-gray-100">Setup</h3>
              <ChevronDownIcon className="h-5 w-5 text-gray-400 transition-transform group-open:rotate-180 dark:text-gray-500" />
            </summary>
            <Card.Content>
              <div className="mt-1 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Method</p>
                  <p className="text-sm text-gray-800 dark:text-gray-200">{tasting.method ?? "-"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Water type</p>
                  <p className="text-sm text-gray-800 dark:text-gray-200">{tasting.waterType ?? "-"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Filter type</p>
                  <p className="text-sm text-gray-800 dark:text-gray-200">{tasting.filterType ?? "-"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Grinder</p>
                  <p className="text-sm text-gray-800 dark:text-gray-200">{tasting.grinder ?? "-"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Grind setting</p>
                  <p className="text-sm text-gray-800 dark:text-gray-200">{tasting.grindSetting ?? "-"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Beans weight</p>
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    {tasting.beansWeight !== null ? `${tasting.beansWeight}g` : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Water weight</p>
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    {tasting.waterWeight !== null ? `${tasting.waterWeight}g` : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Water temperature
                  </p>
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    {tasting.waterTemperature !== null ? `${tasting.waterTemperature}°C` : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Target time</p>
                  <p className="text-sm text-gray-800 dark:text-gray-200">{targetTime}</p>
                </div>
              </div>
            </Card.Content>
          </details>
        </Card.Container>

        <Card.Container>
          <Card.Header title="Samples" />
          <Card.Content>
            <ul className="space-y-2">
              {tasting.samples.map((sample, index) => (
                <li key={sample.id}>
                  <RouterLink
                    to="/drinks/tastings/$tastingId/samples/$sampleId"
                    params={{ tastingId: tasting.id, sampleId: sample.id }}
                    className="block rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5"
                  >
                    <p className="font-semibold">Sample #{index + 1}</p>
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                      {getNormalizedTastingSampleLabel(tasting.variable, sample, beansLookup) || "-"}
                    </p>
                  </RouterLink>
                </li>
              ))}
            </ul>
          </Card.Content>
        </Card.Container>
      </div>
    </>
  );
}
