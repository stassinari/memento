import React, { useState, FunctionComponent } from "react";
import { Switch, FormControlLabel } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import Stopwatch from "../fields/stopwatch";
import Time from "../fields/time";
import { FormikProps } from "formik";

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
