import { atom, useAtomValue } from "jotai";
import { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import { Button } from "../../Button";
import { FormSection } from "../../Form";
import { Stopwatch } from "../../Stopwatch";
import { Toggle } from "../../Toggle";
import { FormInput } from "../../form/FormInput";

export interface EspressoTimeInputs {
  actualTime: number | null;
  actualWeight: number | null;
}

export const espressoTimeEmptyValues: () => EspressoTimeInputs = () => ({
  actualTime: null,
  actualWeight: null,
});

interface EspressoTimeProps {
  defaultValues: EspressoTimeInputs;
  handleNestedSubmit: (data: EspressoTimeInputs) => void;
  handleBack: () => void;
  ctaLabel: string;
}

export const espressoStopwatchAtom = atom<boolean>(false);

export const EspressoTime: React.FC<EspressoTimeProps> = ({
  defaultValues,
  handleNestedSubmit,
  handleBack,
  ctaLabel,
}) => {
  const isStopwatchRunning = useAtomValue(espressoStopwatchAtom);

  const methods = useForm<EspressoTimeInputs>({
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { errors },
    register,
    setValue,
  } = methods;

  const onSubmit: SubmitHandler<EspressoTimeInputs> = async (data) => {
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
          subtitle="Keep track of how long your espresso takes."
        >
          <Stopwatch
            atom={espressoStopwatchAtom}
            initialSeconds={
              defaultValues.actualTime ? defaultValues.actualTime % 60 : 0
            }
            initialMinutes={
              defaultValues.actualTime
                ? Math.floor(defaultValues.actualTime / 60)
                : 0
            }
            setFormSeconds={(seconds) => setValue("actualTime", seconds)}
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
              label="Time (seconds)"
              id="actualTime"
              inputProps={{
                ...register("actualTime", {
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
              error={errors.actualTime?.message}
            />
          </div>

          <FormInput
            label="Final yield (g)"
            id="actualWeight"
            inputProps={{
              ...register("actualWeight", {
                min: {
                  value: 0,
                  message: "Please enter a positive weight.",
                },
                valueAsNumber: true,
              }),
              type: "number",
              step: "0.01",
              placeholder: "41.7",
            }}
            error={errors.actualWeight?.message}
          />
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
