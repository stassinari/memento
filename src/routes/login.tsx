import React, { FunctionComponent } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Paper, Typography, Link as MuiLink, Divider } from "@mui/material";

import makeStyles from '@mui/styles/makeStyles';

import Layout from "../components/layout";
import EmailPasswordForm from "../components/auth/email-password-form";
import GoogleSignIn from "../components/auth/google-sign-in";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2),
    textAlign: "center",
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

const Login: FunctionComponent = () => {
  const classes = useStyles();
  return (
    <Layout title="Memento" hideMenu={true} maxWidth="xs">
      <Paper className={classes.container}>
        <Typography variant="h4" component="h1" gutterBottom>
          Log in
        </Typography>
        <EmailPasswordForm buttonLabel="Log in" authAction={"login"} />

        <Typography>or</Typography>

        <GoogleSignIn label="Log in with Google" />

        <Divider className={classes.divider} />

        <Typography>Don't have an account yet?</Typography>
        <Typography>
          <MuiLink to="/sign-up" component={RouterLink}>
            Sign up here
          </MuiLink>
        </Typography>
      </Paper>
    </Layout>
  );
};

export default Login;
