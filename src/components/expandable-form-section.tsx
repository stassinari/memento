import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Button, Collapse, Paper, TextField, Typography } from "@mui/material";
import { Field, FormikProps } from "formik";
import React, { FunctionComponent, useState } from "react";
import useCommonStyles from "../config/use-common-styles";
import { BrewPrep } from "../database/types/brew";
import { EspressoPrep } from "../database/types/espresso";
import { extractSuggestions } from "../utils/form";
import AdvancedSuggestionsDialog, {
  advancedSuggestionsInputAdornment,
} from "./advanced-suggestions-dialog";
import RecentSuggestions from "./recent-suggestions";

interface Props {
  title: string;
  fields: FormField[];
  list: EspressoPrep[] | BrewPrep[];
  formik: FormikProps<EspressoPrep> | FormikProps<BrewPrep>;
}

interface FormField {
  label: string;
  value: any;
  name: string;
  placeholder?: string;
  customElement?: React.ReactNode;
}

const ExpandableFormSection: FunctionComponent<Props> = ({
  title,
  fields,
  list,
  formik,
}) => {
  const [equipmentExpanded, setEquipmentExpanded] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [advancedSuggestionsField, setAdvancedSuggestionsField] = useState<
    keyof EspressoPrep | keyof BrewPrep
  >("basket");

  const commonStyles = useCommonStyles();

  const handleClick = () => setEquipmentExpanded((prev) => !prev);
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
        collection="espresso"
        field={advancedSuggestionsField}
      />

      <Typography
        variant="h6"
        component="h2"
        className={commonStyles.equipmentHeading}
      >
        {title}
      </Typography>

      <Collapse in={!equipmentExpanded}>
        <Paper
          variant="outlined"
          className={commonStyles.expandableInfo}
          onClick={() => setEquipmentExpanded(true)}
        >
          <table>
            <tbody>
              {fields.map((field) => (
                <tr key={field.name}>
                  <td className={commonStyles.expandableInfoLabel}>
                    {field.label}:
                  </td>
                  <td className={commonStyles.expandableInfoValue}>
                    {field.value ? field.value : <em>Tap to edit</em>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div
            style={{
              display: "inline-block",
              textAlign: "center",
              width: "100%",
            }}
          >
            <ExpandMoreIcon />
          </div>
        </Paper>
      </Collapse>
      <Collapse in={equipmentExpanded}>
        {fields.map((field) => (
          <div key={field.name}>
            {!field.customElement ? (
              <>
                <Field
                  as={TextField}
                  className={commonStyles.formFieldWidth}
                  type="text"
                  name={field.name}
                  label={field.label}
                  placeholder={field.placeholder}
                  variant="outlined"
                  margin="normal"
                  InputProps={advancedSuggestionsInputAdornment(() => {
                    setAdvancedSuggestionsField(
                      field.name as keyof EspressoPrep
                    );
                    setDialogOpen(true);
                  })}
                />
                <RecentSuggestions
                  key={field.name}
                  chips={extractSuggestions(list, field.name)}
                  setValue={(value) => formik.setFieldValue(field.name, value)}
                />
              </>
            ) : (
              field.customElement
            )}
          </div>
        ))}
        <Button
          color="secondary"
          onClick={handleClick}
          endIcon={<KeyboardArrowUpIcon />}
        >
          Hide
        </Button>
      </Collapse>
    </>
  );
};

export default ExpandableFormSection;
