import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  FileCopy as FileCopyIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import {
  Alert,
  Button,
  Link as MuiLink,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import React from "react";
import {
  Link,
  Link as RouterLink,
  useHistory,
  useParams,
} from "react-router-dom";
import { useFirestore, useFirestoreDocData, useUser } from "reactfire";
import ActionDialog from "../components/action-dialog";
import ActionsMenu from "../components/actions-menu";
import DecentChart from "../components/espresso/decent-chart";
import TemperaturesChart from "../components/espresso/temperatures-charts";
import ExtractionYield from "../components/extraction-yield";
import FlavoursChart from "../components/flavours-chart";
import Layout from "../components/layout";
import Markdown from "../components/markdown";
import PageProgress from "../components/page-progress";
import useCommonStyles from "../config/use-common-styles";
import { deleteEspresso } from "../database/queries";
import { Beans } from "../database/types/beans";
import { DecentReadings, Espresso } from "../database/types/espresso";
import { buildBeansLabel } from "../utils/beans";
import { renderDate } from "../utils/dates";
import { capitalise } from "../utils/string";

interface RouteParams {
  id: string;
}

const useStyles = makeStyles((theme) => ({
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(12, 1fr)",
    gridGap: theme.spacing(2),
  },
  chartsContainer: {
    gridColumnEnd: "span 12",
    [theme.breakpoints.up("lg")]: {
      gridColumnEnd: "span 7",
      height: "fit-content",
    },
    [theme.breakpoints.up("xl")]: {
      gridColumnEnd: "span 8",
      height: "fit-content",
    },
  },
  scoresContainer: {
    [theme.breakpoints.up("sm")]: {
      display: "grid",
      gridTemplateColumns: "65% 35%",
    },
    marginBottom: theme.spacing(2),
  },
  mainChart: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  temperatureChart: {
    padding: theme.spacing(2),
  },
  details: {
    gridColumnEnd: "span 12",
    [theme.breakpoints.up("lg")]: {
      gridColumnEnd: "span 5",
      order: "-1",
    },
    [theme.breakpoints.up("xl")]: {
      gridColumnEnd: "span 4",
    },
  },
  alert: {
    marginBottom: theme.spacing(2),
  },
  alertButton: {
    marginTop: theme.spacing(2),
  },
}));

const EspressoDetails = () => {
  const {
    data: { uid: userId },
  } = useUser();
  const firestore = useFirestore();
  const history = useHistory();

  const classes = useStyles();
  const commonStyles = useCommonStyles();

  const [openModal, setOpenModal] = React.useState(false);

  const params = useParams<RouteParams>();
  const espressoId = params.id;

  const espressoRef = firestore
    .collection("users")
    .doc(userId)
    .collection("espresso")
    .doc(espressoId);
  const { status: espressoStatus, data: espresso } =
    useFirestoreDocData<Espresso>(espressoRef);

  const decentReadingsRef = espressoRef
    .collection("decentReadings")
    .doc("decentReadings");
  const { status: decentReadingsStatus, data: decentReadings } =
    useFirestoreDocData<DecentReadings>(decentReadingsRef);

  const beansId = espresso?.beans ? espresso.beans.id : "NO_ID";

  const beansRef = firestore
    .collection("users")
    .doc(userId)
    .collection("beans")
    .doc(beansId);
  const { status: beansStatus, data: beans } =
    useFirestoreDocData<Beans>(beansRef);

  const remove = () => {
    history.push("/espresso");
    deleteEspresso(firestore, userId, espressoId);
  };

  const title = "Espresso details";

  if (
    espressoStatus === "loading" ||
    decentReadingsStatus === "loading" ||
    beansStatus === "loading"
  ) {
    return (
      <>
        <PageProgress />
        <Layout title={title}></Layout>
      </>
    );
  }

  if (!espresso.date) {
    history.push("/404");
    return null;
  }

  return (
    <Layout title={title} maxWidth={espresso.fromDecent ? "xl" : "sm"}>
      <ActionDialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        action={remove}
        actionLabel="Delete"
        title="Delete espresso?"
        message={[
          "Are you sure you want to remove this espresso?",
          "WARNING: this action is irreversible.",
        ]}
      />
      <ActionsMenu
        menuItems={[
          ...(!espresso.fromDecent
            ? [
                {
                  primaryText: "Clone",
                  secondaryText: "Copy this recipe for a new espresso.",
                  Icon: FileCopyIcon,
                  linkTo: `/espresso/${espressoId}/clone`,
                },
              ]
            : []),
          {
            primaryText: "Edit outcome",
            secondaryText: "Edit the espresso rating.",
            Icon: StarIcon,
            linkTo: `/espresso/${espressoId}/outcome`,
          },
          {
            primaryText: "Edit details",
            secondaryText: "Edit the espresso details.",
            Icon: EditIcon,
            linkTo: espresso.fromDecent
              ? `/espresso/${espressoId}/decent/edit`
              : `/espresso/${espressoId}/edit`,
          },
          {
            primaryText: "Remove",
            secondaryText: "Warning: irreversible action.",
            Icon: DeleteIcon,
            onClick: () => setOpenModal(true),
          },
        ]}
      />
      <div className={espresso.fromDecent ? classes.grid : ""}>
        {espresso.fromDecent && (
          <div className={classes.chartsContainer}>
            <Paper className={classes.mainChart}>
              <DecentChart
                readings={decentReadings}
                profileName={espresso.profileName}
              />
            </Paper>
            <Paper className={classes.temperatureChart}>
              <TemperaturesChart readings={decentReadings} />
            </Paper>
          </div>
        )}
        <div className={classes.details}>
          {espresso.partial && (
            <Alert severity="warning" className={classes.alert}>
              You haven't filled in any details about this espresso yet.
              <div>
                <Button
                  color="inherit"
                  variant="outlined"
                  size="small"
                  component={Link}
                  to={`/espresso/${espressoId}/decent`}
                  className={classes.alertButton}
                >
                  Add espresso details
                </Button>
              </div>
            </Alert>
          )}
          <Paper className={commonStyles.table}>
            <TableContainer>
              <Table aria-label="simple table">
                <TableBody>
                  <TableRow>
                    <TableCell className={commonStyles.label}>Rating</TableCell>
                    <TableCell>
                      {espresso.rating ? (
                        espresso.rating
                      ) : (
                        <MuiLink
                          to={`/espresso/${espressoId}/outcome`}
                          component={RouterLink}
                        >
                          Rate this espresso
                        </MuiLink>
                      )}
                    </TableCell>
                  </TableRow>

                  <ExtractionYield
                    tds={espresso.tds}
                    weight={Number(
                      espresso.actualWeight || espresso.targetWeight
                    )}
                    dose={Number(espresso.beansWeight)}
                  />

                  <TableRow>
                    <TableCell className={commonStyles.label}>Notes</TableCell>
                    <TableCell>
                      {espresso.notes ? <Markdown md={espresso.notes} /> : ""}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {espresso.tastingScores &&
            !Object.values(espresso.tastingScores).every((t) => t === 0) && (
              <Paper className={classes.scoresContainer}>
                <div>
                  <FlavoursChart tastingScores={espresso.tastingScores} />
                </div>
                <TableContainer>
                  <Table aria-label="simple table">
                    <TableBody>
                      <TableRow>
                        <TableCell className={commonStyles.label}>
                          Aroma
                        </TableCell>
                        <TableCell>
                          {espresso.tastingScores.aroma
                            ? espresso.tastingScores.aroma
                            : ""}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className={commonStyles.label}>
                          Acidity
                        </TableCell>
                        <TableCell>
                          {espresso.tastingScores.acidity
                            ? espresso.tastingScores.acidity
                            : ""}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className={commonStyles.label}>
                          Sweetness
                        </TableCell>
                        <TableCell>
                          {espresso.tastingScores.sweetness
                            ? espresso.tastingScores.sweetness
                            : ""}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className={commonStyles.label}>
                          Body
                        </TableCell>
                        <TableCell>
                          {espresso.tastingScores.body
                            ? espresso.tastingScores.body
                            : ""}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className={commonStyles.label}>
                          Finish
                        </TableCell>
                        <TableCell>
                          {espresso.tastingScores.finish
                            ? espresso.tastingScores.finish
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
                      {renderDate(espresso.date, "dd MMM yyyy @ HH:mm")}
                    </TableCell>
                  </TableRow>
                  {espresso.profileName && (
                    <TableRow>
                      <TableCell className={commonStyles.label}>
                        Decent profile
                      </TableCell>
                      <TableCell>{espresso.profileName}</TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell className={commonStyles.label}>Beans</TableCell>
                    <TableCell>
                      <MuiLink
                        to={
                          espresso.beans ? `/beans/${espresso.beans.id}` : "#"
                        }
                        component={RouterLink}
                      >
                        {buildBeansLabel(beans, true)}
                      </MuiLink>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={commonStyles.label}>
                      Final weight
                    </TableCell>
                    <TableCell>
                      {espresso.actualWeight
                        ? `${espresso.actualWeight} g`
                        : ""}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={commonStyles.label}>
                      Beans weight
                    </TableCell>
                    <TableCell>
                      {espresso.beansWeight ? `${espresso.beansWeight} g` : ""}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={commonStyles.label}>Time</TableCell>
                    <TableCell>
                      {espresso.actualTime
                        ? `${espresso.actualTime} seconds`
                        : ""}{" "}
                    </TableCell>
                  </TableRow>
                  {!espresso.fromDecent && (
                    <TableRow>
                      <TableCell className={commonStyles.label}>
                        Water temperature
                      </TableCell>
                      <TableCell>
                        {espresso.waterTemperature
                          ? `${espresso.waterTemperature} °C`
                          : ""}
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell className={commonStyles.label}>
                      Grind setting
                    </TableCell>
                    <TableCell>{espresso.grindSetting}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={commonStyles.label}>
                      Machine
                    </TableCell>
                    <TableCell>{espresso.machine}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={commonStyles.label}>
                      Grinder
                    </TableCell>
                    <TableCell>{espresso.grinder}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={commonStyles.label}>Burrs</TableCell>
                    <TableCell>{espresso.grinderBurrs}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={commonStyles.label}>
                      Portafilter
                    </TableCell>
                    <TableCell>{capitalise(espresso.portafilter)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={commonStyles.label}>Basket</TableCell>
                    <TableCell>{espresso.basket}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </div>
      </div>
    </Layout>
  );
};

export default EspressoDetails;
