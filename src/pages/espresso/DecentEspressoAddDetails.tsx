import { doc, orderBy, updateDoc } from "firebase/firestore";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "twin.macro";
import {
  DecentEspressoForm,
  decentEspressoFormEmptyValues,
  DecentEspressoFormInputs,
} from "../../components/espresso/steps/DecentEspressoForm";
import { db } from "../../firebaseConfig";
import { useFirestoreCollection } from "../../hooks/firestore/useFirestoreCollection";
import { useFirestoreDoc } from "../../hooks/firestore/useFirestoreDoc";
import { useCurrentUser } from "../../hooks/useInitUser";
import { DecentEspressoPrep, Espresso } from "../../types/espresso";

export const decentEspressoToFirestore = (
  espresso: DecentEspressoFormInputs
) => ({
  ...espresso,
  partial: false,
  beans: doc(db, espresso.beans ?? ""),
});

export const DecentEspressoAddDetails = () => {
  const user = useCurrentUser();
  const { espressoId } = useParams();

  const navigate = useNavigate();

  const {
    details: partialEspresso,
    isLoading,
    docRef: existingEspressoRef,
  } = useFirestoreDoc<DecentEspressoPrep>("espresso", espressoId);

  const { list: espressoList, isLoading: areEspressoLoading } =
    useFirestoreCollection<Espresso>("espresso", [orderBy("date", "desc")]);

  if (!user) throw new Error("User is not logged in.");

  if (isLoading || areEspressoLoading) return null;

  if (!espressoId || !partialEspresso) {
    throw new Error("Espresso does not exist.");
  }

  const editDecentEspresso = async (data: DecentEspressoFormInputs) => {
    await updateDoc(existingEspressoRef, decentEspressoToFirestore(data));
    navigate(`/drinks/espresso/${espressoId}`);
  };

  return (
    <React.Fragment>
      <h1 tw="text-3xl font-bold tracking-tight text-gray-900">
        Add Decent shot details
      </h1>
      <DecentEspressoForm
        defaultValues={decentEspressoFormEmptyValues(
          partialEspresso,
          espressoList[0]
        )}
        espressoList={espressoList}
        mutation={editDecentEspresso}
      />
    </React.Fragment>
  );
};
