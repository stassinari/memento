import { FormControlLabel, Switch } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import { FormikProps } from "formik";
import React, { FunctionComponent, useState } from "react";
import { BrewPrep } from "../../../../database/types/brew";
import Stopwatch from "../fields/stopwatch";
import Time from "../fields/time";

interface Props {
  formik: FormikProps<BrewPrep>;
}

const useStyles = makeStyles(() => {
  return {
    timeContainer: {
      display: "flex",
      flexDirection: "column",
    },
  };
});

const Timer: FunctionComponent<Props> = ({ formik }) => {
  const classes = useStyles();
  const [manualInput, setManualInput] = useState(false);
  const handleChange = () => setManualInput(!manualInput);

  return (
    <>
      <Stopwatch
        initialSeconds={formik.values.timeSeconds}
        initialMinutes={formik.values.timeMinutes}
        setFormSeconds={(seconds: number) =>
          formik.setFieldValue("timeSeconds", seconds % 60)
        }
        setFormMinutes={(seconds: number) =>
          formik.setFieldValue("timeMinutes", Math.floor(seconds / 60))
        }
        disabled={manualInput}
      />
      <div className={classes.timeContainer}>
        <FormControlLabel
          control={
            <Switch
              checked={manualInput}
              onChange={handleChange}
              name="manualInput"
            />
          }
          label="Set manually"
        />
        {manualInput && <Time formik={formik} />}
      </div>
    </>
  );
};

export default Timer;
