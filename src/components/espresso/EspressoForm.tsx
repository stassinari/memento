import { orderBy } from "firebase/firestore";
import React, { useState } from "react";
import { SubmitHandler } from "react-hook-form";
import "twin.macro";
import { useFirestoreCollection } from "../../hooks/firestore/useFirestoreCollection";
import { Beans } from "../../types/beans";
import { Espresso } from "../../types/espresso";
import {
  BeansEquipment,
  beansEquipmentEmptyValues,
  BeansEquipmentInputs,
} from "./steps/BeansEquipment";
import {
  EspressoRecipe,
  espressoRecipeEmptyValues,
  EspressoRecipeInputs,
} from "./steps/Recipe";
import {
  EspressoTime,
  espressoTimeEmptyValues,
  EspressoTimeInputs,
} from "./steps/Time";

// FIXME introduce global "createdAt" and "updatedAt" on every object
export interface EspressoFormInputs
  extends BeansEquipmentInputs,
    EspressoRecipeInputs,
    EspressoTimeInputs {}

export const espressoFormEmptyValues: (
  copyFrom?: Espresso
) => EspressoFormInputs = (copyFrom) => ({
  ...beansEquipmentEmptyValues(copyFrom),

  ...espressoRecipeEmptyValues(),

  ...espressoTimeEmptyValues(),
});

type EspressoFormStep = "beansEquipment" | "recipe" | "time";

interface EspressoFormProps {
  defaultValues: EspressoFormInputs;
  title: string;
  buttonLabel: string;
  mutation: (data: EspressoFormInputs) => Promise<void>;
}

export const EspressoForm: React.FC<EspressoFormProps> = ({
  defaultValues,
  title,
  buttonLabel,
  mutation,
}) => {
  const [espressoFormInputs, setEspressoFormInputs] = useState(defaultValues);
  const [activeStep, setActiveStep] =
    useState<EspressoFormStep>("beansEquipment");

  const { list: beansList, isLoading: areBeansLoading } =
    useFirestoreCollection<Beans>("beans", [
      orderBy("roastDate", "desc"),
      // where("isFinished", "==", false), TODO consider smarter way, ie only non-finished beans + possible archived+selected one
    ]);

  const { list: espressoList, isLoading: areEspressosLoading } =
    useFirestoreCollection<Espresso>("espresso", [orderBy("date", "desc")]);

  const onSubmit: SubmitHandler<EspressoFormInputs> = async (data) => {
    await mutation(data);
  };

  if (areBeansLoading || areEspressosLoading) return null;

  return (
    <React.Fragment>
      <h1 tw="text-3xl font-bold tracking-tight text-gray-900">{title}</h1>

      {activeStep === "beansEquipment" ? (
        <BeansEquipment
          espressoList={espressoList}
          beansList={beansList}
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
    </React.Fragment>
  );
};
