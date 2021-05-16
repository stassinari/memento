import React, { FunctionComponent, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import clsx from "clsx";
import {
  Button,
  TextField,
  Typography,
  Link as MuiLink,
  makeStyles,
} from "@material-ui/core";
import { Formik, Form, Field } from "formik";
import EmailIcon from "@material-ui/icons/Email";
import * as Yup from "yup";
import firebase from "firebase/app";

import useCommonStyles from "../../config/use-common-styles";
import { useAuth } from "reactfire";

interface Props {
  buttonLabel: string;
  authAction: "login" | "sign-up";
}

const emailPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .required("Please enter your email address.")
    .email("Please enter a valid email address."),
  password: Yup.string()
    .required("Please enter a password")
    .min(6, "Password needs to be at least 6 characters."),
});

const useStyles = makeStyles((theme) => ({
  fieldsContainer: {
    marginLeft: "auto",
    marginRight: "auto",
    textAlign: "left",
  },
  button: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

const EmailPasswordForm: FunctionComponent<Props> = ({
  buttonLabel,
  authAction,
}) => {
  const auth = useAuth();
  const classes = useStyles();
  const commonStyles = useCommonStyles();
  const [authError, setAuthError] = useState("");
  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={emailPasswordSchema}
      onSubmit={(values) => {
        const currentUser = auth.currentUser;
        const firebaseAuthPromise =
          authAction === "sign-up"
            ? currentUser
              ? currentUser.linkWithCredential(
                  firebase.auth.EmailAuthProvider.credential(
                    values.email,
                    values.password
                  )
                )
              : auth.createUserWithEmailAndPassword(
                  values.email,
                  values.password
                )
            : auth.signInWithEmailAndPassword(values.email, values.password);
        firebaseAuthPromise
          .then((result) => {
            setAuthError("");
            console.log(`successful ${authAction}`);
          })
          .catch((error) => {
            setAuthError(error.message);
            console.log("error", error);
          });
      }}
    >
      {(formik) => {
        const showEmailError = formik.errors.email && formik.touched.email;
        const showPasswordError =
          formik.errors.password && formik.touched.password;
        return (
          <Form noValidate>
            <div
              className={clsx(
                classes.fieldsContainer,
                commonStyles.formFieldWidth
              )}
            >
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
              <Field
                as={TextField}
                className={commonStyles.formFieldWidth}
                name="password"
                label="Password"
                type="password"
                autoComplete="current-password"
                variant="outlined"
                margin="dense"
                size="small"
                error={showPasswordError}
                helperText={showPasswordError && formik.errors.password}
              />
              <Typography>
                <MuiLink to="/reset-password" component={RouterLink}>
                  Forgot password?
                </MuiLink>
              </Typography>
            </div>
            <Button
              className={clsx(classes.button, commonStyles.formFieldWidth)}
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<EmailIcon />}
            >
              {buttonLabel}
            </Button>
          </Form>
        );
      }}
    </Formik>
  );
};

export default EmailPasswordForm;
