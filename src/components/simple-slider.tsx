import React, { FunctionComponent } from "react";
import { Field, FormikValues } from "formik";
import { FormLabel, Slider } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

interface Props {
  name: string;
  label: string;
  step?: number;
}

const marks = [
  { value: 0 },
  { value: 1 },
  { value: 2 },
  { value: 3 },
  { value: 4 },
  { value: 5 },
  { value: 6 },
  { value: 7 },
  { value: 8 },
  { value: 9 },
  { value: 10 },
];

const useStyles = makeStyles((theme) => {
  return {
    sliderContainer: {
      maxWidth: 300,
    },
  };
});

const SimpleSlider: FunctionComponent<Props> = ({ name, label, step = 1 }) => {
  const classes = useStyles();
  return (
    <div className={classes.sliderContainer}>
      <FormLabel>{label}</FormLabel>
      <Field name={name}>
        {({ form }: FormikValues) => {
          let value = form.initialValues;
          // go through nested form object
          name.split(".").forEach((el) => {
            value = value[el];
          });
          return (
            <Slider
              defaultValue={value}
              step={step}
              min={0}
              max={10}
              marks={marks}
              valueLabelDisplay="auto"
              onChangeCommitted={(_, value) => {
                form.setFieldValue(name, value);
              }}
            />
          );
        }}
      </Field>
    </div>
  );
};

export default SimpleSlider;
