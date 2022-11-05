import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import "twin.macro";
import { Button } from "../../Button";
import { FormSection } from "../../Form";
import { FormInput } from "../../form/FormInput";
import { Stopwatch } from "../../Stopwatch";

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
  handleBack: () => void;
  ctaLabel: string;
}

export const BrewTime: React.FC<BrewTimeProps> = ({
  defaultValues,
  handleNestedSubmit,
  handleBack,
  ctaLabel,
}) => {
  const methods = useForm<BrewTimeInputs>({
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { errors },
    register,
    setValue,
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
          <Stopwatch
            setFormSeconds={(seconds) => setValue("timeSeconds", seconds)}
            setFormMinutes={(minutes) => setValue("timeMinutes", minutes)}
          />

          <div tw="flex items-end gap-4">
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
            <span tw="py-[9px]">:</span>
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
          </div>
        </FormSection>

        <div className="flex justify-end gap-4">
          <Button variant="white" type="button" onClick={handleBack}>
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
