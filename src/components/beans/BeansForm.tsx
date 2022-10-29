import { orderBy } from "firebase/firestore";
import React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "twin.macro";
import { theme } from "twin.macro";
import countries from "../../data/countries";
import { processes } from "../../data/processes";
import { notesToOptions, tastingNotes } from "../../data/tasting-notes";
import { varietals } from "../../data/varietals";
import { useFirestoreList } from "../../hooks/firestore/useFirestoreList";
import useMediaQuery from "../../hooks/useMediaQuery";
import { Beans, BeansBlendPart, RoastStyle } from "../../types/beans";
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
import { extractSuggestions } from "../form/FormSuggestions";
import { TextWithImageOption } from "../ListOption";
import { BeansBlendForm, blendEmptyValues } from "./BeansBlendForm";
import { CountryOptionFlag } from "./CountryOptionFlag";

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

  blend: BeansBlendPart[];

  freezeDate: Date | null;
  thawDate: Date | null;

  isFinished?: boolean;
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

  origin: "single-origin",

  ...singleOriginEmptyValues,

  blend: [blendEmptyValues],

  freezeDate: null,
  thawDate: null,

  isFinished: false,
};

interface BeansFormProps {
  defaultValues: BeansFormInputs;
  title: string;
  buttonLabel: string;
  mutation: (data: BeansFormInputs) => Promise<void>;
  showStorageSection?: boolean;
}

export const BeansForm: React.FC<BeansFormProps> = ({
  defaultValues,
  title,
  buttonLabel,
  mutation,
  showStorageSection = true,
}) => {
  const navigate = useNavigate();

  const { list: beansList, isLoading } = useFirestoreList<Beans>("beans", [
    orderBy("roastDate", "desc"),
  ]);

  const isSm = useMediaQuery(`(min-width: ${theme`screens.sm`})`);

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
      data = { ...data, blend: [] };
    }
    mutation(data);
  };

  const isSingleOrigin = watch("origin") === "single-origin";

  if (isLoading) return null;

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
                // autoFocus: true,
                placeholder: "Kilimanjaro",
              }}
              error={errors.name?.message}
            />

            <FormComboboxSingle
              label="Roaster *"
              name="roaster"
              options={[
                ...new Set(beansList.map(({ roaster }) => roaster).sort()),
              ]}
              placeholder="Square mile"
              requiredMsg="Please select a roaster"
              error={errors.roaster?.message}
              suggestions={extractSuggestions(beansList, "roaster")}
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

          <Divider tw="hidden sm:block" />

          {showStorageSection && (
            <React.Fragment>
              <FormSection
                title="Storage"
                subtitle="In case the beans are frozen or thawed."
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

              <Divider tw="hidden sm:block" />
            </React.Fragment>
          )}

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

            {isSingleOrigin ? (
              <React.Fragment>
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
              </React.Fragment>
            ) : (
              <BeansBlendForm />
            )}
          </FormSection>

          <div className="flex justify-end gap-4">
            <Button variant="white" onClick={() => navigate(-1)}>
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
    </div>
  );
};
