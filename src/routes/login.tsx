import React, { FunctionComponent } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Paper,
  Typography,
  Link as MuiLink,
  makeStyles,
  Divider,
} from "@material-ui/core";

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
