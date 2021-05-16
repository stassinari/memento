import React, { FunctionComponent, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Button,
  Paper,
  TextField,
  Typography,
  Link as MuiLink,
  makeStyles,
  Divider,
} from "@material-ui/core";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import VpnKeyIcon from "@material-ui/icons/VpnKey";

import Layout from "../components/layout";
import useCommonStyles from "../config/use-common-styles";
import clsx from "clsx";
import { useAuth } from "reactfire";

const emailSchema = Yup.object().shape({
  email: Yup.string()
    .required("Please enter your email address.")
    .email("Please enter a valid email address."),
});

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2),
    textAlign: "center",
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

const ResetPassword: FunctionComponent = () => {
  const auth = useAuth();
  const classes = useStyles();
  const commonStyles = useCommonStyles();
  const [authError, setAuthError] = useState("");

  const [resetSuccessful, setResetSuccessful] = useState(false);

  return (
    <Layout title="Memento" hideMenu={true} maxWidth="xs">
      <Paper className={classes.container}>
        {resetSuccessful ? (
          <Typography>
            You should receive an email shortly with instructiont to reset your
            password.
          </Typography>
        ) : (
          <Formik
            initialValues={{ email: "" }}
            validationSchema={emailSchema}
            onSubmit={(values) => {
              auth
                .sendPasswordResetEmail(values.email)
                .then((result) => {
                  setAuthError("");
                  setResetSuccessful(true);
                  console.log("reset password sent", result);
                })
                .catch((error) => {
                  setAuthError(error.message);
                  console.log("error", error);
                });
            }}
          >
            {(formik) => {
              const showEmailError =
                formik.errors.email && formik.touched.email;

              return (
                <Form noValidate>
                  <div>
                    <Field
                      as={TextField}
                      className={commonStyles.formFieldWidth}
                      type="email"
                      name="email"
                      label="Email"
                      variant="outlined"
                      margin="dense"
                      size="small"
                      error={showEmailError || !!authError}
                      helperText={
                        (showEmailError && formik.errors.email) ||
                        (!!authError && authError)
                      }
                    />
                  </div>
                  <Button
                    className={clsx(
                      classes.button,
                      commonStyles.formFieldWidth
                    )}
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<VpnKeyIcon />}
                  >
                    Send reset password link
                  </Button>

                  <Divider className={classes.divider} />
                  <Typography>Ended up on the wrong page?</Typography>
                  <Typography>
                    <MuiLink to="/login" component={RouterLink}>
                      Log in
                    </MuiLink>{" "}
                    or{" "}
                    <MuiLink to="/sign-up" component={RouterLink}>
                      sign up
                    </MuiLink>
                  </Typography>
                </Form>
              );
            }}
          </Formik>
        )}
      </Paper>
    </Layout>
  );
};

export default ResetPassword;
