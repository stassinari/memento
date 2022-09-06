import { useFirestoreCollectionMutation } from "@react-query-firebase/firestore";
import { collection } from "firebase/firestore";
import { useAtom } from "jotai";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "twin.macro";
import { Button } from "../components/Button";
import { FormInput } from "../components/form/FormInput";
import { db } from "../firebaseConfig";
import { userAtom } from "../hooks/useInitUser";
import { Beans } from "../types/beans";

type BeansAddInputs = {
  name: string;
  roaster: string;
  isFinished?: boolean;
};

export const emptyValues: Beans = {
  name: "",
  isFinished: false,
  roaster: "",
  roastDate: null,
  roastingNotes: [],
  roastLevel: null,
  roastStyle: null,
  origin: "single-origin",
  country: null,
  farmer: "",
  region: "",
  process: "",
  varietals: [],
  harvestDate: null,
  altitude: "",
  freezeDate: null,
  thawDate: null,
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

  const onSubmit: SubmitHandler<BeansAddInputs> = async ({ name, roaster }) => {
    console.log({ name, roaster });
    mutation.mutate({ ...emptyValues, name, roaster });
  };

  return (
    <div>
      adding beanz
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
            ...register("roaster", { required: "Please enter your password" }),
            type: "text",
            placeholder: "Square Mile",
          }}
          error={errors.roaster?.message}
        />

        <Button variant="primary" type="submit" disabled={mutation.isLoading}>
          Log in
        </Button>
      </form>
    </div>
  );
};
