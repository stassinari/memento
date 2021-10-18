import React, { FunctionComponent } from "react";
import { useHistory } from "react-router-dom";
import { useFirestore, useFirestoreCollectionData, useUser } from "reactfire";
import EspressoForm, {
  emptyValues,
} from "../components/espresso/espresso-form";
import Layout from "../components/layout";
import PageProgress from "../components/page-progress";
import { addEspresso } from "../database/queries";
import { Beans } from "../database/types/beans";
import { Espresso, EspressoPrep } from "../database/types/espresso";
import { SUGGESTIONS_HISTORY_LIMIT } from "../utils/form";

interface Props {
  update: boolean;
  clone: boolean;
}

const EspressoAdd: FunctionComponent<Props> = ({ update, clone }) => {
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

  const { status: beansListStatus, data: beans } =
    useFirestoreCollectionData<Beans>(beansListQuery, {
      idField: "id",
    });

  const espressoQuery = useFirestore()
    .collection("users")
    .doc(userId)
    .collection("espresso")
    .orderBy("date", "desc")
    .limit(SUGGESTIONS_HISTORY_LIMIT);
  const { status: espressoListStatus, data: espressos } =
    useFirestoreCollectionData<Espresso>(espressoQuery, {
      idField: "id",
    });

  const title = "Add espresso";
  if (espressoListStatus === "loading" || beansListStatus === "loading") {
    return (
      <>
        <PageProgress />
        <Layout title={title}></Layout>
      </>
    );
  }

  // cherrypick the values of the equipment
  const latestEspresso =
    espressos.filter((e) => !e.partial).length !== 0
      ? (espressos[0] as EspressoPrep)
      : emptyValues;
  const newValues: EspressoPrep = {
    ...emptyValues,
    beans: beans.length === 1 ? beans[0] : null, // autoselect beans if only one bean bag is present
    machine: latestEspresso.machine
      ? latestEspresso.machine
      : emptyValues.machine,
    grinder: latestEspresso.grinder
      ? latestEspresso.grinder
      : emptyValues.grinder,
    grinderBurrs: latestEspresso.grinderBurrs
      ? latestEspresso.grinderBurrs
      : emptyValues.grinderBurrs,
    portafilter: latestEspresso.portafilter
      ? latestEspresso.portafilter
      : emptyValues.portafilter,
    basket: latestEspresso.basket ? latestEspresso.basket : emptyValues.basket,
  };

  return (
    <Layout title={title}>
      <EspressoForm
        espressos={espressos}
        beans={beans}
        initialValues={newValues}
        initialErrors={{ beans: "lol" }}
        handleSubmit={(values: EspressoPrep) =>
          addEspresso(firestore, userId, values).then((espressoRef) =>
            history.push(`/espresso/${espressoRef.id}/outcome?success=true`)
          )
        }
      />
    </Layout>
  );
};

export default EspressoAdd;
