import { Box, Grid, TextField } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import { Field, FormikProps } from "formik";
import React, { FunctionComponent } from "react";
import { BrewPrep } from "../../../../database/types/brew";

interface Props {
  formik: FormikProps<BrewPrep>;
}

const useStyles = makeStyles(() => {
  return {
    input: {
      width: 96,
    },
  };
});

const Time: FunctionComponent<Props> = ({ formik }) => {
  const classes = useStyles();
  const showMinutesError =
    formik.errors.timeMinutes && formik.touched.timeMinutes;
  const showSecondsError =
    formik.errors.timeSeconds && formik.touched.timeSeconds;
  return (
    <Grid container alignItems="center">
      <Grid item>
        <Box mr={2} display="inline">
          <Field
            as={TextField}
            className={classes.input}
            type="number"
            inputMode="decimal"
            size="small"
            name="timeMinutes"
            margin="normal"
            label="Minutes"
            placeholder="E.g: 3"
            variant="outlined"
            inputProps={{ step: "any" }}
            error={showMinutesError}
            helperText={showMinutesError && formik.errors.timeMinutes}
          />
        </Box>
      </Grid>

      <Grid item>
        <span>:</span>
      </Grid>

      <Grid item>
        <Box ml={2} display="inline">
          <Field
            as={TextField}
            className={classes.input}
            type="number"
            inputMode="decimal"
            size="small"
            name="timeSeconds"
            margin="normal"
            label="Seconds"
            placeholder="E.g: 21"
            variant="outlined"
            inputProps={{ step: "any" }}
            error={showSecondsError}
            helperText={showSecondsError && formik.errors.timeSeconds}
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default Time;
