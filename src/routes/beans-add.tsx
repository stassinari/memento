import React, { FunctionComponent } from "react";
import { useHistory } from "react-router-dom";
import { useFirestore, useUser } from "reactfire";
import BeansForm from "../components/beans/beans-form";
import Layout from "../components/layout";
import { addBeans } from "../database/queries";
import { Beans } from "../database/types/beans";

const BeansAdd: FunctionComponent = () => {
  const {
    data: { uid: userId },
  } = useUser();
  const history = useHistory();
  const firestore = useFirestore();

  return (
    <Layout title="Add beans">
      <BeansForm
        handleSubmit={(values: Beans) => {
          addBeans(firestore, userId, values).then((beansRef) =>
            history.push(`/beans/${beansRef.id}`)
          );
        }}
      />
    </Layout>
  );
};

export default BeansAdd;
