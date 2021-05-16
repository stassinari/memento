import React, { useState, FunctionComponent } from "react";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import { Paper, Button, TextField, Fade } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Alert, AlertTitle } from "@material-ui/lab";

import { updateBrew } from "../database/queries";
import PageProgress from "../components/page-progress";
import SimpleSlider from "../components/simple-slider";
import Layout from "../components/layout";
import { PoweredBy } from "../components/markdown";
import OutcomeFlavours from "../components/outcome-flavours";
import { useUser, useFirestore, useFirestoreDocData } from "reactfire";

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
};

const BrewOutcome: FunctionComponent = () => {
  const {
    data: { uid: userId },
  } = useUser();
  const firestore = useFirestore();
  const classes = useStyles();

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
        {() => (
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

                <div className={classes.buttonContainer}>
                  <Button
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
