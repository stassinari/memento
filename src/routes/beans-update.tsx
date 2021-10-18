import React, { FunctionComponent } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useFirestore, useFirestoreDocData, useUser } from "reactfire";
import BeansForm, { emptyValues } from "../components/beans/beans-form";
import Layout from "../components/layout";
import PageProgress from "../components/page-progress";
import { addBeans, updateBeans } from "../database/queries";
import { Beans } from "../database/types/beans";
import { toDate } from "../utils/dates";

interface RouteParams {
  id: string;
}

interface Props {
  update: boolean;
  clone: boolean;
}

const BeansUpdate: FunctionComponent<Props> = ({ update, clone }) => {
  const {
    data: { uid: userId },
  } = useUser();

  const history = useHistory();
  const firestore = useFirestore();

  const params = useParams<RouteParams>();
  const beansId = params.id;

  // get beans by ID - empty if add, non-empty if update | clone
  const beansRef = firestore
    .collection("users")
    .doc(userId)
    .collection("beans")
    .doc(beansId);

  const { status, data: beans } = useFirestoreDocData<Beans>(beansRef);

  const title = `${update ? "Update" : "Add"} beans`;

  if (status === "loading") {
    return (
      <>
        <PageProgress />
        <Layout title={title}></Layout>
      </>
    );
  }

  if (status === "error" || !beans.name) {
    // FIXME revisit this, look into Suspense?
    history.push("/404");
    return null;
  }

  // merge with emptyValues (precedence to FS values first)
  let newValues = { ...emptyValues, ...beans };
  if (update) {
    // convert FS Timestamp to Date
    newValues.roastDate = newValues.roastDate
      ? toDate(newValues.roastDate)
      : null;
    newValues.freezeDate = newValues.freezeDate
      ? toDate(newValues.freezeDate)
      : null;
    newValues.thawDate = newValues.thawDate ? toDate(newValues.thawDate) : null;
  } else if (clone) {
    newValues.roastDate = null;
    newValues.freezeDate = null;
    newValues.thawDate = null;
    newValues.isFinished = false;
  }
  newValues.harvestDate = newValues.harvestDate
    ? toDate(newValues.harvestDate)
    : null;

  return (
    <Layout title={title}>
      <BeansForm
        initialValues={newValues}
        update={update}
        handleSubmit={
          update
            ? (values: Beans) =>
                updateBeans(firestore, userId, values, beansId).then(() =>
                  history.push(`/beans/${beansId}`)
                )
            : (values: Beans) =>
                addBeans(firestore, userId, values).then((ref) =>
                  history.push(`/beans/${ref.id}`)
                )
        }
      />
    </Layout>
  );
};

export default BeansUpdate;
