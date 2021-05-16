import React, { FunctionComponent } from "react";
import { Button, makeStyles } from "@material-ui/core";
import PersonIcon from "@material-ui/icons/Person";
import clsx from "clsx";

import useCommonStyles from "../../config/use-common-styles";
import { useAuth } from "reactfire";

const useStyles = makeStyles((theme) => ({
  button: {
    marginTop: theme.spacing(2),
  },
}));

const AnonymousSignIn: FunctionComponent = () => {
  const auth = useAuth();
  const classes = useStyles();
  const commonStyles = useCommonStyles();

  const signInAnonymously = () => {
    auth
      .signInAnonymously()
      .then((result) => {
        console.log("successful login", result);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  return (
    <Button
      className={clsx(classes.button, commonStyles.formFieldWidth)}
      variant="outlined"
      color="primary"
      startIcon={<PersonIcon />}
      onClick={signInAnonymously}
    >
      Continue as guest
    </Button>
  );
};

export default AnonymousSignIn;
