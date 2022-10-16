import { setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "twin.macro";
import {
  BeansForm,
  beansFormEmptyValues,
  BeansFormInputs,
} from "../../components/beans/BeansForm";
import { useNewRef } from "../../hooks/firestore/useNewBeansRef";

export const BeansAdd: React.FC = () => {
  const navigate = useNavigate();
  const newBeansRef = useNewRef("beans");

  const addBeans = async (data: BeansFormInputs) => {
    await setDoc(newBeansRef, data);
    navigate(`/beans/${newBeansRef.id}`);
  };

  return (
    <BeansForm
      defaultValues={beansFormEmptyValues}
      title="Add beans"
      buttonLabel="Add"
      mutation={addBeans}
      showStorageSection={false}
    />
  );
};

export default BeansAdd;
