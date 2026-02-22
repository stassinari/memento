import { Link, LinkProps } from "@tanstack/react-router";
import { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import { useQuery } from "@tanstack/react-query";
import { getEspressoFormValueSuggestions, getSelectableBeans } from "~/db/queries";
import { Beans } from "~/db/types";
import { Button } from "../../Button";
import { EquipmentTable } from "../../EquipmentTable";
import { FormSection } from "../../Form";
import { BeansCardsSelect } from "../../beans/BeansCardsSelect";
import { FormComboboxSingle } from "../../form/FormComboboxSingle";
import { FormInput } from "../../form/FormInput";
import { FormInputDate } from "../../form/FormInputDate";
import { FormInputRadioButtonGroup } from "../../form/FormInputRadioButtonGroup";

export interface DecentEspressoFormInputs {
  date: Date;
  beans: string | null;

  machine: string | null;
  grinder: string | null;
  grinderBurrs: string | null;
  portafilter: string | null;
  basket: string | null;

  actualWeight: number | null;
  targetWeight: number | null;
  beansWeight: number | null;
  grindSetting: string | null;
}

export const decentEspressoFormEmptyValues: (
  partialEspresso: DecentEspressoFormInputs,
  latestEspresso?: DecentEspressoFormInputs,
) => DecentEspressoFormInputs = (partialEspresso, latestEspresso) => ({
  date: partialEspresso.date,

  beans: null,
  grindSetting: null,
  actualWeight: partialEspresso.actualWeight ?? 0,

  targetWeight: partialEspresso.targetWeight ?? null,
  beansWeight: null,

  machine: latestEspresso ? latestEspresso.machine : null,
  grinder: latestEspresso ? latestEspresso.grinder : null,
  grinderBurrs: latestEspresso ? latestEspresso.grinderBurrs : null,
  portafilter: latestEspresso ? latestEspresso.portafilter : null,
  basket: latestEspresso ? latestEspresso.basket : null,
});

interface DecentEspressoFormProps {
  defaultValues: DecentEspressoFormInputs;
  existingBeans?: Beans;
  mutation: (data: DecentEspressoFormInputs) => void;
  backLinkProps: LinkProps;
}

export const DecentEspressoForm = ({
  defaultValues,
  existingBeans,
  mutation,
  backLinkProps,
}: DecentEspressoFormProps) => {
  const { data: beansList, isLoading: areBeansLoading } = useQuery({
    queryKey: ["beans"],
    queryFn: () => getSelectableBeans(),
  });

  const { data: espressoFormValueSuggestions, isLoading: areEspressoFormValueSuggestionsLoading } =
    useQuery({
      queryKey: ["espressos", "formValueSuggestions"],
      queryFn: () => getEspressoFormValueSuggestions(),
    });

  const [showEquipmentForm, setShowEquipmentForm] = useState(false);

  const methods = useForm<DecentEspressoFormInputs>({
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { errors },
    getValues,
    register,
  } = methods;

  const onSubmit: SubmitHandler<DecentEspressoFormInputs> = async (data) => {
    mutation(data);
  };

  if (
    areBeansLoading ||
    areEspressoFormValueSuggestionsLoading ||
    !beansList ||
    !espressoFormValueSuggestions
  ) {
    return null;
  }

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

          <BeansCardsSelect beansList={beansList} existingBeans={existingBeans} />
        </FormSection>

        <FormSection title="Recipe" subtitle="The numbers that defined this shot.">
          <FormInput
            label="Final yield (g)"
            id="actualWeight"
            inputProps={{
              ...register("actualWeight", {
                min: {
                  value: 0,
                  message: "Please enter a positive weight.",
                },
                setValueAs: (v: string) => (v === "" ? null : Number(v)),
              }),
              type: "number",
              step: "0.01",
              placeholder: "41.7",
            }}
            error={errors.actualWeight?.message}
          />

          <FormInput
            label="Dose (g) *"
            id="beansWeight"
            inputProps={{
              ...register("beansWeight", {
                required: "Please enter the dose of your beans.",
                min: {
                  value: 0,
                  message: "Please enter a positive weight.",
                },
                setValueAs: (v: string) => (v === "" ? null : Number(v)),
              }),
              type: "number",
              step: "0.01",
              placeholder: "15",
            }}
            error={errors.beansWeight?.message}
          />

          <FormInput
            label="Target yield"
            id="targetWeight"
            inputProps={{
              ...register("targetWeight", {
                min: {
                  value: 0,
                  message: "Please enter a positive weight.",
                },
                setValueAs: (v: string) => (v === "" ? null : Number(v)),
              }),
              type: "number",
              step: "0.01",
              placeholder: "42",
            }}
            error={errors.targetWeight?.message}
          />

          <FormInput
            label="Grind setting"
            id="grindSetting"
            inputProps={{
              ...register("grindSetting"),
              type: "text",
              placeholder: "1.5",
            }}
          />
        </FormSection>

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
          <Button variant="white" asChild>
            <Link {...backLinkProps}>Back</Link>
          </Button>
          <Button variant="primary" type="submit" colour="accent">
            Update
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
