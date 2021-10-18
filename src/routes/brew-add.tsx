import React, { FunctionComponent } from "react";
import { useHistory } from "react-router-dom";
import { useFirestore, useFirestoreCollectionData, useUser } from "reactfire";
import BrewForm, { emptyValues } from "../components/brew/brew-form";
import Layout from "../components/layout";
import PageProgress from "../components/page-progress";
import { addBrew } from "../database/queries";
import { Beans } from "../database/types/beans";
import { Brew, BrewPrep } from "../database/types/brew";
import { SUGGESTIONS_HISTORY_LIMIT } from "../utils/form";

const BrewAdd: FunctionComponent = () => {
  const {
    data: { uid: userId },
  } = useUser();
  const history = useHistory();
  const firestore = useFirestore();

  const beansListQuery = useFirestore()
    .collection("users")
    .doc(userId)
    .collection("beans")
    .orderBy("roastDate", "desc")
    .where("isFinished", "==", false);
  const { status: beansStatus, data: beans } =
    useFirestoreCollectionData<Beans>(beansListQuery, {
      idField: "id",
    });

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

  const title = "Add brew";

  if (brewsStatus === "loading" || beansStatus === "loading") {
    return (
      <>
        <PageProgress />
        <Layout title={title}></Layout>
      </>
    );
  }

  // cherrypick the values of the equipment
  const latestBrew =
    brews.length !== 0 ? (brews[0] as Brew) : (emptyValues as Brew);
  const newValues: BrewPrep = {
    ...emptyValues,
    beans: beans.length === 1 ? beans[0] : null, // autoselect beans if only one bean bag is present
    filterType: latestBrew.filterType,
    grinder: latestBrew.grinder,
    grinderBurrs: latestBrew.grinderBurrs,
    waterType: latestBrew.waterType,
  };

  return (
    <Layout title={title}>
      <BrewForm
        brews={brews}
        beans={beans}
        initialValues={newValues}
        initialErrors={{ beans: "lol" }}
        handleSubmit={(values: BrewPrep) =>
          addBrew(firestore, userId, values).then((brewRef) =>
            history.push(`/brews/${brewRef.id}/outcome?success=true`)
          )
        }
      />
    </Layout>
  );
};

export default BrewAdd;
