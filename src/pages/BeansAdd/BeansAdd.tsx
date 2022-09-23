import { collection, doc, setDoc } from "firebase/firestore";
import { useAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import "twin.macro";
import { BeansForm, BeansFormInputs } from "../../components/BeansForm";
import { db } from "../../firebaseConfig";
import { userAtom } from "../../hooks/useInitUser";

export const emptyValues: BeansFormInputs = {
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

  const newBeansRef = doc(collection(db, "users", user?.uid || "lol", "beans"));

  const addBeans = async (data: BeansFormInputs) => {
    await setDoc(newBeansRef, data);
    navigate(`/beans/${newBeansRef.id}`);
  };

  return (
    <BeansForm
      defaultValues={emptyValues}
      title="Add beans"
      buttonLabel="Add"
      mutation={addBeans}
    />
  );
};

export default BeansAdd;
