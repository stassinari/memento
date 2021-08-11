import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@material-ui/core";
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
import { useFirestore, useFirestoreDocData, useUser } from "reactfire";
import ActionDialog from "../components/action-dialog";
import ActionsMenu from "../components/actions-menu";
import { roastLevelLabels } from "../components/beans/beans-add/fields/roast-level";
import Layout from "../components/layout";
import PageProgress from "../components/page-progress";
import SimpleDialog from "../components/simple-dialog";
import useCommonStyles from "../config/use-common-styles";
import countriesMap from "../database/countries";
import {
  beansFreezeToday,
  beansSetFinished,
  beansThawToday,
  canRemoveBeans,
  deleteBeans,
} from "../database/queries";
import { renderDate } from "../utils/dates";
import { capitalise } from "../utils/string";

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
  countryContainer: {
    position: "relative",
    width: theme.spacing(24),
  },
  countryFlag: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: theme.spacing(8),
    opacity: 0.75,
    borderRadius: 4,
  },
  countryMap: {
    width: theme.spacing(24),
    fill: "red",
  },
}));

const BeansDetails = () => {
  const {
    data: { uid: userId },
  } = useUser();
  const commonStyles = useCommonStyles();
  const classes = useStyles();

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

  if (status === "loading") {
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
      {beans.country && (
        <Paper className={commonStyles.table}>
          {beans.country} - {countriesMap[beans.country].toLowerCase()}
          <div className={classes.countryContainer}>
            <img
              src={`${process.env.PUBLIC_URL}/images/maps/${countriesMap[
                beans.country
              ].toLowerCase()}.svg`}
              className={classes.countryMap}
              alt={`${beans.country} map outline`}
            />
            <img
              src={`${process.env.PUBLIC_URL}/images/flags/${countriesMap[
                beans.country
              ].toLowerCase()}.svg`}
              className={classes.countryFlag}
              alt={`${beans.country} flag`}
            />
          </div>
        </Paper>
      )}
      <Paper className={commonStyles.table}>
        <TableContainer>
          <Table aria-label="simple table">
            <TableBody>
              <TableRow>
                <TableCell className={commonStyles.label}>Name</TableCell>
                <TableCell>{beans.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={commonStyles.label}>Roaster</TableCell>
                <TableCell>{beans.roaster}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={commonStyles.label}>Roast date</TableCell>
                <TableCell>{renderDate(beans.roastDate)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={commonStyles.label}>
                  Roast style
                </TableCell>
                <TableCell>{capitalise(beans.roastStyle)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={commonStyles.label}>
                  Roast level
                </TableCell>
                <TableCell>
                  {beans.roastLevel !== undefined &&
                    beans.roastLevel !== null &&
                    roastLevelLabels[beans.roastLevel].label}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={commonStyles.label}>
                  Roasting notes
                </TableCell>
                <TableCell>
                  {beans.roastingNotes ? beans.roastingNotes.join(", ") : ""}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {beans.freezeDate && (
        <Paper className={commonStyles.table}>
          <TableContainer>
            <Table aria-label="simple table">
              <TableBody>
                <TableRow>
                  <TableCell className={commonStyles.label}>
                    Freeze date
                  </TableCell>
                  <TableCell>{renderDate(beans.freezeDate)}</TableCell>
                </TableRow>
                {beans.thawDate && (
                  <TableRow>
                    <TableCell className={commonStyles.label}>
                      Thaw date
                    </TableCell>
                    <TableCell>{renderDate(beans.thawDate)}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
      <Paper>
        <TableContainer>
          <Table aria-label="simple table">
            <TableBody>
              <TableRow>
                <TableCell className={commonStyles.label}>Origin</TableCell>
                <TableCell>{capitalise(beans.origin)}</TableCell>
              </TableRow>
              {beans.origin === "single-origin" && (
                <>
                  <TableRow>
                    <TableCell className={commonStyles.label}>
                      Country
                    </TableCell>
                    <TableCell>{beans.country}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={commonStyles.label}>Region</TableCell>
                    <TableCell>{beans.region}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={commonStyles.label}>
                      Varietal(s)
                    </TableCell>
                    <TableCell>
                      {beans.varietals && beans.varietals.join(", ")}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={commonStyles.label}>
                      Altitude
                    </TableCell>
                    <TableCell>
                      {beans.altitude ? `${beans.altitude} masl` : ""}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={commonStyles.label}>
                      Process
                    </TableCell>
                    <TableCell>{beans.process}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={commonStyles.label}>Farmer</TableCell>
                    <TableCell>{beans.farmer}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={commonStyles.label}>
                      Harvest Date
                    </TableCell>
                    <TableCell>{renderDate(beans.harvestDate)}</TableCell>
                  </TableRow>
                </>
              )}
              {beans.origin === "blend" && (
                <>
                  {beans.blend?.map((item: BeansBlendPart, index: number) => (
                    <TableRow key={index}>
                      <TableCell className={commonStyles.label}>
                        Origin #{index + 1}
                      </TableCell>
                      <TableCell>
                        <ul className={classes.list}>
                          {item.name && <li>{item.name}</li>}
                          {item.country && <li>{item.country}</li>}
                          {item.percentage && <li>{item.percentage}%</li>}
                          {item.varietals && (
                            <li>{item.varietals.join(", ")}</li>
                          )}
                          {item.process && <li>{item.process}</li>}
                        </ul>
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Layout>
  );
};

export default BeansDetails;
