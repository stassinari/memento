import {
  Box,
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

const RoastStyle: FunctionComponent<Props> = ({ formik }) => (
  <Box mt={1}>
    <FormControl component="fieldset">
      <FormLabel component="legend">Roast profile</FormLabel>
      <Field
        as={RadioGroup}
        aria-label="roast style"
        name="roastStyle"
        value={formik.values.roastStyle}
      >
        <FormControlLabel
          value="filter"
          control={<Radio />}
          name="roastStyle"
          id="filter"
          label="Filter"
        />
        <FormControlLabel
          value="espresso"
          control={<Radio />}
          name="roastStyle"
          id="espresso"
          label="Epresso"
        />
        <FormControlLabel
          value="omni-roast"
          control={<Radio />}
          name="roastStyle"
          id="omni-roast"
          label="Omni-roast"
        />
      </Field>
    </FormControl>
  </Box>
);
export default RoastStyle;
