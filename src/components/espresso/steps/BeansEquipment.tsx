import { ReactNode, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import { Espresso } from "~/db/types";
import { Button } from "../../Button";
import { Divider } from "../../Divider";
import { EquipmentTable } from "../../EquipmentTable";
import { FormSection } from "../../Form";
import { FormComboboxSingle } from "../../form/FormComboboxSingle";
import { FormInputDate } from "../../form/FormInputDate";
import { FormInputRadioButtonGroup } from "../../form/FormInputRadioButtonGroup";
import { EspressoFormValueSuggestions } from "../EspressoForm";

export interface BeansEquipmentInputs {
  date: Date | null;
  beans: string | null;

  machine: string | null;
  grinder: string | null;
  grinderBurrs: string | null;
  portafilter: string | null;
  basket: string | null;
}

export const beansEquipmentEmptyValues: (copyFrom?: Espresso) => BeansEquipmentInputs = (
  copyFrom,
) => ({
  date: new Date(),
  beans: null,

  machine: copyFrom?.machine ?? null,
  grinder: copyFrom?.grinder ?? null,
  grinderBurrs: copyFrom?.grinderBurrs ?? null,
  portafilter: copyFrom?.portafilter ?? null,
  basket: copyFrom?.basket ?? null,
});

interface BeansEquipmentProps {
  espressoFormValueSuggestions: EspressoFormValueSuggestions;
  beansCardsSelectComponent: ReactNode;
  defaultValues: BeansEquipmentInputs;
  handleNestedSubmit: (data: BeansEquipmentInputs) => void;
}

export const BeansEquipment = ({
  espressoFormValueSuggestions,
  beansCardsSelectComponent,
  defaultValues,
  handleNestedSubmit,
}: BeansEquipmentProps) => {
  const [showEquipmentForm, setShowEquipmentForm] = useState(false);

  const methods = useForm<BeansEquipmentInputs>({
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { errors },
    getValues,
  } = methods;

  const onSubmit: SubmitHandler<BeansEquipmentInputs> = async (data) => {
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
            requiredMsg="Please enter a espresso date"
            error={errors.date?.message}
            placeholder="Select espresso date"
          />

          {beansCardsSelectComponent}
        </FormSection>

        <Divider className="hidden sm:block" />

        <FormSection title="Equipment" subtitle="The gear that went into this shot.">
          {showEquipmentForm ? (
            <>
              <FormComboboxSingle
                label="Machine"
                name="machine"
                placeholder="Lelit Elizabeth"
                options={espressoFormValueSuggestions.machine.sort()}
                suggestions={espressoFormValueSuggestions.machine.slice(0, 5)}
              />

              <FormComboboxSingle
                label="Grinder"
                name="grinder"
                placeholder="Niche Zero"
                options={espressoFormValueSuggestions.grinder.sort()}
                suggestions={espressoFormValueSuggestions.grinder.slice(0, 5)}
              />

              <FormComboboxSingle
                label="Burrs"
                name="grinderBurrs"
                placeholder="54mm conical"
                options={espressoFormValueSuggestions.grinderBurrs.sort()}
                suggestions={espressoFormValueSuggestions.grinderBurrs.slice(0, 5)}
              />

              <FormInputRadioButtonGroup
                label="Portafilter"
                name="portafilter"
                options={[
                  { label: "Regular", value: "regular" },
                  { label: "Bottomless", value: "bottomless" },
                ]}
                variant="secondary"
              />

              <FormComboboxSingle
                label="Basket"
                name="basket"
                placeholder="VST 18g"
                options={espressoFormValueSuggestions.basket.sort()}
                suggestions={espressoFormValueSuggestions.basket.slice(0, 5)}
              />
            </>
          ) : (
            <EquipmentTable
              rows={[
                { label: "Machine", value: getValues("machine") },
                { label: "Grinder", value: getValues("grinder") },
                { label: "Burrs", value: getValues("grinderBurrs") },
                { label: "Portafilter", value: getValues("portafilter") },
                { label: "Basket", value: getValues("basket") },
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
