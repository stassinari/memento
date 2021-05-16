import { TextField } from "@material-ui/core";
import { Field } from "formik";
import React, { FunctionComponent } from "react";

interface Props {
  label: string;
  name: string;
}

const FlavourNotes: FunctionComponent<Props> = ({ name, label }) => {
  return (
    <Field
      as={TextField}
      type="text"
      name={name}
      margin="normal"
      multiline
      rows={2}
      label={label}
      variant="outlined"
    />
  );
};

export default FlavourNotes;
