import { Paper } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Form, Formik, FormikErrors } from "formik";
import React, { FunctionComponent, useState } from "react";
import {
  Redirect,
  Route,
  Switch,
  useLocation,
  useRouteMatch,
} from "react-router-dom";
import * as Yup from "yup";
import useCommonStyles from "../../config/use-common-styles";
import { Beans } from "../../database/types/beans";
import { Brew, BrewPrep } from "../../database/types/brew";
import { MultiPageFormButtons, Stepper } from "../multi-page-form-buttons";
import RatioForm from "../ratio-form";
import BaseInfo from "./brew-add/pages/base-info";
import Timer from "./brew-add/pages/timer";

interface Props {
  brews: Brew[];
  beans: Beans[];
  handleSubmit: (value: BrewPrep) => void;
  initialValues?: BrewPrep;
  initialErrors?: FormikErrors<BrewPrep>;
  update?: boolean;
}

const brewAddSchema = Yup.object().shape({
  date: Yup.date().nullable(true).required("Required"),
  method: Yup.string().required("Required"),
  beans: Yup.object()
    .nullable(true)
    .required("Please select some coffee beans."),
  waterWeight: Yup.number()
    .positive("Please enter an actual weight.")
    .required("Required"),
  beansWeight: Yup.number()
    .positive("Please enter an actual weight.")
    .required("Required"),
  waterTemperature: Yup.number()
    .positive("Please enter a positive temperature.")
    .max(100, "Please enter a non-gaseous water temperature."),
  timeSeconds: Yup.number()
    .min(0, "Please don't break time-space, enter positive seconds.")
    .max(59, "Please enter fewer than 60 seconds."),
  timeMinutes: Yup.number().min(
    0,
    "Please don't break time-space, enter positive minutes."
  ),
});

const steps = ["Beans", "Recipe", "Time"];

const requiredFieldsByStep: (keyof BrewPrep)[][] = [
  ["date", "method", "beans"],
  ["waterWeight", "beansWeight"],
  [],
];

export const emptyValues: BrewPrep = {
  method: "",
  date: new Date(),
  beans: null,
  waterWeight: "",
  beansWeight: "",
  waterTemperature: "",
  grinder: "",
  grinderBurrs: "",
  grindSetting: "",
  waterType: "",
  filterType: "",
  timeMinutes: "",
  timeSeconds: "",
};

const BrewForm: FunctionComponent<Props> = ({
  brews,
  beans,
  handleSubmit,
  initialValues = emptyValues,
  initialErrors = {},
  update = false,
}) => {
  let { path } = useRouteMatch();
  const location = useLocation();

  const activeStep = parseInt(location.pathname.split("step").pop()!);

  const commonClasses = useCommonStyles();

  const [displayFormError, setDisplayFormError] = useState(false);

  return (
    <Formik
      initialErrors={initialErrors}
      initialValues={initialValues}
      validationSchema={brewAddSchema}
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
                  <BaseInfo brews={brews} beans={beans} formik={formik} />
                </Route>
                <Route exact path={`${path}/step1`}>
                  <RatioForm
                    formik={formik}
                    type="brew"
                    waterValue={formik.values.waterWeight}
                    waterError={formik.errors.waterWeight}
                    waterTouched={formik.touched.waterWeight}
                  />
                </Route>
                <Route exact path={`${path}/step2`}>
                  <Timer formik={formik} />
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

export default BrewForm;
