// import NoSleep from "nosleep.js";
import { PauseIcon, PlayIcon, XMarkIcon } from "@heroicons/react/20/solid";
import React, { useEffect, useState } from "react";
// import { CircularProgressbar } from "react-circular-progressbar";
// import "react-circular-progressbar/dist/styles.css";
import "twin.macro";
import { IconButton } from "./IconButton";

interface StopwatchProps {
  initialSeconds?: number;
  initialMinutes?: number;
  setFormSeconds: (arg0: number) => void;
  setFormMinutes: (arg0: number) => void;
  disabled?: boolean;
}

export const Stopwatch: React.FC<StopwatchProps> = ({
  disabled = false,
  initialSeconds = 0,
  initialMinutes = 0,
  setFormSeconds,
  setFormMinutes,
}) => {
  console.log("rendering Stopwatch");

  const [seconds, setSeconds] = useState(initialMinutes * 60 + initialSeconds);
  const [isRunning, setIsRunning] = useState(false);

  const displaySeconds = ("0" + (seconds % 60)).slice(-2);
  const displayMinutes = Math.floor(seconds / 60)
    .toString()
    .slice(-2);

  function toggle() {
    if (isRunning) {
      // in case it's stopping, we set form values
      setFormSeconds(seconds % 60);
      setFormMinutes(Math.floor(seconds / 60));
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
    <div tw="flex items-center gap-2">
      <IconButton
        Icon={isRunning ? <PauseIcon /> : <PlayIcon />}
        variant="secondary"
        type="button"
        onClick={toggle}
        disabled={disabled}
      />

      <span tw="w-20 text-2xl">
        {displayMinutes}:{displaySeconds}
      </span>

      <IconButton
        Icon={<XMarkIcon />}
        variant="white"
        type="button"
        onClick={reset}
        disabled={disabled}
      />
    </div>
  );
};
