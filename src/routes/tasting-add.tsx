import DateFnsUtils from "@date-io/date-fns";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  makeStyles,
  Paper,
  Radio,
  RadioGroup,
  Typography,
} from "@material-ui/core";
import {
  KeyboardDateTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import "date-fns";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useFirestore, useFirestoreCollectionData, useUser } from "reactfire";
import * as Yup from "yup";
import BeansCheckbox from "../components/beans-checkbox";
import Layout from "../components/layout";
import TastingVariables from "../components/tastings/tasting-variables";
import { addTasting } from "../database/queries";
import { Beans } from "../database/types/beans";
import { Brew } from "../database/types/brew";
import { Tasting, TastingVariable } from "../database/types/tasting";
import { SUGGESTIONS_HISTORY_LIMIT } from "../utils/form";

const formSchema = Yup.object().shape({
  date: Yup.date().nullable(true).required("Required"),
  isTastingBeans: Yup.boolean()
    .nullable()
    .required("Please select what you are tasting"),
  beans: Yup.array().when("isTastingBeans", {
    is: true,
    then: Yup.array()
      .required("Please select the beans you are tasting")
      .min(2, "Select at least two coffee beans"),
  }),
  tastingVariable: Yup.string().when("isTastingBeans", {
    is: false,
    then: Yup.string().required("Please select a tasting value"),
  }),
  tastingSamplesVarValues: Yup.array().when("tastingVariable", {
    is: (tVar: TastingVariable) => !!tVar,
    then: Yup.array()
      .required("Please add some tasting samples")
      .min(2, "Select at least two tasting samples"),
  }),
});

const useStyles = makeStyles((theme) => ({
  formContainer: {
    padding: theme.spacing(2),
  },
  checkboxContainer: {
    marginBottom: theme.spacing(1),
  },
  buttonContainer: {
    marginTop: theme.spacing(2),
  },
}));

const TastingAdd = () => {
  const {
    data: { uid: userId },
  } = useUser();
  const firestore = useFirestore();
  const history = useHistory();

  const classes = useStyles();

  const brewsQuery = useFirestore()
    .collection("users")
    .doc(userId)
    .collection("brews")
    .orderBy("date", "desc")
    .limit(SUGGESTIONS_HISTORY_LIMIT);
  const { data: brews } = useFirestoreCollectionData<Brew>(brewsQuery, {
    idField: "id",
  });

  const beansQuery = useFirestore()
    .collection("users")
    .doc(userId)
    .collection("beans")
    .orderBy("roastDate", "desc")
    .where("isFinished", "==", false);
  const { data: beans } = useFirestoreCollectionData<Beans>(beansQuery, {
    idField: "id",
  });

  useEffect(() => {
    const beansToSelect = beans?.reduce(
      (obj, currentValue) => ({ ...obj, [currentValue.id!]: false }),
      {}
    );
    setBeansCheckboxes(beansToSelect);
  }, [beans]);

  const [date, setDate] = useState<Date | null>(new Date());

  const [isTastingBeans, setIsTastingBeans] = useState<boolean | null>(null);
  const [tastingVariable, setTastingVariable] = useState<TastingVariable | "">(
    ""
  );

  const [tastingSamplesVarValues, setTastingSamplesVasValues] = useState<
    string[]
  >([]);

  const [beansCheckboxes, setBeansCheckboxes] = useState<
    Record<string, boolean>
  >({});

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleAdd = async () => {
    const redirectCallback = (tastingRef: any) =>
      history.push(`/tastings/${tastingRef.id}/prep`);

    const selectedBeansIds = Object.keys(beansCheckboxes).filter(
      (id) => beansCheckboxes[id]
    );

    try {
      await formSchema.validate(
        {
          date,
          isTastingBeans,
          beans: selectedBeansIds,
          tastingVariable,
          tastingSamplesVarValues,
        },
        { abortEarly: false }
      );
      setFormErrors({});

      const record: Tasting | null = isTastingBeans
        ? {
            variable: "beans",
            samples: selectedBeansIds.map((b) => ({
              variableValue: firestore
                .collection("users")
                .doc(userId)
                .collection("beans")
                .doc(b),
            })),
            date,
          }
        : tastingVariable !== ""
        ? {
            variable: tastingVariable,
            samples: tastingSamplesVarValues.map((o) => ({ variableValue: o })),
            date,
          }
        : null;
      if (record) {
        addTasting(firestore, userId, record).then(redirectCallback);
      }
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errors = error.inner.reduce(
          (acc, e) =>
            e.path && !acc[e.path] ? { ...acc, [e.path]: e.message } : acc,
          {} as Record<string, string>
        );
        setFormErrors(errors);
      }
    }
  };

  return (
    <Layout title="Tasting setup">
      <Typography variant="h5" component="h1" gutterBottom>
        Step 1: tasting variable
      </Typography>
      <div>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDateTimePicker
            value={date}
            ampm={false}
            InputAdornmentProps={{ position: "end" }}
            KeyboardButtonProps={{ edge: "end" }}
            name="date"
            autoOk
            label="Date"
            format="dd/MM/yyyy @ HH:mm"
            inputVariant="outlined"
            margin="normal"
            placeholder="E.g 10/10/2018 @ 08:34"
            disableFuture={true}
            onChange={(date: Date | null) => {
              setDate(date);
            }}
            error={!!formErrors.date}
            helperText={formErrors.beans}
          />
        </MuiPickersUtilsProvider>
      </div>
      <FormControl
        component="fieldset"
        className={classes.checkboxContainer}
        error={!!formErrors.isTastingBeans}
      >
        <FormLabel component="legend">What are you tasting?</FormLabel>
        <RadioGroup
          aria-label="tasting beans"
          name="isTastingBeans"
          value={isTastingBeans}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setIsTastingBeans(
              (event.target as HTMLInputElement).value === "true"
            )
          }
        >
          <FormControlLabel
            value={true}
            control={<Radio />}
            label="Different coffee beans (e.g cupping)"
          />
          <FormControlLabel
            value={false}
            control={<Radio />}
            label="Something else"
          />
          <FormHelperText>{formErrors.isTastingBeans}</FormHelperText>
        </RadioGroup>
      </FormControl>

      {isTastingBeans && (
        <Paper>
          <BeansCheckbox
            title="Select all the beans you're tasting"
            beansList={beans}
            values={beansCheckboxes}
            setValue={(beansId: string) =>
              setBeansCheckboxes({
                ...beansCheckboxes,
                [beansId]: !beansCheckboxes[beansId],
              })
            }
            showError={!!formErrors.beans}
            helperText={formErrors.beans}
          />
        </Paper>
      )}

      {isTastingBeans === false && (
        <Paper className={classes.formContainer}>
          <TastingVariables
            brews={brews}
            formErrors={formErrors}
            tastingVariable={tastingVariable}
            setTastingVariable={setTastingVariable}
            tastingSamplesVarValues={tastingSamplesVarValues}
            setTastingSamplesVarValues={setTastingSamplesVasValues}
          />
        </Paper>
      )}

      <div className={classes.buttonContainer}>
        <Button variant="contained" color="primary" onClick={handleAdd}>
          Next
        </Button>
      </div>
    </Layout>
  );
};

export default TastingAdd;
