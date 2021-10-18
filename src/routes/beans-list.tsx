import {
  Chip,
  FormControlLabel,
  FormGroup,
  Grid,
  Switch,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AcUnitIcon from "@material-ui/icons/AcUnit";
import React, { FunctionComponent, useState } from "react";
import { useFirestore, useFirestoreCollectionData, useUser } from "reactfire";
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
    buttonContainer: {
      marginBottom: theme.spacing(2),
      display: "flex",
      justifyContent: "flex-end",
    },
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

  const [hideFinished, setHideFinished] = useState(false);

  let beansQuery = useFirestore()
    .collection("users")
    .doc(userId)
    .collection("beans")
    .orderBy("roastDate", "desc");

  if (hideFinished) {
    beansQuery.where("isFinished", "==", false);
  }
  const { status, data: beansList } = useFirestoreCollectionData<Beans>(
    beansQuery,
    {
      idField: "id",
    }
  );

  const openedBeans = beansList
    ?.filter((b) => !b.isFinished)
    .sort(sortBeansByRoastDate);
  const finishedBeans = beansList
    ?.filter((b) => b.isFinished)
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
      <div className={classes.buttonContainer}>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={hideFinished}
                onChange={() => setHideFinished(!hideFinished)}
                name="showFinished"
              />
            }
            label="Show finished"
          />
        </FormGroup>
      </div>
      {beansList.length === 0 ? (
        <EmptyList type="beans" />
      ) : (
        <>
          {openedBeans.length > 0 && (
            <CardsList title="Opened beans" list={openedBeans} />
          )}
          {hideFinished && finishedBeans.length > 0 && (
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
