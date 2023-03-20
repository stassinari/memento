import { DocumentData, DocumentReference, updateDoc } from "firebase/firestore";
import { pick } from "lodash";
import React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import "twin.macro";
import { Espresso } from "../../types/espresso";
import { Button } from "../Button";
import { FormSection } from "../Form";
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

export const EspressoOutcomeForm: React.FC<EspressoOutcomeFormProps> = ({
  espresso,
  espressoRef,
}) => {
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
      navigate(`/drinks/espresso/${espresso.id}`);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
        tw="mt-6 space-y-6"
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
            helperText={
              <React.Fragment>
                Powered by{" "}
                <a
                  tw="underline hover:no-underline"
                  href="https://www.markdownguide.org/"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Markdown
                </a>
              </React.Fragment>
            }
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
          <Button
            variant="white"
            type="button"
            as={Link}
            to={`/drinks/espressos/${espresso.id ?? ""}`}
          >
            Back
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
