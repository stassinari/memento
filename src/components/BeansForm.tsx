import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "twin.macro";
import countries from "../data/countries";
import { processes } from "../data/processes";
import { notesToOptions, tastingNotes } from "../data/tasting-notes";
import { varietals } from "../data/varietals";
import { CountryOptionFlag } from "../pages/BeansAdd/CountryOptionFlag";
import { RoastStyle } from "../types/beans";
import { Button } from "./Button";
import { Divider } from "./Divider";
import { FormSection } from "./Form";
import { FormComboboxMulti } from "./form/FormComboboxMulti";
import { FormComboboxSingle } from "./form/FormComboboxSingle";
import { FormInput } from "./form/FormInput";
import { FormInputDate } from "./form/FormInputDate";
import { FormInputMonthYear } from "./form/FormInputMonthYear";
import { FormInputRadio } from "./form/FormInputRadio";
import { FormInputRadioButtonGroup } from "./form/FormInputRadioButtonGroup";
import { FormInputSlider } from "./form/FormInputSlider";
import { TextWithImageOption } from "./ListOption";

export interface BeansFormInputs {
  name: string | null;
  roaster: string | null;
  roastDate: Date | null;
  roastStyle: RoastStyle | null;
  roastLevel: number | null;
  roastingNotes: string[];

  origin: "single-origin" | "blend";
  country: string | null;
  region: string | null;
  farmer: string | null;
  altitude: number | null;
  process: string | null;
  varietals: string[];
  harvestDate: Date | null;

  isFinished?: boolean;
}

export const beansFormEmptyValues: BeansFormInputs = {
  name: null,
  roaster: null,
  isFinished: false,
  roastDate: null,
  roastingNotes: [],
  roastStyle: null,
  roastLevel: null,
  origin: "single-origin",
  country: null,
  farmer: null,
  region: null,
  process: null,
  varietals: [],
  harvestDate: null,
  altitude: null,
  // freezeDate: null,
  // thawDate: null,
};

interface BeansFormProps {
  defaultValues: BeansFormInputs;
  title: string;
  buttonLabel: string;
  mutation: any;
}

export const BeansForm: React.FC<BeansFormProps> = ({
  defaultValues,
  title,
  buttonLabel,
  mutation,
}) => {
  const navigate = useNavigate();

  const methods = useForm<BeansFormInputs>({
    defaultValues,
  });
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = methods;

  const onSubmit: SubmitHandler<BeansFormInputs> = async (data) => {
    mutation.mutate(data);
  };

  return (
    <div>
      <h1 tw="text-3xl font-bold tracking-tight text-gray-900">{title}</h1>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
          tw="mt-6 space-y-6"
        >
          <FormSection
            title="Roast information"
            subtitle="This section is about things that were decided on the roaster's end."
          >
            <FormInput
              label="Name *"
              id="name"
              inputProps={{
                ...register("name", {
                  required: "Please enter a name for your beans",
                }),
                type: "text",
                autoFocus: true,
                placeholder: "Kilimanjaro",
              }}
              error={errors.name?.message}
            />

            <FormInput
              label="Roaster *"
              id="roaster"
              inputProps={{
                ...register("roaster", {
                  required: "Please enter your password",
                }),
                type: "text",
                placeholder: "Square Mile",
              }}
              error={errors.roaster?.message}
            />

            <FormInputDate
              label="Roast date"
              id="roastDate"
              placeholder="Select roast date"
            />

            <FormInputRadio
              id="roastStyle"
              label="Roast profile"
              inputProps={{ ...register("roastStyle") }}
              options={[
                { value: "filter", label: "Filter" },
                { value: "espresso", label: "Espresso" },
                { value: "omni-roast", label: "Omni-roast" },
              ]}
            />

            <FormInputSlider
              label="Roast level"
              id="roastLevel"
              min={0}
              max={4}
              step={1}
              overrideLabels={["Light", "Medium", "Dark"]}
              hideThumbMarker={true}
            />

            <FormComboboxMulti
              label="Roasting notes"
              name="roastingNotes"
              options={notesToOptions(tastingNotes).map((note) => note.label)} // TODO see if we can have groups
              placeholder="Search notes..."
            />
          </FormSection>

          <Divider tw="hidden sm:block" />

          <FormSection
            title="Terroir"
            subtitle="This section is about where the beans came from."
          >
            <FormInputRadioButtonGroup
              label="Origin"
              name="origin"
              options={[
                { label: "Singe origin", value: "single-origin" },
                { label: "Blend", value: "blend" },
              ]}
              variant="secondary"
            />

            <FormComboboxSingle
              name="country"
              label="Country"
              options={countries.map(({ name }) => name)}
              placeholder="Ethiopia"
              renderOption={(country) => (
                <TextWithImageOption
                  text={country}
                  Image={<CountryOptionFlag country={country} />}
                />
              )}
            />

            <FormComboboxSingle
              label="Process"
              name="process"
              options={processes}
              placeholder="Red honey"
            />

            <FormComboboxMulti
              label="Varietal(s)"
              name="varietals"
              options={varietals}
              placeholder="Search variety..."
            />

            <FormInput
              label="Farmer"
              id="farmer"
              inputProps={{
                ...register("farmer"),
                type: "text",
                placeholder: "Cooperativa lollanza",
              }}
            />

            <FormInput
              label="Region"
              id="region"
              inputProps={{
                ...register("region"),
                type: "text",
                placeholder: "Huila",
              }}
            />

            <FormInput
              label="Altitude (masl)"
              id="altitude"
              inputProps={{
                ...register("altitude", { valueAsNumber: true }),
                type: "number",
                placeholder: "1200",
              }}
            />

            <FormInputMonthYear
              label="Harvest date"
              id="harvestDate"
              placeholder="Select harvest date"
            />
          </FormSection>

          <div className="flex justify-end gap-4">
            <Button variant="white" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={mutation.isLoading}
            >
              {buttonLabel}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
