import React, { useState } from "react";
import { Grid } from "@material-ui/core";

import Layout from "../components/layout";
import PageProgress from "../components/page-progress";
import SkeletonListPage from "../components/skeletons";
import Fab from "../components/fab";
import { EmptyList } from "../components/empty-states";
import Card from "../components/card";
import SpoonThinIcon from "../components/icons/spoon-thin";
import LoadingButton from "../components/loading-button";
import { tastingVariablesList } from "../utils/constants";
import { buildBeansIdLabelMap } from "../utils/beans";
import { useUser, useFirestore, useFirestoreCollectionData } from "reactfire";

const FIRST_LOAD_LIMIT = 10;

const TastingList = () => {
  const {
    data: { uid: userId },
  } = useUser();

  const [limit, setLimit] = useState(FIRST_LOAD_LIMIT);
  const [loadAll, setLoadAll] = useState(false);

  const espressoQuery = useFirestore()
    .collection("users")
    .doc(userId)
    .collection("tastings")
    .orderBy("date", "desc")
    .limit(limit);
  const { status: tastingsStatus, data: tastings } =
    useFirestoreCollectionData<Tasting>(espressoQuery, {
      idField: "id",
    });

  const beansQuery = useFirestore()
    .collection("users")
    .doc(userId)
    .collection("beans");
  const { status: beansStatus, data: beans } =
    useFirestoreCollectionData<Beans>(beansQuery, {
      idField: "id",
    });

  const beansIdLabelMap = buildBeansIdLabelMap(beans);

  const title = "Tastings";

  if ((tastingsStatus === "loading" && !loadAll) || beansStatus === "loading") {
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
    <Layout title="Tastings">
      <Fab link="/tastings/add" label="Add tasting" />
      {tastings.length === 0 ? (
        <EmptyList type="tastings" />
      ) : (
        <>
          <Grid container direction={"column"} spacing={2}>
            {tastings.map((tasting) => {
              let tastingVariables = tasting.samples.map(
                (s) => s.variableValue
              );
              if (tasting.variable === "beans") {
                tastingVariables = tastingVariables.map(
                  (v) => beansIdLabelMap[v.id]
                );
              }
              return (
                <Grid item key={tasting.id}>
                  <Card
                    title={
                      tasting.variable === "beans"
                        ? "Beans"
                        : tastingVariablesList.find(
                            (v) => v.value === tasting.variable
                          )!.label
                    }
                    link={`/tastings/${tasting.id}/ratings`}
                    Icon={SpoonThinIcon}
                    secondLine={`${tastingVariables.join(", ")}`}
                    date={tasting.date}
                    datePrefix="Tasted on"
                  />
                </Grid>
              );
            })}
          </Grid>

          {(!loadAll || tastingsStatus === "loading") &&
            tastings.length >= FIRST_LOAD_LIMIT && (
              <>
                <LoadingButton
                  type="tastings"
                  isLoading={tastingsStatus === "loading"}
                  handleClick={() => {
                    setLoadAll(true);
                    setLimit(10000);
                  }}
                />
              </>
            )}
        </>
      )}
    </Layout>
  );
};

export default TastingList;
