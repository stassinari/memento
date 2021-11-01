import DateFnsUtils from "@date-io/date-fns";
import { Box, Button, Card, CardContent, Paper } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import "date-fns";
import { Field, Form, Formik } from "formik";
import React, { FunctionComponent } from "react";
import { useFirestore, useFirestoreCollectionData, useUser } from "reactfire";
import * as Yup from "yup";
import useCommonStyles from "../../config/use-common-styles";
import { Beans } from "../../database/types/beans";
import Flavours from "../flavours";
import FormErrors from "../form-errors";
import Altitude from "./beans-add/fields/altitude";
import Blend from "./beans-add/fields/blend";
import Country from "./beans-add/fields/country";
import Farmer from "./beans-add/fields/farmer";
import HarvestDate from "./beans-add/fields/harvest-date";
import Name from "./beans-add/fields/name";
import Origin from "./beans-add/fields/origin";
import Process from "./beans-add/fields/process";
import Region from "./beans-add/fields/region";
import RoastDate from "./beans-add/fields/roast-date";
import RoastLevel from "./beans-add/fields/roast-level";
import RoastStyle from "./beans-add/fields/roast-style";
import Roaster from "./beans-add/fields/roaster";
import Varietal from "./beans-add/fields/varietal";

interface Props {
  handleSubmit: (value: Beans) => void;
  initialValues?: Beans;
  update?: boolean;
}

export const emptyValues: Beans = {
  name: "",
  isFinished: false,
  roaster: "",
  roastDate: null,
  roastingNotes: [],
  roastLevel: null,
  roastStyle: null,
  origin: "single-origin",
  country: null,
  farmer: "",
  region: "",
  process: "",
  varietals: [],
  harvestDate: null,
  altitude: "",
  freezeDate: null,
  thawDate: null,
};

const BeansAddSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  roaster: Yup.string().required("Required"),
});

const useStyles = makeStyles((theme) => {
  return {
    errorsContainer: {
      margin: theme.spacing(1),
    },
    spacedCard: {
      marginBottom: theme.spacing(2),
    },
  };
});

const BeansForm: FunctionComponent<Props> = ({
  handleSubmit,
  initialValues = emptyValues,
  update = false,
}) => {
  const {
    data: { uid: userId },
  } = useUser();

  const classes = useStyles();
  const commonStyles = useCommonStyles();

  const beansListQuery = useFirestore()
    .collection("users")
    .doc(userId)
    .collection("beans")
    .orderBy("roastDate", "desc")
    .where("isFinished", "==", false);

  const { data: beansList } = useFirestoreCollectionData<Beans>(
    beansListQuery,
    {
      idField: "id",
    }
  );

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={BeansAddSchema}
      onSubmit={handleSubmit}
    >
      {(formik) => {
        return (
          <Form>
            <Card className={classes.spacedCard}>
              <CardContent>
                <Name
                  value={formik.values.name}
                  setValue={(value) => formik.setFieldValue("name", value)}
                  required={true}
                  showError={!!formik.errors.name && formik.touched.name}
                  helperText={formik.errors.name}
                />
                <Roaster beansList={beansList} formik={formik} />
                <RoastDate formik={formik} />
                <RoastStyle formik={formik} />
                <RoastLevel />
                <Flavours
                  values={formik.values.roastingNotes}
                  defaultValues={formik.initialValues.roastingNotes}
                  setValues={(values) =>
                    formik.setFieldValue("roastingNotes", values)
                  }
                  label="Roasting notes"
                />
              </CardContent>
            </Card>
            {update && (
              <Card className={classes.spacedCard}>
                <CardContent>
                  <div>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <Field
                        as={KeyboardDatePicker}
                        className={commonStyles.formFieldWidth}
                        name="freezeDate"
                        autoOk
                        label="Freeze date"
                        format="dd/MM/yyyy"
                        inputVariant="outlined"
                        margin="normal"
                        placeholder="E.g 10/10/2018"
                        disableFuture={true}
                        onChange={(value: React.ChangeEvent<{}>) => {
                          formik.setFieldValue("freezeDate", value);
                        }}
                      />
                    </MuiPickersUtilsProvider>
                  </div>
                  <div>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <Field
                        as={KeyboardDatePicker}
                        className={commonStyles.formFieldWidth}
                        name="thawDate"
                        autoOk
                        label="Thaw date"
                        format="dd/MM/yyyy"
                        inputVariant="outlined"
                        margin="normal"
                        placeholder="E.g 10/10/2018"
                        disableFuture={true}
                        onChange={(value: React.ChangeEvent<{}>) => {
                          formik.setFieldValue("thawDate", value);
                        }}
                      />
                    </MuiPickersUtilsProvider>
                  </div>
                </CardContent>
              </Card>
            )}
            <Card>
              <CardContent>
                <Origin formik={formik} />
                {formik.values.origin === "single-origin" && (
                  <>
                    <Country
                      value={formik.initialValues.country}
                      setValue={(value) =>
                        formik.setFieldValue("country", value)
                      }
                    />
                    <Region />
                    <Varietal
                      value={formik.values.varietals}
                      setValue={(value) =>
                        formik.setFieldValue("varietals", value)
                      }
                    />
                    <Altitude />

                    <Process
                      value={formik.values.process}
                      setValue={(value) =>
                        formik.setFieldValue("process", value)
                      }
                    />
                    <Farmer />
                    <HarvestDate formik={formik} />
                  </>
                )}
                {formik.values.origin === "blend" && <Blend formik={formik} />}
              </CardContent>
            </Card>
            {formik.submitCount > 0 && !formik.isValid && (
              <Paper className={classes.errorsContainer}>
                <FormErrors formik={formik} />
              </Paper>
            )}
            <Box mt={2}>
              <Button type="submit" variant="contained" color="primary">
                {update ? "Update" : "Add"} beans
              </Button>
            </Box>
          </Form>
        );
      }}
    </Formik>
  );
};

export default BeansForm;
