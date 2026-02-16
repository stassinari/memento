import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { SubmitHandler } from "react-hook-form";

import { BeansCardsSelect } from "~/components/beans/BeansCardsSelect";
import {
  getBeansNonArchived,
  getEspressoFormValueSuggestions,
} from "~/db/queries";
import { Espresso } from "~/db/types";
import { userAtom } from "~/hooks/useInitUser";
import {
  BeansEquipment,
  BeansEquipmentInputs,
  beansEquipmentEmptyValues,
} from "./steps/BeansEquipment";
import {
  EspressoRecipe,
  EspressoRecipeInputs,
  espressoRecipeEmptyValues,
} from "./steps/Recipe";
import {
  EspressoTime,
  EspressoTimeInputs,
  espressoTimeEmptyValues,
} from "./steps/Time";

// FIXME introduce global "createdAt" and "updatedAt" on every object
export interface EspressoFormInputs
  extends BeansEquipmentInputs, EspressoRecipeInputs, EspressoTimeInputs {}

export type EspressoFormValueSuggestions = Awaited<
  ReturnType<typeof getEspressoFormValueSuggestions>
>;

export const espressoFormEmptyValues: (
  copyFrom?: Espresso,
) => EspressoFormInputs = (copyFrom) => ({
  ...beansEquipmentEmptyValues(copyFrom),

  ...espressoRecipeEmptyValues(),

  ...espressoTimeEmptyValues(),
});

type EspressoFormStep = "beansEquipment" | "recipe" | "time";

interface EspressoFormProps {
  defaultValues: EspressoFormInputs;
  buttonLabel: string;
  mutation: (data: EspressoFormInputs) => void;
}

export const EspressoForm = ({
  defaultValues,
  buttonLabel,
  mutation,
}: EspressoFormProps) => {
  console.log("EspressoForm");

  const user = useAtomValue(userAtom);

  const [espressoFormInputs, setEspressoFormInputs] = useState(defaultValues);
  const [activeStep, setActiveStep] =
    useState<EspressoFormStep>("beansEquipment");

  const { data: beansList, isLoading: areBeansLoading } = useQuery({
    queryKey: ["beans", user?.uid],
    queryFn: () => getBeansNonArchived({ data: user?.uid ?? "" }),
  });

  const { data: espressoFormValueSuggestions } = useQuery({
    queryKey: ["espressos", "formValueSuggestions"],
    queryFn: () => getEspressoFormValueSuggestions({ data: user?.uid ?? "" }),
  });

  const onSubmit: SubmitHandler<EspressoFormInputs> = (data) => {
    mutation(data);
  };

  if (areBeansLoading || !espressoFormValueSuggestions || !beansList)
    return null;

  return (
    <>
      {activeStep === "beansEquipment" ? (
        <BeansEquipment
          espressoFormValueSuggestions={espressoFormValueSuggestions}
          beansCardsSelectComponent={<BeansCardsSelect beansList={beansList} />}
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
