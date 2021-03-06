import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { Field, FormikProps } from "formik";
import React, { FunctionComponent } from "react";
import { Beans } from "../../../../database/types/beans";

interface Props {
  formik: FormikProps<Beans>;
}

const Origin: FunctionComponent<Props> = ({ formik }) => {
  return (
    <div>
      <FormControl component="fieldset">
        <FormLabel component="legend">Origin</FormLabel>
        <Field
          as={RadioGroup}
          aria-label="origin"
          name="origin"
          value={formik.values.origin}
        >
          <FormControlLabel
            value="single-origin"
            control={<Radio />}
            name="origin"
            id="single-origin"
            label="Single-origin"
          />
          <FormControlLabel
            value="blend"
            control={<Radio />}
            name="origin"
            id="blend"
            label="Blend"
          />
        </Field>
      </FormControl>
    </div>
  );
};

export default Origin;
