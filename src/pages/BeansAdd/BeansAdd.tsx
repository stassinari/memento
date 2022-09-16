import { useFirestoreCollectionMutation } from "@react-query-firebase/firestore";
import { collection } from "firebase/firestore";
import { useAtom } from "jotai";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "twin.macro";
import { Button } from "../../components/Button";
import { FormComboboxMulti } from "../../components/form/FormComboboxMulti";
import { FormComboboxSingle } from "../../components/form/FormComboboxSingle";
import { FormInput } from "../../components/form/FormInput";
import { FormInputDate } from "../../components/form/FormInputDate";
import { FormInputMonthYear } from "../../components/form/FormInputMonthYear";
import { FormInputRadio } from "../../components/form/FormInputRadio";
import { FormInputRadioCard } from "../../components/form/FormInputRadioCard";
import { FormInputSlider } from "../../components/form/FormInputSlider";
import { TextWithImageOption } from "../../components/ListOption";
import countries from "../../data/countries";
import { processes } from "../../data/processes";
import { notesToOptions, tastingNotes } from "../../data/tasting-notes";
import { varietals } from "../../data/varietals";
import { db } from "../../firebaseConfig";
import { userAtom } from "../../hooks/useInitUser";
import { RoastStyle } from "../../types/beans";
import { CountryOptionFlag } from "./CountryOptionFlag";

export type BeansAddInputs = {
  name: string;
  roaster: string;
  roastDate: Date | null;
  roastStyle: RoastStyle | null;
  roastLevel: number | null;
  roastingNotes: string[];
  country: string | null;
  process: string | null;
  farmer: string | null;
  origin: "single-origin" | "blend";
  region: string | null;
  altitude: number | null;
  varietals: string[];
  harvestDate: Date | null;
  isFinished?: boolean;
};

export const emptyValues: BeansAddInputs = {
  name: "",
  isFinished: false,
  roaster: "",
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

export const BeansAdd: React.FC = () => {
  const [user] = useAtom(userAtom);

  const navigate = useNavigate();

  const methods = useForm<BeansAddInputs>({ defaultValues: emptyValues });
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = methods;

  const beansRef = collection(db, "users", user?.uid || "lol", "beans");
  const mutation = useFirestoreCollectionMutation(beansRef, {
    onSuccess(data) {
      console.log("new document with ID: ", data.id);
      navigate(`/beans/${data.id}`);
    },
  });

  const onSubmit: SubmitHandler<BeansAddInputs> = async (data) => {
    mutation.mutate(data);
  };

  return (
    <div>
      adding beanz
      {/* Consider creating reusable components rather than relying on this Provider */}
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
          tw="space-y-6"
        >
          <FormInput
            label="Name"
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
            label="Roaster"
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

          <FormInputRadioCard
            label="Origin"
            name="origin"
            options={[
              { label: "Singe origin", value: "single-origin" },
              { label: "Blend", value: "blend" },
            ]}
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

          <Button variant="primary" type="submit" disabled={mutation.isLoading}>
            Add
          </Button>
        </form>
      </FormProvider>
    </div>
  );
};

export default BeansAdd;
