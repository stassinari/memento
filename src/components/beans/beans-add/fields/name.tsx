import React, { FunctionComponent } from "react";
import { Field } from "formik";
import { TextField } from "@mui/material";
import useCommonStyles from "../../../../config/use-common-styles";

interface Props {
  value: any;
  setValue: (arg0: any) => void;
  required?: boolean;
  showError?: boolean;
  helperText?: string;
}

const Name: FunctionComponent<Props> = ({
  value,
  setValue,
  required = false,
  showError = false,
  helperText,
}) => {
  const commonStyles = useCommonStyles();
  return (
    <div>
      <Field
        as={TextField}
        className={commonStyles.formFieldWidth}
        inputProps={{
          autoComplete: "new-password",
          form: {
            autocomplete: "off",
          },
        }}
        value={value}
        type="text"
        name="name"
        label={`Name ${required ? "*" : ""}`}
        variant="outlined"
        margin="normal"
        onChange={(event: any) => setValue(event.target.value)}
        error={showError}
        helperText={showError && helperText}
      />
    </div>
  );
};

export default Name;
