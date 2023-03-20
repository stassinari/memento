import { setDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import {
  EspressoForm,
  espressoFormEmptyValues,
  EspressoFormInputs,
} from "../../components/espresso/EspressoForm";
import { useFirestoreDoc } from "../../hooks/firestore/useFirestoreDoc";
import { useNewRef } from "../../hooks/firestore/useNewBeansRef";
import { Espresso } from "../../types/espresso";
import { espressoToFirestore } from "./EspressoAdd";

export const EspressoClone = () => {
  const { espressoId } = useParams();
  const navigate = useNavigate();

  const { details: espresso } = useFirestoreDoc<Espresso>(
    "espresso",
    espressoId
  );

  const newEspressoRef = useNewRef("espresso");

  const addEspresso = async (data: EspressoFormInputs) => {
    await setDoc(newEspressoRef, espressoToFirestore(data));
    navigate(`/drinks/espresso/${newEspressoRef.id}`);
  };

  if (!espresso) {
    return null;
  }

  // TODO find an automated way to do this
  const fromFirestore: EspressoFormInputs = {
    ...espressoFormEmptyValues(),
    beans: espresso.beans.path,

    machine: espresso.machine,
    grinder: espresso.grinder,
    grinderBurrs: espresso.grinderBurrs,
    portafilter: espresso.portafilter,
    basket: espresso.basket,

    targetWeight: espresso.targetWeight,
    beansWeight: espresso.beansWeight,
    waterTemperature: espresso.waterTemperature,
    grindSetting: espresso.grindSetting,
  };

  return (
    <EspressoForm
      defaultValues={fromFirestore}
      title="Clone espresso"
      buttonLabel="Clone"
      mutation={addEspresso}
    />
  );
};
