import { setDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import {
  BeansForm,
  BeansFormInputs,
  beansFormEmptyValues,
} from "../../components/beans/BeansForm";
import { useFirestoreDoc } from "../../hooks/firestore/useFirestoreDoc";
import { useNewRef } from "../../hooks/firestore/useNewBeansRef";
import { Beans } from "../../types/beans";

export const BeansClone = () => {
  const { beansId } = useParams();

  const navigate = useNavigate();

  const { details: beans } = useFirestoreDoc<Beans>("beans", beansId);

  const newBeansRef = useNewRef("beans");

  const addBeans = async (data: BeansFormInputs) => {
    await setDoc(newBeansRef, data);
    navigate(`/beans/${newBeansRef.id}`);
  };

  if (!beans) {
    return null;
  }

  const fromFirestore: BeansFormInputs = {
    ...beansFormEmptyValues,

    name: beans.name,
    roaster: beans.roaster,
    roastDate: beans.roastDate?.toDate() ?? null,
    roastStyle: beans.roastStyle,
    roastLevel: beans.roastLevel,
    roastingNotes: beans.roastingNotes,

    origin: beans.origin,

    ...(beans.origin === "single-origin"
      ? {
          country: beans.country,
          farmer: beans.farmer,
          region: beans.region,
          process: beans.process,
          varietals: beans.varietals,
          harvestDate: beans.harvestDate?.toDate() ?? null,
          altitude: beans.altitude,
        }
      : {
          blend: beans.blend,
        }),
  };

  return (
    <BeansForm
      defaultValues={fromFirestore}
      title="Clone beans"
      buttonLabel="Clone"
      mutation={addBeans}
      showStorageSection={false}
    />
  );
};
