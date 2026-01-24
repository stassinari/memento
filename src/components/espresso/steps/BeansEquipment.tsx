import { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import { Beans } from "@/types/beans";
import { Espresso } from "@/types/espresso";
import { Button } from "../../Button";
import { Divider } from "../../Divider";
import { EquipmentTable } from "../../EquipmentTable";
import { FormSection } from "../../Form";
import { BeansCardsSelect } from "../../beans/BeansCardsSelect";
import { FormComboboxSingle } from "../../form/FormComboboxSingle";
import { FormInputDate } from "../../form/FormInputDate";
import { FormInputRadioButtonGroup } from "../../form/FormInputRadioButtonGroup";
import { extractSuggestions } from "../../form/FormSuggestions";

export interface BeansEquipmentInputs {
  date: Date | null;
  beans: string | null;

  machine: string | null;
  grinder: string | null;
  grinderBurrs: string | null;
  portafilter: string | null;
  basket: string | null;
}

export const beansEquipmentEmptyValues: (
  copyFrom?: Espresso,
) => BeansEquipmentInputs = (copyFrom) => ({
  date: new Date(),
  beans: null,

  machine: copyFrom?.machine ?? null,
  grinder: copyFrom?.grinder ?? null,
  grinderBurrs: copyFrom?.grinderBurrs ?? null,
  portafilter: copyFrom?.portafilter ?? null,
  basket: copyFrom?.basket ?? null,
});

interface BeansEquipmentProps {
  espressoList: Espresso[];
  beansList: Beans[];
  defaultValues: BeansEquipmentInputs;
  handleNestedSubmit: (data: BeansEquipmentInputs) => void;
}

export const BeansEquipment = ({
  espressoList,
  beansList,
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
      <form
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
        className="space-y-6"
      >
        <FormSection
          title="Base information"
          subtitle="This section includes the information that boh I don't know."
        >
          <FormInputDate
            label="Date *"
            id="date"
            requiredMsg="Please enter a espresso date"
            error={errors.date?.message}
            placeholder="Select espresso date"
          />

          <BeansCardsSelect beansList={beansList} />
        </FormSection>

        <Divider className="hidden sm:block" />

        <FormSection
          title="Equipment information"
          subtitle="This section is about equipment. Duh."
        >
          {showEquipmentForm ? (
            <>
              <FormComboboxSingle
                label="Machine"
                name="machine"
                placeholder="Lelit Elizabeth"
                options={[
                  ...new Set(
                    espressoList
                      .flatMap(({ machine }) => (machine ? [machine] : []))
                      .sort(),
                  ),
                ]}
                suggestions={extractSuggestions(espressoList, "machine")}
              />

              <FormComboboxSingle
                label="Grinder"
                name="grinder"
                placeholder="Niche Zero"
                options={[
                  ...new Set(
                    espressoList
                      .flatMap(({ grinder }) => (grinder ? [grinder] : []))
                      .sort(),
                  ),
                ]}
                suggestions={extractSuggestions(espressoList, "grinder")}
              />

              <FormComboboxSingle
                label="Burrs"
                name="grinderBurrs"
                placeholder="54mm conical"
                options={[
                  ...new Set(
                    espressoList
                      .flatMap(({ grinderBurrs }) =>
                        grinderBurrs ? [grinderBurrs] : [],
                      )
                      .sort(),
                  ),
                ]}
                suggestions={extractSuggestions(espressoList, "grinderBurrs")}
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
                options={[
                  ...new Set(
                    espressoList
                      .flatMap(({ basket }) => (basket ? [basket] : []))
                      .sort(),
                  ),
                ]}
                suggestions={extractSuggestions(espressoList, "basket")}
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
