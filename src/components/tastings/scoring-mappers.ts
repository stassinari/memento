import {
  TastingScoringFormInputs,
  TastingScoringSampleInputs,
} from "~/components/tastings/form-types";

export type TastingScoringSampleSource = TastingScoringSampleInputs;

const toNullableString = (value: string | null): string | null => {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const toNullableNumber = (value: number | null): number | null =>
  value === null || Number.isNaN(value) ? null : value;

export const mapTastingScoringSampleFromSource = (
  sample: TastingScoringSampleSource,
): TastingScoringSampleInputs => ({
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
});

export const mapTastingScoringFormValuesFromSamples = (
  samples: TastingScoringSampleSource[],
): TastingScoringFormInputs => ({
  samples: samples.map(mapTastingScoringSampleFromSource),
});

export const normalizeTastingScoringFormData = (
  data: TastingScoringFormInputs,
): TastingScoringFormInputs => ({
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
