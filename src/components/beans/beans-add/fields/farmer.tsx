import React, { FunctionComponent } from "react";
import { Field } from "formik";
import { TextField } from "@mui/material";
import useCommonStyles from "../../../../config/use-common-styles";

const Farmer: FunctionComponent = () => {
  const commonStyles = useCommonStyles();
  return (
    <div>
      <Field
        as={TextField}
        className={commonStyles.formFieldWidth}
        type="text"
        name="farmer"
        label="Farmer / producer"
        variant="outlined"
        margin="normal"
      />
    </div>
  );
};

export default Farmer;
