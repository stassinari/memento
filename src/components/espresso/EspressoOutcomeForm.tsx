import { Link, useNavigate } from "@tanstack/react-router";
import { DocumentData, DocumentReference, updateDoc } from "firebase/firestore";
import { pick } from "lodash";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import { Espresso } from "../../types/espresso";
import { Button } from "../Button";
import { FormSection } from "../Form";
import { PoweredByMarkdown } from "../PoweredByMarkdown";
import { FormInput } from "../form/FormInput";
import { FormInputSlider } from "../form/FormInputSlider";
import { FormTextarea } from "../form/FormTextarea";

// TODO refactor this and merge with brew
interface TastingScoresInputs {
  aroma: number | null;
  acidity: number | null;
  sweetness: number | null;
  body: number | null;
  finish: number | null;
}

interface EspressoOutcomeInputs {
  rating: number | null;
  notes: string | null;
  tastingScores: TastingScoresInputs | null;
  tds: number | null;
}

const espressoOutcomeFormEmptyValues: EspressoOutcomeInputs = {
  rating: null,
  notes: null,
  tds: null,
  tastingScores: {
    acidity: null,
    aroma: null,
    sweetness: null,
    body: null,
    finish: null,
  },
};

interface EspressoOutcomeFormProps {
  espresso: Espresso;
  espressoRef: DocumentReference<DocumentData>;
}

export const EspressoOutcomeForm = ({
  espresso,
  espressoRef,
}: EspressoOutcomeFormProps) => {
  const navigate = useNavigate();

  const methods = useForm<EspressoOutcomeInputs>({
    defaultValues: {
      ...espressoOutcomeFormEmptyValues,
      ...pick(espresso, ["rating", "notes", "tastingScores", "tds"]),
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = methods;

  const onSubmit: SubmitHandler<EspressoOutcomeInputs> = async (data) => {
    if (espresso.id) {
      await updateDoc(espressoRef, { ...data });
      navigate({
        to: "/drinks/espresso/$espressoId",
        params: { espressoId: espresso.id },
      });
    }
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
          <FormInputSlider
            label="Aroma"
            id="tastingScores.aroma"
            min={0}
            max={10}
            step={1}
          />
          <FormInputSlider
            label="Acidity"
            id="tastingScores.acidity"
            min={0}
            max={10}
            step={1}
          />
          <FormInputSlider
            label="Sweetness"
            id="tastingScores.sweetness"
            min={0}
            max={10}
            step={1}
          />
          <FormInputSlider
            label="Body"
            id="tastingScores.body"
            min={0}
            max={10}
            step={1}
          />
          <FormInputSlider
            label="Finish"
            id="tastingScores.finish"
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
                valueAsNumber: true,
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
