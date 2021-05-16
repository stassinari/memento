import React, { useState, useEffect, FunctionComponent } from "react";
import { Button } from "@material-ui/core";
import {
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon,
  Clear as ClearIcon,
} from "@material-ui/icons";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import NoSleep from "nosleep.js";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface Props {
  initialSeconds: string;
  initialMinutes?: string;
  setFormSeconds: (arg0: number) => void;
  setFormMinutes?: (arg0: number) => void;
  disabled: boolean;
}

const useStyles = makeStyles((theme) => {
  return {
    progressContainer: {
      width: 200,
      marginLeft: "auto",
      marginRight: "auto",
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(5),
    },
    buttonContainer: {
      textAlign: "center",
      marginBottom: theme.spacing(3),
    },
    startPauseButton: {
      marginRight: theme.spacing(2),
    },
  };
});

const noSleep = new NoSleep();

const Stopwatch: FunctionComponent<Props> = ({
  disabled,
  initialSeconds,
  initialMinutes,
  setFormSeconds,
  setFormMinutes,
}) => {
  const theme = useTheme();
  const classes = useStyles();

  const initialTime =
    parseInt(initialMinutes ? initialMinutes! : "0") * 60 +
    parseInt(initialSeconds);
  const [seconds, setSeconds] = useState(initialTime ? initialTime : 0);
  const [isRunning, setIsRunning] = useState(false);

  const displaySeconds = setFormMinutes
    ? ("0" + (seconds % 60)).slice(-2)
    : ("0" + seconds).slice(-2);
  const displayMinutes = ("0" + Math.floor(seconds / 60)).slice(-2);

  function toggle() {
    if (isRunning) {
      noSleep.disable();
      // in case it's stopping, we set form values
      setFormSeconds(seconds);
      if (setFormMinutes) {
        setFormMinutes!(seconds);
      }
    } else {
      noSleep.enable();
    }
    setIsRunning(!isRunning);
  }

  function reset() {
    setSeconds(0);
    setIsRunning(false);
  }

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      if (disabled) {
        clearInterval(interval!);
      }
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
    } else if (!isRunning && seconds !== 0) {
      clearInterval(interval!);
    }
    return () => clearInterval(interval);
  }, [isRunning, seconds, setSeconds, disabled]);

  useEffect(() => {
    if (disabled) {
      setIsRunning(false);
      setSeconds(0);
    }
  }, [disabled]);

  return (
    <>
      <div className={classes.progressContainer}>
        <CircularProgressbar
          value={seconds % 60}
          maxValue={60}
          text={
            setFormMinutes
              ? `${displayMinutes}:${displaySeconds}`
              : displaySeconds
          }
          strokeWidth={4}
          styles={{
            path: {
              stroke: theme.palette.primary.main,
              strokeLinecap: "butt",
            },
            trail: {
              stroke: theme.palette.grey[300],
            },
            text: {
              fill: disabled ? "#9e9e9e" : theme.palette.text.primary,
            },
          }}
        />
      </div>
      <div className={classes.buttonContainer}>
        <Button
          variant="contained"
          color="secondary"
          className={classes.startPauseButton}
          disabled={disabled}
          onClick={toggle}
          startIcon={isRunning ? <StopIcon /> : <PlayArrowIcon />}
        >
          {isRunning ? "Stop" : "Start"}
        </Button>
        <Button
          variant="contained"
          disabled={disabled}
          onClick={reset}
          startIcon={<ClearIcon />}
        >
          Reset
        </Button>
      </div>
    </>
  );
};

export default Stopwatch;
