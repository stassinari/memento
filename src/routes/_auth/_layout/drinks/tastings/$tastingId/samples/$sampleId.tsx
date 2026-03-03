import { Link as RouterLink, createFileRoute } from "@tanstack/react-router";
import ReactMarkdown from "react-markdown";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";
import { Button } from "~/components/Button";
import { NotFound } from "~/components/ErrorPage";
import { Heading } from "~/components/Heading";
import {
  buildBeansLookup,
  getNormalizedTastingSampleLabel,
  hasMeaningfulNormalizedRating,
} from "~/components/tastings/utils";
import { useTastingDetailData } from "~/hooks/queries/tastings";
import useScreenMediaQuery from "~/hooks/useScreenMediaQuery";

export const Route = createFileRoute("/_auth/_layout/drinks/tastings/$tastingId/samples/$sampleId")(
  {
    component: TastingSamplePage,
  },
);

const scoreDimensions = [
  {
    key: "aroma",
    label: "Aroma",
    quantityField: "aromaQuantity",
    qualityField: "aromaQuality",
    notesField: "aromaNotes",
  },
  {
    key: "acidity",
    label: "Acidity",
    quantityField: "acidityQuantity",
    qualityField: "acidityQuality",
    notesField: "acidityNotes",
  },
  {
    key: "sweetness",
    label: "Sweetness",
    quantityField: "sweetnessQuantity",
    qualityField: "sweetnessQuality",
    notesField: "sweetnessNotes",
  },
  {
    key: "body",
    label: "Body",
    quantityField: "bodyQuantity",
    qualityField: "bodyQuality",
    notesField: "bodyNotes",
  },
  {
    key: "finish",
    label: "Finish",
    quantityField: "finishQuantity",
    qualityField: "finishQuality",
    notesField: "finishNotes",
  },
] as const;

function TastingSamplePage() {
  const { tastingId, sampleId } = Route.useParams();
  const isSm = useScreenMediaQuery("sm");

  const { tasting, beans, isLoadingTasting } = useTastingDetailData({ tastingId });

  if (isLoadingTasting) {
    return null;
  }

  if (!tasting) {
    return <NotFound />;
  }

  const sampleIndex = tasting.samples.findIndex((sample) => sample.id === sampleId);
  const sample = sampleIndex >= 0 ? tasting.samples[sampleIndex] : null;

  if (!sample) {
    return <NotFound />;
  }

  const beansLookup = buildBeansLookup(beans);
  const variableValue = getNormalizedTastingSampleLabel(tasting.variable, sample, beansLookup);
  const variableValueNode =
    tasting.variable === "beans" && sample.variableValueBeansId ? (
      <RouterLink
        to="/beans/$beansId"
        params={{ beansId: sample.variableValueBeansId }}
        className="text-orange-600 underline underline-offset-2 hover:text-orange-500 dark:text-orange-300 dark:hover:text-orange-200"
      >
        {variableValue || "View bean"}
      </RouterLink>
    ) : (
      variableValue || "-"
    );
  const hasRating = hasMeaningfulNormalizedRating(sample);
  const sampleName = `Sample #${sampleIndex + 1}`;

  return (
    <>
      {!isSm && (
        <>
          <BreadcrumbsWithHome
            items={[
              navLinks.drinks,
              navLinks.tastings,
              { label: "Detail", linkTo: "/drinks/tastings/$tastingId" },
              { label: sampleName },
            ]}
          />
          <Heading
            actionSlot={
              <Button variant="white" colour="accent" size="sm" asChild>
                <RouterLink to="/drinks/tastings/$tastingId" params={{ tastingId }}>
                  Back to tasting
                </RouterLink>
              </Button>
            }
          >
            {sampleName}
          </Heading>
        </>
      )}

      <div className={isSm ? "space-y-4" : "mt-3 space-y-4"}>
        <section className="space-y-2.5">
          {isSm && <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">{sampleName}</h2>}

          <div className="overflow-hidden rounded-md border border-gray-200 bg-white dark:border-white/10 dark:bg-gray-900">
            <dl className="divide-y divide-gray-200 dark:divide-white/10">
              <div className="grid grid-cols-2 gap-4 px-4 py-3">
                <dt className="text-sm text-gray-500 dark:text-gray-400">Variable value</dt>
                <dd className="text-right text-sm font-medium text-gray-900 dark:text-gray-100">
                  {variableValueNode}
                </dd>
              </div>
              <div className="grid grid-cols-2 gap-4 px-4 py-3">
                <dt className="text-sm text-gray-500 dark:text-gray-400">Actual time</dt>
                <dd className="text-right text-sm font-medium text-gray-900 dark:text-gray-100">
                  {sample.actualTimeMinutes !== null || sample.actualTimeSeconds !== null
                    ? `${sample.actualTimeMinutes ?? 0}:${String(sample.actualTimeSeconds ?? 0).padStart(2, "0")}`
                    : "-"}
                </dd>
              </div>
            </dl>
          </div>

          {sample.note && (
            <article className="prose prose-sm max-w-none text-sm text-gray-700 dark:prose-invert dark:text-gray-300">
              <ReactMarkdown>{sample.note}</ReactMarkdown>
            </article>
          )}
        </section>

        <section className="space-y-2.5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Rating</h3>

          {!hasRating ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">No tasting score for this sample.</p>
          ) : (
            <div className="space-y-2.5">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-md border border-gray-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-gray-900">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Overall
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    {sample.overall !== null ? `${sample.overall}/10` : "-"}
                  </p>
                </div>
                <div className="rounded-md border border-gray-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-gray-900">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Flavours
                  </p>
                  <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                    {sample.flavours.length > 0 ? sample.flavours.join(", ") : "-"}
                  </p>
                </div>
              </div>

              <div className="overflow-hidden rounded-md border border-gray-200 bg-white dark:border-white/10 dark:bg-gray-900">
                <div className="divide-y divide-gray-200 dark:divide-white/10">
                  {scoreDimensions.map((dimension) => {
                    const quantity = sample[dimension.quantityField];
                    const quality = sample[dimension.qualityField];
                    const notes = sample[dimension.notesField];

                    return (
                      <div key={dimension.key} className="px-4 py-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {dimension.label}
                          </p>
                          <div className="flex items-center gap-1.5 text-xs">
                            <span className="rounded-full bg-blue-100 px-2 py-0.5 font-medium text-blue-700 dark:bg-blue-500/20 dark:text-blue-200">
                              Quantity: {quantity ?? "-"}
                            </span>
                            <span className="rounded-full bg-orange-100 px-2 py-0.5 font-medium text-orange-700 dark:bg-orange-500/20 dark:text-orange-200">
                              Quality: {quality ?? "-"}
                            </span>
                          </div>
                        </div>
                        {notes && notes.trim() !== "" ? (
                          <article className="prose prose-sm mt-1 max-w-none dark:prose-invert">
                            <ReactMarkdown>{notes}</ReactMarkdown>
                          </article>
                        ) : (
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">No notes</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
