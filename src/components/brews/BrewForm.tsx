import { orderBy } from "firebase/firestore";
import React, { useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "twin.macro";
import { useFirestoreList } from "../../hooks/firestore/useFirestoreList";
import { Beans } from "../../types/beans";
import { Brew } from "../../types/brews";
import { Button } from "../Button";
import { Divider } from "../Divider";
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

export const brewFormEmptyValues: () => BrewFormInputs = () => ({
  ...beansMethodEquipmentEmptyValues(),

  ...brewRecipeEmptyValues(),

  ...brewTimeEmptyValues(),
});

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
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);

  const { list: beansList, isLoading: areBeansLoading } =
    useFirestoreList<Beans>("beans", [orderBy("roastDate", "desc")]);

  const { list: brewsList, isLoading: areBrewsLoading } =
    useFirestoreList<Brew>("brews", [orderBy("date", "desc")]);

  const onSubmit: SubmitHandler<BrewFormInputs> = async (data) => {
    mutation(data);
  };

  if (areBeansLoading || areBrewsLoading) return null;

  return (
    <div>
      <h1 tw="text-3xl font-bold tracking-tight text-gray-900">{title}</h1>

      <BeansMethodEquipment
        brewsList={brewsList}
        beansList={beansList}
        defaultValues={defaultValues}
      />

      <Divider tw="hidden sm:block" />

      <BrewRecipe defaultValues={defaultValues} />

      <Divider tw="hidden sm:block" />

      <BrewTime defaultValues={defaultValues} />

      <div className="flex justify-end gap-4">
        <Button variant="white" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button
          variant="primary"
          type="submit"
          colour="accent"
          // disabled={mutation.isLoading} FIXME disabled buttons after first click
        >
          {buttonLabel}
        </Button>
      </div>
    </div>
  );
};
