import React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import "twin.macro";
import { Brew, TastingScores } from "../../types/brews";
import { Button } from "../Button";
import { FormSection } from "../Form";
import { FormInputSlider } from "../form/FormInputSlider";
import { FormTextarea } from "../form/FormTextarea";

interface BrewOutcomeInputs {
  rating: number | null;
  notes: string | null;
  tastingScores: TastingScores | null;
  tds: number | null;
  finalBrewWeight: number | null;
  extractionType: string | null; // "percolation" | "immersion"
}

const brewOutcomeFormEmptyValues: BrewOutcomeInputs = {
  rating: null,
  notes: null,
  tds: null,
  tastingScores: null,
  finalBrewWeight: null,
  extractionType: null,
};

interface BrewOutcomeFormProps {
  brew: Brew;
}

export const BrewOutcomeForm: React.FC<BrewOutcomeFormProps> = ({ brew }) => {
  const methods = useForm<BrewOutcomeInputs>({
    defaultValues: brewOutcomeFormEmptyValues,
  });

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = methods;

  const onSubmit: SubmitHandler<BrewOutcomeInputs> = async (data) => {
    // handleNestedSubmit(data);
    console.log(data);
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
            // hideThumbMarker={true}
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

        <div className="flex justify-end gap-4">
          <Button
            variant="white"
            type="button"
            as={Link}
            to={`/drinks/brews/${brew.id}`}
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
