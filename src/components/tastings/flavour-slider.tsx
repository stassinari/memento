import React, { FunctionComponent } from "react";
import { FormLabel, Slider } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import { Field, FormikValues } from "formik";

interface Props {
  fieldName: string;
  label: string;
  formId: string;
  index: number;
  minMark: string;
  maxMark: string;
}

const quantityMarks = (min: string, max: string) => [
  { value: 0, label: min },
  { value: 1 },
  { value: 2 },
  { value: 3 },
  { value: 4 },
  { value: 5, label: max },
];

const useStyles = makeStyles((theme) => {
  return {
    sliderContainer: {
      maxWidth: 300,
    },
  };
});

const FlavourSlider: FunctionComponent<Props> = ({
  label,
  index,
  formId,
  minMark,
  maxMark,
  fieldName,
}) => {
  const classes = useStyles();
  return (
    <div className={classes.sliderContainer}>
      <FormLabel>{label}</FormLabel>
      <Field>
        {({ form }: FormikValues) => (
          <Slider
            defaultValue={form.initialValues.ratings[index][fieldName]}
            value={form.values.ratings[index][fieldName]}
            step={0.5}
            min={0}
            max={5}
            marks={quantityMarks(minMark, maxMark)}
            valueLabelDisplay="auto"
            onChange={(_, value) => {
              form.setFieldValue(`${formId}.${fieldName}`, value);
            }}
          />
        )}
      </Field>
    </div>
  );
};

export default FlavourSlider;
