import { useFirestoreCollectionMutation } from "@react-query-firebase/firestore";
import { collection } from "firebase/firestore";
import { useAtom } from "jotai";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { FormInput } from "../components/form/FormInput";
import { FormInputDate } from "../components/form/FormInputDate";
import { FormInputMonthYear } from "../components/form/FormInputMonthYear";
import { FormRadio } from "../components/form/FormRadio";
import { db } from "../firebaseConfig";
import { userAtom } from "../hooks/useInitUser";
import { RoastStyle } from "../types/beans";

export type BeansAddInputs = {
  name: string;
  roaster: string;
  roastDate: Date | null;
  roastStyle: RoastStyle | null;
  harvestDate: Date | null;
  isFinished?: boolean;
};

export const emptyValues: BeansAddInputs = {
  name: "",
  isFinished: false,
  roaster: "",
  roastDate: null,
  // roastingNotes: [],
  // roastLevel: null,
  roastStyle: null,
  // origin: "single-origin",
  // country: null,
  // farmer: "",
  // region: "",
  // process: "",
  // varietals: [],
  harvestDate: null,
  // altitude: "",
  // freezeDate: null,
  // thawDate: null,
};

export const BeansAdd = () => {
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
    // const newData = { ...data, roastDate: Date.parse(data.roastDate || "") };
    console.log(data);
    // mutation.mutate({ ...emptyValues, ...data }); // fix this, add a hidden isFinished field I guess
  };

  return (
    <div>
      adding beanz
      {/* Consider creating reusable components rather than relying on this Provider */}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} tw="space-y-6">
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

          <FormRadio
            id="roastStyle"
            label="Roast profile"
            inputProps={{ ...register("roastStyle") }}
            options={[
              { value: "filter", label: "Filter" },
              { value: "espresso", label: "Espresso" },
              { value: "omni-roast", label: "Omni-roast" },
            ]}
            // helperText="This is a helper text lol"
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
