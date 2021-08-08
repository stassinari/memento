import { Button, Grid, Typography } from "@material-ui/core";
import { subDays, subMonths, subWeeks } from "date-fns/esm";
import firebase from "firebase/app";
import React, { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import { useFirestore, useFirestoreCollectionData, useUser } from "reactfire";
import { EmptyBeans, EmptyList } from "../components/empty-states";
import EspressoCard from "../components/espresso/espresso-card";
import Fab from "../components/fab";
import Layout from "../components/layout";
import PageProgress from "../components/page-progress";
import SkeletonListPage from "../components/skeletons";
import useCommonStyles from "../config/use-common-styles";
import { buildBeansIdLabelMap } from "../utils/beans";

const EspressoRecent: FunctionComponent = () => {
  const {
    data: { uid: userId },
  } = useUser();

  const commonStyles = useCommonStyles();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = subDays(today, 1);
  const lastWeek = subWeeks(today, 1);
  const lastMonth = subMonths(today, 1);

  const espressoQuery = useFirestore()
    .collection("users")
    .doc(userId)
    .collection("espresso")
    .where("date", ">", lastMonth)
    .orderBy("date", "desc");
  const { status: espressoStatus, data: espressoList } =
    useFirestoreCollectionData<Espresso>(espressoQuery, {
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

  const title = "Recent espresso";

  if (espressoStatus === "loading" || beansStatus === "loading") {
    return (
      <>
        <PageProgress />
        <Layout title={title}>
          <SkeletonListPage />
        </Layout>
      </>
    );
  }

  const todaysEspressos = espressoList.filter(
    (espresso) =>
      (espresso.date as firebase.firestore.Timestamp).toMillis() >
      today.getTime()
  );

  const yesterdaysEspressos = espressoList.filter(
    (espresso) =>
      (espresso.date as firebase.firestore.Timestamp).toMillis() >
        yesterday.getTime() &&
      (espresso.date as firebase.firestore.Timestamp).toMillis() <
        today.getTime()
  );

  const lastWeeksEspressos = espressoList.filter(
    (espresso) =>
      (espresso.date as firebase.firestore.Timestamp).toMillis() >
        lastWeek.getTime() &&
      (espresso.date as firebase.firestore.Timestamp).toMillis() <
        yesterday.getTime()
  );

  const lastMonthsEspressos = espressoList.filter(
    (espresso) =>
      (espresso.date as firebase.firestore.Timestamp).toMillis() >
        lastMonth.getTime() &&
      (espresso.date as firebase.firestore.Timestamp).toMillis() <
        lastWeek.getTime()
  );

  const allLists = [
    {
      title: "Today",
      espressoList: todaysEspressos,
    },
    {
      title: "Yesterday",
      espressoList: yesterdaysEspressos,
    },
    {
      title: "Last week",
      espressoList: lastWeeksEspressos,
    },
    {
      title: "Last month",
      espressoList: lastMonthsEspressos,
    },
  ];

  return (
    <Layout title={title} maxWidth="md">
      <Fab
        disabled={beans.length === 0}
        link="/espresso/add/step0"
        label="Add espresso"
      />
      {beans.length === 0 ? (
        <EmptyBeans type="espressos" />
      ) : espressoList.length === 0 ? (
        <EmptyList type="espressos" />
      ) : (
        <>
          {allLists.map(
            (list) =>
              list.espressoList.length > 0 && (
                <div key={list.title}>
                  <Typography
                    variant="h5"
                    gutterBottom
                    className={commonStyles.listTitle}
                  >
                    {list.title}
                  </Typography>

                  <Grid container spacing={2}>
                    {list.espressoList.map((espresso) => (
                      <Grid item xs={12} sm={6} key={espresso.id}>
                        <EspressoCard
                          espresso={espresso}
                          beansLabel={
                            espresso.beans
                              ? beansIdLabelMap[espresso.beans.id]
                              : ""
                          }
                        />
                      </Grid>
                    ))}
                  </Grid>
                </div>
              )
          )}
          <Button
            color="primary"
            variant="outlined"
            component={Link}
            to="/espresso/all"
            className={commonStyles.viewMoreButton}
          >
            View all espressos
          </Button>
        </>
      )}
    </Layout>
  );
};

export default EspressoRecent;
