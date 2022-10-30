import { useSetAtom } from "jotai";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import "twin.macro";
import { Button } from "../../Button";
import { FormSection } from "../../Form";
import { FormInput } from "../../form/FormInput";
import { brewFormActiveStepAtom } from "../BrewForm";

export interface BrewTimeInputs {
  timeSeconds: number | null;
  timeMinutes: number | null;
}

export const brewTimeEmptyValues: () => BrewTimeInputs = () => ({
  timeSeconds: null,
  timeMinutes: null,
});

interface BrewTimeProps {
  defaultValues: BrewTimeInputs;
  handleNestedSubmit: (data: BrewTimeInputs) => void;
  ctaLabel: string;
}

export const BrewTime: React.FC<BrewTimeProps> = ({
  defaultValues,
  ctaLabel,
  handleNestedSubmit,
}) => {
  const setBrewFormActiveStep = useSetAtom(brewFormActiveStepAtom);

  const methods = useForm<BrewTimeInputs>({
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = methods;

  const onSubmit: SubmitHandler<BrewTimeInputs> = async (data) => {
    handleNestedSubmit(data);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
        tw="mt-6 space-y-6"
      >
        <FormSection
          title="Time"
          subtitle="Keep track of how long your brew takes."
        >
          <FormInput
            label="Minutes"
            id="timeMinutes"
            inputProps={{
              ...register("timeMinutes", {
                min: {
                  value: 0,
                  message:
                    "Please don't break space/time, enter a positive number.",
                },
                valueAsNumber: true,
              }),
              type: "number",
              placeholder: "2",
            }}
            error={errors.timeMinutes?.message}
          />

          <FormInput
            label="Seconds"
            id="timeSeconds"
            inputProps={{
              ...register("timeSeconds", {
                min: {
                  value: 0,
                  message:
                    "Please don't break space/time, enter a positive number.",
                },
                valueAsNumber: true,
              }),
              type: "number",
              placeholder: "34",
            }}
            error={errors.timeSeconds?.message}
          />
        </FormSection>

        <div className="flex justify-end gap-4">
          <Button
            variant="white"
            type="button"
            onClick={() => setBrewFormActiveStep("recipe")}
          >
            Back
          </Button>
          <Button
            variant="primary"
            type="submit"
            colour="accent"
            // disabled={mutation.isLoading} FIXME disabled buttons after first click
          >
            {ctaLabel}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
