import { setDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import {
  BrewForm,
  brewFormEmptyValues,
  BrewFormInputs,
} from "../../components/brews/BrewForm";
import { useFirestoreDetails } from "../../hooks/firestore/useFirestoreDetails";
import { useNewRef } from "../../hooks/firestore/useNewBeansRef";
import { Brew } from "../../types/brews";
import { brewToFirestore } from "./BrewsAdd";

export const BrewClone = () => {
  const { brewId } = useParams();
  const navigate = useNavigate();

  const { details: brew } = useFirestoreDetails<Brew>("brews", brewId);

  const newBrewRef = useNewRef("brews");

  const addBrew = async (data: BrewFormInputs) => {
    await setDoc(newBrewRef, brewToFirestore(data));
    navigate(`/drinks/brews/${newBrewRef.id}`);
  };

  if (!brew) {
    return null;
  }

  // TODO find an automated way to do this
  const fromFirestore: BrewFormInputs = {
    ...brewFormEmptyValues(),
    method: brew.method,
    beans: brew.beans.path,

    grinder: brew.grinder,
    grinderBurrs: brew.grinderBurrs,
    waterType: brew.waterType,
    filterType: brew.filterType,

    waterWeight: brew.waterWeight,
    beansWeight: brew.beansWeight,
    waterTemperature: brew.waterTemperature,
    grindSetting: brew.grindSetting,
  };

  return (
    <BrewForm
      defaultValues={fromFirestore}
      title="Clone brew"
      buttonLabel="Clone"
      mutation={addBrew}
    />
  );
};
