import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Fade,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputAdornment,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { Field, Form, Formik } from "formik";
import React, { FunctionComponent, useState } from "react";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import { useFirestore, useFirestoreDocData, useUser } from "reactfire";
import Layout from "../components/layout";
import { PoweredBy } from "../components/markdown";
import OutcomeFlavours from "../components/outcome-flavours";
import PageProgress from "../components/page-progress";
import SimpleSlider from "../components/simple-slider";
import useCommonStyles from "../config/use-common-styles";
import { updateBrew } from "../database/queries";
import { Brew } from "../database/types/brew";

interface RouteParams {
  id: string;
}

const useStyles = makeStyles((theme) => {
  return {
    alert: {
      marginBottom: theme.spacing(2),
    },
    formContainer: {
      padding: theme.spacing(2),
    },
    buttonContainer: {
      textAlign: "right",
      marginTop: theme.spacing(2),
    },
    backButton: {
      marginRight: theme.spacing(2),
    },
  };
});

const emptyValues = {
  rating: 0,
  notes: "",
  tastingScores: { aroma: 0, acidity: 0, sweetness: 0, body: 0, finish: 0 },
  tds: 0,
  finalBrewWeight: 0,
  extractionType: "percolation",
};

const BrewOutcome: FunctionComponent = () => {
  const {
    data: { uid: userId },
  } = useUser();
  const firestore = useFirestore();
  const classes = useStyles();
  const commonStyles = useCommonStyles();

  const params = useParams<RouteParams>();
  const brewId = params.id;
  const history = useHistory();
  const query = new URLSearchParams(useLocation().search);
  const success = query.get("success") === "true";

  const brewRef = firestore
    .collection("users")
    .doc(userId)
    .collection("brews")
    .doc(brewId);
  const { status: brewStatus, data: brew } = useFirestoreDocData<Brew>(brewRef);

  const [alertOpen, setAlertOpen] = useState(success);

  const title = "Edit brew outcome";

  if (brewStatus === "loading") {
    return (
      <>
        <PageProgress />
        <Layout title={title}></Layout>
      </>
    );
  }

  // merge with emptyValues (precedence to FS values first)
  const initialValues = { ...emptyValues, ...brew };

  return (
    <Layout title={title}>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          updateBrew(firestore, userId, values, params.id).then(() => {
            history.push(`/brews/${params.id}`);
          });
        }}
      >
        {(formik) => (
          <>
            <Fade in={alertOpen} unmountOnExit>
              <Alert
                className={classes.alert}
                onClose={() => setAlertOpen(false)}
              >
                <AlertTitle>Brew successfully added</AlertTitle>
                Sit back and enjoy your coffee!
                <br />
                When you're ready, come back here and fill out your tasting
                notes.
              </Alert>
            </Fade>
            <Paper className={classes.formContainer}>
              <Form>
                <Typography
                  variant="h6"
                  component="h2"
                  className={commonStyles.equipmentHeading}
                >
                  Tasting notes
                </Typography>

                <SimpleSlider name="rating" label="Rating" step={0.5} />

                <div>
                  <Field
                    as={TextField}
                    type="text"
                    name="notes"
                    margin="normal"
                    multiline
                    rows={3}
                    rowsMax={Infinity}
                    fullWidth
                    label="Notes"
                    variant="outlined"
                  />
                </div>
                <PoweredBy />

                <OutcomeFlavours />

                <Typography
                  variant="h6"
                  component="h2"
                  className={commonStyles.equipmentHeading}
                >
                  Extraction
                </Typography>

                <Box mt={1}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Extraction type</FormLabel>
                    <Field
                      as={RadioGroup}
                      aria-label="extraction type"
                      row
                      name="extractionType"
                      value={formik.values.extractionType}
                    >
                      <FormControlLabel
                        value="percolation"
                        control={<Radio size="small" />}
                        name="extractionType"
                        id="percolation"
                        label="Percolation"
                      />
                      <FormControlLabel
                        value="immersion"
                        control={<Radio size="small" />}
                        name="extractionType"
                        id="immersion"
                        label="Immersion"
                      />
                    </Field>
                  </FormControl>
                </Box>

                <div>
                  <Field
                    as={TextField}
                    className={commonStyles.formFieldWidth}
                    type="number"
                    inputMode="decimal"
                    name="tds"
                    margin="normal"
                    label="TDS"
                    placeholder="E.g: 1.3"
                    inputProps={{ step: "any" }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">%</InputAdornment>
                      ),
                    }}
                    variant="outlined"
                  />
                </div>

                <div>
                  <Field
                    as={TextField}
                    className={commonStyles.formFieldWidth}
                    type="number"
                    inputMode="decimal"
                    name="finalBrewWeight"
                    margin="normal"
                    label="Final brew weight"
                    placeholder="E.g: 210"
                    inputProps={{ step: "any" }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">g</InputAdornment>
                      ),
                    }}
                    variant="outlined"
                  />
                </div>

                <div className={classes.buttonContainer}>
                  <Button
                    color="secondary"
                    className={classes.backButton}
                    component={Link}
                    to={`/brews/${params.id}`}
                  >
                    Back to details
                  </Button>
                  <Button type="submit" variant="contained" color="primary">
                    Rate
                  </Button>
                </div>
              </Form>
            </Paper>
          </>
        )}
      </Formik>
    </Layout>
  );
};

export default BrewOutcome;
