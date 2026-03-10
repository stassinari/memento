import { useQuery } from "@tanstack/react-query";
import { type FormEvent, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { getBrewFormValueSuggestions } from "~/db/queries";
import { Beans } from "~/db/types";
import { TastingSetupFormInputs } from "./form-types";
import {
  buildBeansById,
  groupBeansOptions,
  normalizeTastingSetupFormData,
  tastingFormEmptyValues,
  validateStep2Samples,
} from "./tasting-create-form-utils";
import { TastingCreateFormStepSamples } from "./TastingCreateFormStepSamples";
import { TastingCreateFormStepSetup } from "./TastingCreateFormStepSetup";

interface TastingCreateFormProps {
  beansList: Pick<Beans, "id" | "name" | "roaster" | "isFrozen" | "roastDate">[];
  onSubmit: (data: TastingSetupFormInputs) => void;
  isSubmitting?: boolean;
  mode?: "create" | "edit";
  defaultValues?: TastingSetupFormInputs;
}

type FormStep = "setup" | "samples";

export const TastingCreateForm = ({
  beansList,
  onSubmit,
  isSubmitting = false,
  mode = "create",
  defaultValues,
}: TastingCreateFormProps) => {
  const [step, setStep] = useState<FormStep>("setup");
  const [stepError, setStepError] = useState<string | null>(null);
  const isEditMode = mode === "edit";

  const methods = useForm<TastingSetupFormInputs>({
    defaultValues: defaultValues ?? tastingFormEmptyValues,
  });
  const { data: brewFormValueSuggestions } = useQuery({
    queryKey: ["brews", "formValueSuggestions"],
    queryFn: () => getBrewFormValueSuggestions(),
  });
  const beansById = useMemo(() => buildBeansById(beansList), [beansList]);
  const groupedBeansOptions = useMemo(() => groupBeansOptions(beansList), [beansList]);

  const { handleSubmit, trigger, getValues } = methods;

  const validateStep1 = async () => {
    const variable = getValues("variable");
    if (!variable) {
      setStepError("Please select what variable you are tasting.");
      return false;
    }

    const isValid = await trigger(["date", "variable"]);
    if (!isValid) {
      setStepError("Please complete the required setup fields.");
      return false;
    }

    setStepError(null);
    return true;
  };

  const validateStep2 = () => {
    const variable = getValues("variable");
    const samples = getValues("samples");
    const error = validateStep2Samples({ variable, samples });
    setStepError(error);
    return !error;
  };

  const goToStep2 = async () => {
    const isValid = await validateStep1();
    if (!isValid) return;
    setStep("samples");
  };

  const saveSetup = async () => {
    const isValid = validateStep2();
    if (!isValid) return;
    await handleSubmit((data) => onSubmit(normalizeTastingSetupFormData(data)))();
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (step === "setup") {
      await goToStep2();
      return;
    }
    await saveSetup();
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleFormSubmit} autoComplete="off" className="space-y-6">
        {step === "setup" ? (
          <TastingCreateFormStepSetup
            beansById={beansById}
            groupedBeansOptions={groupedBeansOptions}
            isEditMode={isEditMode}
            brewFormValueSuggestions={brewFormValueSuggestions}
            stepError={stepError && stepError.includes("variable") ? stepError : undefined}
            onNext={goToStep2}
          />
        ) : (
          <TastingCreateFormStepSamples
            beansById={beansById}
            groupedBeansOptions={groupedBeansOptions}
            isEditMode={isEditMode}
            isSubmitting={isSubmitting}
            stepError={stepError ?? undefined}
            onBack={() => setStep("setup")}
            onSave={saveSetup}
          />
        )}
      </form>
    </FormProvider>
  );
};
