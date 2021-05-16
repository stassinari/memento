import React, { FunctionComponent } from "react";
import { useHistory, useParams } from "react-router-dom";

import { addEspresso, updateEspresso } from "../database/queries";
import { toDate } from "../utils/dates";
import PageProgress from "../components/page-progress";
import Layout from "../components/layout";
import { SUGGESTIONS_HISTORY_LIMIT } from "../utils/form";
import {
  useFirestore,
  useFirestoreCollectionData,
  useFirestoreDocData,
  useUser,
} from "reactfire";
import EspressoForm, {
  emptyValues,
} from "../components/espresso/espresso-form";

interface RouteParams {
  id: string;
}

interface Props {
  update: boolean;
  clone: boolean;
}

const EspressoUpdate: FunctionComponent<Props> = ({ update, clone }) => {
  const {
    data: { uid: userId },
  } = useUser();
  const history = useHistory();
  const firestore = useFirestore();

  const params = useParams<RouteParams>();
  const espressoId = params.id;

  const espressoRef = firestore
    .collection("users")
    .doc(userId)
    .collection("espresso")
    .doc(espressoId);
  const { status: espressoStatus, data: espresso } =
    useFirestoreDocData<EspressoPrep>(espressoRef);

  const espressoListQuery = useFirestore()
    .collection("users")
    .doc(userId)
    .collection("espresso")
    .orderBy("date", "desc")
    .limit(SUGGESTIONS_HISTORY_LIMIT);
  const { status: espressoListStatus, data: espressos } =
    useFirestoreCollectionData<Espresso>(espressoListQuery, {
      idField: "id",
    });

  const beansListQuery = useFirestore()
    .collection("users")
    .doc(userId)
    .collection("beans")
    .orderBy("roastDate", "desc")
    .where("isFinished", "==", false);
  const { status: beansListStatus, data: beans } =
    useFirestoreCollectionData<Beans>(beansListQuery, {
      idField: "id",
    });

  const title = `${update ? "Update" : "Add"} espresso`;

  if (
    espressoStatus === "loading" ||
    espressoListStatus === "loading" ||
    beansListStatus === "loading"
  ) {
    return (
      <>
        <PageProgress />
        <Layout title={title}></Layout>
      </>
    );
  }

  if (espressoStatus === "error" || !espresso.date) {
    // FIXME revisit this, look into Suspense?
    history.push("/404");
    return null;
  }

  // merge with emptyValues (precedence to FS values first)
  let newValues = { ...emptyValues, ...espresso };
  if (update) {
    // convert FS Timestamp to Date
    newValues.date = toDate(newValues.date);
  } else if (clone) {
    // cherrypick the values that carry over for a new "clone" brew
    newValues = {
      ...emptyValues,
      beans: espresso.beans,
      beansWeight: espresso.beansWeight,
      date: new Date(),
      targetWeight: espresso.targetWeight,
      grindSetting: espresso.grindSetting,
      machine: espresso.machine,
      grinder: espresso.grinder,
      grinderBurrs: espresso.grinderBurrs,
      waterTemperature: espresso.waterTemperature,
      portafilter: espresso.portafilter,
      basket: espresso.basket,
    };
  }

  return (
    <Layout title="Add espresso">
      <EspressoForm
        espressos={espressos}
        beans={beans}
        initialValues={newValues}
        update={update}
        handleSubmit={
          update
            ? (values: EspressoPrep) => {
                updateEspresso(firestore, userId, values, espressoId).then(() =>
                  history.push(`/espresso/${espressoId}`)
                );
              }
            : (values: EspressoPrep) =>
                addEspresso(firestore, userId, values).then((espressoRef) =>
                  history.push(
                    `/espresso/${espressoRef.id}/outcome?success=true`
                  )
                )
        }
      />
    </Layout>
  );
};

export default EspressoUpdate;
