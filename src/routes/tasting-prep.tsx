import React from "react";
import { useHistory, useParams } from "react-router-dom";
import { Typography } from "@material-ui/core";

import Layout from "../components/layout";
import { updateTastingSamples } from "../database/queries";
import PageProgress from "../components/page-progress";

import { SUGGESTIONS_HISTORY_LIMIT } from "../utils/form";
import { TastingPrepForm } from "../components/tastings/tasting-prep-form";
import {
  useUser,
  useFirestore,
  useFirestoreCollectionData,
  useFirestoreDocData,
} from "reactfire";

interface RouteParams {
  id: string;
}

const emptyValues = {
  method: "",
  beans: null,
  waterWeight: "",
  beansWeight: "",
  waterTemperature: "",
  grinder: "",
  grindSetting: "",
  waterType: "",
  filterType: "",
  timeMinutes: "",
  timeSeconds: "",
};

const TastingPrep = () => {
  const {
    data: { uid: userId },
  } = useUser();
  const firestore = useFirestore();
  const history = useHistory();

  const params = useParams<RouteParams>();
  const tastingId = params.id;

  const tastingRef = firestore
    .collection("users")
    .doc(userId)
    .collection("tastings")
    .doc(tastingId);
  const { status: tastingStatus, data: tasting } =
    useFirestoreDocData<Tasting>(tastingRef);

  const brewsQuery = useFirestore()
    .collection("users")
    .doc(userId)
    .collection("brews")
    .orderBy("date", "desc")
    .limit(SUGGESTIONS_HISTORY_LIMIT);
  const { status: brewsStatus, data: brews } = useFirestoreCollectionData<Brew>(
    brewsQuery,
    {
      idField: "id",
    }
  );

  const beansQuery = useFirestore()
    .collection("users")
    .doc(userId)
    .collection("beans")
    .orderBy("roastDate", "desc")
    .where("isFinished", "==", false);
  const { status: beansStatus, data: beans } =
    useFirestoreCollectionData<Beans>(beansQuery, {
      idField: "id",
    });

  const handleSubmit = (values: TastingPrep) => {
    // create all tasting samples
    const samples = tasting?.samples.map((s) => ({
      ...s,
      prep: values,
    }));
    updateTastingSamples(firestore, userId, tastingId, samples!).then(() => {
      history.push(`/tastings/${tastingId}/ratings`);
    });
  };

  const title = "Tasting template";

  if (
    tastingStatus === "loading" ||
    brewsStatus === "loading" ||
    beansStatus === "loading"
  ) {
    return (
      <>
        <PageProgress />
        <Layout title={title}></Layout>
      </>
    );
  }

  if (tasting.prepDone) history.push(`/tastings/${tastingId}/ratings`);

  return (
    <Layout title="Tasting template">
      <Typography variant="h5" component="h1" gutterBottom>
        Step 2: common details (optional)
      </Typography>
      <Typography variant="subtitle1">
        Fill up details that are common to all samples.
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Note: you can skip this step, or change anything later on.
      </Typography>

      <TastingPrepForm
        handleSubmit={handleSubmit}
        initialValues={emptyValues}
        tastingVariable={tasting?.variable!}
        brews={brews}
        beans={beans}
        submitButtonLabel="Next"
      />
    </Layout>
  );
};

export default TastingPrep;
