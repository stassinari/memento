import React, { FunctionComponent, useState } from "react";
import firebase from "firebase/app";

import Date from "../fields/date";
import BeansRadioDialog from "../../../beans-radio-dialog";
import { Field, FormikProps } from "formik";
import { TextField } from "@material-ui/core";
import useCommonStyles from "../../../../config/use-common-styles";
import { extractSuggestions } from "../../../../utils/form";
import AdvancedSuggestionsDialog, {
  advancedSuggestiongInputAdornment,
} from "../../../advanced-suggestions-dialog";
import RecentSuggestions from "../../../recent-suggestions";
import ExpandableFormSection from "../../../expandable-form-section";

interface Props {
  brews: Brew[];
  beans: Beans[];
  formik: FormikProps<BrewPrep>;
}

const BaseInfo: FunctionComponent<Props> = ({ formik, brews, beans }) => {
  const commonStyles = useCommonStyles();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [advancedSuggestionsField, setAdvancedSuggestionsField] = useState<
    keyof BrewPrep
  >("filterType");

  if (beans.length === 0) {
    // TODO refactor into smaller components
    // this only applies to the list, should display the skeleton of the page
    return null;
  }

  const showMethodError = formik.errors.method && formik.touched.method;

  return (
    <>
      <AdvancedSuggestionsDialog
        open={dialogOpen}
        onClose={(selectedValue) => () => {
          if (selectedValue) {
            formik.setFieldValue(advancedSuggestionsField, selectedValue);
          }
          setDialogOpen(false);
        }}
        collection="brews"
        field={advancedSuggestionsField}
      />
      <Date
        value={formik.values.date}
        setValue={(value: React.ChangeEvent) =>
          formik.setFieldValue("date", value)
        }
        showError={!!formik.errors.date && !!formik.touched.date}
        helperText={formik.errors.date}
      />
      <div>
        <Field
          as={TextField}
          type="text"
          name="method"
          label="Method *"
          placeholder="E.g: V60"
          variant="outlined"
          margin="normal"
          className={commonStyles.formFieldWidth}
          error={showMethodError}
          helperText={showMethodError && formik.errors.method}
          InputProps={advancedSuggestiongInputAdornment(() => {
            setAdvancedSuggestionsField("method");
            setDialogOpen(true);
          })}
        />
        <RecentSuggestions
          chips={extractSuggestions(brews, "method")}
          setValue={(value) => formik.setFieldValue("method", value)}
        />
      </div>
      <BeansRadioDialog
        beansList={beans}
        value={formik.values.beans}
        setValue={(
          value: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>
        ) => formik.setFieldValue("beans", value)}
        showError={!!formik.errors.beans && (formik.touched.beans as boolean)}
        helperText={formik.errors.beans as string}
      />

      <ExpandableFormSection
        title="Equipment"
        formik={formik}
        fields={[
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
            label: "Water type",
            value: formik.values.waterType,
            name: "waterType",
            placeholder: "E.g: Waitrose",
          },
          {
            label: "Filter type",
            value: formik.values.filterType,
            name: "filterType",
            placeholder: "E.g: Hario tabbed",
          },
        ]}
        list={brews}
      />
    </>
  );
};

export default BaseInfo;
