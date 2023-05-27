import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import "twin.macro";
import { Button } from "../../Button";
import { FormSection } from "../../Form";
import { FormInput } from "../../form/FormInput";

export interface EspressoRecipeInputs {
  targetWeight: number | null;
  beansWeight: number | null;
  waterTemperature: number | null;
  grindSetting: string | null;
}

export const espressoRecipeEmptyValues: () => EspressoRecipeInputs = () => ({
  targetWeight: null,
  beansWeight: null,
  waterTemperature: null,
  grindSetting: null,
});

interface EspressoRecipeProps {
  defaultValues: EspressoRecipeInputs;
  handleNestedSubmit: (data: EspressoRecipeInputs) => void;
  handleBack: () => void;
}

export const EspressoRecipe: React.FC<EspressoRecipeProps> = ({
  defaultValues,
  handleNestedSubmit,
  handleBack,
}) => {
  const methods = useForm<EspressoRecipeInputs>({
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = methods;

  const onSubmit: SubmitHandler<EspressoRecipeInputs> = async (data) => {
    handleNestedSubmit(data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" tw="space-y-6">
        <FormSection
          title="Recipe"
          subtitle="All the info unique to this espresso."
        >
          <FormInput
            label="Yield *"
            id="targetWeight"
            inputProps={{
              ...register("targetWeight", {
                required: "Please enter the yield of your espresso.",
                min: {
                  value: 0,
                  message: "Please enter a positive weight.",
                },
                valueAsNumber: true,
              }),
              type: "number",
              step: "0.01",
              placeholder: "42",
            }}
            error={errors.targetWeight?.message}
          />

          <FormInput
            label="Dose (g) *"
            id="beansWeight"
            inputProps={{
              ...register("beansWeight", {
                required: "Please enter the dose of your beans.",
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
