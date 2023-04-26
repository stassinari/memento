import { setDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import {
  EspressoForm,
  EspressoFormInputs,
  espressoFormEmptyValues,
} from "../../components/espresso/EspressoForm";
import { useDocRef } from "../../hooks/firestore/useDocRef";
import { useFirestoreDocOneTime } from "../../hooks/firestore/useFirestoreDocOneTime";
import { useNewRef } from "../../hooks/firestore/useNewBeansRef";
import { BaseEspresso } from "../../types/espresso";
import { espressoToFirestore } from "./EspressoAdd";

export const EspressoClone = () => {
  const { espressoId } = useParams();
  const navigate = useNavigate();

  const docRef = useDocRef<BaseEspresso>("espresso", espressoId);
  const { details: espresso } = useFirestoreDocOneTime<BaseEspresso>(docRef);

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
    beans: espresso.beans?.path ?? null,

    machine: espresso.machine,
    grinder: espresso.grinder,
    grinderBurrs: espresso.grinderBurrs,
    portafilter: espresso.portafilter,
    basket: espresso.basket,

    targetWeight: espresso.targetWeight ?? null,
    beansWeight: espresso.beansWeight ?? null,
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
