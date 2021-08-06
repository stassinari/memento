import { Chip, Grid } from "@material-ui/core";
import NewReleasesIcon from "@material-ui/icons/NewReleases";
import React, { useState } from "react";
import { useFirestore, useFirestoreCollectionData, useUser } from "reactfire";
import Card, { CardRating } from "../components/card";
import { EmptyBeans, EmptyList } from "../components/empty-states";
import Fab from "../components/fab";
import BeanIcon from "../components/icons/bean";
import Layout from "../components/layout";
import LoadingButton from "../components/loading-button";
import PageProgress from "../components/page-progress";
import SkeletonListPage from "../components/skeletons";
import { buildBeansIdLabelMap } from "../utils/beans";

const FIRST_LOAD_LIMIT = 10;

const NewChip = (
  <Chip label="NEW" size="small" color="primary" icon={<NewReleasesIcon />} />
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
              const rating =
                espresso.rating && espresso.rating !== 0
                  ? espresso.rating
                  : undefined;
              const profileName = espresso.profileName
                ? espresso.profileName
                : "Unknown profile";
              const Item = espresso.partial ? (
                // just added decent case
                <Card
                  link={`/espresso/${espresso.id}`}
                  title={profileName}
                  aside={<CardRating variant="primary">{NewChip}</CardRating>}
                  date={espresso.date}
                  datePrefix="Pulled on"
                />
              ) : espresso.fromDecent ? (
                // custom card for decent shots
                <Card
                  title={profileName}
                  secondLine={beansLabel}
                  SecondLineIcon={BeanIcon}
                  link={`/espresso/${espresso.id}`}
                  aside={
                    rating && (
                      <CardRating
                        variant={rating >= 6 ? "primary" : "secondary"}
                      >
                        {rating}
                      </CardRating>
                    )
                  }
                  date={espresso.date}
                  datePrefix="Pulled on"
                />
              ) : (
                // manually added case
                <Card
                  link={`/espresso/${espresso.id}`}
                  aside={
                    rating && (
                      <CardRating
                        variant={rating >= 6 ? "primary" : "secondary"}
                      >
                        {rating}
                      </CardRating>
                    )
                  }
                  secondLine={beansLabel}
                  SecondLineIcon={BeanIcon}
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
