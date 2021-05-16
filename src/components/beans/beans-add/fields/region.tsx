import React, { FunctionComponent } from "react";
import { Field } from "formik";
import { TextField } from "@material-ui/core";
import useCommonStyles from "../../../../config/use-common-styles";

const Region: FunctionComponent = () => {
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
        type="text"
        name="region"
        label="Region"
        variant="outlined"
        margin="normal"
      />
    </div>
  );
};

export default Region;
