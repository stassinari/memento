import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { SubmitHandler } from "react-hook-form";

import { BeansCardsSelect } from "~/components/beans/BeansCardsSelect";
import { getEspressoFormValueSuggestions, getSelectableBeans } from "~/db/queries";
import { Beans, Espresso } from "~/db/types";
import {
  BeansEquipment,
  BeansEquipmentInputs,
  beansEquipmentEmptyValues,
} from "./steps/BeansEquipment";
import { EspressoRecipe, EspressoRecipeInputs, espressoRecipeEmptyValues } from "./steps/Recipe";
import { EspressoTime, EspressoTimeInputs, espressoTimeEmptyValues } from "./steps/Time";

export interface EspressoFormInputs
  extends BeansEquipmentInputs, EspressoRecipeInputs, EspressoTimeInputs {}

export type EspressoFormValueSuggestions = Awaited<
  ReturnType<typeof getEspressoFormValueSuggestions>
>;

export const espressoFormEmptyValues: (copyFrom?: Espresso) => EspressoFormInputs = (copyFrom) => ({
  ...beansEquipmentEmptyValues(copyFrom),

  ...espressoRecipeEmptyValues(),

  ...espressoTimeEmptyValues(),
});

type EspressoFormStep = "beansEquipment" | "recipe" | "time";

interface EspressoFormProps {
  defaultValues: EspressoFormInputs;
  existingBeans?: Beans;
  buttonLabel: string;
  mutation: (data: EspressoFormInputs) => void;
}

export const EspressoForm = ({
  defaultValues,
  existingBeans,
  buttonLabel,
  mutation,
}: EspressoFormProps) => {
  console.log("EspressoForm");

  const [espressoFormInputs, setEspressoFormInputs] = useState(defaultValues);
  const [activeStep, setActiveStep] = useState<EspressoFormStep>("beansEquipment");

  const { data: beansList, isLoading: areBeansLoading } = useQuery({
    queryKey: ["beans"],
    queryFn: () => getSelectableBeans(),
  });

  const { data: espressoFormValueSuggestions } = useQuery({
    queryKey: ["espressos", "formValueSuggestions"],
    queryFn: () => getEspressoFormValueSuggestions(),
  });

  const onSubmit: SubmitHandler<EspressoFormInputs> = (data) => {
    mutation(data);
  };

  // FIXME can display the page as this is loading
  if (areBeansLoading || !espressoFormValueSuggestions || !beansList) return null;

  return (
    <>
      {activeStep === "beansEquipment" ? (
        <BeansEquipment
          espressoFormValueSuggestions={espressoFormValueSuggestions}
          beansCardsSelectComponent={
            <BeansCardsSelect beansList={beansList} existingBeans={existingBeans} />
          }
          defaultValues={espressoFormInputs}
          handleNestedSubmit={(data) => {
            setEspressoFormInputs({ ...espressoFormInputs, ...data });
            setActiveStep("recipe");
          }}
        />
      ) : activeStep === "recipe" ? (
        <EspressoRecipe
          defaultValues={espressoFormInputs}
          handleNestedSubmit={(data) => {
            setEspressoFormInputs({ ...espressoFormInputs, ...data });
            setActiveStep("time");
          }}
          handleBack={() => setActiveStep("beansEquipment")}
        />
      ) : (
        <EspressoTime
          defaultValues={espressoFormInputs}
          ctaLabel={buttonLabel}
          handleNestedSubmit={(data) => {
            const toSend = { ...espressoFormInputs, ...data };
            onSubmit(toSend);
          }}
          handleBack={() => setActiveStep("recipe")}
        />
      )}
    </>
  );
};
