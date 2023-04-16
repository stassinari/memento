import { orderBy } from "firebase/firestore";
import React, { useMemo, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import "twin.macro";
import { useCollectionQuery } from "../../hooks/firestore/useCollectionQuery";
import { useFirestoreCollectionOneTime } from "../../hooks/firestore/useFirestoreCollectionOneTime";
import { Beans } from "../../types/beans";
import { Espresso } from "../../types/espresso";
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
  console.log("EspressoForm");

  const [espressoFormInputs, setEspressoFormInputs] = useState(defaultValues);
  const [activeStep, setActiveStep] =
    useState<EspressoFormStep>("beansEquipment");

  // where("isFinished", "==", false), TODO consider smarter way, ie only non-finished beans + possible archived+selected one
  const beansFilters = useMemo(() => [orderBy("roastDate", "desc")], []);

  const beansQuery = useCollectionQuery<Beans>("beans", beansFilters);
  const { list: beansList, isLoading: areBeansLoading } =
    useFirestoreCollectionOneTime<Beans>(beansQuery);

  const espressoFilters = useMemo(() => [orderBy("date", "desc")], []);
  const espressoQuery = useCollectionQuery<Espresso>(
    "espresso",
    espressoFilters
  );

  const { list: espressoList, isLoading: areEspressosLoading } =
    useFirestoreCollectionOneTime<Espresso>(espressoQuery);

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
