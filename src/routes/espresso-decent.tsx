import {
  Box,
  Button,
  InputAdornment,
  makeStyles,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { Field, Form, Formik } from "formik";
import React, { FunctionComponent } from "react";
import { useHistory, useParams } from "react-router-dom";
import * as Yup from "yup";

import { completeDecentEspresso } from "../database/queries";
import PageProgress from "../components/page-progress";
import Layout from "../components/layout";
import { SUGGESTIONS_HISTORY_LIMIT } from "../utils/form";
import { filterBeans } from "../utils/beans";
import BeansRadioDialog from "../components/beans-radio-dialog";
import useCommonStyles from "../config/use-common-styles";
import { capitalise } from "../utils/string";
import ExpandableFormSection from "../components/expandable-form-section";
import {
  useFirestore,
  useFirestoreCollectionData,
  useFirestoreDocData,
  useUser,
} from "reactfire";

interface RouteParams {
  id: string;
}

interface Props {
  update: boolean;
  clone: boolean;
}

const espressoAddSchema = Yup.object().shape({
  beans: Yup.object()
    .nullable(true)
    .required("Please select some coffee beans."),
  actualWeight: Yup.number()
    .moreThan(0, "Please enter an actual weight.")
    .required("Required"),
  targetWeight: Yup.number().positive("Please enter an actual weight."),
  beansWeight: Yup.number()
    .positive("Please enter an actual weight.")
    .required("Required"),
  waterTemperature: Yup.number()
    .positive("Please enter a positive temperature.")
    .max(100, "Please enter a non-gaseous water temperature."),
});

const emptyValues: Partial<EspressoPrep> = {
  beans: null,
  beansWeight: "",
  waterTemperature: "",
  grinder: "",
  grinderBurrs: "",
  grindSetting: "",
  portafilter: "",
  basket: "",
  actualWeight: "",
  actualTime: "",
};

const useStyles = makeStyles((theme) => {
  return {
    formContainer: {
      padding: theme.spacing(2),
    },
  };
});

const EspressoDecentAdd: FunctionComponent<Props> = ({ update, clone }) => {
  const {
    data: { uid: userId },
  } = useUser();
  const history = useHistory();
  const firestore = useFirestore();

  const classes = useStyles();

  const params = useParams<RouteParams>();
  const espressoId = params.id;

  const commonStyles = useCommonStyles();

  const espressoRef = firestore
    .collection("users")
    .doc(userId)
    .collection("espresso")
    .doc(espressoId);
  const { status: espressoStatus, data: espresso } =
    useFirestoreDocData<EspressoPrep>(espressoRef);

  const espressoQuery = useFirestore()
    .collection("users")
    .doc(userId)
    .collection("espresso")
    .orderBy("date", "desc")
    .limit(SUGGESTIONS_HISTORY_LIMIT);
  const { status: espressoListStatus, data: espressos } =
    useFirestoreCollectionData<Espresso>(espressoQuery, {
      idField: "id",
    });

  const beansListQuery = useFirestore()
    .collection("users")
    .doc(userId)
    .collection("beans")
    .orderBy("roastDate", "desc")
    .where("isFinished", "==", false);
  const { status: beansListStatus, data: beansTemp } =
    useFirestoreCollectionData<Beans>(beansListQuery, {
      idField: "id",
    });

  const beans = filterBeans(beansTemp);

  const title = "Complete Decent shot";

  if (
    espressoStatus === "loading" ||
    espressoListStatus === "loading" ||
    beansListStatus === "loading"
  ) {
    return (
      <>
        <PageProgress />
        <Layout title={title}></Layout>
      </>
    );
  }

  const completedDecent = espressos.filter((e) => e.fromDecent && !e.partial);

  // cherrypick the values of the equipment
  const latestDecentEspresso =
    completedDecent.length !== 0
      ? completedDecent[0]
      : (emptyValues as Espresso);
  const newValues = {
    ...emptyValues,
    ...espresso,
    beans: beans.length === 1 ? beans[0] : espresso.beans, // autoselect beans if only one bean bag is present
    grinder: latestDecentEspresso.grinder,
    grinderBurrs: latestDecentEspresso.grinderBurrs,
    portafilter: latestDecentEspresso.portafilter,
    basket: latestDecentEspresso.basket,
  };

  return (
    <Layout title={title}>
      <Formik
        initialValues={newValues}
        validationSchema={espressoAddSchema}
        onSubmit={(values: EspressoPrep) => {
          completeDecentEspresso(firestore, userId, values, espressoId).then(
            () => {
              history.push(`/espresso/${espressoId}`);
            }
          );
        }}
      >
        {(formik) => {
          return (
            <Paper className={classes.formContainer}>
              <Form>
                <BeansRadioDialog
                  beansList={beans}
                  value={formik.values.beans}
                  setValue={(value: any) =>
                    formik.setFieldValue("beans", value)
                  }
                  filterFirst={false}
                  showError={
                    !!formik.errors.beans && (formik.touched.beans as boolean)
                  }
                  helperText={formik.errors.beans as string}
                />

                <div>
                  <Field
                    as={TextField}
                    className={commonStyles.formFieldWidth}
                    type="number"
                    inputMode="decimal"
                    name="actualWeight"
                    margin="normal"
                    label="Final yield  *"
                    placeholder="Actual yield shown on scale"
                    step="any"
                    inputProps={{ step: "any" }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">g</InputAdornment>
                      ),
                    }}
                    variant="outlined"
                    error={
                      formik.errors.actualWeight && formik.touched.actualWeight
                    }
                    helperText={
                      formik.errors.actualWeight &&
                      formik.touched.actualWeight &&
                      formik.errors.actualWeight
                    }
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
                    label="Dose *"
                    placeholder="E.g: 18.1g"
                    inputProps={{ step: "any" }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">g</InputAdornment>
                      ),
                    }}
                    variant="outlined"
                    error={
                      formik.errors.beansWeight && formik.touched.beansWeight
                    }
                    helperText={
                      formik.errors.beansWeight &&
                      formik.touched.beansWeight &&
                      formik.errors.beansWeight
                    }
                  />
                </div>

                <div>
                  <Field
                    as={TextField}
                    className={commonStyles.formFieldWidth}
                    type="number"
                    inputMode="decimal"
                    name="targetWeight"
                    margin="normal"
                    label="Target yield"
                    placeholder="Weight of espresso you wanted"
                    inputProps={{ step: "any" }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">g</InputAdornment>
                      ),
                    }}
                    variant="outlined"
                    error={
                      formik.errors.targetWeight && formik.touched.targetWeight
                    }
                    helperText={
                      formik.errors.targetWeight &&
                      formik.touched.targetWeight &&
                      formik.errors.targetWeight
                    }
                  />
                </div>

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

                <ExpandableFormSection
                  title="Equipment"
                  formik={formik}
                  fields={[
                    {
                      label: "Machine",
                      value: formik.values.machine,
                      name: "machine",
                      placeholder: "E.g: Decent DE1+ 1.3",
                    },
                    {
                      label: "Grinder",
                      value: formik.values.grinder,
                      name: "grinder",
                      placeholder: "E.g: Niche Zero",
                    },
                    {
                      label: "Burrs",
                      value: formik.values.grinderBurrs,
                      name: "grinderBurrs",
                      placeholder: "E.g: Stock steel 63mm",
                    },
                    {
                      label: "Portafilter",
                      value: capitalise(formik.values.portafilter),
                      name: "poartafilter",
                      customElement: (
                        <div className={commonStyles.toggleGroupContainer}>
                          <Typography
                            variant="caption"
                            component="label"
                            className={commonStyles.toggleGroupLabel}
                          >
                            Portafilter
                          </Typography>
                          <ToggleButtonGroup
                            className={commonStyles.toggleGroup}
                            value={formik.values.portafilter}
                            exclusive
                            onChange={(
                              _: React.MouseEvent<HTMLElement>,
                              value: string | null
                            ) => formik.setFieldValue("portafilter", value)}
                            aria-label="text portafilter type"
                            size="medium"
                          >
                            <ToggleButton
                              value="regular"
                              selected={formik.values.portafilter === "regular"}
                              aria-label="regular portafilter"
                            >
                              Regular
                            </ToggleButton>
                            <ToggleButton
                              value="bottomless"
                              selected={
                                formik.values.portafilter === "bottomless"
                              }
                              aria-label="bottomless portafilter"
                            >
                              Bottomless
                            </ToggleButton>
                          </ToggleButtonGroup>
                        </div>
                      ),
                    },
                    {
                      label: "Basket",
                      value: formik.values.basket,
                      name: "basket",
                      placeholder: "E.g: VST 18g",
                    },
                  ]}
                  list={espressos}
                />

                <Box mt={2}>
                  <Button type="submit" variant="contained" color="primary">
                    Update details
                  </Button>
                </Box>
              </Form>
            </Paper>
          );
        }}
      </Formik>
    </Layout>
  );
};

export default EspressoDecentAdd;
