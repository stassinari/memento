import { atom, useAtomValue } from "jotai";
import { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import { Button } from "../../Button";
import { FormSection } from "../../Form";
import { Stopwatch } from "../../Stopwatch";
import { Toggle } from "../../Toggle";
import { FormInput } from "../../form/FormInput";

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

export const brewStopwatchAtom = atom<boolean>(false);

export const BrewTime = ({
  defaultValues,
  handleNestedSubmit,
  handleBack,
  ctaLabel,
}: BrewTimeProps) => {
  const isStopwatchRunning = useAtomValue(brewStopwatchAtom);

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

  const [manualInput, setManualInput] = useState(false);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
        className="space-y-6"
      >
        <FormSection
          title="Time"
          subtitle="Keep track of how long your brew takes."
        >
          <Stopwatch
            atom={brewStopwatchAtom}
            initialSeconds={defaultValues.timeSeconds || 0}
            initialMinutes={defaultValues.timeMinutes || 0}
            setFormSeconds={(seconds) => setValue("timeSeconds", seconds)}
            setFormMinutes={(minutes) => setValue("timeMinutes", minutes)}
            disabled={manualInput}
          />

          <Toggle
            checked={manualInput}
            onChange={setManualInput}
            label="Set time manually"
            disabled={isStopwatchRunning}
          />

          <div className="flex items-end gap-4">
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
                disabled: !manualInput,
              }}
              error={errors.timeMinutes?.message}
            />
            <span className="py-[9px]">:</span>
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
                disabled: !manualInput,
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
