import { Link, useNavigate } from "@tanstack/react-router";
import { DocumentData, DocumentReference, updateDoc } from "firebase/firestore";
import { pick } from "lodash";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import { Brew, ExtractionType } from "~/types/brew";
import { Button } from "../Button";
import { FormSection } from "../Form";
import { PoweredByMarkdown } from "../PoweredByMarkdown";
import { FormInput } from "../form/FormInput";
import { FormInputRadioButtonGroup } from "../form/FormInputRadioButtonGroup";
import { FormInputSlider } from "../form/FormInputSlider";
import { FormTextarea } from "../form/FormTextarea";

interface TastingScoresInputs {
  aroma: number | null;
  acidity: number | null;
  sweetness: number | null;
  body: number | null;
  finish: number | null;
}

interface BrewOutcomeInputs {
  rating: number | null;
  notes: string | null;
  tastingScores: TastingScoresInputs | null;
  tds: number | null;
  finalBrewWeight: number | null;
  extractionType: ExtractionType | null;
}

const brewOutcomeFormEmptyValues: BrewOutcomeInputs = {
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
  finalBrewWeight: null,
  extractionType: null,
};

interface BrewOutcomeFormProps {
  brew: Brew;
  brewRef: DocumentReference<DocumentData>;
}

export const BrewOutcomeForm = ({ brew, brewRef }: BrewOutcomeFormProps) => {
  const navigate = useNavigate();

  const methods = useForm<BrewOutcomeInputs>({
    defaultValues: {
      ...brewOutcomeFormEmptyValues,
      ...pick(brew, [
        "rating",
        "notes",
        "tastingScores",
        "tds",
        "finalBrewWeight",
        "extractionType",
      ]),
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = methods;

  const onSubmit: SubmitHandler<BrewOutcomeInputs> = async (data) => {
    if (brew.id) {
      await updateDoc(brewRef, { ...data });
      navigate({ to: "/drinks/brews/$brewId", params: { brewId: brew.id } });
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
        className="space-y-6"
      >
        <FormSection title="Scores" subtitle="Bla">
          <FormInputSlider
            label="Overall score"
            id="rating"
            min={0}
            max={10}
            step={0.5}
            // hideThumbMarker={true}
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
          subtitle="(Optional) Find out the TDS of you brew."
        >
          <FormInputRadioButtonGroup
            label="Extraction type"
            name="extractionType"
            options={[
              { label: "Percolation", value: "percolation" },
              { label: "Immersion", value: "immersion" },
            ]}
            variant="secondary"
          />

          <FormInput
            label="Final brew weight (g)"
            id="finalBrewWeight"
            inputProps={{
              ...register("finalBrewWeight", {
                min: {
                  value: 0,
                  message: "Please enter a positive weight.",
                },
                valueAsNumber: true,
              }),
              type: "number",
              step: "0.01",
              placeholder: "223.7",
            }}
            error={errors.finalBrewWeight?.message}
          />

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
            <Link to="/drinks/brews/$brewId" params={{ brewId: brew.id ?? "" }}>
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
