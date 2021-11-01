import makeStyles from '@mui/styles/makeStyles';
import { Alert, AlertTitle } from '@mui/material';
import { FormikProps } from "formik";
import React, { FunctionComponent } from "react";
import { Beans } from "../database/types/beans";
import { BrewPrep } from "../database/types/brew";
import { EspressoPrep } from "../database/types/espresso";

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
