import clsx from "clsx";
import { useMemo, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Button } from "~/components/Button";
import { EquipmentTable } from "~/components/EquipmentTable";
import { FormSection } from "~/components/Form";
import { Input } from "~/components/Input";
import { FormComboboxSingle } from "~/components/form/FormComboboxSingle";
import { FormInput } from "~/components/form/FormInput";
import { FormInputDate } from "~/components/form/FormInputDate";
import { FormTextarea } from "~/components/form/FormTextarea";
import { TastingVariable } from "~/db/schema";
import { Beans } from "~/db/types";
import { parseNullableNumberInput } from "~/util";
import { Divider } from "../Divider";
import { TastingSetupFormInputs } from "./form-types";
import { TastingVariableSelector } from "./TastingVariableSelector";
import {
  buildBeansById,
  getTargetTimeSummary,
  groupBeansOptions,
  toNullableString,
} from "./tasting-create-form-utils";
import { getTastingDefaultName } from "./utils";

interface TastingCreateFormStepSetupProps {
  beansList: Pick<Beans, "id" | "name" | "roaster" | "isFrozen" | "roastDate">[];
  isEditMode: boolean;
  brewFormValueSuggestions?: {
    method: string[];
    grinder: string[];
    waterType: string[];
    filterType: string[];
  };
  stepError?: string;
  onNext: () => void;
}

export const TastingCreateFormStepSetup = ({
  beansList,
  isEditMode,
  brewFormValueSuggestions,
  stepError,
  onNext,
}: TastingCreateFormStepSetupProps) => {
  const [showSetupForm, setShowSetupForm] = useState(false);
  const {
    control,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<TastingSetupFormInputs>();

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

  const beansById = useMemo(() => buildBeansById(beansList), [beansList]);
  const groupedBeansOptions = useMemo(() => groupBeansOptions(beansList), [beansList]);
  const targetTimeSummary = getTargetTimeSummary(targetTimeMinutes, targetTimeSeconds);

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

  return (
    <>
      <FormSection title="Details" subtitle="Define the tasting session and variable.">
        <FormInputDate
          label="Date *"
          id="date"
          requiredMsg="Please select a tasting date"
          error={errors.date?.message}
        />

        <Controller
          control={control}
          name="variable"
          render={({ field }) => (
            <TastingVariableSelector
              value={field.value}
              disabled={isEditMode}
              onChange={(nextVariable) => {
                field.onChange(nextVariable);
                if (nextVariable) {
                  updateVariable(nextVariable);
                }
              }}
            />
          )}
        />
        {stepError && <Input.Error>{stepError}</Input.Error>}

        <FormInput
          label="Name"
          id="name"
          helperText={`Optional. Defaults to "${getTastingDefaultName(variable)}".`}
          inputProps={{
            ...register("name"),
            placeholder: getTastingDefaultName(variable),
          }}
        />
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
                value: variable === TastingVariable.Method ? "Variable" : toNullableString(method),
              },
              {
                label: "Water type",
                value:
                  variable === TastingVariable.WaterType ? "Variable" : toNullableString(waterType),
              },
              {
                label: "Filter type",
                value:
                  variable === TastingVariable.FilterType ? "Variable" : toNullableString(filterType),
              },
              {
                label: "Grinder",
                value: variable === TastingVariable.Grinder ? "Variable" : toNullableString(grinder),
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
        <Button type="button" variant="primary" colour="accent" onClick={onNext}>
          Next: samples
        </Button>
      </div>
    </>
  );
};
