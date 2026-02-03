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
import { Espresso } from "~/types/espresso";
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
  const readFromPostgres = useFeatureFlag("read_from_postgres");

  const [espressoFormInputs, setEspressoFormInputs] = useState(defaultValues);
  const [activeStep, setActiveStep] =
    useState<EspressoFormStep>("beansEquipment");

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

  const espressoFilters = useMemo(() => [orderBy("date", "desc")], []);
  const espressoQuery = useCollectionQuery<Espresso>(
    "espresso",
    espressoFilters,
  );

  const { list: espressoList, isLoading: areEspressosLoading } =
    useFirestoreCollectionOneTime<Espresso>(espressoQuery);

  const onSubmit: SubmitHandler<EspressoFormInputs> = (data) => {
    mutation(data);
  };

  const areBeansLoading = readFromPostgres
    ? isPgBeansLoading
    : isFsBeansLoading;

  if (areBeansLoading || areEspressosLoading) return null;

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
      {activeStep === "beansEquipment" ? (
        <BeansEquipment
          espressoList={espressoList}
          beansCardsSelectComponent={beansCardsSelectComponent}
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
