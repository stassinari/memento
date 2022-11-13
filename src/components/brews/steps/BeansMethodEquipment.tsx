import React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import "twin.macro";
import { Beans } from "../../../types/beans";
import { Brew } from "../../../types/brews";
import { BeansCardsSelect } from "../../beans/BeansCardsSelect";
import { Button } from "../../Button";
import { Divider } from "../../Divider";
import { FormSection } from "../../Form";
import { FormComboboxSingle } from "../../form/FormComboboxSingle";
import { FormInputDate } from "../../form/FormInputDate";
import { extractSuggestions } from "../../form/FormSuggestions";

export interface BeansMethodEquipmentInputs {
  date: Date | null;
  method: string | null;
  beans: string | null;

  grinder: string | null;
  grinderBurrs: string | null;
  waterType: string | null;
  filterType: string | null;
}

export const beansMethodEquipmentEmptyValues: () => BeansMethodEquipmentInputs =
  () => ({
    date: new Date(),
    method: null,
    beans: null,

    grinder: null,
    grinderBurrs: null,
    waterType: null,
    filterType: null,
  });

interface BeansMethodEquipmentProps {
  brewsList: Brew[];
  beansList: Beans[];
  defaultValues: BeansMethodEquipmentInputs;
  handleNestedSubmit: (data: BeansMethodEquipmentInputs) => void;
}

export const BeansMethodEquipment: React.FC<BeansMethodEquipmentProps> = ({
  brewsList,
  beansList,
  defaultValues,
  handleNestedSubmit,
}) => {
  const methods = useForm<BeansMethodEquipmentInputs>({
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit: SubmitHandler<BeansMethodEquipmentInputs> = async (data) => {
    console.log(data);
    handleNestedSubmit(data);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
        tw="mt-6 space-y-6"
      >
        <FormSection
          title="Base information"
          subtitle="This section includes the information that boh I don't know."
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
            options={[...new Set(brewsList.map(({ method }) => method).sort())]}
            placeholder="Orea v3"
            requiredMsg="Please enter the method of your brew"
            error={errors.method?.message}
            suggestions={extractSuggestions(brewsList, "method")}
          />

          <BeansCardsSelect beansList={beansList} />
        </FormSection>

        <Divider tw="hidden sm:block" />

        <FormSection
          title="Equipment information"
          subtitle="This section is about equipment. Duh."
        >
          <FormComboboxSingle
            label="Grinder"
            name="grinder"
            placeholder="Niche Zero"
            options={[
              ...new Set(
                brewsList
                  .flatMap(({ grinder }) => (grinder ? [grinder] : []))
                  .sort()
              ),
            ]}
            suggestions={extractSuggestions(brewsList, "grinder")}
          />

          <FormComboboxSingle
            label="Burrs"
            name="grinderBurrs"
            placeholder="54mm conical"
            options={[
              ...new Set(
                brewsList
                  .flatMap(({ grinderBurrs }) =>
                    grinderBurrs ? [grinderBurrs] : []
                  )
                  .sort()
              ),
            ]}
            suggestions={extractSuggestions(brewsList, "grinderBurrs")}
          />

          <FormComboboxSingle
            label="Water type"
            name="waterType"
            placeholder="ZeroWater"
            options={[
              ...new Set(
                brewsList
                  .flatMap(({ waterType }) => (waterType ? [waterType] : []))
                  .sort()
              ),
            ]}
            suggestions={extractSuggestions(brewsList, "waterType")}
          />

          <FormComboboxSingle
            label="Filter"
            name="filterType"
            placeholder="Bleached"
            options={[
              ...new Set(
                brewsList
                  .flatMap(({ filterType }) => (filterType ? [filterType] : []))
                  .sort()
              ),
            ]}
            suggestions={extractSuggestions(brewsList, "filterType")}
          />
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
