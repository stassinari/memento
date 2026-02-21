import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { SubmitHandler } from "react-hook-form";

import { BeansCardsSelect } from "~/components/beans/BeansCardsSelect";
import { getBrewFormValueSuggestions, getSelectableBeans } from "~/db/queries";
import { Beans, Brew } from "~/db/types";
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
  existingBeans?: Beans;
  buttonLabel: string;
  mutation: (data: BrewFormInputs) => void;
}

export const BrewForm = ({
  defaultValues,
  existingBeans,
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
    queryFn: () => getSelectableBeans({ data: user?.dbId ?? "" }),
  });

  const { data: brewFormValueSuggestions } = useQuery({
    queryKey: ["brews", "formValueSuggestions"],
    queryFn: () => getBrewFormValueSuggestions({ data: user?.dbId ?? "" }),
  });

  const onSubmit: SubmitHandler<BrewFormInputs> = (data) => {
    mutation(data);
  };

  // FIXME can display the page as this is loading
  if (areBeansLoading || !brewFormValueSuggestions || !beansList) return null;

  return (
    <>
      {activeStep === "beansMethodEquipment" ? (
        <BeansMethodEquipment
          brewFormValueSuggestions={brewFormValueSuggestions}
          beansCardsSelectComponent={
            <BeansCardsSelect
              beansList={beansList}
              existingBeans={existingBeans}
            />
          }
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
