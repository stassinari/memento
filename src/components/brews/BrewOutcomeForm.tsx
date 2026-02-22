import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import { updateBrewOutcome } from "~/db/mutations";
import { ExtractionType } from "~/db/schema";
import { Brew } from "~/db/types";
import { Button } from "../Button";
import { FormSection } from "../Form";
import { PoweredByMarkdown } from "../PoweredByMarkdown";
import { FormInput } from "../form/FormInput";
import { FormInputRadioButtonGroup } from "../form/FormInputRadioButtonGroup";
import { FormInputSlider } from "../form/FormInputSlider";
import { FormTextarea } from "../form/FormTextarea";

export interface BrewOutcomeInputs {
  rating: number | null;
  notes: string | null;
  tds: number | null;
  finalBrewWeight: number | null;
  extractionType: ExtractionType | null;

  aroma: number | null;
  acidity: number | null;
  sweetness: number | null;
  body: number | null;
  finish: number | null;
}

const brewOutcomeFormEmptyValues: BrewOutcomeInputs = {
  rating: null,
  notes: null,
  aroma: null,
  acidity: null,
  sweetness: null,
  body: null,
  finish: null,
  tds: null,
  finalBrewWeight: null,
  extractionType: null,
};

interface BrewOutcomeFormProps {
  brew: Brew;
  brewId: string;
}

export const BrewOutcomeForm = ({ brew, brewId }: BrewOutcomeFormProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const methods = useForm<BrewOutcomeInputs>({
    defaultValues: {
      ...brewOutcomeFormEmptyValues,
      ...brew,
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = methods;

  const mutation = useMutation({
    mutationFn: async (data: BrewOutcomeInputs) => {
      await updateBrewOutcome({
        data: {
          data,
          brewId,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brews"] });
      navigate({ to: "/drinks/brews/$brewId", params: { brewId } });
    },
    onError: (error) => {
      console.error("BrewOutcomeForm - mutation error:", error);
    },
  });

  const onSubmit: SubmitHandler<BrewOutcomeInputs> = async (data) => {
    mutation.mutate(data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" className="space-y-6">
        <FormSection
          title="Scores"
          subtitle="Your overall impression and any notes worth remembering."
        >
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

        <FormSection title="Tasting notes" subtitle="Break down the cup — from aroma to finish.">
          <FormInputSlider label="Aroma" id="aroma" min={0} max={10} step={1} />
          <FormInputSlider label="Acidity" id="acidity" min={0} max={10} step={1} />
          <FormInputSlider label="Sweetness" id="sweetness" min={0} max={10} step={1} />
          <FormInputSlider label="Body" id="body" min={0} max={10} step={1} />
          <FormInputSlider label="Finish" id="finish" min={0} max={10} step={1} />
        </FormSection>

        <FormSection title="Extraction" subtitle="The technical side of how the brew turned out.">
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
                setValueAs: (v: string) => (v === "" ? null : Number(v)),
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
