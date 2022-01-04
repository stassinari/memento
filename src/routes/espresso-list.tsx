import { Grid } from "@mui/material";
import React from "react";
import { useFirestore, useFirestoreCollectionData, useUser } from "reactfire";
import { EmptyBeans, EmptyList } from "../components/empty-states";
import EspressoCard from "../components/espresso/espresso-card";
import Fab from "../components/fab";
import Layout from "../components/layout";
import PageProgress from "../components/page-progress";
import SkeletonListPage from "../components/skeletons";
import { Beans } from "../database/types/beans";
import { Espresso } from "../database/types/espresso";
import { buildBeansIdLabelMap } from "../utils/beans";

const EspressoList = () => {
  const {
    data: { uid: userId },
  } = useUser();

  const espressoQuery = useFirestore()
    .collection("users")
    .doc(userId)
    .collection("espresso")
    .orderBy("date", "desc");
  const { status: espressoListStatus, data: espressoList } =
    useFirestoreCollectionData<Espresso>(espressoQuery, {
      idField: "id",
    });

  const beansQuery = useFirestore()
    .collection("users")
    .doc(userId)
    .collection("beans");
  const { status: beansListStatus, data: beansList } =
    useFirestoreCollectionData<Beans>(beansQuery, {
      idField: "id",
    });

  const beansIdLabelMap = buildBeansIdLabelMap(beansList);

  const title = "Espresso";

  if (espressoListStatus === "loading" || beansListStatus === "loading") {
    return (
      <>
        <PageProgress />
        <Layout title={title}>
          <SkeletonListPage />
        </Layout>
      </>
    );
  }

  return (
    <Layout title={title}>
      <Fab
        disabled={beansList.length === 0}
        link="/espresso/add/step0"
        label="Add espresso"
      />
      {beansList.length === 0 ? (
        <EmptyBeans type="espressos" />
      ) : espressoList.length === 0 ? (
        <EmptyList type="espressos" />
      ) : (
        <>
          <Grid container direction={"column"} spacing={2}>
            {espressoList.map((espresso) => (
              <Grid item key={espresso.id}>
                <EspressoCard
                  espresso={espresso}
                  beansLabel={
                    (espresso.beans &&
                      espresso.beans.id &&
                      beansIdLabelMap[espresso.beans.id]) ||
                    undefined
                  }
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Layout>
  );
};

export default EspressoList;
