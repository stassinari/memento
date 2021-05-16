import React, { FunctionComponent } from "react";
import { Alert, AlertTitle } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import { FormikProps } from "formik";

interface Props {
  formik:
    | FormikProps<BrewPrep>
    | FormikProps<Beans>
    | FormikProps<EspressoPrep>;
}

const useStyles = makeStyles((theme) => {
  return {
    list: {
      margin: 0,
      paddingLeft: 15,
    },
  };
});

const FormErrors: FunctionComponent<Props> = ({ formik }) => {
  const errors: Record<string, any> = formik.errors;
  const classes = useStyles();
  return (
    <Alert severity="error">
      <AlertTitle>Some fields require your attention!</AlertTitle>
      <ul className={classes.list}>
        {Object.keys(errors).map((key) => (
          <li key={key}>
            {key}: {errors[key]}
          </li>
        ))}
      </ul>
    </Alert>
  );
};

export default FormErrors;
