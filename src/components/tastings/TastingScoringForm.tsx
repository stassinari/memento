import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "~/components/Button";
import { MobileBottomDrawerNavigator } from "~/components/MobileBottomDrawerNavigator";
import { FormComboboxMulti } from "~/components/form/FormComboboxMulti";
import { FormInput } from "~/components/form/FormInput";
import { FormInputSlider } from "~/components/form/FormInputSlider";
import { FormTextarea } from "~/components/form/FormTextarea";
import {
  TastingSamplesList,
  TastingSamplesListItem,
  TastingSamplesListItemContent,
} from "~/components/tastings/TastingSamplesList";
import { TastingSamplesShell } from "~/components/tastings/TastingSamplesShell";
import { buildBeansLookup, getNormalizedTastingSampleLabel } from "~/components/tastings/utils";
import { notesToOptions, tastingNotes } from "~/data/tasting-notes";
import { TastingVariable } from "~/db/schema";
import useScreenMediaQuery from "~/hooks/useScreenMediaQuery";
import { parseNullableNumberInput } from "~/util";
import { TastingScoringFormInputs, TastingScoringSampleInputs } from "./form-types";
import {
  mapTastingScoringFormValuesFromSamples,
  normalizeTastingScoringFormData,
} from "./scoring-mappers";

interface BeansLookupItem {
  id: string;
  name: string;
  roaster: string;
}

interface TastingSampleLike extends TastingScoringSampleInputs {
  variableValueText: string | null;
  variableValueBeansId: string | null;
}

interface TastingLike {
  variable: TastingVariable | null;
  samples: TastingSampleLike[];
}

interface TastingScoringFormProps {
  tasting: TastingLike;
  beansLookup: BeansLookupItem[];
  onSubmit: (data: TastingScoringFormInputs) => void;
  onBack?: () => void;
  isSubmitting?: boolean;
}

type ScoreDimensionKey = "aroma" | "acidity" | "sweetness" | "body" | "finish";

const scoreDimensions: Array<{ key: ScoreDimensionKey; label: string }> = [
  { key: "aroma", label: "Aroma" },
  { key: "acidity", label: "Acidity" },
  { key: "sweetness", label: "Sweetness" },
  { key: "body", label: "Body" },
  { key: "finish", label: "Finish" },
];

const allFlavourOptions = notesToOptions(tastingNotes).map((note) => note.label);

export const TastingScoringForm = ({
  tasting,
  beansLookup,
  onSubmit,
  onBack,
  isSubmitting = false,
}: TastingScoringFormProps) => {
  const [activeSampleIndex, setActiveSampleIndex] = useState(0);
  const isSm = useScreenMediaQuery("sm");
  const formValues = useMemo(
    () => mapTastingScoringFormValuesFromSamples(tasting.samples),
    [tasting.samples],
  );

  const methods = useForm<TastingScoringFormInputs>({
    defaultValues: formValues,
  });

  useEffect(() => {
    methods.reset(formValues);
  }, [methods, formValues]);

  const { handleSubmit, register, watch } = methods;
  const samples = watch("samples");
  const activeSampleKey = tasting.samples[activeSampleIndex]?.id ?? String(activeSampleIndex);

  const normalizedBeansLookup = useMemo(() => buildBeansLookup(beansLookup), [beansLookup]);

  const getSampleLabel = (sampleIndex: number): string => {
    const sample = tasting.samples[sampleIndex];
    if (!sample) return `Sample #${sampleIndex + 1}`;

    return (
      getNormalizedTastingSampleLabel(tasting.variable, sample, normalizedBeansLookup) ||
      `Sample #${sampleIndex + 1}`
    );
  };

  const goToPreviousSample = () => {
    setActiveSampleIndex((index) => Math.max(0, index - 1));
  };

  const goToNextSample = () => {
    setActiveSampleIndex((index) => Math.min(samples.length - 1, index + 1));
  };

  const renderSamplesList = () => (
    <TastingSamplesList variant="inbox">
      {tasting.samples.map((sample, index) => (
        <TastingSamplesListItem
          key={sample.id}
          variant="inbox"
          isSelected={tasting.samples[activeSampleIndex]?.id === sample.id}
          asChild
        >
          <button
            type="button"
            onClick={() => setActiveSampleIndex(index)}
          >
            <TastingSamplesListItemContent sampleNumber={index + 1} label={getSampleLabel(index)} />
          </button>
        </TastingSamplesListItem>
      ))}
    </TastingSamplesList>
  );

  const sampleFormContent = (
    <>
      <h2 className="text-base font-semibold text-gray-900 dark:text-white">
        {getSampleLabel(activeSampleIndex)}
      </h2>

      <FormInputSlider
        label="Overall"
        id={`samples.${activeSampleIndex}.overall`}
        min={0}
        max={10}
        step={0.5}
      />

      <FormComboboxMulti
        label="Flavour notes"
        name={`samples.${activeSampleIndex}.flavours`}
        options={allFlavourOptions}
        placeholder="Search flavours"
      />

      {scoreDimensions.map((dimension) => (
        <div
          key={dimension.key}
          className="rounded-md bg-white p-3 ring-1 ring-inset ring-gray-200 dark:bg-gray-900/60 dark:ring-white/10"
        >
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {dimension.label}
          </p>
          <div className="mt-3 space-y-3">
            <FormInputSlider
              label="Quantity"
              id={`samples.${activeSampleIndex}.${dimension.key}Quantity`}
              min={0}
              max={5}
              step={0.5}
            />
            <FormInputSlider
              label="Quality"
              id={`samples.${activeSampleIndex}.${dimension.key}Quality`}
              min={0}
              max={5}
              step={0.5}
            />
            <FormTextarea
              label="Notes"
              id={`samples.${activeSampleIndex}.${dimension.key}Notes`}
              textareaProps={{
                ...register(`samples.${activeSampleIndex}.${dimension.key}Notes` as const),
              }}
            />
          </div>
        </div>
      ))}

      <FormInput
        label="Actual time minutes"
        id={`samples.${activeSampleIndex}.actualTimeMinutes`}
        inputProps={{
          ...register(`samples.${activeSampleIndex}.actualTimeMinutes` as const, {
            setValueAs: parseNullableNumberInput,
          }),
          type: "number",
        }}
      />

      <FormInput
        label="Actual time seconds"
        id={`samples.${activeSampleIndex}.actualTimeSeconds`}
        inputProps={{
          ...register(`samples.${activeSampleIndex}.actualTimeSeconds` as const, {
            setValueAs: parseNullableNumberInput,
          }),
          type: "number",
        }}
      />

      <FormTextarea
        label="Sample note"
        id={`samples.${activeSampleIndex}.note`}
        textareaProps={{ ...register(`samples.${activeSampleIndex}.note` as const) }}
      />
    </>
  );

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit((data) => {
          onSubmit(normalizeTastingScoringFormData(data));
        })}
        autoComplete="off"
        className="space-y-6 pb-[calc(env(safe-area-inset-bottom)+3.5rem)] sm:pb-0"
      >
        {isSm ? (
          <TastingSamplesShell list={renderSamplesList()}>
            <div key={activeSampleKey} className="space-y-6">
              {sampleFormContent}
            </div>
          </TastingSamplesShell>
        ) : (
          <div key={activeSampleKey} className="space-y-5">
            {sampleFormContent}
          </div>
        )}

        {!isSm && (
          <MobileBottomDrawerNavigator
            drawerTitle="Samples"
            currentIndex={activeSampleIndex}
            totalCount={samples.length}
            onPrevious={goToPreviousSample}
            onNext={goToNextSample}
            disablePrevious={activeSampleIndex === 0}
            disableNext={activeSampleIndex === samples.length - 1}
            closeOnContentClick
          >
            {renderSamplesList()}
          </MobileBottomDrawerNavigator>
        )}

        <div className="flex justify-end gap-4">
          {onBack && (
            <Button type="button" variant="white" onClick={onBack} disabled={isSubmitting}>
              Back
            </Button>
          )}
          <Button type="submit" variant="primary" colour="accent" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save scoring"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
