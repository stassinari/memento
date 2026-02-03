import { useQuery } from "@tanstack/react-query";
import { orderBy } from "firebase/firestore";
import { useAtomValue } from "jotai";
import { useMemo, useState } from "react";
import { SubmitHandler } from "react-hook-form";

import { BeansCardsSelect as FirebaseBeansCardsSelect } from "~/components/beans/BeansCardsSelect.Firebase";
import { BeansCardsSelect as PostgresBeansCardsSelect } from "~/components/beans/BeansCardsSelect.Postgres";
import { getBeans } from "~/db/queries";
import { useCollectionQuery } from "~/hooks/firestore/useCollectionQuery";
import { useFirestoreCollectionOneTime } from "~/hooks/firestore/useFirestoreCollectionOneTime";
import { useFeatureFlag } from "~/hooks/useFeatureFlag";
import { userAtom } from "~/hooks/useInitUser";
import { Beans } from "~/types/beans";
import { Brew } from "~/types/brew";
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
  const readFromPostgres = useFeatureFlag("read_from_postgres");

  const [brewFormInputs, setBrewFormInputs] = useState(defaultValues);
  const [activeStep, setActiveStep] = useState<BrewFormStep>(
    "beansMethodEquipment",
  );

  // Load beans from PostgreSQL or Firestore based on flag
  const { data: pgBeansList, isLoading: isPgBeansLoading } = useQuery({
    queryKey: ["beans", user?.uid],
    queryFn: () => getBeans({ data: user?.uid ?? "" }),
    enabled: readFromPostgres && !!user?.uid,
  });

  const beansFilters = useMemo(() => [orderBy("roastDate", "desc")], []);
  const beansQuery = useCollectionQuery<Beans>("beans", beansFilters);
  const { list: fsBeansList, isLoading: isFsBeansLoading } =
    useFirestoreCollectionOneTime<Beans>(beansQuery);

  const brewFilters = useMemo(() => [orderBy("date", "desc")], []);
  const brewQuery = useCollectionQuery<Brew>("brews", brewFilters);
  const { list: brewsList, isLoading: areBrewsLoading } =
    useFirestoreCollectionOneTime<Brew>(brewQuery);

  const onSubmit: SubmitHandler<BrewFormInputs> = (data) => {
    mutation(data);
  };

  const areBeansLoading = readFromPostgres
    ? isPgBeansLoading
    : isFsBeansLoading;

  if (areBeansLoading || areBrewsLoading) return null;

  // Conditionally render the appropriate BeansCardsSelect component

  const beansCardsSelectComponent = readFromPostgres ? (
    <PostgresBeansCardsSelect
      beansList={((pgBeansList as any) || []).map((b: any) => b.beans)}
    />
  ) : (
    <FirebaseBeansCardsSelect beansList={fsBeansList} />
  );

  return (
    <>
      {activeStep === "beansMethodEquipment" ? (
        <BeansMethodEquipment
          brewsList={brewsList}
          beansCardsSelectComponent={beansCardsSelectComponent}
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
