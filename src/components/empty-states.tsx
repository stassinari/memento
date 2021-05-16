import React, { FunctionComponent } from "react";
import { useTheme, useMediaQuery, Button, makeStyles } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  button: {
    marginTop: theme.spacing(2),
  },
}));

interface EmptyListProps {
  type: string;
}

export const EmptyList: FunctionComponent<EmptyListProps> = ({ type }) => {
  const theme = useTheme();
  const isBreakpointMd = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Alert severity="warning">
      <AlertTitle>No {type} to display</AlertTitle>
      You haven't added any {type} yet. Press the "+" button{" "}
      {isBreakpointMd ? "above" : "below"} to start.
    </Alert>
  );
};

interface EmptyBeansProps {
  type: string;
}

export const EmptyBeans: FunctionComponent<EmptyBeansProps> = ({ type }) => {
  const classes = useStyles();
  return (
    <Alert severity="warning">
      <AlertTitle>No beans added</AlertTitle>
      To start adding {type}, you first need to add at least one bag of coffee
      beans.
      <div>
        <Button
          color="inherit"
          variant="outlined"
          size="small"
          component={Link}
          to="/beans/add"
          className={classes.button}
        >
          Add beans
        </Button>
      </div>
    </Alert>
  );
};
