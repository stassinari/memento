import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "~/components/Button";
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
import { parseNullableNumberInput } from "~/util";
import { TastingScoringFormInputs } from "./form-types";

interface BeansLookupItem {
  id: string;
  name: string;
  roaster: string;
}

interface TastingSampleLike {
  id: string;
  variableValueText: string | null;
  variableValueBeansId: string | null;
  note: string | null;
  actualTimeMinutes: number | null;
  actualTimeSeconds: number | null;

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
}

interface TastingLike {
  variable: TastingVariable | null;
  samples: TastingSampleLike[];
}

interface TastingScoringFormProps {
  tasting: TastingLike;
  beansLookup: BeansLookupItem[];
  onSubmit: (data: TastingScoringFormInputs) => void;
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

const toNullableString = (value: string | null): string | null => {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const toNullableNumber = (value: number | null): number | null =>
  value === null || Number.isNaN(value) ? null : value;

export const TastingScoringForm = ({
  tasting,
  beansLookup,
  onSubmit,
  isSubmitting = false,
}: TastingScoringFormProps) => {
  const [activeSampleIndex, setActiveSampleIndex] = useState(0);

  const methods = useForm<TastingScoringFormInputs>({
    defaultValues: {
      samples: tasting.samples.map((sample) => ({
        id: sample.id,
        note: sample.note,
        actualTimeMinutes: sample.actualTimeMinutes,
        actualTimeSeconds: sample.actualTimeSeconds,
        overall: sample.overall,
        flavours: sample.flavours,
        aromaQuantity: sample.aromaQuantity,
        aromaQuality: sample.aromaQuality,
        aromaNotes: sample.aromaNotes,
        acidityQuantity: sample.acidityQuantity,
        acidityQuality: sample.acidityQuality,
        acidityNotes: sample.acidityNotes,
        sweetnessQuantity: sample.sweetnessQuantity,
        sweetnessQuality: sample.sweetnessQuality,
        sweetnessNotes: sample.sweetnessNotes,
        bodyQuantity: sample.bodyQuantity,
        bodyQuality: sample.bodyQuality,
        bodyNotes: sample.bodyNotes,
        finishQuantity: sample.finishQuantity,
        finishQuality: sample.finishQuality,
        finishNotes: sample.finishNotes,
      })),
    },
  });

  useEffect(() => {
    methods.reset({
      samples: tasting.samples.map((sample) => ({
        id: sample.id,
        note: sample.note,
        actualTimeMinutes: sample.actualTimeMinutes,
        actualTimeSeconds: sample.actualTimeSeconds,
        overall: sample.overall,
        flavours: sample.flavours,
        aromaQuantity: sample.aromaQuantity,
        aromaQuality: sample.aromaQuality,
        aromaNotes: sample.aromaNotes,
        acidityQuantity: sample.acidityQuantity,
        acidityQuality: sample.acidityQuality,
        acidityNotes: sample.acidityNotes,
        sweetnessQuantity: sample.sweetnessQuantity,
        sweetnessQuality: sample.sweetnessQuality,
        sweetnessNotes: sample.sweetnessNotes,
        bodyQuantity: sample.bodyQuantity,
        bodyQuality: sample.bodyQuality,
        bodyNotes: sample.bodyNotes,
        finishQuantity: sample.finishQuantity,
        finishQuality: sample.finishQuality,
        finishNotes: sample.finishNotes,
      })),
    });
  }, [methods, tasting.samples]);

  const { handleSubmit, register, watch } = methods;
  const samples = watch("samples");

  const normalizedBeansLookup = useMemo(() => buildBeansLookup(beansLookup), [beansLookup]);

  const getSampleLabel = (sampleIndex: number): string => {
    const sample = tasting.samples[sampleIndex];
    if (!sample) return `Sample #${sampleIndex + 1}`;

    return (
      getNormalizedTastingSampleLabel(tasting.variable, sample, normalizedBeansLookup) ||
      `Sample #${sampleIndex + 1}`
    );
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit((data) => {
          onSubmit({
            samples: data.samples.map((sample) => ({
              ...sample,
              note: toNullableString(sample.note),
              actualTimeMinutes: toNullableNumber(sample.actualTimeMinutes),
              actualTimeSeconds: toNullableNumber(sample.actualTimeSeconds),
              overall: toNullableNumber(sample.overall),
              flavours: sample.flavours ?? [],
              aromaQuantity: toNullableNumber(sample.aromaQuantity),
              aromaQuality: toNullableNumber(sample.aromaQuality),
              aromaNotes: toNullableString(sample.aromaNotes),
              acidityQuantity: toNullableNumber(sample.acidityQuantity),
              acidityQuality: toNullableNumber(sample.acidityQuality),
              acidityNotes: toNullableString(sample.acidityNotes),
              sweetnessQuantity: toNullableNumber(sample.sweetnessQuantity),
              sweetnessQuality: toNullableNumber(sample.sweetnessQuality),
              sweetnessNotes: toNullableString(sample.sweetnessNotes),
              bodyQuantity: toNullableNumber(sample.bodyQuantity),
              bodyQuality: toNullableNumber(sample.bodyQuality),
              bodyNotes: toNullableString(sample.bodyNotes),
              finishQuantity: toNullableNumber(sample.finishQuantity),
              finishQuality: toNullableNumber(sample.finishQuality),
              finishNotes: toNullableString(sample.finishNotes),
            })),
          });
        })}
        autoComplete="off"
        className="space-y-6"
      >
        <TastingSamplesShell
          list={
            <TastingSamplesList variant="inbox">
              {tasting.samples.map((sample, index) => (
                <TastingSamplesListItem
                  key={sample.id}
                  variant="inbox"
                  isSelected={tasting.samples[activeSampleIndex]?.id === sample.id}
                  asChild
                >
                  <button type="button" onClick={() => setActiveSampleIndex(index)}>
                    <TastingSamplesListItemContent
                      sampleNumber={index + 1}
                      label={getSampleLabel(index)}
                    />
                  </button>
                </TastingSamplesListItem>
              ))}
            </TastingSamplesList>
          }
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between sm:hidden">
              <Button
                type="button"
                variant="white"
                size="sm"
                onClick={() => setActiveSampleIndex((index) => Math.max(0, index - 1))}
                disabled={activeSampleIndex === 0}
              >
                <ArrowLeftIcon /> Previous
              </Button>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {activeSampleIndex + 1}/{samples.length}
              </span>
              <Button
                type="button"
                variant="white"
                size="sm"
                onClick={() =>
                  setActiveSampleIndex((index) => Math.min(samples.length - 1, index + 1))
                }
                disabled={activeSampleIndex === samples.length - 1}
              >
                Next <ArrowRightIcon />
              </Button>
            </div>

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
          </div>
        </TastingSamplesShell>

        <div className="flex justify-end gap-4">
          <Button type="submit" variant="primary" colour="accent" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save scoring"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
