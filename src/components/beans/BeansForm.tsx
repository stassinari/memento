import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import countries from "~/data/countries";
import { processes } from "~/data/processes";
import { notesToOptions, tastingNotes } from "~/data/tasting-notes";
import { varietals } from "~/data/varietals";
import { getBeansUniqueRoasters } from "~/db/queries";
import { BeanOrigin, BeansBlendPart, RoastStyle } from "~/db/schema";
import { userAtom } from "~/hooks/useInitUser";
import useScreenMediaQuery from "~/hooks/useScreenMediaQuery";
import { Button } from "../Button";
import { Divider } from "../Divider";
import { FormSection } from "../Form";
import { FormComboboxMulti } from "../form/FormComboboxMulti";
import { FormComboboxSingle } from "../form/FormComboboxSingle";
import { FormInput } from "../form/FormInput";
import { FormInputDate } from "../form/FormInputDate";
import { FormInputMonthYear } from "../form/FormInputMonthYear";
import { FormInputRadio } from "../form/FormInputRadio";
import { FormInputRadioButtonGroup } from "../form/FormInputRadioButtonGroup";
import { FormInputSlider } from "../form/FormInputSlider";
import { TextWithImageOption } from "../form/ListOption";
import { BeansBlendForm, blendEmptyValues } from "./BeansBlendForm";
import { CountryOptionFlag } from "./CountryOptionFlag";

export interface BeansFormInputs {
  name: string | null;
  roaster: string | null;
  roastDate: Date | null;
  roastStyle: RoastStyle | null;
  roastLevel: number | null;
  roastingNotes: string[];

  origin: BeanOrigin;

  country: string | null;
  region: string | null;
  farmer: string | null;
  altitude: number | null;
  process: string | null;
  varietals: string[];
  harvestDate: Date | null;

  blendParts: BeansBlendPart[] | null;

  freezeDate: Date | null;
  thawDate: Date | null;

  isArchived?: boolean;
}

const singleOriginEmptyValues = {
  country: null,
  farmer: null,
  region: null,
  process: null,
  varietals: [],
  harvestDate: null,
  altitude: null,
};

export const beansFormEmptyValues: BeansFormInputs = {
  name: null,
  roaster: null,
  roastDate: null,
  roastStyle: null,
  roastLevel: null,
  roastingNotes: [],

  origin: BeanOrigin.SingleOrigin,

  ...singleOriginEmptyValues,

  blendParts: [blendEmptyValues],

  freezeDate: null,
  thawDate: null,

  isArchived: false,
};

interface BeansFormProps {
  defaultValues: BeansFormInputs;
  buttonLabel: string;
  mutation: (data: BeansFormInputs) => void;
  showStorageSection?: boolean;
}

export const BeansForm = ({
  defaultValues,
  buttonLabel,
  mutation,
  showStorageSection = true,
}: BeansFormProps) => {
  console.log("BeansForm");

  const user = useAtomValue(userAtom);

  const { data: uniqueRoasters } = useQuery({
    queryKey: ["bean", "roasters"],
    queryFn: () =>
      getBeansUniqueRoasters({
        data: user?.uid ?? "",
      }),
  });

  const isSm = useScreenMediaQuery("sm");

  const methods = useForm<BeansFormInputs>({
    defaultValues,
  });
  const {
    handleSubmit,
    formState: { errors },
    register,
    watch,
  } = methods;

  const onSubmit: SubmitHandler<BeansFormInputs> = async (data) => {
    if (data.origin === "blend") {
      data = { ...data, ...singleOriginEmptyValues };
    } else {
      data = { ...data, blendParts: [] };
    }
    void mutation(data);
  };

  const isSingleOrigin = watch("origin") === "single-origin";

  if (!uniqueRoasters) return null;

  // get the top 5 most recent roasters (excludes beans with no roast date)
  const roastersSuggestions = [
    ...new Set(
      uniqueRoasters.filter((r) => r.roastDate !== null).map((r) => r.roaster),
    ),
  ].slice(0, 5);

  // get all unique roasters sorted by name
  const roastersList = [
    ...new Set(uniqueRoasters.map((r) => r.roaster)),
  ].sort();

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
        className="mt-6 space-y-6"
      >
        <FormSection
          title="Roast information"
          subtitle="Everything about how the roaster transformed these beans — from the profile they chose to the notes they brought out."
        >
          <FormInput
            label="Name *"
            id="name"
            inputProps={{
              ...register("name", {
                required: "Please enter a name for your beans",
              }),
              type: "text",
              // autoFocus: true,
              placeholder: "Kilimanjaro",
            }}
            error={errors.name?.message}
          />

          <FormComboboxSingle
            label="Roaster *"
            name="roaster"
            options={roastersList}
            placeholder="Square mile"
            requiredMsg="Please select a roaster"
            error={errors.roaster?.message}
            suggestions={roastersSuggestions}
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
            direction={isSm ? "horizontal" : "vertical"}
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

        <Divider className="hidden sm:block" />

        {showStorageSection && (
          <>
            <FormSection
              title="Storage"
              subtitle="For beans that have taken a trip to the freezer and back."
            >
              <FormInputDate
                label="Freeze date"
                id="freezeDate"
                placeholder="Select freeze date"
              />

              <FormInputDate
                label="Thaw date"
                id="thawDate"
                placeholder="Select thaw date"
              />
            </FormSection>

            <Divider className="hidden sm:block" />
          </>
        )}

        <FormSection
          title="Terroir"
          subtitle="Where these beans come from and how they were grown — the story before the roastery."
        >
          <FormInputRadioButtonGroup
            label="Origin"
            name="origin"
            options={[
              { label: "Single origin", value: "single-origin" },
              { label: "Blend", value: "blend" },
            ]}
            variant="secondary"
          />

          {isSingleOrigin ? (
            <>
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
                label="Farmer / producer"
                id="farmer"
                inputProps={{
                  ...register("farmer"),
                  type: "text",
                  placeholder: "Lollanza Cooperative",
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
                  ...register("altitude", {
                    setValueAs: (v: string) => (v === "" ? null : Number(v)),
                  }),
                  type: "number",
                  placeholder: "1200",
                }}
              />
              <FormInputMonthYear
                label="Harvest date"
                id="harvestDate"
                placeholder="Select harvest date"
              />
            </>
          ) : (
            <BeansBlendForm />
          )}
        </FormSection>

        <div className="flex justify-end gap-4">
          <Button
            variant="white"
            onClick={() => {
              window.history.back();
            }}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            colour="accent"
            // disabled={mutation.isLoading} FIXME disabled buttons after first click
          >
            {buttonLabel}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
