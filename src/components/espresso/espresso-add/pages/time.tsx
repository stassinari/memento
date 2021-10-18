import {
  FormControlLabel,
  InputAdornment,
  makeStyles,
  Switch,
  TextField,
} from "@material-ui/core";
import { Field, FormikProps } from "formik";
import React, { FunctionComponent, useState } from "react";
import useCommonStyles from "../../../../config/use-common-styles";
import { EspressoPrep } from "../../../../database/types/espresso";
import Stopwatch from "../../../brew/brew-add/fields/stopwatch";

interface Props {
  formik: FormikProps<EspressoPrep>;
}

const useStyles = makeStyles((theme) => {
  return {
    slider: {
      maxWidth: 300,
    },
    timeContainer: {
      display: "flex",
      flexDirection: "column",
    },
    fieldsContainer: {
      maxWidth: 250,
    },
    weight: {
      width: "100%",
    },
  };
});

const Time: FunctionComponent<Props> = ({ formik }) => {
  const classes = useStyles();
  const commonStyles = useCommonStyles();

  const [manualInput, setManualInput] = useState(false);
  const handleChange = () => setManualInput(!manualInput);

  const showActualTimeError =
    formik.errors.actualTime && formik.touched.actualTime;
  return (
    <>
      <Stopwatch
        initialSeconds={formik.values.actualTime}
        setFormSeconds={(seconds: number) =>
          formik.setFieldValue("actualTime", seconds)
        }
        disabled={manualInput}
      />
      <div className={classes.fieldsContainer}>
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
          <Field
            as={TextField}
            className={commonStyles.formFieldWidth}
            disabled={!manualInput}
            type="number"
            inputMode="decimal"
            name="actualTime"
            margin="normal"
            label="Seconds *"
            placeholder="E.g: 27"
            step="any"
            inputProps={{ step: "any" }}
            InputProps={{
              endAdornment: <InputAdornment position="end">s</InputAdornment>,
            }}
            variant="outlined"
            error={showActualTimeError}
            helperText={showActualTimeError && formik.errors.actualTime}
          />
        </div>
        <Field
          as={TextField}
          className={commonStyles.formFieldWidth}
          type="number"
          inputMode="decimal"
          name="actualWeight"
          margin="normal"
          label="Final weight"
          placeholder="E.g: 37.2"
          step="any"
          inputProps={{ step: "any" }}
          InputProps={{
            endAdornment: <InputAdornment position="end">g</InputAdornment>,
          }}
          variant="outlined"
        />
      </div>
    </>
  );
};

export default Time;
