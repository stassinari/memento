import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { SubmitHandler } from "react-hook-form";

import { BeansCardsSelect } from "~/components/beans/BeansCardsSelect";
import { getBeansNonArchived, getBrewFormValueSuggestions } from "~/db/queries";
import { Brew } from "~/db/types";
import { userAtom } from "~/hooks/useInitUser";
import {
  BeansMethodEquipment,
  BeansMethodEquipmentInputs,
  beansMethodEquipmentEmptyValues,
} from "./steps/BeansMethodEquipment";
import {
  BrewRecipe,
  BrewRecipeInputs,
  brewRecipeEmptyValues,
} from "./steps/Recipe";
import { BrewTime, BrewTimeInputs, brewTimeEmptyValues } from "./steps/Time";

// FIXME introduce global "createdAt" and "updatedAt" on every object
export interface BrewFormInputs
  extends BeansMethodEquipmentInputs, BrewRecipeInputs, BrewTimeInputs {}

export type BrewFormValuesSuggestions = Awaited<
  ReturnType<typeof getBrewFormValueSuggestions>
>;

export const brewFormEmptyValues: (copyFrom?: Brew) => BrewFormInputs = (
  copyFrom,
) => ({
  ...beansMethodEquipmentEmptyValues(copyFrom),

  ...brewRecipeEmptyValues(),

  ...brewTimeEmptyValues(),
});

type BrewFormStep = "beansMethodEquipment" | "recipe" | "time";

interface BrewFormProps {
  defaultValues: BrewFormInputs;
  buttonLabel: string;
  mutation: (data: BrewFormInputs) => void;
}

export const BrewForm = ({
  defaultValues,
  buttonLabel,
  mutation,
}: BrewFormProps) => {
  console.log("BrewForm");

  const user = useAtomValue(userAtom);

  const [brewFormInputs, setBrewFormInputs] = useState(defaultValues);
  const [activeStep, setActiveStep] = useState<BrewFormStep>(
    "beansMethodEquipment",
  );

  const { data: beansList, isLoading: areBeansLoading } = useQuery({
    queryKey: ["beans", "notArchived"],
    queryFn: () => getBeansNonArchived({ data: user?.uid ?? "" }),
  });

  const { data: brewFormValueSuggestions } = useQuery({
    queryKey: ["brews", "formValueSuggestions"],
    queryFn: () => getBrewFormValueSuggestions({ data: user?.uid ?? "" }),
  });

  const onSubmit: SubmitHandler<BrewFormInputs> = (data) => {
    mutation(data);
  };

  if (areBeansLoading || !brewFormValueSuggestions || !beansList) return null;

  return (
    <>
      {activeStep === "beansMethodEquipment" ? (
        <BeansMethodEquipment
          brewFormValueSuggestions={brewFormValueSuggestions}
          beansCardsSelectComponent={<BeansCardsSelect beansList={beansList} />}
          defaultValues={brewFormInputs}
          handleNestedSubmit={(data) => {
            setBrewFormInputs({ ...brewFormInputs, ...data });
            setActiveStep("recipe");
          }}
        />
      ) : activeStep === "recipe" ? (
        <BrewRecipe
          defaultValues={brewFormInputs}
          handleNestedSubmit={(data) => {
            setBrewFormInputs({ ...brewFormInputs, ...data });
            setActiveStep("time");
          }}
          handleBack={() => setActiveStep("beansMethodEquipment")}
        />
      ) : (
        <BrewTime
          defaultValues={brewFormInputs}
          ctaLabel={buttonLabel}
          handleNestedSubmit={(data) => {
            console.log("this firing?", data);

            const toSend = { ...brewFormInputs, ...data };
            onSubmit(toSend);
          }}
          handleBack={() => setActiveStep("recipe")}
        />
      )}
    </>
  );
};
