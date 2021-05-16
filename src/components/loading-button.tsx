import React, { FunctionComponent } from "react";
import { Button, CircularProgress, makeStyles } from "@material-ui/core";

interface LoadingButtonProps {
  type: string;
  isLoading: boolean;
  handleClick: () => void;
}

const useStyles = makeStyles((theme) => ({
  buttonContainer: {
    margin: theme.spacing(2),
    position: "relative",
    display: "flex",
    justifyContent: "center",
  },
  buttonProgress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
}));

const LoadingButton: FunctionComponent<LoadingButtonProps> = ({
  type,
  isLoading,
  handleClick,
}) => {
  const classes = useStyles();
  return (
    <div className={classes.buttonContainer}>
      <Button
        variant="contained"
        color="secondary"
        disabled={isLoading}
        onClick={handleClick}
      >
        Load all {type}
      </Button>
      {isLoading && (
        <CircularProgress size={24} className={classes.buttonProgress} />
      )}
    </div>
  );
};

export default LoadingButton;
