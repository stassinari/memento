import React, { FunctionComponent } from "react";
import { Field, FormikProps } from "formik";
import { FormGroup, FormControlLabel, Switch } from "@material-ui/core";

interface Props {
  formik: FormikProps<Beans>;
}

const IsFinished: FunctionComponent<Props> = ({ formik }) => {
  const FormSwitch = (
    <Field
      as={Switch}
      name="isFinished"
      checked={formik.values.isFinished}
      onChange={(event: React.ChangeEvent<{}>, value: boolean) => {
        formik.setFieldValue("isFinished", value);
      }}
    />
  );
  return (
    <FormGroup row>
      <FormControlLabel
        label="Is it finished?"
        labelPlacement="start"
        control={FormSwitch}
      />
    </FormGroup>
  );
};

export default IsFinished;
