import React, { FunctionComponent } from "react";
import { useParams, useHistory, Link as RouterLink } from "react-router-dom";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Link as MuiLink,
  makeStyles,
} from "@material-ui/core";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  FileCopy as FileCopyIcon,
  Star as StarIcon,
} from "@material-ui/icons";

import { deleteBrew } from "../database/queries";
import { buildBeansLabel } from "../utils/beans";
import ActionsMenu from "../components/actions-menu";
import useCommonStyles from "../config/use-common-styles";
import { renderDate } from "../utils/dates";
import ActionDialog from "../components/action-dialog";
import Layout from "../components/layout";
import PageProgress from "../components/page-progress";
import Markdown from "../components/markdown";
import FlavoursChart from "../components/flavours-chart";
import { useUser, useFirestore, useFirestoreDocData } from "reactfire";

interface RouteParams {
  id: string;
}

const useStyles = makeStyles((theme) => ({
  scoresContainer: {
    [theme.breakpoints.up("sm")]: {
      display: "grid",
      gridTemplateColumns: "65% 35%",
    },
    marginBottom: theme.spacing(2),
  },
}));

const BrewDetails: FunctionComponent = () => {
  const {
    data: { uid: userId },
  } = useUser();
  const firestore = useFirestore();
  const history = useHistory();

  const classes = useStyles();
  const commonStyles = useCommonStyles();

  const params = useParams<RouteParams>();
  const brewId = params.id;

  const [openModal, setOpenModal] = React.useState(false);

  const brewRef = firestore
    .collection("users")
    .doc(userId)
    .collection("brews")
    .doc(brewId);
  const { status: brewStatus, data: brew } = useFirestoreDocData<Brew>(brewRef);

  const beansId = brew?.beans ? brew.beans.id : "NO_ID";

  const beansRef = firestore
    .collection("users")
    .doc(userId)
    .collection("beans")
    .doc(beansId);
  const { status: beansStatus, data: beans } =
    useFirestoreDocData<Beans>(beansRef);

  const remove = () => {
    deleteBrew(firestore, userId, brewId).then(() => history.push("/brews"));
  };

  const title = "Brew details";

  // returns early if not loaded or empty
  if (brewStatus === "loading" || beansStatus === "loading") {
    return (
      <>
        <PageProgress />
        <Layout title={title}></Layout>
      </>
    );
  }

  if (!brew.date) {
    history.push("/404");
    return null;
  }

  return (
    <Layout title={title}>
      <ActionDialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        action={remove}
        actionLabel="Delete"
        title="Delete brew?"
        message={[
          "Are you sure you want to remove this brew?",
          "WARNING: this action is irreversible.",
        ]}
      />
      <ActionsMenu
        menuItems={[
          {
            primaryText: "Clone",
            secondaryText: "Copy this recipe for a new brew.",
            Icon: FileCopyIcon,
            linkTo: `/brews/${brewId}/clone`,
          },
          {
            primaryText: "Edit outcome",
            secondaryText: "Edit the brew rating.",
            Icon: StarIcon,
            linkTo: `/brews/${brewId}/outcome`,
          },
          {
            primaryText: "Edit details",
            secondaryText: "Edit the espresso details.",
            Icon: EditIcon,
            linkTo: `/brews/${brewId}/edit`,
          },
          {
            primaryText: "Remove",
            secondaryText: "Warning: irreversible action.",
            Icon: DeleteIcon,
            onClick: () => setOpenModal(true),
          },
        ]}
      />
      <Paper className={commonStyles.table}>
        <TableContainer>
          <Table aria-label="simple table">
            <TableBody>
              <TableRow>
                <TableCell className={commonStyles.label}>Rating</TableCell>
                <TableCell>
                  {brew.rating ? (
                    brew.rating
                  ) : (
                    <MuiLink
                      to={`/brews/${brewId}/outcome`}
                      component={RouterLink}
                    >
                      Rate this brew
                    </MuiLink>
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={commonStyles.label}>Notes</TableCell>
                <TableCell>
                  {brew.notes ? <Markdown md={brew.notes} /> : ""}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {brew.tastingScores &&
        !Object.values(brew.tastingScores).every((t) => t === 0) && (
          <Paper className={classes.scoresContainer}>
            <div>
              <FlavoursChart tastingScores={brew.tastingScores} />
            </div>
            <TableContainer>
              <Table aria-label="simple table">
                <TableBody>
                  <TableRow>
                    <TableCell className={commonStyles.label}>Aroma</TableCell>
                    <TableCell>
                      {brew.tastingScores.aroma ? brew.tastingScores.aroma : ""}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={commonStyles.label}>
                      Acidity
                    </TableCell>
                    <TableCell>
                      {brew.tastingScores.acidity
                        ? brew.tastingScores.acidity
                        : ""}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={commonStyles.label}>
                      Sweetness
                    </TableCell>
                    <TableCell>
                      {brew.tastingScores.sweetness
                        ? brew.tastingScores.sweetness
                        : ""}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={commonStyles.label}>Body</TableCell>
                    <TableCell>
                      {brew.tastingScores.body ? brew.tastingScores.body : ""}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={commonStyles.label}>Finish</TableCell>
                    <TableCell>
                      {brew.tastingScores.finish
                        ? brew.tastingScores.finish
                        : ""}
                    </TableCell>
                  </TableRow>
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
                <TableCell className={commonStyles.label}>Date</TableCell>
                <TableCell>
                  {renderDate(brew.date, "dd MMM yyyy @ HH:mm:ss")}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={commonStyles.label}>Method</TableCell>
                <TableCell>{brew.method}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={commonStyles.label}>Beans</TableCell>
                <TableCell>
                  <MuiLink
                    to={brew.beans ? `/beans/${brew.beans.id}` : "#"}
                    component={RouterLink}
                  >
                    {buildBeansLabel(beans, true)}
                  </MuiLink>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={commonStyles.label}>
                  Water weight
                </TableCell>
                <TableCell>
                  {brew.waterWeight ? `${brew.waterWeight} ml` : ""}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={commonStyles.label}>
                  Beans weight
                </TableCell>
                <TableCell>
                  {brew.beansWeight ? `${brew.beansWeight} g` : ""}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={commonStyles.label}>
                  Water temperature
                </TableCell>
                <TableCell>
                  {brew.waterTemperature ? `${brew.waterTemperature} °C` : ""}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={commonStyles.label}>Grinder</TableCell>
                <TableCell>{brew.grinder}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={commonStyles.label}>Burrs</TableCell>
                <TableCell>{brew.grinderBurrs}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={commonStyles.label}>
                  Grind setting
                </TableCell>
                <TableCell>{brew.grindSetting}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={commonStyles.label}>Water type</TableCell>
                <TableCell>{brew.waterType}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={commonStyles.label}>
                  Filter type
                </TableCell>
                <TableCell>{brew.filterType}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={commonStyles.label}>Time</TableCell>
                <TableCell>
                  {brew.timeMinutes || brew.timeSeconds
                    ? `${brew.timeMinutes} minutes ${brew.timeSeconds} seconds`
                    : ""}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Layout>
  );
};

export default BrewDetails;
