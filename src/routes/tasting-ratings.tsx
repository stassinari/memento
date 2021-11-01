import {
  Avatar,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import EditIcon from "@mui/icons-material/Edit";
import { Alert } from '@mui/material';
import { Form, Formik } from "formik";
import React, { FunctionComponent, useState } from "react";
import {
  Link,
  NavLink,
  Route,
  Switch,
  useHistory,
  useLocation,
  useParams,
  useRouteMatch,
} from "react-router-dom";
import {
  useFirestore,
  useFirestoreCollectionData,
  useFirestoreDocData,
  useUser,
} from "reactfire";
import { AutoSave } from "../components/autosave";
import Layout from "../components/layout";
import PageProgress from "../components/page-progress";
import { TastingPrepForm } from "../components/tastings/tasting-prep-form";
import TastingSingleRating from "../components/tastings/tasting-single-rating";
import { updateTastingSamples } from "../database/queries";
import { Beans } from "../database/types/beans";
import { Brew } from "../database/types/brew";
import {
  Tasting,
  TastingPrep,
  TastingRating,
  TastingSample,
  TastingVariable,
} from "../database/types/tasting";
import { buildBeansLabel } from "../utils/beans";
import { tastingVariablesList } from "../utils/constants";
import { SUGGESTIONS_HISTORY_LIMIT } from "../utils/form";

interface RouteParams {
  id: string;
}

interface FormResults {
  ratings: TastingRating[];
}

const emptyRatingValues: TastingRating = {
  overall: 0,
  flavours: [],
  aromaQuantity: 0,
  aromaQuality: 0,
  aromaNotes: "",
  acidityQuantity: 0,
  acidityQuality: 0,
  acidityNotes: "",
  sweetnessQuantity: 0,
  sweetnessQuality: 0,
  sweetnessNotes: "",
  bodyQuantity: 0,
  bodyQuality: 0,
  bodyNotes: "",
  finishQuantity: 0,
  finishQuality: 0,
  finishNotes: "",
};

const useStyles = makeStyles((theme) => {
  return {
    container: {
      padding: theme.spacing(2),
    },
    rightGrid: {
      paddingTop: "0 !important",
      paddingBottom: "0 !important",
    },
    rightPaper: {
      padding: theme.spacing(1),
    },
    pageHeading: {
      marginBottom: theme.spacing(4),
      textAlign: "center",
      [theme.breakpoints.up("md")]: {
        textAlign: "left",
      },
    },
    ratingHeader: {
      display: "flex",
      justifyContent: "space-between",
    },
    alert: {
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(2),
    },
    listItem: {
      "&.active": {
        backgroundColor: theme.palette.grey[200],
      },
    },
    mobileNavigationContainer: {
      marginTop: theme.spacing(-2),
      display: "flex",
      justifyContent: "space-between",
      alignItems: "start",
      marginBottom: theme.spacing(3),
    },
    mobileNavigationCentre: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginTop: theme.spacing(1),
    },
    mobileNavigationCounter: {
      marginTop: theme.spacing(1),
    },
    sampleName: {
      paddingTop: theme.spacing(1),
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    submitButtonContainer: {
      marginTop: theme.spacing(3),
    },
    dialog: {
      marginBottom: theme.spacing(1),
    },
  };
});

const buildSampleName = (
  tastingVariable: TastingVariable,
  sample: TastingSample,
  beans: Beans[]
) => {
  let name: string;
  if (tastingVariable === "beans") {
    const beansId = (sample.variableValue as any).id;
    const b = beans.find((bnz) => bnz.id === beansId);
    name = buildBeansLabel(b, false);
  } else {
    name = sample.variableValue as string;
  }
  return name;
};

interface SampleListProps {
  url: string;
  samples?: TastingSample[];
  activeSampleIndex?: number;
  tastingVariable: TastingVariable;
  beans: Beans[];
}

const SamplesList: FunctionComponent<SampleListProps> = ({
  url,
  samples = [],
  tastingVariable,
  beans,
}) => {
  const classes = useStyles();
  return (
    <List component="nav">
      {samples.map((s, i) => (
        <ListItem
          key={i}
          button
          component={NavLink}
          to={`${url}/sample${i}`}
          className={classes.listItem}
        >
          <ListItemAvatar>
            <Avatar>#{i + 1}</Avatar>
          </ListItemAvatar>
          <ListItemText primary={buildSampleName(tastingVariable, s, beans)} />
        </ListItem>
      ))}
    </List>
  );
};

interface MobileNavigationProps {
  url: string;
  numberOfSamples: number;
  activeIndex: number;
}

const MobileNavigation: FunctionComponent<MobileNavigationProps> = ({
  url,
  numberOfSamples,
  activeIndex,
}) => {
  const classes = useStyles();
  return (
    <div className={classes.mobileNavigationContainer}>
      <IconButton
        component={Link}
        to={`${url}/sample${activeIndex - 1}`}
        disabled={activeIndex === 0}
        aria-label="previous sample"
        size="large">
        <ChevronLeftIcon />
      </IconButton>
      <div className={classes.mobileNavigationCentre}>
        <Button variant="contained" size="small" component={Link} to={`${url}`}>
          View all
        </Button>
        <Typography
          variant="caption"
          className={classes.mobileNavigationCounter}
        >
          {activeIndex + 1}/{numberOfSamples}
        </Typography>
      </div>
      <IconButton
        component={Link}
        to={`${url}/sample${activeIndex + 1}`}
        disabled={activeIndex === numberOfSamples - 1}
        aria-label="next sample"
        size="large">
        <ChevronRightIcon />
      </IconButton>
    </div>
  );
};

const TastingRatings = () => {
  const {
    data: { uid: userId },
  } = useUser();
  const firestore = useFirestore();
  const history = useHistory();
  const { url, path } = useRouteMatch();
  const location = useLocation();

  const params = useParams<RouteParams>();
  const tastingId = params.id;

  const activeSampleIndex = parseInt(
    location.pathname.replace(`${url}/sample`, "")
  );

  const classes = useStyles();
  const theme = useTheme();
  const isBreakpointMd = useMediaQuery(theme.breakpoints.up("md"));

  const [openDialog, setOpenDialog] = useState(false);

  const tastingRef = firestore
    .collection("users")
    .doc(userId)
    .collection("tastings")
    .doc(tastingId);
  const { status: tastingStatus, data: tasting } =
    useFirestoreDocData<Tasting>(tastingRef);

  const brewsQuery = useFirestore()
    .collection("users")
    .doc(userId)
    .collection("brews")
    .orderBy("date", "desc")
    .limit(SUGGESTIONS_HISTORY_LIMIT);
  const { status: brewsStatus, data: brews } = useFirestoreCollectionData<Brew>(
    brewsQuery,
    {
      idField: "id",
    }
  );

  const beansQuery = useFirestore()
    .collection("users")
    .doc(userId)
    .collection("beans")
    .orderBy("roastDate", "desc");
  const { status: beansStatus, data: beans } =
    useFirestoreCollectionData<Beans>(beansQuery, {
      idField: "id",
    });

  const title = "Tasting ratings";

  if (
    tastingStatus === "loading" ||
    brewsStatus === "loading" ||
    beansStatus === "loading"
  ) {
    return (
      <>
        <PageProgress />
        <Layout title={title}></Layout>
      </>
    );
  }

  if (!tasting.prepDone) history.push(`/tastings/${tastingId}/prep`);
  const actualRatings = tasting.samples.map((s) => ({
    ...emptyRatingValues,
    ...s.rating,
  }));
  const initialValues: FormResults = { ratings: actualRatings };

  return (
    <Layout title={title} maxWidth="md">
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        className={classes.pageHeading}
      >
        {tasting?.variable === "beans"
          ? "Beans"
          : tastingVariablesList.find((v) => v.value === tasting?.variable)
              ?.label}{" "}
        tasting
      </Typography>

      {!isBreakpointMd && activeSampleIndex >= 0 && (
        <MobileNavigation
          url={url}
          numberOfSamples={tasting?.samples.length!}
          activeIndex={activeSampleIndex}
        />
      )}

      <Formik
        initialValues={initialValues}
        onSubmit={(values, formikHelpers) => {
          const newSamples = tasting?.samples.map((s, i) => ({
            ...s,
            rating: values.ratings[i],
          }));
          updateTastingSamples(firestore, userId, tastingId, newSamples!).then(
            () => {
              formikHelpers.setSubmitting(false);
            }
          );
        }}
      >
        <Form>
          <Paper>
            <Grid container spacing={2}>
              {isBreakpointMd && (
                <Grid item md={4}>
                  <SamplesList
                    url={url}
                    samples={tasting?.samples}
                    activeSampleIndex={activeSampleIndex}
                    tastingVariable={tasting?.variable!}
                    beans={beans}
                  />
                </Grid>
              )}

              <Grid item xs={12} md={8} className={classes.rightGrid}>
                <Switch>
                  <Route exact path={`${path}`}>
                    {isBreakpointMd ? (
                      <Alert severity="info" className={classes.alert}>
                        Click on the items on the left to edit samples.
                      </Alert>
                    ) : (
                      <Grid item xs={12}>
                        <SamplesList
                          url={url}
                          samples={tasting?.samples}
                          tastingVariable={tasting?.variable!}
                          beans={beans}
                        />
                      </Grid>
                    )}
                  </Route>

                  {tasting?.samples.map((s, i) => {
                    const sampleName = buildSampleName(
                      tasting.variable,
                      s,
                      beans
                    );

                    const handleSubmit = (values: TastingPrep) => {
                      // update samples array with these values
                      const allPreps = tasting?.samples.map((s) => s.prep);
                      const updatedPreps = [
                        ...allPreps.slice(0, i),
                        values,
                        ...allPreps.slice(i + 1),
                      ];
                      const updatedSamples = tasting?.samples.map((s, i) => ({
                        ...s,
                        prep: updatedPreps[i],
                      }));
                      updateTastingSamples(
                        firestore,
                        userId,
                        tastingId,
                        updatedSamples!
                      ).then(() => {
                        setOpenDialog(false);
                      });
                    };
                    return (
                      <Route exact path={`${path}/sample${i}`} key={i}>
                        <Paper
                          className={classes.rightPaper}
                          elevation={isBreakpointMd ? 2 : 0}
                        >
                          <div className={classes.ratingHeader}>
                            <Typography
                              variant="h5"
                              component="h2"
                              className={classes.sampleName}
                            >
                              {sampleName}
                            </Typography>

                            <Button
                              variant="outlined"
                              color="primary"
                              startIcon={<EditIcon />}
                              onClick={() => setOpenDialog(true)}
                            >
                              Prep
                            </Button>
                          </div>

                          <Dialog
                            fullWidth={true}
                            maxWidth="xs"
                            open={openDialog}
                            onClose={() => setOpenDialog(false)}
                          >
                            <DialogTitle>
                              Edit prep for {sampleName}
                            </DialogTitle>
                            <DialogContent className={classes.dialog}>
                              <TastingPrepForm
                                handleSubmit={handleSubmit}
                                initialValues={s.prep!}
                                tastingVariable={tasting.variable}
                                brews={brews}
                                beans={beans.filter((b) => !b.isFinished)}
                                container={false}
                                submitButtonLabel="Edit"
                              />
                            </DialogContent>
                          </Dialog>

                          <TastingSingleRating
                            prep={s.prep!}
                            tastingVariable={tasting!.variable}
                            formId={`ratings[${i}]`}
                            index={i}
                          />
                        </Paper>
                      </Route>
                    );
                  })}
                </Switch>
              </Grid>
            </Grid>
          </Paper>
          <div className={classes.submitButtonContainer}>
            <Button type="submit" variant="contained" color="primary">
              Save!
            </Button>
            <AutoSave debounceMs={3000} />
          </div>
        </Form>
      </Formik>
    </Layout>
  );
};

export default TastingRatings;
