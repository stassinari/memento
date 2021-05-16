import React, { useState } from "react";

import Fab from "../components/fab";
import { buildBeansIdLabelMap } from "../utils/beans";
import Layout from "../components/layout";
import PageProgress from "../components/page-progress";
import SkeletonListPage from "../components/skeletons";
import { EmptyBeans, EmptyList } from "../components/empty-states";
import Card from "../components/card";
import TamperIcon from "../components/icons/tamper";
import NewReleasesIcon from "@material-ui/icons/NewReleases";
import { Chip, Grid } from "@material-ui/core";
import { useFirestore, useFirestoreCollectionData, useUser } from "reactfire";
import LoadingButton from "../components/loading-button";

const FIRST_LOAD_LIMIT = 10;

const NewChip = (
  <Chip label="New" size="small" color="primary" icon={<NewReleasesIcon />} />
);

const EspressoList = () => {
  const {
    data: { uid: userId },
  } = useUser();

  const [limit, setLimit] = useState(FIRST_LOAD_LIMIT);
  const [loadAll, setLoadAll] = useState(false);

  const espressoQuery = useFirestore()
    .collection("users")
    .doc(userId)
    .collection("espresso")
    .orderBy("date", "desc")
    .limit(limit);
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

  if (
    (espressoListStatus === "loading" && !loadAll) ||
    beansListStatus === "loading"
  ) {
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
            {espressoList.map((espresso) => {
              const beansLabel = espresso.beans
                ? beansIdLabelMap[espresso.beans.id]
                : "";
              const yieldz = espresso.actualWeight
                ? espresso.actualWeight
                : espresso.targetWeight
                ? espresso.targetWeight
                : undefined;
              const dose = espresso.beansWeight;
              const recipe =
                yieldz && dose
                  ? `${yieldz}g out / ${espresso.beansWeight}g in`
                  : yieldz
                  ? `${yieldz}g out`
                  : dose
                  ? `${dose}g in`
                  : undefined;
              const rating =
                espresso.rating && espresso.rating !== 0
                  ? `${espresso.rating}/10`
                  : undefined;
              const time = espresso.actualTime;
              const profileName = espresso.profileName
                ? espresso.profileName
                : "Unknown profile";
              const Item = espresso.partial ? (
                // decent case
                <Card
                  link={`/espresso/${espresso.id}`}
                  Icon={TamperIcon}
                  secondLine={profileName}
                  thirdLine={recipe && time && `${recipe} ⇨ ${time}s`}
                  date={espresso.date}
                  datePrefix="Pulled on"
                  Tag={NewChip}
                />
              ) : espresso.fromDecent ? (
                // custom card for decent shots
                <Card
                  title={beansLabel}
                  secondLine={profileName}
                  thirdLine={recipe && time && `${recipe} ⇨ ${time}s`}
                  link={`/espresso/${espresso.id}`}
                  Icon={TamperIcon}
                  aside={rating}
                  date={espresso.date}
                  datePrefix="Pulled on"
                />
              ) : (
                // manually added case
                <Card
                  title={beansLabel}
                  link={`/espresso/${espresso.id}`}
                  Icon={TamperIcon}
                  aside={rating}
                  secondLine={`${recipe} ⇨ ${time}s`}
                  date={espresso.date}
                  datePrefix="Pulled on"
                />
              );

              return (
                <Grid item key={espresso.id}>
                  {Item}
                </Grid>
              );
            })}
          </Grid>

          {(!loadAll || espressoListStatus === "loading") &&
            espressoList.length >= FIRST_LOAD_LIMIT && (
              <>
                <LoadingButton
                  type="espressos"
                  isLoading={espressoListStatus === "loading"}
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

export default EspressoList;
