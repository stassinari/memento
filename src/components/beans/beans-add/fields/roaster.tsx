import { TextField } from "@material-ui/core";
import { Field, FormikProps } from "formik";
import React, { FunctionComponent, useState } from "react";
import useCommonStyles from "../../../../config/use-common-styles";
import { Beans } from "../../../../database/types/beans";
import { extractSuggestions } from "../../../../utils/form";
import AdvancedSuggestionsDialog, {
  advancedSuggestiongInputAdornment,
} from "../../../advanced-suggestions-dialog";
import RecentSuggestions from "../../../recent-suggestions";

interface Props {
  beansList: Beans[];
  formik: FormikProps<Beans>;
}

const Roaster: FunctionComponent<Props> = ({ beansList, formik }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const showError = formik.errors.roaster && formik.touched.roaster;
  const commonStyles = useCommonStyles();
  return (
    <div>
      <Field
        as={TextField}
        className={commonStyles.formFieldWidth}
        type="text"
        name="roaster"
        label="Roaster *"
        variant="outlined"
        margin="normal"
        error={showError}
        helperText={showError && formik.errors.roaster}
        InputProps={advancedSuggestiongInputAdornment(() =>
          setDialogOpen(true)
        )}
      />
      <RecentSuggestions
        chips={extractSuggestions(beansList, "roaster")}
        setValue={(value) => formik.setFieldValue("roaster", value)}
      />
      <AdvancedSuggestionsDialog
        open={dialogOpen}
        onClose={(selectedValue) => () => {
          if (selectedValue) {
            formik.setFieldValue("roaster", selectedValue);
          }
          setDialogOpen(false);
        }}
        collection="beans"
        field="roaster"
      />
    </div>
  );
};

export default Roaster;
