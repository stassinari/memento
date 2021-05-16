import React, { FunctionComponent } from "react";
import { Field } from "formik";
import { TextField, InputAdornment } from "@material-ui/core";
import useCommonStyles from "../../../../config/use-common-styles";

const Altitude: FunctionComponent = () => {
  const commonStyles = useCommonStyles();
  return (
    <div>
      <Field
        as={TextField}
        className={commonStyles.formFieldWidth}
        type="number"
        inputMode="decimal"
        name="altitude"
        margin="normal"
        label="Altitude"
        placeholder="E.g: 1800"
        inputProps={{ step: "any" }}
        InputProps={{
          endAdornment: <InputAdornment position="end">masl</InputAdornment>,
        }}
        variant="outlined"
      />
    </div>
  );
};

export default Altitude;
