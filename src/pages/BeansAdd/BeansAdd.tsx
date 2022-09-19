import { useFirestoreCollectionMutation } from "@react-query-firebase/firestore";
import { collection } from "firebase/firestore";
import { useAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import "twin.macro";
import { BeansForm } from "../../components/BeansForm";
import { db } from "../../firebaseConfig";
import { userAtom } from "../../hooks/useInitUser";
import { RoastStyle } from "../../types/beans";

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

  const beansRef = collection(db, "users", user?.uid || "lol", "beans");
  const mutation = useFirestoreCollectionMutation(beansRef, {
    onSuccess(data) {
      console.log("new document with ID: ", data.id);
      navigate(`/beans/${data.id}`);
    },
  });

  return (
    <BeansForm
      defaultValues={emptyValues}
      title="Add beans"
      buttonLabel="Add"
      mutation={mutation}
    />
  );
};

export default BeansAdd;
