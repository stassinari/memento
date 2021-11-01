import { Button, Fade, Paper, TextField } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import { Alert, AlertTitle } from '@mui/material';
import { Field, Form, Formik } from "formik";
import React, { FunctionComponent, useState } from "react";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import { useFirestore, useFirestoreDocData, useUser } from "reactfire";
import Layout from "../components/layout";
import { PoweredBy } from "../components/markdown";
import OutcomeFlavours from "../components/outcome-flavours";
import PageProgress from "../components/page-progress";
import SimpleSlider from "../components/simple-slider";
import { updateEspresso } from "../database/queries";
import {
  EspressoOutcome as IEspressoOutcome,
  EspressoPrep,
} from "../database/types/espresso";

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
      marginBottom: theme.spacing(2),
    },
    buttonContainer: {
      textAlign: "right",
      marginTop: theme.spacing(1),
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

const EspressoOutcome: FunctionComponent = () => {
  const {
    data: { uid: userId },
  } = useUser();
  const firestore = useFirestore();
  const classes = useStyles();

  const params = useParams<RouteParams>();
  const espressoId = params.id;
  const history = useHistory();
  const query = new URLSearchParams(useLocation().search);
  const success = query.get("success") === "true";

  const [alertOpen, setAlertOpen] = useState(success);

  const espressoRef = firestore
    .collection("users")
    .doc(userId)
    .collection("espresso")
    .doc(espressoId);
  const { status, data: espresso } = useFirestoreDocData<
    IEspressoOutcome & Partial<EspressoPrep>
  >(espressoRef);

  const title = "Edit espresso outcome";

  if (status === "loading") {
    return (
      <>
        <PageProgress />
        <Layout title={title}></Layout>
      </>
    );
  }

  // merge with emptyValues (precedence to FS values first)
  const initialValues = { ...emptyValues, ...espresso };

  return (
    <Layout title={title}>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          updateEspresso(firestore, userId, values, params.id).then(() => {
            history.push(`/espresso/${params.id}`);
          });
        }}
      >
        {(formik) => {
          return (
            <>
              <Fade in={alertOpen} unmountOnExit>
                <Alert
                  className={classes.alert}
                  onClose={() => setAlertOpen(false)}
                >
                  <AlertTitle>Espresso successfully added</AlertTitle>
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
                      to={`/espresso/${params.id}`}
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
          );
        }}
      </Formik>
    </Layout>
  );
};

export default EspressoOutcome;
