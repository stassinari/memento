import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MeasuringStrategy,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, FormProvider, useFieldArray, useForm } from "react-hook-form";
import { Button } from "~/components/Button";
import { Card } from "~/components/Card";
import { EquipmentTable } from "~/components/EquipmentTable";
import { FormSection } from "~/components/Form";
import { Input } from "~/components/Input";
import { FormComboboxMulti } from "~/components/form/FormComboboxMulti";
import { FormComboboxSingle } from "~/components/form/FormComboboxSingle";
import { FormInput } from "~/components/form/FormInput";
import { FormInputDate } from "~/components/form/FormInputDate";
import { FormInputSlider } from "~/components/form/FormInputSlider";
import { FormTextarea } from "~/components/form/FormTextarea";
import { SortableFormCard } from "~/components/form/SortableFormCard";
import { notesToOptions, tastingNotes } from "~/data/tasting-notes";
import { getBrewFormValueSuggestions } from "~/db/queries";
import { TastingVariable } from "~/db/schema";
import { Beans } from "~/db/types";
import useScreenMediaQuery from "~/hooks/useScreenMediaQuery";
import { parseNullableNumberInput } from "~/util";
import { Divider } from "../Divider";
import { TastingFormInputs, TastingSampleFormInputs } from "./form-types";
import { tastingVariablesList } from "./utils";

interface TastingCreateFormProps {
  beansList: Pick<Beans, "id" | "name" | "roaster" | "isFrozen" | "roastDate">[];
  onSubmit: (data: TastingFormInputs) => void;
  isSubmitting?: boolean;
}

type FormStep = 1 | 2 | 3;
type ScoreDimensionKey = "aroma" | "acidity" | "sweetness" | "body" | "finish";

const scoreDimensions: Array<{ key: ScoreDimensionKey; label: string }> = [
  { key: "aroma", label: "Aroma" },
  { key: "acidity", label: "Acidity" },
  { key: "sweetness", label: "Sweetness" },
  { key: "body", label: "Body" },
  { key: "finish", label: "Finish" },
];

const nonBeansVariables = tastingVariablesList.map((entry) => ({
  label: entry.label,
  value: entry.value as Exclude<TastingVariable, TastingVariable.Beans>,
}));

const allFlavourOptions = notesToOptions(tastingNotes).map((note) => note.label);

const toNullableString = (value: string | null): string | null => {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const toNullableNumber = (value: number | null): number | null =>
  value === null || Number.isNaN(value) ? null : value;

const getEmptySample = (position: number): TastingSampleFormInputs => ({
  position,
  variableValueText: "",
  variableValueBeansId: null,
  note: "",
  actualTimeMinutes: null,
  actualTimeSeconds: null,

  overall: null,
  flavours: [],

  aromaQuantity: null,
  aromaQuality: null,
  aromaNotes: "",

  acidityQuantity: null,
  acidityQuality: null,
  acidityNotes: "",

  sweetnessQuantity: null,
  sweetnessQuality: null,
  sweetnessNotes: "",

  bodyQuantity: null,
  bodyQuality: null,
  bodyNotes: "",

  finishQuantity: null,
  finishQuality: null,
  finishNotes: "",
});

type BeansSelectOption = { value: string; label: string; disabled?: boolean };

export const tastingFormEmptyValues: TastingFormInputs = {
  date: new Date(),
  variable: TastingVariable.Beans,
  note: "",

  beansId: null,
  method: "",
  waterWeight: null,
  beansWeight: null,
  waterTemperature: null,
  grinder: "",
  grindSetting: "",
  waterType: "",
  filterType: "",
  targetTimeMinutes: null,
  targetTimeSeconds: null,

  samples: [getEmptySample(0), getEmptySample(1)],
};

export const TastingCreateForm = ({
  beansList,
  onSubmit,
  isSubmitting = false,
}: TastingCreateFormProps) => {
  console.log("TastingCreateForm");

  const [step, setStep] = useState<FormStep>(1);
  const [stepError, setStepError] = useState<string | null>(null);
  const [activeSampleIndex, setActiveSampleIndex] = useState(0);
  const [showSetupForm, setShowSetupForm] = useState(false);
  const [collapsedSampleIds, setCollapsedSampleIds] = useState<Record<string, boolean>>({});
  const fallbackSampleOrderByIdRef = useRef<Record<string, number>>({});
  const nextFallbackSampleOrderRef = useRef(1);
  const isSm = useScreenMediaQuery("sm");

  const methods = useForm<TastingFormInputs>({
    defaultValues: tastingFormEmptyValues,
  });
  const { data: brewFormValueSuggestions } = useQuery({
    queryKey: ["brews", "formValueSuggestions"],
    queryFn: () => getBrewFormValueSuggestions(),
  });

  const {
    control,
    handleSubmit,
    register,
    setValue,
    trigger,
    watch,
    formState: { errors },
  } = methods;

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "samples",
  });
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const variable = watch("variable");
  const beansId = watch("beansId");
  const method = watch("method");
  const waterType = watch("waterType");
  const filterType = watch("filterType");
  const grinder = watch("grinder");
  const grindSetting = watch("grindSetting");
  const beansWeight = watch("beansWeight");
  const waterWeight = watch("waterWeight");
  const waterTemperature = watch("waterTemperature");
  const targetTimeMinutes = watch("targetTimeMinutes");
  const targetTimeSeconds = watch("targetTimeSeconds");
  const note = watch("note");
  const samples = watch("samples");

  const beansById = useMemo(() => {
    const map = new Map<string, string>();
    beansList.forEach((bean) => {
      map.set(bean.id, `${bean.name} (${bean.roaster})`);
    });
    return map;
  }, [beansList]);
  const groupedBeansOptions = useMemo(() => {
    const sorted = [...beansList].sort((a, b) => {
      const aTime = a.roastDate ? new Date(a.roastDate).getTime() : 0;
      const bTime = b.roastDate ? new Date(b.roastDate).getTime() : 0;
      return bTime - aTime;
    });
    const open = sorted.filter((bean) => !bean.isFrozen);
    const frozen = sorted.filter((bean) => bean.isFrozen);

    return {
      open,
      frozen,
    };
  }, [beansList]);

  const selectedBeanIds = samples
    .map((sample) => sample.variableValueBeansId)
    .filter((value): value is string => Boolean(value));

  const targetTimeSummary =
    targetTimeMinutes !== null || targetTimeSeconds !== null
      ? `${targetTimeMinutes ?? 0}:${String(targetTimeSeconds ?? 0).padStart(2, "0")}`
      : null;
  const shouldShowCollapseAll = fields.some((field) => collapsedSampleIds[field.id] !== true);

  useEffect(() => {
    fields.forEach((field) => {
      if (!fallbackSampleOrderByIdRef.current[field.id]) {
        fallbackSampleOrderByIdRef.current[field.id] = nextFallbackSampleOrderRef.current++;
      }
    });
  }, [fields]);

  const getSampleDisplayTitle = (index: number, fieldId?: string): string => {
    const sample = samples[index];
    if (sample) {
      if (variable === TastingVariable.Beans) {
        if (sample.variableValueBeansId) {
          const beanLabel = beansById.get(sample.variableValueBeansId);
          if (beanLabel) return beanLabel;
        }
      } else {
        const variableValue = toNullableString(sample.variableValueText);
        if (variableValue) return variableValue;
      }
    }

    const stableOrder = fieldId ? fallbackSampleOrderByIdRef.current[fieldId] : undefined;
    return `Sample #${stableOrder ?? index + 1}`;
  };
  const step1VariableError = step === 1 && stepError?.includes("variable") ? stepError : undefined;
  const step2SamplesError = step === 2 ? stepError : undefined;
  const getSampleBeansOptions = (currentBeansId: string | null): BeansSelectOption[] => [
    { value: "", label: "Select beans" },
    ...groupedBeansOptions.open.map((bean) => ({
      value: bean.id,
      label: `${bean.name} (${bean.roaster})`,
      disabled: selectedBeanIds.includes(bean.id) && currentBeansId !== bean.id,
    })),
    ...(groupedBeansOptions.frozen.length > 0
      ? [{ value: "__frozen_separator__", label: "----- Frozen -----", disabled: true }]
      : []),
    ...groupedBeansOptions.frozen.map((bean) => ({
      value: bean.id,
      label: `${bean.name} (${bean.roaster})`,
      disabled: selectedBeanIds.includes(bean.id) && currentBeansId !== bean.id,
    })),
  ];

  const updateVariable = (nextVariable: TastingVariable) => {
    setValue("variable", nextVariable, { shouldDirty: true });

    if (nextVariable === TastingVariable.Beans) {
      setValue("beansId", null, { shouldDirty: true });
    }

    if (nextVariable === TastingVariable.Method) {
      setValue("method", "", { shouldDirty: true });
    }
    if (nextVariable === TastingVariable.WaterType) {
      setValue("waterType", "", { shouldDirty: true });
    }
    if (nextVariable === TastingVariable.FilterType) {
      setValue("filterType", "", { shouldDirty: true });
    }
    if (nextVariable === TastingVariable.Grinder) {
      setValue("grinder", "", { shouldDirty: true });
    }

    samples.forEach((_, index) => {
      if (nextVariable === TastingVariable.Beans) {
        setValue(`samples.${index}.variableValueText`, "", { shouldDirty: true });
      } else {
        setValue(`samples.${index}.variableValueBeansId`, null, { shouldDirty: true });
      }
    });
  };

  const validateStep1 = async () => {
    if (!variable) {
      setStepError("Please select what variable you are tasting.");
      return false;
    }

    const isValid = await trigger(["date", "variable"]);
    if (!isValid) {
      setStepError("Please complete the required setup fields.");
      return false;
    }
    setStepError(null);
    return true;
  };

  const validateStep2 = async () => {
    if (!variable) {
      setStepError("Please select what variable you are tasting.");
      return false;
    }

    if (fields.length < 2) {
      setStepError("Please keep at least two samples.");
      return false;
    }

    if (variable === TastingVariable.Beans) {
      const hasMissingBeans = samples.some((sample) => !sample.variableValueBeansId);
      if (hasMissingBeans) {
        setStepError("Every sample needs beans selected.");
        return false;
      }

      const uniqueCount = new Set(selectedBeanIds).size;
      if (uniqueCount !== selectedBeanIds.length) {
        setStepError("The same beans cannot be selected twice.");
        return false;
      }
    } else {
      const hasMissingValue = samples.some((sample) => !sample.variableValueText?.trim());
      if (hasMissingValue) {
        setStepError("Every sample needs a variable value.");
        return false;
      }
    }

    setStepError(null);
    return true;
  };

  const goToStep2 = async () => {
    const isValid = await validateStep1();
    if (!isValid) return;
    setStep(2);
  };

  const goToStep3 = async () => {
    const isValid = await validateStep2();
    if (!isValid) return;
    setActiveSampleIndex(0);
    setStep(3);
  };

  const addSample = () => {
    append(getEmptySample(fields.length));
    setActiveSampleIndex(fields.length);
  };

  const removeSample = (index: number) => {
    if (fields.length <= 2) return;
    const removedId = fields[index]?.id;
    remove(index);
    if (removedId) {
      setCollapsedSampleIds((current) => {
        const next = { ...current };
        delete next[removedId];
        return next;
      });
    }

    setActiveSampleIndex((currentIndex) => {
      if (currentIndex === index) return Math.max(0, index - 1);
      if (currentIndex > index) return currentIndex - 1;
      return currentIndex;
    });
  };

  const handleSamplesDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;

    const oldIndex = fields.findIndex((field) => field.id === active.id);
    const newIndex = fields.findIndex((field) => field.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    move(oldIndex, newIndex);

    if (activeSampleIndex === oldIndex) {
      setActiveSampleIndex(newIndex);
    } else if (activeSampleIndex === newIndex) {
      setActiveSampleIndex(oldIndex);
    }
  };

  const toggleSampleCollapse = (id: string) => {
    setCollapsedSampleIds((current) => ({
      ...current,
      [id]: !current[id],
    }));
  };

  const toggleAllSampleCards = () => {
    if (shouldShowCollapseAll) {
      const collapsedAll: Record<string, boolean> = {};
      fields.forEach((field) => {
        collapsedAll[field.id] = true;
      });
      setCollapsedSampleIds(collapsedAll);
      return;
    }

    setCollapsedSampleIds((current) => {
      const next = { ...current };
      fields.forEach((field) => {
        next[field.id] = false;
      });
      return next;
    });
  };

  const onFormSubmit = (data: TastingFormInputs) => {
    const normalizedSamples = data.samples.map((sample, index) => ({
      ...sample,
      position: index,
      variableValueBeansId:
        data.variable === TastingVariable.Beans ? sample.variableValueBeansId : null,
      variableValueText:
        data.variable === TastingVariable.Beans ? null : toNullableString(sample.variableValueText),
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
    }));

    onSubmit({
      ...data,
      variable: data.variable!,
      note: toNullableString(data.note),
      method: toNullableString(data.method),
      grinder: toNullableString(data.grinder),
      grindSetting: toNullableString(data.grindSetting),
      waterType: toNullableString(data.waterType),
      filterType: toNullableString(data.filterType),
      waterWeight: toNullableNumber(data.waterWeight),
      beansWeight: toNullableNumber(data.beansWeight),
      waterTemperature: toNullableNumber(data.waterTemperature),
      targetTimeMinutes: toNullableNumber(data.targetTimeMinutes),
      targetTimeSeconds: toNullableNumber(data.targetTimeSeconds),
      beansId: data.variable === TastingVariable.Beans ? null : data.beansId,
      samples: normalizedSamples,
    });
  };

  const activeSample = samples[activeSampleIndex];

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onFormSubmit)} autoComplete="off" className="space-y-6">
        {step === 1 && (
          <>
            <FormSection title="Details" subtitle="Define the tasting session and variable.">
              <FormInputDate
                label="Date *"
                id="date"
                requiredMsg="Please select a tasting date"
                error={errors.date?.message}
              />

              <fieldset>
                <legend className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  What are you tasting?
                </legend>
                <Controller
                  control={control}
                  name="variable"
                  render={({ field }) => (
                    <div className="mt-3 grid gap-4 sm:grid-cols-2">
                      <label
                        className={clsx(
                          "group relative flex rounded-lg border border-gray-300 bg-white p-4 has-focus-visible:outline-3 has-focus-visible:-outline-offset-1 dark:border-white/10 dark:bg-gray-900",
                          field.value === TastingVariable.Beans &&
                            "-outline-offset-2 outline-2 outline-orange-600 dark:outline-orange-400",
                        )}
                      >
                        <input
                          type="radio"
                          className="sr-only"
                          checked={field.value === TastingVariable.Beans}
                          onChange={() => {
                            field.onChange(TastingVariable.Beans);
                            updateVariable(TastingVariable.Beans);
                          }}
                        />
                        <div className="flex-1">
                          <span className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
                            Beans
                          </span>
                          <span className="mt-1 block text-sm text-gray-500 dark:text-gray-400">
                            Compare different coffees (cupping and similar sessions).
                          </span>
                        </div>
                        <CheckCircleIcon
                          className={clsx(
                            "size-5 text-orange-600 dark:text-orange-400",
                            field.value === TastingVariable.Beans ? "visible" : "invisible",
                          )}
                        />
                      </label>

                      <label
                        className={clsx(
                          "group relative flex rounded-lg border border-gray-300 bg-white p-4 has-focus-visible:outline-3 has-focus-visible:-outline-offset-1 dark:border-white/10 dark:bg-gray-900",
                          field.value !== TastingVariable.Beans &&
                            "-outline-offset-2 outline-2 outline-orange-600 dark:outline-orange-400",
                        )}
                      >
                        <input
                          type="radio"
                          className="sr-only"
                          checked={field.value !== TastingVariable.Beans}
                          onChange={() => {
                            if (field.value === TastingVariable.Beans) {
                              field.onChange(null);
                            }
                          }}
                        />
                        <div className="flex-1">
                          <span className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
                            Something else
                          </span>
                          <span className="mt-1 block text-sm text-gray-500 dark:text-gray-400">
                            Compare one setup variable while holding the rest steady.
                          </span>
                          <div className="mt-3">
                            <select
                              value={
                                field.value && field.value !== TastingVariable.Beans
                                  ? field.value
                                  : ""
                              }
                              onChange={(event) => {
                                const value = event.currentTarget.value as
                                  | Exclude<TastingVariable, TastingVariable.Beans>
                                  | "";
                                if (value === "") {
                                  field.onChange(null);
                                  return;
                                }

                                const variableValue = value as Exclude<
                                  TastingVariable,
                                  TastingVariable.Beans
                                >;
                                field.onChange(variableValue);
                                updateVariable(variableValue);
                              }}
                              className="block w-full rounded-md border-gray-300 bg-white text-sm text-gray-900 shadow-xs focus:border-orange-500 focus:ring-orange-500 dark:border-white/15 dark:bg-gray-900 dark:text-gray-100"
                            >
                              <option value="">Select variable</option>
                              {nonBeansVariables.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <CheckCircleIcon
                          className={clsx(
                            "size-5 text-orange-600 dark:text-orange-400",
                            field.value !== TastingVariable.Beans ? "visible" : "invisible",
                          )}
                        />
                      </label>
                    </div>
                  )}
                />
                {step1VariableError && <Input.Error>{step1VariableError}</Input.Error>}
              </fieldset>
            </FormSection>

            <Divider className="hidden sm:block" />

            <FormSection
              title="Setup"
              subtitle="Shared setup applied across samples unless that field is the variable."
            >
              {showSetupForm ? (
                <>
                  <div>
                    <Input.Label htmlFor="beansId">Beans</Input.Label>
                    <div className="mt-1">
                      <select
                        id="beansId"
                        {...register("beansId")}
                        disabled={variable === TastingVariable.Beans}
                        className={clsx(
                          "block w-full rounded-md border-gray-300 bg-white text-sm text-gray-900 shadow-xs focus:border-orange-500 focus:ring-orange-500 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 dark:border-white/15 dark:bg-gray-900 dark:text-gray-100 dark:disabled:border-white/10 dark:disabled:bg-white/10 dark:disabled:text-gray-400",
                        )}
                      >
                        <option value="">No shared beans</option>
                        {groupedBeansOptions.open.map((bean) => (
                          <option key={bean.id} value={bean.id}>
                            {bean.name} ({bean.roaster})
                          </option>
                        ))}
                        {groupedBeansOptions.frozen.length > 0 && (
                          <option value="__frozen_separator__" disabled>
                            ----- Frozen -----
                          </option>
                        )}
                        {groupedBeansOptions.frozen.map((bean) => (
                          <option key={bean.id} value={bean.id}>
                            {bean.name} ({bean.roaster})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {variable === TastingVariable.Method ? (
                    <FormInput
                      label="Method"
                      id="method"
                      inputProps={{ value: "Variable", disabled: true }}
                    />
                  ) : (
                    <FormComboboxSingle
                      label="Method"
                      name="method"
                      options={brewFormValueSuggestions?.method?.sort() ?? []}
                      placeholder="V60"
                      suggestions={brewFormValueSuggestions?.method?.slice(0, 5) ?? []}
                    />
                  )}

                  {variable === TastingVariable.WaterType ? (
                    <FormInput
                      label="Water type"
                      id="waterType"
                      inputProps={{ value: "Variable", disabled: true }}
                    />
                  ) : (
                    <FormComboboxSingle
                      label="Water type"
                      name="waterType"
                      options={brewFormValueSuggestions?.waterType?.sort() ?? []}
                      placeholder="ZeroWater"
                      suggestions={brewFormValueSuggestions?.waterType?.slice(0, 5) ?? []}
                    />
                  )}

                  {variable === TastingVariable.FilterType ? (
                    <FormInput
                      label="Filter type"
                      id="filterType"
                      inputProps={{ value: "Variable", disabled: true }}
                    />
                  ) : (
                    <FormComboboxSingle
                      label="Filter type"
                      name="filterType"
                      options={brewFormValueSuggestions?.filterType?.sort() ?? []}
                      placeholder="Abaca"
                      suggestions={brewFormValueSuggestions?.filterType?.slice(0, 5) ?? []}
                    />
                  )}

                  {variable === TastingVariable.Grinder ? (
                    <FormInput
                      label="Grinder"
                      id="grinder"
                      inputProps={{ value: "Variable", disabled: true }}
                    />
                  ) : (
                    <FormComboboxSingle
                      label="Grinder"
                      name="grinder"
                      options={brewFormValueSuggestions?.grinder?.sort() ?? []}
                      placeholder="Niche Zero"
                      suggestions={brewFormValueSuggestions?.grinder?.slice(0, 5) ?? []}
                    />
                  )}

                  <FormInput
                    label="Grind setting"
                    id="grindSetting"
                    inputProps={{
                      ...register("grindSetting"),
                    }}
                  />

                  <FormInput
                    label="Beans weight (g)"
                    id="beansWeight"
                    inputProps={{
                      ...register("beansWeight", {
                        setValueAs: parseNullableNumberInput,
                      }),
                      type: "number",
                      step: "0.1",
                    }}
                  />

                  <FormInput
                    label="Water weight (g)"
                    id="waterWeight"
                    inputProps={{
                      ...register("waterWeight", {
                        setValueAs: parseNullableNumberInput,
                      }),
                      type: "number",
                      step: "0.1",
                    }}
                  />

                  <FormInput
                    label="Water temperature (°C)"
                    id="waterTemperature"
                    inputProps={{
                      ...register("waterTemperature", {
                        setValueAs: parseNullableNumberInput,
                      }),
                      type: "number",
                      step: "0.1",
                    }}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormInput
                      label="Target time minutes"
                      id="targetTimeMinutes"
                      inputProps={{
                        ...register("targetTimeMinutes", {
                          setValueAs: parseNullableNumberInput,
                        }),
                        type: "number",
                      }}
                    />

                    <FormInput
                      label="Target time seconds"
                      id="targetTimeSeconds"
                      inputProps={{
                        ...register("targetTimeSeconds", {
                          setValueAs: parseNullableNumberInput,
                        }),
                        type: "number",
                      }}
                    />
                  </div>

                  <FormTextarea
                    label="Session note"
                    id="note"
                    textareaProps={{
                      ...register("note"),
                      placeholder: "Markdown supported",
                    }}
                  />
                </>
              ) : (
                <EquipmentTable
                  rows={[
                    {
                      label: "Beans",
                      value:
                        variable === TastingVariable.Beans
                          ? "Variable"
                          : beansId
                            ? (beansById.get(beansId) ?? "Unknown beans")
                            : null,
                    },
                    {
                      label: "Method",
                      value:
                        variable === TastingVariable.Method ? "Variable" : toNullableString(method),
                    },
                    {
                      label: "Water type",
                      value:
                        variable === TastingVariable.WaterType
                          ? "Variable"
                          : toNullableString(waterType),
                    },
                    {
                      label: "Filter type",
                      value:
                        variable === TastingVariable.FilterType
                          ? "Variable"
                          : toNullableString(filterType),
                    },
                    {
                      label: "Grinder",
                      value:
                        variable === TastingVariable.Grinder
                          ? "Variable"
                          : toNullableString(grinder),
                    },
                    { label: "Grind setting", value: toNullableString(grindSetting) },
                    {
                      label: "Beans weight",
                      value: beansWeight !== null ? `${beansWeight} g` : null,
                    },
                    {
                      label: "Water weight",
                      value: waterWeight !== null ? `${waterWeight} g` : null,
                    },
                    {
                      label: "Water temperature",
                      value: waterTemperature !== null ? `${waterTemperature} °C` : null,
                    },
                    {
                      label: "Target time",
                      value: targetTimeSummary,
                    },
                    {
                      label: "Notes",
                      value: toNullableString(note),
                    },
                  ]}
                  onClick={() => setShowSetupForm(true)}
                />
              )}
            </FormSection>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="primary" colour="accent" onClick={goToStep2}>
                Next: samples
              </Button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <FormSection
              title="Samples"
              subtitle="Define samples and what changes between them. Note: a tasting needs at least two samples."
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">{fields.length} samples</p>
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="white"
                    colour="accent"
                    size="sm"
                    onClick={toggleAllSampleCards}
                  >
                    {shouldShowCollapseAll ? <ArrowsPointingInIcon /> : <ArrowsPointingOutIcon />}
                    <span className="sr-only">
                      {shouldShowCollapseAll ? "Collapse all samples" : "Expand all samples"}
                    </span>
                    <span className="hidden md:inline">
                      {shouldShowCollapseAll ? "Collapse all" : "Expand all"}
                    </span>
                  </Button>
                  <Button
                    type="button"
                    variant="white"
                    colour="accent"
                    size="sm"
                    onClick={addSample}
                  >
                    <PlusIcon />
                    <span className="sr-only">Add sample</span>
                    <span className="hidden md:inline">Add sample</span>
                  </Button>
                </div>
              </div>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                measuring={{
                  droppable: {
                    strategy: MeasuringStrategy.Always,
                  },
                }}
                onDragEnd={handleSamplesDragEnd}
              >
                <SortableContext
                  items={fields.map((field) => field.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-4">
                    {fields.map((field, index) => {
                      const currentSample = samples[index];
                      return (
                        <SortableFormCard
                          key={field.id}
                          id={field.id}
                          title={getSampleDisplayTitle(index, field.id)}
                          canRemove={fields.length > 2}
                          onRemove={() => removeSample(index)}
                          isCollapsed={collapsedSampleIds[field.id] ?? false}
                          onToggleCollapse={() => toggleSampleCollapse(field.id)}
                        >
                          {variable === TastingVariable.Beans ? (
                            <div>
                              <Input.Label htmlFor={`samples.${index}.variableValueBeansId`}>
                                Beans *
                              </Input.Label>
                              <div className="mt-1">
                                <select
                                  id={`samples.${index}.variableValueBeansId`}
                                  {...register(`samples.${index}.variableValueBeansId` as const)}
                                  className="block w-full rounded-md border-gray-300 bg-white text-sm text-gray-900 shadow-xs focus:border-orange-500 focus:ring-orange-500 dark:border-white/15 dark:bg-gray-900 dark:text-gray-100"
                                >
                                  {getSampleBeansOptions(
                                    currentSample?.variableValueBeansId ?? null,
                                  ).map((option) => (
                                    <option
                                      key={`${field.id}-${option.value}`}
                                      value={option.value}
                                      disabled={option.disabled}
                                    >
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          ) : (
                            <FormInput
                              label="Variable value *"
                              id={`samples.${index}.variableValueText`}
                              inputProps={{
                                ...register(`samples.${index}.variableValueText` as const),
                              }}
                            />
                          )}

                          <div className="mt-3">
                            <FormTextarea
                              label="Sample note"
                              id={`samples.${index}.note`}
                              textareaProps={{ ...register(`samples.${index}.note` as const) }}
                            />
                          </div>
                        </SortableFormCard>
                      );
                    })}
                  </div>
                </SortableContext>
              </DndContext>
              {step2SamplesError && <Input.Error>{step2SamplesError}</Input.Error>}
            </FormSection>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="white" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button type="button" variant="primary" colour="accent" onClick={goToStep3}>
                Next: ratings
              </Button>
            </div>
          </>
        )}

        {step === 3 && activeSample && (
          <>
            <div className={clsx(isSm && "grid grid-cols-12 gap-4", !isSm && "space-y-4")}>
              <aside
                className={clsx(
                  "space-y-2",
                  isSm &&
                    "col-span-4 max-h-[70vh] overflow-y-auto border-r border-gray-200 pr-2 dark:border-white/10",
                )}
              >
                {samples.map((sample, index) => {
                  const isActive = index === activeSampleIndex;
                  const label =
                    variable === TastingVariable.Beans
                      ? sample.variableValueBeansId
                        ? beansById.get(sample.variableValueBeansId)
                        : "Unknown bean"
                      : sample.variableValueText || "Untitled";

                  return (
                    <button
                      key={`${index}-${label}`}
                      type="button"
                      onClick={() => setActiveSampleIndex(index)}
                      className={clsx(
                        "w-full rounded-md border px-3 py-2 text-left",
                        isActive
                          ? "border-orange-500 bg-orange-50 dark:border-orange-400 dark:bg-orange-500/15"
                          : "border-gray-200 bg-white hover:bg-gray-50 dark:border-white/10 dark:bg-gray-900 dark:hover:bg-white/5",
                      )}
                    >
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {getSampleDisplayTitle(index, fields[index]?.id)}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">
                        {label}
                      </p>
                    </button>
                  );
                })}
              </aside>

              <main className={clsx(isSm && "col-span-8", "space-y-6")}>
                {!isSm && (
                  <div className="flex items-center justify-between">
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
                )}

                <Card.Container>
                  <Card.Header
                    title={getSampleDisplayTitle(activeSampleIndex, fields[activeSampleIndex]?.id)}
                  />
                  <Card.Content className="space-y-4">
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
                        className="rounded-md border border-gray-200 p-3 dark:border-white/10"
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
                              ...register(
                                `samples.${activeSampleIndex}.${dimension.key}Notes` as const,
                              ),
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
                  </Card.Content>
                </Card.Container>
              </main>
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="white" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button type="submit" variant="primary" colour="accent" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Create tasting"}
              </Button>
            </div>
          </>
        )}
      </form>
    </FormProvider>
  );
};
