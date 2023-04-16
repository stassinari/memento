import { doc, orderBy, setDoc } from "firebase/firestore";
import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "twin.macro";
import {
  DecentEspressoForm,
  DecentEspressoFormInputs,
} from "../../components/espresso/steps/DecentEspressoForm";
import { db } from "../../firebaseConfig";
import { useCollectionQuery } from "../../hooks/firestore/useCollectionQuery";
import { useFirestoreCollectionOneTime } from "../../hooks/firestore/useFirestoreCollectionOneTime";
import { useFirestoreDoc } from "../../hooks/firestore/useFirestoreDoc";
import { useCurrentUser } from "../../hooks/useInitUser";
import { DecentEspresso, Espresso } from "../../types/espresso";

export const decentEspressoToFirestore = (
  espresso: DecentEspressoFormInputs
) => ({
  ...espresso,
  beans: doc(db, espresso.beans ?? ""),
});

export const DecentEspressoEditDetails = () => {
  console.log("DecentEspressoEditDetails");

  const user = useCurrentUser();
  const { espressoId } = useParams();

  const navigate = useNavigate();

  const { details: decentEspresso, isLoading } =
    useFirestoreDoc<DecentEspresso>("espresso", espressoId);

  const filters = useMemo(() => [orderBy("date", "desc")], []);
  const query = useCollectionQuery<Espresso>("espresso", filters);
  const { list: espressoList, isLoading: areEspressoLoading } =
    useFirestoreCollectionOneTime(query);

  if (!user) throw new Error("User is not logged in.");

  if (isLoading || areEspressoLoading) return null;

  if (!espressoId || !decentEspresso || !decentEspresso.beans) {
    throw new Error("Espresso does not exist.");
  }

  const existingEspressoRef = doc(
    db,
    "users",
    user.uid,
    "espresso",
    espressoId
  );

  const editDecentEspresso = async (data: DecentEspressoFormInputs) => {
    await setDoc(existingEspressoRef, decentEspressoToFirestore(data));
    navigate(`/drinks/espresso/${espressoId}`);
  };

  // TODO find an automated way to do this
  const fromFirestore: DecentEspressoFormInputs = {
    ...decentEspresso,
    targetWeight: decentEspresso.targetWeight ?? null,
    beansWeight: decentEspresso.beansWeight ?? null,
    date: decentEspresso.date.toDate(),
    beans: decentEspresso.beans.path,
  };

  return (
    <React.Fragment>
      <h1 tw="text-3xl font-bold tracking-tight text-gray-900">
        Edit Decent shot details
      </h1>
      <DecentEspressoForm
        defaultValues={fromFirestore}
        espressoList={espressoList}
        mutation={editDecentEspresso}
        backLink={`/drinks/espresso/${espressoId}`}
      />
    </React.Fragment>
  );
};
