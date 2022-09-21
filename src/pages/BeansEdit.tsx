import { useFirestoreDocumentMutation } from "@react-query-firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { BeansForm, BeansFormInputs } from "../components/BeansForm";
import { useBeansDetails } from "../hooks/firestore/useBeansDetails";

export const BeansEdit = () => {
  const { beansId } = useParams();

  const navigate = useNavigate();

  const { beans, docRef } = useBeansDetails(beansId);

  const mutation = useFirestoreDocumentMutation(
    docRef,
    {},
    {
      onSuccess() {
        navigate(`/beans/${beansId}`);
      },
    }
  );

  if (!beans) {
    return null;
  }

  // TODO find an automated way to do this
  const fromFirestore: BeansFormInputs = {
    ...beans,
    roastDate: beans.roastDate?.toDate() || null,
    harvestDate: beans.harvestDate?.toDate() || null,
  };

  return (
    <BeansForm
      defaultValues={fromFirestore}
      title="Edit beans"
      buttonLabel="Edit"
      mutation={mutation}
    />
  );
};
