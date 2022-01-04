import AcUnitIcon from "@mui/icons-material/AcUnit";
import { Chip, Grid, Typography } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import React, { FunctionComponent, useState } from "react";
import { useFirestore, useFirestoreCollectionData, useUser } from "reactfire";
import BeansListOptions from "../components/beans/beans-list-options";
import Card, { CardRating } from "../components/card";
import { EmptyList } from "../components/empty-states";
import Fab from "../components/fab";
import Layout from "../components/layout";
import PageProgress from "../components/page-progress";
import SkeletonListPage from "../components/skeletons";
import { Beans } from "../database/types/beans";
import { areBeansFrozen, sortBeansByRoastDate } from "../utils/beans";

const useStyles = makeStyles((theme) => {
  return {
    grid: {
      marginBottom: theme.spacing(4),
    },
    title: {
      marginBottom: theme.spacing(2),
    },
  };
});

const BeansList = () => {
  const {
    data: { uid: userId },
  } = useUser();

  const classes = useStyles();
  const [showFinished, setShowFinished] = useState(false);
  const [showFrozen, setShowFrozen] = useState(true);

  let beansQuery = useFirestore()
    .collection("users")
    .doc(userId)
    .collection("beans")
    .orderBy("roastDate", "desc");

  if (showFinished) {
    beansQuery.where("isFinished", "==", true);
  }
  const { status, data: beansList } = useFirestoreCollectionData<Beans>(
    beansQuery,
    {
      idField: "id",
    }
  );

  const openedBeans = beansList
    ?.filter((b) => !b.isFinished)
    .filter((b) => (showFrozen ? true : !areBeansFrozen(b)))
    .sort(sortBeansByRoastDate);
  const finishedBeans = beansList
    ?.filter((b) => b.isFinished)
    .filter((b) => (showFrozen ? true : !areBeansFrozen(b)))
    .sort(sortBeansByRoastDate);

  const title = "Beans";

  if (status === "loading") {
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
      <Fab link="/beans/add" label="Add beans" />

      <BeansListOptions
        showFrozen={showFrozen}
        showFinished={showFinished}
        setShowFrozen={setShowFrozen}
        setShowFinished={setShowFinished}
      />

      {beansList.length === 0 ? (
        <EmptyList type="beans" />
      ) : (
        <>
          {openedBeans.length > 0 && (
            <CardsList title="Opened beans" list={openedBeans} />
          )}
          {showFinished && finishedBeans.length > 0 && (
            <CardsList title="Finished beans" list={finishedBeans} />
          )}
        </>
      )}
    </Layout>
  );
};

interface CardsListProps {
  title: string;
  list: Beans[];
}

const FrozenChip = (
  <Chip color="secondary" label="Frozen" size="small" icon={<AcUnitIcon />} />
);

const CardsList: FunctionComponent<CardsListProps> = ({ title, list }) => {
  const classes = useStyles();
  return (
    <>
      <Typography className={classes.title} variant="h5" component="h2">
        {title}
      </Typography>
      <Grid className={classes.grid} container direction={"column"} spacing={2}>
        {list.map((beanBag) => (
          <Grid item key={beanBag.id}>
            <Card
              title={
                beanBag.country
                  ? `${beanBag.name} (${beanBag.country})`
                  : beanBag.name
              }
              link={`/beans/${beanBag.id}`}
              aside={
                areBeansFrozen(beanBag) && (
                  <CardRating variant="secondary">{FrozenChip}</CardRating>
                )
              }
              secondLine={beanBag.roaster}
              date={beanBag.roastDate}
              datePrefix="Roasted on"
              includeDateTime={false}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default BeansList;
