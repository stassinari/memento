import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import { updateEspressoOutcome } from "~/db/mutations";
import { Espresso } from "~/db/types";
import { userAtom } from "~/hooks/useInitUser";
import { Button } from "../Button";
import { FormSection } from "../Form";
import { PoweredByMarkdown } from "../PoweredByMarkdown";
import { FormInput } from "../form/FormInput";
import { FormInputSlider } from "../form/FormInputSlider";
import { FormTextarea } from "../form/FormTextarea";

export interface EspressoOutcomeInputs {
  rating: number | null;
  notes: string | null;
  tds: number | null;

  aroma: number | null;
  acidity: number | null;
  sweetness: number | null;
  body: number | null;
  finish: number | null;
}

const espressoOutcomeFormEmptyValues: EspressoOutcomeInputs = {
  rating: null,
  notes: null,
  tds: null,
  acidity: null,
  aroma: null,
  sweetness: null,
  body: null,
  finish: null,
};

interface EspressoOutcomeFormProps {
  espresso: Espresso;
  espressoId: string;
}

export const EspressoOutcomeForm = ({
  espresso,
  espressoId,
}: EspressoOutcomeFormProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAtomValue(userAtom);

  const methods = useForm<EspressoOutcomeInputs>({
    defaultValues: {
      ...espressoOutcomeFormEmptyValues,
      ...espresso,
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = methods;

  const mutation = useMutation({
    mutationFn: async (data: EspressoOutcomeInputs) => {
      await updateEspressoOutcome({
        data: {
          data,
          espressoId,
          firebaseUid: user?.uid ?? "",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["espresso"] });

      navigate({
        to: "/drinks/espresso/$espressoId",
        params: { espressoId },
      });
    },
  });

  const onSubmit: SubmitHandler<EspressoOutcomeInputs> = async (data) => {
    mutation.mutate(data);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
        className="mt-6 space-y-6"
      >
        <FormSection title="Scores" subtitle="Bla">
          <FormInputSlider
            label="Overall score"
            id="rating"
            min={0}
            max={10}
            step={0.5}
          />

          <FormTextarea
            label="Notes"
            id="notes"
            textareaProps={{ ...register("notes") }}
            helperText={<PoweredByMarkdown />}
          />
        </FormSection>

        <FormSection
          title="Tasting notes"
          subtitle="(Optional) More granular tasting notes."
        >
          <FormInputSlider label="Aroma" id="aroma" min={0} max={10} step={1} />
          <FormInputSlider
            label="Acidity"
            id="acidity"
            min={0}
            max={10}
            step={1}
          />
          <FormInputSlider
            label="Sweetness"
            id="sweetness"
            min={0}
            max={10}
            step={1}
          />
          <FormInputSlider label="Body" id="body" min={0} max={10} step={1} />
          <FormInputSlider
            label="Finish"
            id="finish"
            min={0}
            max={10}
            step={1}
          />
        </FormSection>

        <FormSection
          title="Extraction"
          subtitle="(Optional) Find out the TDS of you espresso."
        >
          <FormInput
            label="TDS (%)"
            id="tds"
            inputProps={{
              ...register("tds", {
                min: {
                  value: 0,
                  message: "Please enter a positive TDS.",
                },
                setValueAs: (v: string) => (v === "" ? null : Number(v)),
              }),
              type: "number",
              step: "0.01",
              placeholder: "1.9",
            }}
            error={errors.tds?.message}
          />
        </FormSection>

        <div className="flex justify-end gap-4">
          <Button variant="white" type="button" asChild>
            <Link
              to="/drinks/espresso/$espressoId"
              params={{ espressoId: espresso.id ?? "" }}
            >
              Back
            </Link>
          </Button>
          <Button
            variant="primary"
            type="submit"
            colour="accent"
            // disabled={mutation.isLoading} FIXME disabled buttons after first click
          >
            Rate
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
