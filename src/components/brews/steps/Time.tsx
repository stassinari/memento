import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { FormSection } from "../../Form";
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
}

export const BrewTime: React.FC<BrewTimeProps> = ({ defaultValues }) => {
  const methods = useForm<BrewTimeInputs>({
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = methods;

  const onSubmit: SubmitHandler<BrewTimeInputs> = async (data) => {
    // 1. add to atom
    // 2. submit the whole shebang
    console.log(data);
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
      </form>
    </FormProvider>
  );
};
