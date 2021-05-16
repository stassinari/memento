import React, { FunctionComponent, useState } from "react";
import { Paper } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Form, Formik, FormikErrors } from "formik";
import {
  useRouteMatch,
  useLocation,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import * as Yup from "yup";

import { MultiPageFormButtons, Stepper } from "../multi-page-form-buttons";
import BaseInfo from "./espresso-add/pages/base-info";
import Time from "./espresso-add/pages/time";
import RatioForm from "../ratio-form";
import useCommonStyles from "../../config/use-common-styles";

interface Props {
  espressos: Espresso[];
  beans: Beans[];
  handleSubmit: (value: EspressoPrep) => void;
  initialValues?: EspressoPrep;
  initialErrors?: FormikErrors<EspressoPrep>;
  update?: boolean;
}

const espressoAddSchema = Yup.object().shape({
  date: Yup.date().nullable(true).required("Required"),
  beans: Yup.object()
    .nullable(true)
    .required("Please select some coffee beans."),
  targetWeight: Yup.number()
    .positive("Please enter an actual weight.")
    .required("Required"),
  beansWeight: Yup.number()
    .positive("Please enter an actual weight.")
    .required("Required"),
  waterTemperature: Yup.number()
    .positive("Please enter a positive temperature.")
    .max(100, "Please enter a non-gaseous water temperature."),
  actualTime: Yup.number()
    .min(0, "Please don't break time-space, enter positive seconds.")
    .required("Required"),
});

export const emptyValues: EspressoPrep = {
  date: new Date(),
  beans: null,
  beansWeight: "",
  waterTemperature: "",
  grinder: "",
  grinderBurrs: "",
  machine: "",
  grindSetting: "",
  targetWeight: "",
  portafilter: "",
  basket: "",
  actualWeight: "",
  actualTime: "",
};

const steps = ["Beans", "Recipe", "Time"];

const requiredFieldsByStep: (keyof EspressoPrep)[][] = [
  ["date", "beans"],
  ["targetWeight", "beansWeight"],
  ["actualTime"],
];

const EspressoForm: FunctionComponent<Props> = ({
  espressos,
  beans,
  handleSubmit,
  initialValues = emptyValues,
  initialErrors = {},
  update = false,
}) => {
  let { path } = useRouteMatch();
  const location = useLocation();

  const activeStep = parseInt(location.pathname.split("step").pop()!);

  const [displayFormError, setDisplayFormError] = useState(false);

  const commonClasses = useCommonStyles();

  return (
    <Formik
      initialErrors={initialErrors}
      initialValues={initialValues}
      validationSchema={espressoAddSchema}
      onSubmit={handleSubmit}
    >
      {(formik) => {
        const isStepValid = () => {
          const fieldsToValidate = requiredFieldsByStep[activeStep].reduce(
            (obj, field) => ({ ...obj, [field]: true }),
            {}
          );
          formik.setTouched(fieldsToValidate, true);
          const formErrors = Object.keys(formik.errors);
          const pageErrors = requiredFieldsByStep[activeStep].filter((f) =>
            formErrors.includes(f)
          );
          return pageErrors.length === 0;
        };
        return (
          <Paper className={commonClasses.formContainer}>
            <Form>
              <Stepper steps={steps} activeStep={activeStep} />

              {displayFormError && (
                <Alert severity="error">
                  There are some errors on this page. Please fix them to
                  proceed.
                </Alert>
              )}

              <Switch>
                <Route exact path={`${path}/step0`}>
                  <BaseInfo
                    espressos={espressos}
                    beans={beans}
                    formik={formik}
                  />
                </Route>
                <Route exact path={`${path}/step1`}>
                  <RatioForm
                    formik={formik}
                    type="espresso"
                    waterValue={formik.values.targetWeight}
                    waterError={formik.errors.targetWeight}
                    waterTouched={formik.touched.targetWeight}
                  />
                </Route>
                <Route exact path={`${path}/step2`}>
                  <Time formik={formik} />
                </Route>
                <Redirect exact from={path} to={`${path}/step0`} />
                <Redirect to="/404" />
              </Switch>

              <MultiPageFormButtons
                steps={steps}
                activeStep={activeStep}
                nextButtonFinalLabel={update ? "Update" : "Add"}
                isStepValid={isStepValid}
                setDisplayFormError={setDisplayFormError}
              />
            </Form>
          </Paper>
        );
      }}
    </Formik>
  );
};

export default EspressoForm;
