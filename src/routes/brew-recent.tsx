import { Button, Grid, Typography } from "@material-ui/core";
import { subDays, subMonths, subWeeks } from "date-fns/esm";
import firebase from "firebase/app";
import React, { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import { useFirestore, useFirestoreCollectionData, useUser } from "reactfire";
import BrewCard from "../components/brew/brew-card";
import { EmptyBeans, EmptyList } from "../components/empty-states";
import Fab from "../components/fab";
import Layout from "../components/layout";
import PageProgress from "../components/page-progress";
import SkeletonListPage from "../components/skeletons";
import useCommonStyles from "../config/use-common-styles";
import { Beans } from "../database/types/beans";
import { Brew } from "../database/types/brew";
import { buildBeansIdLabelMap } from "../utils/beans";

const BrewRecent: FunctionComponent = () => {
  const {
    data: { uid: userId },
  } = useUser();

  const commonStyles = useCommonStyles();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = subDays(today, 1);
  const lastWeek = subWeeks(today, 1);
  const lastMonth = subMonths(today, 1);

  const brewsQuery = useFirestore()
    .collection("users")
    .doc(userId)
    .collection("brews")
    .where("date", ">", lastMonth)
    .orderBy("date", "desc");
  const { status: brewsStatus, data: brews } = useFirestoreCollectionData<Brew>(
    brewsQuery,
    {
      idField: "id",
    }
  );

  const beansQuery = useFirestore()
    .collection("users")
    .doc(userId)
    .collection("beans");
  const { status: beansStatus, data: beans } =
    useFirestoreCollectionData<Beans>(beansQuery, {
      idField: "id",
    });

  const beansIdLabelMap = buildBeansIdLabelMap(beans);

  const title = "Recent brews";

  if (brewsStatus === "loading" || beansStatus === "loading") {
    return (
      <>
        <PageProgress />
        <Layout title={title}>
          <SkeletonListPage />
        </Layout>
      </>
    );
  }

  const todaysBrews = brews.filter(
    (brew) =>
      (brew.date as firebase.firestore.Timestamp).toMillis() > today.getTime()
  );

  const yesterdaysBrews = brews.filter(
    (brew) =>
      (brew.date as firebase.firestore.Timestamp).toMillis() >
        yesterday.getTime() &&
      (brew.date as firebase.firestore.Timestamp).toMillis() < today.getTime()
  );

  const lastWeeksBrews = brews.filter(
    (brew) =>
      (brew.date as firebase.firestore.Timestamp).toMillis() >
        lastWeek.getTime() &&
      (brew.date as firebase.firestore.Timestamp).toMillis() <
        yesterday.getTime()
  );

  const lastMonthsBrews = brews.filter(
    (brew) =>
      (brew.date as firebase.firestore.Timestamp).toMillis() >
        lastMonth.getTime() &&
      (brew.date as firebase.firestore.Timestamp).toMillis() <
        lastWeek.getTime()
  );

  const allLists = [
    {
      title: "Today",
      brews: todaysBrews,
    },
    {
      title: "Yesterday",
      brews: yesterdaysBrews,
    },
    {
      title: "Last week",
      brews: lastWeeksBrews,
    },
    {
      title: "Last month",
      brews: lastMonthsBrews,
    },
  ];

  return (
    <Layout title={title} maxWidth="md">
      <Fab
        disabled={beans.length === 0}
        link="/brews/add/step0"
        label="Add brew"
      />
      {beans.length === 0 ? (
        <EmptyBeans type="brews" />
      ) : brews.length === 0 ? (
        <EmptyList type="brews" />
      ) : (
        <>
          {allLists.map(
            (list) =>
              list.brews.length > 0 && (
                <div key={list.title}>
                  <Typography
                    variant="h5"
                    gutterBottom
                    className={commonStyles.listTitle}
                  >
                    {list.title}
                  </Typography>

                  <Grid container spacing={2}>
                    {list.brews.map((brew) => (
                      <Grid item xs={12} sm={6} key={brew.id}>
                        <BrewCard
                          brew={brew}
                          beansLabel={
                            brew.beans &&
                            brew.beans.id &&
                            beansIdLabelMap[brew.beans.id]
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
            to="/brews/all"
            className={commonStyles.viewMoreButton}
          >
            View all brews
          </Button>
        </>
      )}
    </Layout>
  );
};

export default BrewRecent;
