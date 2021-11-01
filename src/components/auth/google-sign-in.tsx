import React, { FunctionComponent } from "react";
import { Button } from "@mui/material";
import withStyles from '@mui/styles/withStyles';
import firebase from "firebase/app";

import GoogleIcon from "../../components/icons/google";
import useCommonStyles from "../../config/use-common-styles";
import { useHistory } from "react-router-dom";
import { useAuth } from "reactfire";

interface Props {
  label: string;
}

const GoogleButton = withStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
    color: theme.palette.common.black,
    backgroundColor: theme.palette.common.white,
    "&:hover": {
      backgroundColor: theme.palette.grey[400],
    },
  },
}))(Button);

const GoogleSignIn: FunctionComponent<Props> = ({ label }) => {
  const auth = useAuth();
  const history = useHistory();
  const commonStyles = useCommonStyles();

  const signInWithGoogle = () => {
    const currentUser = auth.currentUser;
    const googleProvider = new firebase.auth.GoogleAuthProvider();

    const firebaseAuthPromise = currentUser
      ? currentUser.linkWithRedirect(googleProvider)
      : auth.signInWithRedirect(googleProvider);

    firebaseAuthPromise
      .then(() => {
        console.log("successful google auth action");
        history.push("/");
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  return (
    <GoogleButton
      className={commonStyles.formFieldWidth}
      variant="contained"
      color="primary"
      startIcon={<GoogleIcon />}
      onClick={signInWithGoogle}
    >
      {label}
    </GoogleButton>
  );
};

export default GoogleSignIn;
