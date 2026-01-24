import { orderBy } from "firebase/firestore";
import { useMemo, useState } from "react";
import { SubmitHandler } from "react-hook-form";

import { useCollectionQuery } from "@/hooks/firestore/useCollectionQuery";
import { useFirestoreCollectionOneTime } from "@/hooks/firestore/useFirestoreCollectionOneTime";
import { Beans } from "@/types/beans";
import { Brew } from "@/types/brew";
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
  extends BeansMethodEquipmentInputs,
    BrewRecipeInputs,
    BrewTimeInputs {}

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
  mutation: (data: BrewFormInputs) => Promise<void>;
}

export const BrewForm = ({
  defaultValues,
  buttonLabel,
  mutation,
}: BrewFormProps) => {
  console.log("BrewForm");

  const [brewFormInputs, setBrewFormInputs] = useState(defaultValues);
  const [activeStep, setActiveStep] = useState<BrewFormStep>(
    "beansMethodEquipment",
  );

  // where("isFinished", "==", false), TODO consider smarter way, ie only non-finished beans + possible archived+selected one
  const beansFilters = useMemo(() => [orderBy("roastDate", "desc")], []);
  const beansQuery = useCollectionQuery<Beans>("beans", beansFilters);
  const { list: beansList, isLoading: areBeansLoading } =
    useFirestoreCollectionOneTime<Beans>(beansQuery);

  const brewFilters = useMemo(() => [orderBy("date", "desc")], []);
  const brewQuery = useCollectionQuery<Brew>("brews", brewFilters);
  const { list: brewsList, isLoading: areBrewsLoading } =
    useFirestoreCollectionOneTime<Brew>(brewQuery);

  const onSubmit: SubmitHandler<BrewFormInputs> = async (data) => {
    await mutation(data);
  };

  if (areBeansLoading || areBrewsLoading) return null;

  return (
    <>
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
    </>
  );
};
