import { Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  AcUnit as AcUnitIcon,
  Archive as ArchiveIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  FileCopy as FileCopyIcon,
  Unarchive as UnarchiveIcon,
} from "@material-ui/icons";
import { Alert, AlertTitle } from "@material-ui/lab";
import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  useFirestore,
  useFirestoreCollectionData,
  useFirestoreDocData,
  useUser,
} from "reactfire";
import ActionDialog from "../components/action-dialog";
import ActionsMenu from "../components/actions-menu";
import BeansRoastInfo from "../components/beans/beans-details/beans-roast-info";
import BeansTerroirBlend from "../components/beans/beans-details/beans-terroir-blend";
import BeansTerroirSingleOrigin from "../components/beans/beans-details/beans-terroir-single-origin";
import BrewCard from "../components/brew/brew-card";
import EspressoCard from "../components/espresso/espresso-card";
import Layout from "../components/layout";
import PageProgress from "../components/page-progress";
import SimpleDialog from "../components/simple-dialog";
import useCommonStyles from "../config/use-common-styles";
import {
  beansFreezeToday,
  beansSetFinished,
  beansThawToday,
  canRemoveBeans,
  deleteBeans,
} from "../database/queries";

interface RouteParams {
  id: string;
}

const useStyles = makeStyles((theme) => ({
  alert: {
    marginBottom: theme.spacing(2),
  },
  list: {
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
}));

const BeansDetails = () => {
  const {
    data: { uid: userId },
  } = useUser();
  const classes = useStyles();
  const commonStyles = useCommonStyles();

  // delete dialog state
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const history = useHistory();

  const firestore = useFirestore();

  const params = useParams<RouteParams>();
  const beansId = params.id;

  const beansRef = firestore
    .collection("users")
    .doc(userId)
    .collection("beans")
    .doc(beansId);
  const { status, data: beans } = useFirestoreDocData<Beans>(beansRef);

  const shortRef = firestore.collection("beans").doc(beansId);

  // retrieve brews and espressos
  const brewsRef = firestore
    .collection("users")
    .doc(userId)
    .collection("brews")
    .where("beans", "==", shortRef)
    .orderBy("date", "desc");
  const { status: brewsStatus, data: brews } = useFirestoreCollectionData<Brew>(
    brewsRef,
    {
      idField: "id",
    }
  );
  console.log(brews);

  const espressosListRef = firestore
    .collection("users")
    .doc(userId)
    .collection("espresso")
    .where("beans", "==", shortRef)
    .orderBy("date", "desc");
  const { status: espressoListStatus, data: espressoList } =
    useFirestoreCollectionData<Espresso>(espressosListRef, {
      idField: "id",
    });
  console.log(espressoList);

  const removeCheck = async () => {
    // TODO refactor this when getting brews/espressos to view as a list
    // search for any brew that references these beans
    const beansRef = firestore.collection("beans").doc(beansId);
    const canDelete = await canRemoveBeans(firestore, userId, beansRef);
    if (canDelete) {
      // show delete dialog
      setDeleteDialogOpen(true);
    } else {
      // show error dialog
      setErrorDialogOpen(true);
    }
  };

  const remove = () => {
    history.push("/beans");
    deleteBeans(firestore, userId, beansId);
  };

  const setFinished = (finished: boolean) => () => {
    beansSetFinished(firestore, userId, beansId, finished);
    history.push("/beans");
  };

  const freeze = () => beansFreezeToday(firestore, userId, beansId);

  const thaw = () => beansThawToday(firestore, userId, beansId);

  const title = "Beans details";

  if (
    status === "loading" ||
    brewsStatus === "loading" ||
    espressoListStatus === "loading"
  ) {
    return (
      <>
        <PageProgress />
        <Layout title={title}></Layout>
      </>
    );
  }

  if (status === "error" || !beans.name) {
    // FIXME revisit this, look into Suspense?
    history.push("/404");
  }

  return (
    <Layout title={title}>
      <ActionDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        action={remove}
        actionLabel="Delete"
        title="Delete beans?"
        message={[
          "Are you sure you want to remove these beans?",
          "WARNING: this action is irreversible.",
        ]}
      />
      <SimpleDialog
        open={errorDialogOpen}
        onClose={() => setErrorDialogOpen(false)}
        message={[
          "These beans can't be deleted because they're associated to one or more brews/espressos.",
          "Please remove all brews/espressos associated with these beans before removing them.",
        ]}
      />
      <ActionsMenu
        menuItems={[
          ...(!beans.isFinished
            ? [
                {
                  primaryText: "Mark as finished",
                  secondaryText: "They won't show up during selection.",
                  Icon: ArchiveIcon,
                  onClick: setFinished(true),
                },
              ]
            : [
                {
                  primaryText: "Mark as not finished",
                  secondaryText: "They will show up during selection.",
                  Icon: UnarchiveIcon,
                  onClick: setFinished(false),
                },
              ]),
          ...(!beans.freezeDate
            ? [
                {
                  primaryText: "Freeze bag",
                  secondaryText: "Sets the freeze date to today.",
                  Icon: AcUnitIcon,
                  onClick: freeze,
                },
              ]
            : !beans.thawDate
            ? [
                {
                  primaryText: "Thaw bag",
                  secondaryText: "Sets the thaw date to today.",
                  Icon: AcUnitIcon,
                  onClick: thaw,
                },
              ]
            : []),

          {
            primaryText: "Add new bag",
            secondaryText: "Add a new bag of the same beans.",
            Icon: FileCopyIcon,
            linkTo: `/beans/${beansId}/clone`,
          },
          {
            primaryText: "Edit",
            secondaryText: "Edit the beans details.",
            Icon: EditIcon,
            linkTo: `/beans/${beansId}/edit`,
          },
          {
            primaryText: "Remove",
            secondaryText: "Warning: irreversible action.",
            Icon: DeleteIcon,
            onClick: removeCheck,
          },
        ]}
      />
      {beans.isFinished && (
        <Alert className={classes.alert} severity="info">
          <AlertTitle>Finished (archived)</AlertTitle>
          This bean bag is <strong>finished</strong> (aka archived).
          <br />
          It won't show up when you select beans, and it will be hidden by
          default in the list of beans page.
        </Alert>
      )}
      <BeansRoastInfo beans={beans} />
      {beans.origin === "single-origin" ? (
        <BeansTerroirSingleOrigin beans={beans} />
      ) : beans.origin === "blend" ? (
        <BeansTerroirBlend beans={beans} />
      ) : null}

      {brews.length > 0 && (
        <>
          <Typography
            variant="h5"
            gutterBottom
            className={commonStyles.listTitle}
          >
            Brews
          </Typography>
          <Grid container spacing={2}>
            {brews.map((brew) => (
              <Grid item xs={12} sm={6} key={brew.id}>
                <BrewCard brew={brew} beansLabel="Will remove this" />
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {espressoList.length > 0 && (
        <>
          <Typography
            variant="h5"
            gutterBottom
            className={commonStyles.listTitle}
          >
            Espressos
          </Typography>
          <Grid container spacing={2}>
            {espressoList.map((espresso) => (
              <Grid item xs={12} sm={6} key={espresso.id}>
                <EspressoCard
                  espresso={espresso}
                  beansLabel="Will remove this"
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Layout>
  );
};

export default BeansDetails;
