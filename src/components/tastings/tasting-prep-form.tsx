import React, { FunctionComponent } from "react";
import { Field, Form, Formik } from "formik";
import {
  Box,
  Button,
  Grid,
  InputAdornment,
  makeStyles,
  Paper,
  TextField,
} from "@material-ui/core";
import * as Yup from "yup";

import { extractSuggestions } from "../../utils/form";
import BeansRadioDialog from "../beans-radio-dialog";
import RecentSuggestions from "../recent-suggestions";
import useCommonStyles from "../../config/use-common-styles";
import ConditionalWrapper from "../conditional-wrapper";

interface Props {
  handleSubmit: (arg0: TastingPrep) => void;
  initialValues: TastingPrep;
  tastingVariable: TastingVariable;
  brews: Brew[];
  beans: Beans[];
  submitButtonLabel: string;
  container?: boolean;
}

const tastingPrepSchema = Yup.object().shape({
  beans: Yup.object().nullable(true),
  waterWeight: Yup.number().positive("Please enter an actual weight."),
  beansWeight: Yup.number().positive("Please enter an actual weight."),
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

const useStyles = makeStyles((theme) => {
  return {
    formContainer: {
      padding: theme.spacing(2),
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    buttonContainer: {
      marginTop: theme.spacing(1),
    },
    timeInput: {
      width: 96,
    },
  };
});

export const TastingPrepForm: FunctionComponent<Props> = ({
  handleSubmit,
  initialValues,
  tastingVariable,
  brews,
  beans,
  submitButtonLabel,
  container = true,
}) => {
  const classes = useStyles();
  const commonStyles = useCommonStyles();
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={tastingPrepSchema}
      onSubmit={handleSubmit}
    >
      {(formik) => {
        return (
          <Form>
            <ConditionalWrapper
              condition={container}
              wrapper={(c: React.ReactNode) => (
                <Paper className={classes.formContainer}>{c}</Paper>
              )}
            >
              {tastingVariable !== "beans" && (
                <BeansRadioDialog
                  beansList={beans}
                  value={formik.values.beans}
                  setValue={(value: any) =>
                    formik.setFieldValue("beans", value)
                  }
                />
              )}
              {tastingVariable !== "method" && (
                <div>
                  <Field
                    as={TextField}
                    className={commonStyles.formFieldWidth}
                    type="text"
                    name="method"
                    label="Method *"
                    placeholder="E.g: V60"
                    variant="outlined"
                    margin="normal"
                  />
                  <RecentSuggestions
                    chips={extractSuggestions(brews, "method")}
                    setValue={(value) => formik.setFieldValue("method", value)}
                  />
                </div>
              )}

              <div>
                <Field
                  as={TextField}
                  className={commonStyles.formFieldWidth}
                  type="number"
                  inputMode="decimal"
                  name="waterWeight"
                  margin="normal"
                  label="Water weight"
                  placeholder="E.g: 200"
                  inputProps={{ step: "any" }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">ml</InputAdornment>
                    ),
                  }}
                  variant="outlined"
                />
              </div>

              <div>
                <Field
                  as={TextField}
                  className={commonStyles.formFieldWidth}
                  type="number"
                  inputMode="decimal"
                  name="beansWeight"
                  margin="normal"
                  label="Beans weight"
                  placeholder="E.g: 12.3"
                  inputProps={{ step: "any" }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">g</InputAdornment>
                    ),
                  }}
                  variant="outlined"
                />
              </div>

              {tastingVariable !== "waterTemperature" && (
                <div>
                  <Field
                    as={TextField}
                    className={commonStyles.formFieldWidth}
                    type="number"
                    inputMode="decimal"
                    name="waterTemperature"
                    margin="normal"
                    label="Temp"
                    placeholder="E.g: 96"
                    inputProps={{ step: "any" }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">°C</InputAdornment>
                      ),
                    }}
                    variant="outlined"
                  />
                </div>
              )}

              {tastingVariable !== "grindSetting" && (
                <div>
                  <Field
                    as={TextField}
                    className={commonStyles.formFieldWidth}
                    type="text"
                    name="grindSetting"
                    margin="normal"
                    label="Grind setting"
                    placeholder="E.g: 5R, 15, coarse"
                    variant="outlined"
                  />
                </div>
              )}

              {tastingVariable !== "grinder" && (
                <div>
                  <Field
                    as={TextField}
                    className={commonStyles.formFieldWidth}
                    type="text"
                    name="grinder"
                    label="Grinder"
                    placeholder="E.g: Baratza Encore"
                    variant="outlined"
                    margin="normal"
                  />
                  <RecentSuggestions
                    chips={extractSuggestions(brews, "grinder")}
                    setValue={(value) => formik.setFieldValue("grinder", value)}
                  />
                </div>
              )}
              {tastingVariable !== "waterType" && (
                <div>
                  <Field
                    as={TextField}
                    className={commonStyles.formFieldWidth}
                    type="text"
                    name="waterType"
                    label="Water type"
                    placeholder="E.g: Waitrose"
                    variant="outlined"
                    margin="normal"
                  />
                  <RecentSuggestions
                    chips={extractSuggestions(brews, "waterType")}
                    setValue={(value) =>
                      formik.setFieldValue("waterType", value)
                    }
                  />
                </div>
              )}
              {tastingVariable !== "filterType" && (
                <div>
                  <Field
                    as={TextField}
                    className={commonStyles.formFieldWidth}
                    type="text"
                    name="filterType"
                    label="Filter Type"
                    placeholder="E.g: metal, paper"
                    variant="outlined"
                    margin="normal"
                  />
                  <RecentSuggestions
                    chips={extractSuggestions(brews, "filterType")}
                    setValue={(value) =>
                      formik.setFieldValue("filterType", value)
                    }
                  />
                </div>
              )}

              <Grid
                container
                alignItems="center"
                className={commonStyles.formFieldWidth}
              >
                <Grid item>
                  <Box mr={2} display="inline">
                    <Field
                      as={TextField}
                      className={classes.timeInput}
                      type="number"
                      inputMode="decimal"
                      name="timeMinutes"
                      margin="normal"
                      label="Minutes"
                      placeholder="E.g: 3"
                      variant="outlined"
                      inputProps={{ step: "any" }}
                    />
                  </Box>
                </Grid>

                <Grid item>
                  <span>:</span>
                </Grid>

                <Grid item>
                  <Box ml={2} display="inline">
                    <Field
                      as={TextField}
                      className={classes.timeInput}
                      type="number"
                      inputMode="decimal"
                      name="timeSeconds"
                      margin="normal"
                      label="Seconds"
                      placeholder="E.g: 21"
                      variant="outlined"
                      inputProps={{ step: "any" }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </ConditionalWrapper>
            <div className={classes.buttonContainer}>
              <Button type="submit" variant="contained" color="primary">
                {submitButtonLabel}
              </Button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};
