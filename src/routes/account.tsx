import {
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import ErrorIcon from "@mui/icons-material/Error";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import PersonIcon from "@mui/icons-material/Person";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import React, { FunctionComponent, useContext } from "react";
import { Link } from "react-router-dom";
import { useAuth, useFirestore, useFirestoreDocData, useUser } from "reactfire";
import { ThemeContext } from "../components/app";
import Layout from "../components/layout";
import { ThemePreference } from "../config/mui-theme";
import useCommonStyles from "../config/use-common-styles";
import { generateSecretKey } from "../database/queries";
import { User } from "../database/types/common";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  infoParagraph: {
    marginBottom: theme.spacing(2),
  },
  email: {
    marginTop: theme.spacing(2),
  },
  headingWithIcon: {
    display: "flex",
    alignItems: "center",
  },
  headingIcon: {
    marginRight: theme.spacing(1),
  },
}));

const Account: FunctionComponent = () => {
  const { data: userData } = useUser();
  const isUserAnonymous = userData && userData.isAnonymous;
  const userId = userData?.uid;
  const userEmail = userData?.email;

  const firestore = useFirestore();
  const auth = useAuth();

  const classes = useStyles();
  const commonStyles = useCommonStyles();

  const { themePref, setThemePref } = useContext(ThemeContext);

  const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const theme = (event.target as HTMLInputElement).value as ThemePreference;
    if (setThemePref) {
      setThemePref(theme);
      localStorage.setItem("theme", theme);
    }
  };

  const userRef = firestore.collection("users").doc(userId);
  const { data: dbUser } = useFirestoreDocData<User>(userRef);
  const secretKey = dbUser ? dbUser.secretKey : "";

  return (
    <Layout title="Account">
      <Paper className={classes.root}>
        {isUserAnonymous && (
          <>
            <Typography
              className={classes.headingWithIcon}
              variant="h5"
              component="h2"
              gutterBottom
            >
              <ErrorIcon className={classes.headingIcon} />
              Complete signing up
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              className={classes.infoParagraph}
            >
              Complete the signup process to enable all the features and access
              Memento on all your devices.
            </Typography>
            <Button
              variant="outlined"
              startIcon={<PersonIcon />}
              component={Link}
              to="/guest-sign-up"
            >
              Sign up
            </Button>

            <Divider className={classes.divider} />
          </>
        )}

        <Typography variant="h5" component="h2" gutterBottom>
          Select theme
        </Typography>
        <div>
          <FormControl component="fieldset">
            <RadioGroup
              aria-label="gender"
              name="gender1"
              value={themePref}
              onChange={handleThemeChange}
            >
              <FormControlLabel
                value="light"
                control={<Radio />}
                label="Light"
              />
              <FormControlLabel value="dark" control={<Radio />} label="Dark" />
              <FormControlLabel
                value="auto"
                control={<Radio />}
                label="Auto (system default)"
              />
            </RadioGroup>
          </FormControl>
        </div>

        <Divider className={classes.divider} />

        {!isUserAnonymous && (
          <>
            <Typography variant="h5" component="h2" gutterBottom>
              Secret key
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              className={classes.infoParagraph}
            >
              Note: this section is useful only if you own a Decent DE1 espresso
              machine, and you'd like to enable the Uploader plugin.
            </Typography>
            <div>
              {secretKey ? (
                <TextField
                  className={commonStyles.formFieldWidth}
                  label="Secret key"
                  variant="outlined"
                  value={secretKey}
                />
              ) : (
                <Button
                  variant="outlined"
                  startIcon={<VpnKeyIcon />}
                  onClick={() => generateSecretKey(firestore, userId)}
                >
                  Generate secret key
                </Button>
              )}
            </div>
            <div className={classes.email}>
              <TextField
                className={commonStyles.formFieldWidth}
                label="Email"
                variant="outlined"
                value={userEmail}
              />
            </div>

            <Divider className={classes.divider} />
          </>
        )}

        <Typography variant="h5" component="h2" gutterBottom>
          Account actions
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          className={classes.infoParagraph}
        >
          TODO: change password. For the time being, please log out and select
          "Reset password".
        </Typography>
        <Button
          variant="outlined"
          startIcon={<MeetingRoomIcon />}
          onClick={() => auth.signOut()}
        >
          Log out
        </Button>
      </Paper>
    </Layout>
  );
};

export default Account;
