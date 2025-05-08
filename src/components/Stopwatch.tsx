// import NoSleep from "nosleep.js";
import { PauseIcon, PlayIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { PrimitiveAtom, useAtom } from "jotai";
import React, { useEffect, useState } from "react";
// import { CircularProgressbar } from "react-circular-progressbar";
// import "react-circular-progressbar/dist/styles.css";
import clsx from "clsx";
import { IconButton } from "./IconButton";

interface StopwatchProps {
  atom: PrimitiveAtom<boolean>;
  initialSeconds?: number;
  initialMinutes?: number;
  setFormSeconds: (seconds: number) => void;
  setFormMinutes?: (minutes: number) => void;
  disabled?: boolean;
}

export const Stopwatch: React.FC<StopwatchProps> = ({
  atom,
  disabled = false,
  initialSeconds = 0,
  initialMinutes = 0,
  setFormSeconds,
  setFormMinutes,
}) => {
  const [seconds, setSeconds] = useState(initialMinutes * 60 + initialSeconds);
  const [isRunning, setIsRunning] = useAtom(atom);

  const displaySeconds = `0${seconds % 60}`.slice(-2);
  const displayMinutes = Math.floor(seconds / 60)
    .toString()
    .slice(-2);

  function toggle() {
    if (isRunning) {
      // in case it's stopping, we set form values
      if (setFormMinutes) {
        setFormSeconds(seconds % 60);
        setFormMinutes(Math.floor(seconds / 60));
      } else {
        setFormSeconds(seconds);
      }
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

  return (
    <div className="flex items-center gap-2">
      <IconButton
        Icon={isRunning ? <PauseIcon /> : <PlayIcon />}
        variant="secondary"
        type="button"
        onClick={toggle}
        disabled={disabled}
      />

      <span
        className={clsx([
          "w-20 text-2xl text-gray-900",
          disabled && "text-gray-400",
        ])}
      >
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
