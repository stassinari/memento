import { Link as RouterLink, createFileRoute, useNavigate } from "@tanstack/react-router";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";
import { Button } from "~/components/Button";
import { NotFound } from "~/components/ErrorPage";
import { Heading } from "~/components/Heading";
import { MarkdownNotes } from "~/components/MarkdownNotes";
import { MobileBottomDrawerNavigator } from "~/components/MobileBottomDrawerNavigator";
import { TastingDetailDesktopLayout } from "~/components/tastings/TastingDetailDesktopLayout";
import { TastingSamplesLinks } from "~/components/tastings/TastingSamplesLinks";
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

  if (isSm) {
    return <TastingSampleDesktop tastingId={tastingId} sampleId={sampleId} />;
  }

  return <TastingSampleMobile tastingId={tastingId} sampleId={sampleId} />;
}

function TastingSampleDesktop({ tastingId, sampleId }: { tastingId: string; sampleId: string }) {
  return (
    <TastingDetailDesktopLayout tastingId={tastingId} selectedSampleId={sampleId}>
      {({ tasting, beansLookup }) => {
        const sampleIndex = tasting.samples.findIndex((sample) => sample.id === sampleId);
        const sample = sampleIndex >= 0 ? tasting.samples[sampleIndex] : null;

        if (!sample) {
          return <NotFound />;
        }

        return (
          <TastingSampleDetailContent
            tasting={tasting}
            sample={sample}
            sampleIndex={sampleIndex}
            beansLookup={beansLookup}
            className="space-y-4"
          />
        );
      }}
    </TastingDetailDesktopLayout>
  );
}

function TastingSampleMobile({ tastingId, sampleId }: { tastingId: string; sampleId: string }) {
  const navigate = useNavigate();
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
  const sampleName = `Sample #${sampleIndex + 1}`;
  const canGoPrevious = sampleIndex > 0;
  const canGoNext = sampleIndex < tasting.samples.length - 1;

  const goToSampleByIndex = (nextIndex: number) => {
    const nextSample = tasting.samples[nextIndex];
    if (!nextSample) return;

    navigate({
      to: "/drinks/tastings/$tastingId/samples/$sampleId",
      params: { tastingId, sampleId: nextSample.id },
      resetScroll: false,
    });
  };

  return (
    <>
      <BreadcrumbsWithHome
        items={[
          navLinks.drinks,
          navLinks.tastings,
          { label: "Detail", link: { to: "/drinks/tastings/$tastingId", params: { tastingId } } },
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

      <TastingSampleDetailContent
        tasting={tasting}
        sample={sample}
        sampleIndex={sampleIndex}
        beansLookup={beansLookup}
        className="mt-3 space-y-4 pb-[calc(env(safe-area-inset-bottom)+3.5rem)]"
      />

      <MobileBottomDrawerNavigator
        drawerTitle="Samples"
        currentIndex={sampleIndex}
        totalCount={tasting.samples.length}
        onPrevious={() => goToSampleByIndex(sampleIndex - 1)}
        onNext={() => goToSampleByIndex(sampleIndex + 1)}
        disablePrevious={!canGoPrevious}
        disableNext={!canGoNext}
        closeOnContentClick
      >
        <TastingSamplesLinks
          variant="inbox"
          tastingId={tastingId}
          variable={tasting.variable}
          samples={tasting.samples}
          beansLookup={beansLookup}
          selectedSampleId={sample.id}
        />
      </MobileBottomDrawerNavigator>
    </>
  );
}

function TastingSampleDetailContent({
  tasting,
  sample,
  sampleIndex,
  beansLookup,
  className,
}: {
  tasting: {
    variable: string | null;
    samples: { id: string }[];
  };
  sample: {
    variableValueText: string | null;
    variableValueBeansId: string | null;
    actualTimeMinutes: number | null;
    actualTimeSeconds: number | null;
    note: string | null;
    overall: number | null;
    flavours: string[];
    aromaQuantity: number | null;
    aromaQuality: number | null;
    aromaNotes: string | null;
    acidityQuantity: number | null;
    acidityQuality: number | null;
    acidityNotes: string | null;
    sweetnessQuantity: number | null;
    sweetnessQuality: number | null;
    sweetnessNotes: string | null;
    bodyQuantity: number | null;
    bodyQuality: number | null;
    bodyNotes: string | null;
    finishQuantity: number | null;
    finishQuality: number | null;
    finishNotes: string | null;
  };
  sampleIndex: number;
  beansLookup: ReturnType<typeof buildBeansLookup>;
  className?: string;
}) {
  const sampleName = `Sample #${sampleIndex + 1}`;
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

  return (
    <div className={className}>
      <section className="space-y-2.5">
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">{sampleName}</h2>

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
          <MarkdownNotes markdown={sample.note} />
        )}
      </section>

      <section className="space-y-2.5">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Rating</h3>

        {!hasRating ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No tasting score for this sample.
          </p>
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
                        <MarkdownNotes markdown={notes} className="mt-1" />
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
  );
}
