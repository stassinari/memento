import React, { FunctionComponent } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  useFirestore,
  useFirestoreCollectionData,
  useFirestoreDocData,
  useUser,
} from "reactfire";
import BrewForm, { emptyValues } from "../components/brew/brew-form";
import Layout from "../components/layout";
import PageProgress from "../components/page-progress";
import { addBrew, updateBrew } from "../database/queries";
import { Beans } from "../database/types/beans";
import { Brew, BrewPrep } from "../database/types/brew";
import { toDate } from "../utils/dates";
import { SUGGESTIONS_HISTORY_LIMIT } from "../utils/form";

interface RouteParams {
  id: string;
}

interface Props {
  update: boolean;
  clone: boolean;
}

const BrewUpdate: FunctionComponent<Props> = ({ update, clone }) => {
  const {
    data: { uid: userId },
  } = useUser();
  const history = useHistory();
  const firestore = useFirestore();

  const params = useParams<RouteParams>();
  const brewId = params.id;

  const brewRef = firestore
    .collection("users")
    .doc(userId)
    .collection("brews")
    .doc(brewId);
  const { status: brewStatus, data: brew } =
    useFirestoreDocData<BrewPrep>(brewRef);

  const brewsListQuery = useFirestore()
    .collection("users")
    .doc(userId)
    .collection("brews")
    .orderBy("date", "desc")
    .limit(SUGGESTIONS_HISTORY_LIMIT);
  const { status: brewsListStatus, data: brewsList } =
    useFirestoreCollectionData<Brew>(brewsListQuery, {
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

  const title = `${update ? "Update" : "Add"} brew`;

  if (
    brewStatus === "loading" ||
    brewsListStatus === "loading" ||
    beansListStatus === "loading"
  ) {
    return (
      <>
        <PageProgress />
        <Layout title={title}></Layout>
      </>
    );
  }

  // merge with emptyValues (precedence to FS values first)
  let newValues = { ...emptyValues, ...brew };
  if (update) {
    // convert FS Timestamp to Date
    newValues.date = toDate(newValues.date);
  } else if (clone) {
    // cherrypick the values that carry over for a new "clone" brew
    newValues = {
      ...emptyValues,
      beans: brew.beans,
      beansWeight: brew.beansWeight,
      date: new Date(),
      filterType: brew.filterType,
      grindSetting: brew.grindSetting,
      grinder: brew.grinder,
      grinderBurrs: brew.grinderBurrs,
      method: brew.method,
      waterTemperature: brew.waterTemperature,
      waterType: brew.waterType,
      waterWeight: brew.waterWeight,
    };
  }

  return (
    <Layout title={title}>
      <BrewForm
        brews={brewsList}
        beans={beans}
        initialValues={newValues}
        update={update}
        handleSubmit={
          update
            ? (values: BrewPrep) => {
                updateBrew(firestore, userId, values, params.id).then(() =>
                  history.push(`/brews/${brewId}`)
                );
              }
            : (values: BrewPrep) =>
                addBrew(firestore, userId, values).then((brewRef) =>
                  history.push(`/brews/${brewRef.id}/outcome?success=true`)
                )
        }
      />
    </Layout>
  );
};

export default BrewUpdate;
