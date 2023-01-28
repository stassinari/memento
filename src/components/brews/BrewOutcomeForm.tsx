import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import "twin.macro";
import { TastingScores } from "../../types/brews";
import { FormSection } from "../Form";
import { FormInputSlider } from "../form/FormInputSlider";

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

export const BrewOutcomeForm = () => {
  const methods = useForm<BrewOutcomeInputs>({
    defaultValues: brewOutcomeFormEmptyValues,
  });

  console.log(brewOutcomeFormEmptyValues);

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
        </FormSection>
      </form>
    </FormProvider>
  );
};
