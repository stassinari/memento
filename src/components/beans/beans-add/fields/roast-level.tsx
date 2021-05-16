import React, { FunctionComponent } from "react";
import { Field, FormikValues } from "formik";
import { FormLabel, Slider } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

interface Props {}

export const roastLevelLabels = [
  { value: 0, label: "Light" },
  { value: 1, label: "Medium-light" },
  { value: 2, label: "Medium" },
  { value: 3, label: "Medium-dark" },
  { value: 4, label: "Dark" },
];

const useStyles = makeStyles((theme) => {
  return {
    sliderContainer: {
      maxWidth: 250,
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
      [theme.breakpoints.up("sm")]: {
        maxWidth: 350,
      },
    },
    slider: {
      marginLeft: theme.spacing(2),
    },
  };
});

const RoastLevel: FunctionComponent<Props> = () => {
  const classes = useStyles();
  return (
    <div className={classes.sliderContainer}>
      <FormLabel>Roast level</FormLabel>
      <Field name="roastLevel">
        {({ form }: FormikValues) => {
          let initialValue = form.initialValues.roastLevel;
          return (
            <Slider
              className={classes.slider}
              defaultValue={initialValue}
              step={1}
              min={0}
              max={4}
              marks={roastLevelLabels.map((m) =>
                m.value % 2 === 1 ? { value: m.value } : m
              )}
              valueLabelDisplay="off"
              onChangeCommitted={(_, value) => {
                form.setFieldValue("roastLevel", value);
              }}
            />
          );
        }}
      </Field>
    </div>
  );
};

export default RoastLevel;
