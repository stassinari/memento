import { ReactNode, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import { Brew } from "~/db/types";
import { Button } from "../../Button";
import { Divider } from "../../Divider";
import { EquipmentTable } from "../../EquipmentTable";
import { FormSection } from "../../Form";
import { FormComboboxSingle } from "../../form/FormComboboxSingle";
import { FormInputDate } from "../../form/FormInputDate";
import { BrewFormValuesSuggestions } from "../BrewForm";

export interface BeansMethodEquipmentInputs {
  date: Date | null;
  method: string | null;
  beans: string | null;

  grinder: string | null;
  grinderBurrs: string | null;
  waterType: string | null;
  filterType: string | null;
}

export const beansMethodEquipmentEmptyValues: (copyFrom?: Brew) => BeansMethodEquipmentInputs = (
  copyFrom,
) => ({
  date: new Date(),
  method: null,
  beans: null,

  grinder: copyFrom?.grinder ?? null,
  grinderBurrs: copyFrom?.grinderBurrs ?? null,
  waterType: copyFrom?.waterType ?? null,
  filterType: copyFrom?.filterType ?? null,
});

interface BeansMethodEquipmentProps {
  brewFormValueSuggestions: BrewFormValuesSuggestions;
  beansCardsSelectComponent: ReactNode;
  defaultValues: BeansMethodEquipmentInputs;
  handleNestedSubmit: (data: BeansMethodEquipmentInputs) => void;
}

export const BeansMethodEquipment = ({
  brewFormValueSuggestions,
  beansCardsSelectComponent,
  defaultValues,
  handleNestedSubmit,
}: BeansMethodEquipmentProps) => {
  const [showEquipmentForm, setShowEquipmentForm] = useState(false);

  const methods = useForm<BeansMethodEquipmentInputs>({
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { errors },
    getValues,
  } = methods;

  const onSubmit: SubmitHandler<BeansMethodEquipmentInputs> = async (data) => {
    console.log(data);
    handleNestedSubmit(data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" className="space-y-6">
        <FormSection
          title="Details"
          subtitle="The essentials — when you made it and what you used."
        >
          <FormInputDate
            label="Date *"
            id="date"
            requiredMsg="Please enter a brew date"
            error={errors.date?.message}
            placeholder="Select brew date"
          />

          <FormComboboxSingle
            label="Method *"
            name="method"
            options={brewFormValueSuggestions.method.sort()}
            placeholder="Orea v3"
            requiredMsg="Please enter the method of your brew"
            error={errors.method?.message}
            suggestions={brewFormValueSuggestions.method.slice(0, 5)}
          />

          {beansCardsSelectComponent}
        </FormSection>

        <Divider className="hidden sm:block" />

        <FormSection title="Equipment" subtitle="The gear that went into this brew.">
          {showEquipmentForm ? (
            <>
              <FormComboboxSingle
                label="Grinder"
                name="grinder"
                placeholder="Niche Zero"
                options={brewFormValueSuggestions.grinder.sort()}
                suggestions={brewFormValueSuggestions.grinder.slice(0, 5)}
              />
              <FormComboboxSingle
                label="Burrs"
                name="grinderBurrs"
                placeholder="54mm conical"
                options={brewFormValueSuggestions.grinderBurrs.sort()}
                suggestions={brewFormValueSuggestions.grinderBurrs.slice(0, 5)}
              />
              <FormComboboxSingle
                label="Water type"
                name="waterType"
                placeholder="ZeroWater"
                options={brewFormValueSuggestions.waterType.sort()}
                suggestions={brewFormValueSuggestions.waterType.slice(0, 5)}
              />
              <FormComboboxSingle
                label="Filter"
                name="filterType"
                placeholder="Bleached"
                options={brewFormValueSuggestions.filterType.sort()}
                suggestions={brewFormValueSuggestions.filterType.slice(0, 5)}
              />
            </>
          ) : (
            <EquipmentTable
              rows={[
                { label: "Grinder", value: getValues("grinder") },
                { label: "Burrs", value: getValues("grinderBurrs") },
                { label: "Water type", value: getValues("waterType") },
                { label: "Filter", value: getValues("filterType") },
              ]}
              onClick={() => setShowEquipmentForm(true)}
            />
          )}
        </FormSection>

        <div className="flex justify-end gap-4">
          <Button variant="white" type="button" disabled>
            Back
          </Button>
          <Button variant="primary" type="submit" colour="accent">
            Next
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
