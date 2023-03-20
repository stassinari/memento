import { orderBy } from "firebase/firestore";
import React, { useState } from "react";
import { SubmitHandler } from "react-hook-form";
import "twin.macro";
import { useFirestoreCollection } from "../../hooks/firestore/useFirestoreCollection";
import { Beans } from "../../types/beans";
import { Brew } from "../../types/brew";
import {
  BeansMethodEquipment,
  beansMethodEquipmentEmptyValues,
  BeansMethodEquipmentInputs,
} from "./steps/BeansMethodEquipment";
import {
  BrewRecipe,
  brewRecipeEmptyValues,
  BrewRecipeInputs,
} from "./steps/Recipe";
import { BrewTime, brewTimeEmptyValues, BrewTimeInputs } from "./steps/Time";

// FIXME introduce global "createdAt" and "updatedAt" on every object
export interface BrewFormInputs
  extends BeansMethodEquipmentInputs,
    BrewRecipeInputs,
    BrewTimeInputs {}

export const brewFormEmptyValues: (copyFrom?: Brew) => BrewFormInputs = (
  copyFrom
) => ({
  ...beansMethodEquipmentEmptyValues(copyFrom),

  ...brewRecipeEmptyValues(),

  ...brewTimeEmptyValues(),
});

type BrewFormStep = "beansMethodEquipment" | "recipe" | "time";

interface BrewFormProps {
  defaultValues: BrewFormInputs;
  title: string;
  buttonLabel: string;
  mutation: (data: BrewFormInputs) => Promise<void>;
}

export const BrewForm: React.FC<BrewFormProps> = ({
  defaultValues,
  title,
  buttonLabel,
  mutation,
}) => {
  const [brewFormInputs, setBrewFormInputs] = useState(defaultValues);
  const [activeStep, setActiveStep] = useState<BrewFormStep>(
    "beansMethodEquipment"
  );

  const { list: beansList, isLoading: areBeansLoading } =
    useFirestoreCollection<Beans>("beans", [
      orderBy("roastDate", "desc"),
      // where("isFinished", "==", false), TODO consider smarter way, ie only non-finished beans + possible archived+selected one
    ]);

  const { list: brewsList, isLoading: areBrewsLoading } =
    useFirestoreCollection<Brew>("brews", [orderBy("date", "desc")]);

  const onSubmit: SubmitHandler<BrewFormInputs> = async (data) => {
    await mutation(data);
  };

  if (areBeansLoading || areBrewsLoading) return null;

  return (
    <React.Fragment>
      <h1 tw="text-3xl font-bold tracking-tight text-gray-900">{title}</h1>

      {activeStep === "beansMethodEquipment" ? (
        <BeansMethodEquipment
          brewsList={brewsList}
          beansList={beansList}
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
            const toSend = { ...brewFormInputs, ...data };
            onSubmit(toSend);
          }}
          handleBack={() => setActiveStep("recipe")}
        />
      )}
    </React.Fragment>
  );
};
