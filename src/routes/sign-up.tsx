import React, { FunctionComponent } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Paper,
  Typography,
  Link as MuiLink,
  Divider,
  makeStyles,
} from "@material-ui/core";

import Layout from "../components/layout";
import EmailPasswordForm from "../components/auth/email-password-form";
import GoogleSignIn from "../components/auth/google-sign-in";
import AnonymousSignIn from "../components/auth/anonymous-sign-in";

interface Props {
  isGuest?: boolean;
}

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2),
    textAlign: "center",
  },
  divider: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
}));

const SignUp: FunctionComponent<Props> = ({ isGuest }) => {
  const classes = useStyles();

  return (
    <Layout title="Memento" hideMenu={!isGuest} maxWidth="xs">
      <Paper className={classes.container}>
        <Typography variant="h4" component="h1" gutterBottom>
          Sign up
        </Typography>

        <EmailPasswordForm buttonLabel="Sign up" authAction={"sign-up"} />

        <Typography>or</Typography>

        <GoogleSignIn label="Sign up with Google" />
        {!isGuest && <AnonymousSignIn />}

        {!isGuest && (
          <>
            <Divider className={classes.divider} />

            <Typography>Already have an account?</Typography>
            <Typography>
              <MuiLink to="/login" component={RouterLink}>
                Log in here
              </MuiLink>
            </Typography>
          </>
        )}
      </Paper>
    </Layout>
  );
};

export default SignUp;
