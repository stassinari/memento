import React, { FunctionComponent, useState } from "react";
import {
  FormGroup,
  FormControlLabel,
  Switch,
  Grid,
  Typography,
  Chip,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useFirestore, useFirestoreCollectionData, useUser } from "reactfire";
import AcUnitIcon from "@material-ui/icons/AcUnit";

import BeanBagIcon from "../components/icons/bean-bag";
import Card from "../components/card";
import Fab from "../components/fab";
import Layout from "../components/layout";
import PageProgress from "../components/page-progress";
import SkeletonListPage from "../components/skeletons";
import { EmptyList } from "../components/empty-states";
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

const FrozenChip = <Chip label="Frozen" size="small" icon={<AcUnitIcon />} />;

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
              title={`${beanBag.name}, ${beanBag.roaster}`}
              link={`/beans/${beanBag.id}`}
              Icon={BeanBagIcon}
              secondLine={
                beanBag.origin === "blend"
                  ? `Blend (${beanBag.blend?.map((b) => b.country).join(", ")})`
                  : beanBag.process || beanBag.country
                  ? `${[beanBag.process, beanBag.country]
                      .filter((s) => !!s)
                      .join(", ")}`
                  : undefined
              }
              date={beanBag.roastDate}
              datePrefix="Roasted on"
              Tag={areBeansFrozen(beanBag) && FrozenChip}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default BeansList;
