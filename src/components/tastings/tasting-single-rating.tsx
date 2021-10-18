import {
  Divider,
  FormLabel,
  Grid,
  makeStyles,
  Slider,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Field, FormikValues } from "formik";
import React, { FunctionComponent } from "react";
import { TastingPrep, TastingVariable } from "../../database/types/tasting";
import Flavours from "../flavours";
import FlavourNotes from "./flavour-notes";
import FlavourSlider from "./flavour-slider";

interface Props {
  prep: TastingPrep;
  tastingVariable: TastingVariable;
  formId: string;
  index: number;
}

const marks = [
  { value: 0 },
  { value: 1 },
  { value: 2 },
  { value: 3 },
  { value: 4 },
  { value: 5 },
  { value: 6 },
  { value: 7 },
  { value: 8 },
  { value: 9 },
  { value: 10 },
];

const useStyles = makeStyles((theme) => {
  return {
    container: {
      padding: theme.spacing(2),
    },
    sliderContainer: {
      maxWidth: 300,
    },
    flavourTitle: {
      marginBottom: theme.spacing(1),
    },
    divider: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
  };
});

const TastingSingleRating: FunctionComponent<Props> = ({
  prep,
  tastingVariable,
  index,
  formId,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const isBreakpointSm = useMediaQuery(theme.breakpoints.up("sm"));
  return (
    <div className={classes.container}>
      <div className={classes.sliderContainer}>
        <FormLabel>Overall</FormLabel>
        <Field>
          {({ form }: FormikValues) => (
            <Slider
              defaultValue={form.initialValues.ratings[index].overall}
              value={form.values.ratings[index].overall}
              step={0.5}
              min={0}
              max={10}
              marks={marks}
              valueLabelDisplay="auto"
              onChange={(_, value) => {
                form.setFieldValue(`${formId}.overall`, value);
              }}
            />
          )}
        </Field>
      </div>
      <Field>
        {({ form }: FormikValues) => (
          <Flavours
            values={form.values.ratings[index].flavours}
            defaultValues={form.initialValues.ratings[index].flavours}
            setValues={(values) =>
              form.setFieldValue(`${formId}.flavours`, values)
            }
            label="Flavours"
          />
        )}
      </Field>

      <Divider className={classes.divider} />

      <Typography variant="h6" component="h3" className={classes.flavourTitle}>
        Aroma
      </Typography>

      <Grid container spacing={isBreakpointSm ? 4 : 0}>
        <Grid item xs={12} sm={6}>
          <FlavourSlider
            fieldName="aromaQuantity"
            label="Aroma quantity"
            formId={formId}
            index={index}
            minMark="Low"
            maxMark="High"
          />

          <FlavourSlider
            fieldName="aromaQuality"
            label="Aroma quality"
            formId={formId}
            index={index}
            minMark="-"
            maxMark="+"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FlavourNotes name={`${formId}.aromaNotes`} label="Aroma notes" />
        </Grid>
      </Grid>

      <Divider className={classes.divider} />

      <Typography variant="h6" component="h3" className={classes.flavourTitle}>
        Acidity
      </Typography>

      <Grid container spacing={isBreakpointSm ? 4 : 0}>
        <Grid item xs={12} sm={6}>
          <FlavourSlider
            fieldName="acidityQuantity"
            label="Acidity quantity"
            formId={formId}
            index={index}
            minMark="Low"
            maxMark="High"
          />

          <FlavourSlider
            fieldName="acidityQuality"
            label="Acidity quality"
            formId={formId}
            index={index}
            minMark="-"
            maxMark="+"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FlavourNotes name={`${formId}.acidityNotes`} label="Acidity notes" />
        </Grid>
      </Grid>

      <Divider className={classes.divider} />

      <Typography variant="h6" component="h3" className={classes.flavourTitle}>
        Sweetness
      </Typography>

      <Grid container spacing={isBreakpointSm ? 4 : 0}>
        <Grid item xs={12} sm={6}>
          <FlavourSlider
            fieldName="sweetnessQuantity"
            label="Sweetness quantity"
            formId={formId}
            index={index}
            minMark="Low"
            maxMark="High"
          />

          <FlavourSlider
            fieldName="sweetnessQuality"
            label="Sweetness quality"
            formId={formId}
            index={index}
            minMark="-"
            maxMark="+"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FlavourNotes
            name={`${formId}.sweetnessNotes`}
            label="Sweetness notes"
          />
        </Grid>
      </Grid>
      <Divider className={classes.divider} />

      <Typography variant="h6" component="h3" className={classes.flavourTitle}>
        Body
      </Typography>

      <Grid container spacing={isBreakpointSm ? 4 : 0}>
        <Grid item xs={12} sm={6}>
          <FlavourSlider
            fieldName="bodyQuantity"
            label="Body quantity"
            formId={formId}
            index={index}
            minMark="Light"
            maxMark="Heavy"
          />

          <FlavourSlider
            fieldName="bodyQuality"
            label="Body quality"
            formId={formId}
            index={index}
            minMark="-"
            maxMark="+"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FlavourNotes name={`${formId}.bodyNotes`} label="Body notes" />
        </Grid>
      </Grid>

      <Divider className={classes.divider} />

      <Typography variant="h6" component="h3" className={classes.flavourTitle}>
        Finish
      </Typography>

      <Grid container spacing={isBreakpointSm ? 4 : 0}>
        <Grid item xs={12} sm={6}>
          <FlavourSlider
            fieldName="finishQuantity"
            label="Finish quantity"
            formId={formId}
            index={index}
            minMark="Short"
            maxMark="Long"
          />

          <FlavourSlider
            fieldName="finishQuality"
            label="Finish quality"
            formId={formId}
            index={index}
            minMark="-"
            maxMark="+"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FlavourNotes name={`${formId}.finishNotes`} label="Finish notes" />
        </Grid>
      </Grid>
    </div>
  );
};

export default TastingSingleRating;
