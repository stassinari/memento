import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import { Button } from "../../Button";
import { FormSection } from "../../Form";
import { FormInput } from "../../form/FormInput";

export interface BrewRecipeInputs {
  waterWeight: number | null;
  beansWeight: number | null;
  waterTemperature: number | null;
  grindSetting: string | null;
}

export const brewRecipeEmptyValues: () => BrewRecipeInputs = () => ({
  waterWeight: null,
  beansWeight: null,
  waterTemperature: null,
  grindSetting: null,
});

interface BrewRecipeProps {
  defaultValues: BrewRecipeInputs;
  handleNestedSubmit: (data: BrewRecipeInputs) => void;
  handleBack: () => void;
}

export const BrewRecipe: React.FC<BrewRecipeProps> = ({
  defaultValues,
  handleNestedSubmit,
  handleBack,
}) => {
  const methods = useForm<BrewRecipeInputs>({
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = methods;

  const onSubmit: SubmitHandler<BrewRecipeInputs> = async (data) => {
    handleNestedSubmit(data);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
        className="space-y-6"
      >
        <FormSection
          title="Recipe"
          subtitle="All the info unique to this brew."
        >
          <FormInput
            label="Water weight (ml) *"
            id="waterWeight"
            inputProps={{
              ...register("waterWeight", {
                required: "Please enter the weight of your water.",
                min: {
                  value: 0,
                  message: "Please enter a positive weight.",
                },
                valueAsNumber: true,
              }),
              type: "number",
              step: "0.01",
              placeholder: "250",
            }}
            error={errors.waterWeight?.message}
          />

          <FormInput
            label="Beans weight (g) *"
            id="beansWeight"
            inputProps={{
              ...register("beansWeight", {
                required: "Please enter the weight of your beans.",
                min: {
                  value: 0,
                  message: "Please enter a positive weight.",
                },
                valueAsNumber: true,
              }),
              type: "number",
              step: "0.01",
              placeholder: "15",
            }}
            error={errors.beansWeight?.message}
          />

          <FormInput
            label="Water temperature (°C)"
            id="waterTemperature"
            inputProps={{
              ...register("waterTemperature", {
                min: {
                  value: 0,
                  message: "Please enter a positive temperature.",
                },
                max: {
                  value: 100,
                  message: "Please enter a non-gaseous water temperature.",
                },
                valueAsNumber: true,
              }),
              type: "number",
              step: "0.01",
              placeholder: "98",
            }}
            error={errors.waterTemperature?.message}
          />

          <FormInput
            label="Grind setting"
            id="grindSetting"
            inputProps={{
              ...register("grindSetting"),
              type: "text",
              placeholder: "1.5",
            }}
          />
        </FormSection>

        <div className="flex justify-end gap-4">
          <Button variant="white" type="button" onClick={handleBack}>
            Back
          </Button>
          <Button variant="primary" type="submit" colour="accent">
            Next
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
