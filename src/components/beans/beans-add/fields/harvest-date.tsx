import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DatePicker from "@mui/lab/DatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { TextField, TextFieldProps } from "@mui/material";
import "date-fns";
import { Field, FormikProps } from "formik";
import React, { FunctionComponent } from "react";
import useCommonStyles from "../../../../config/use-common-styles";
import { Beans } from "../../../../database/types/beans";

interface Props {
  formik: FormikProps<Beans>;
}

const HarvestDate: FunctionComponent<Props> = ({ formik }) => {
  const commonStyles = useCommonStyles();
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Field
        as={DatePicker}
        className={commonStyles.formFieldWidth}
        name="harvestDate"
        views={["year", "month"]}
        renderInput={(props: TextFieldProps) => (
          <TextField
            {...props}
            className={commonStyles.formFieldWidth}
            margin="normal"
            placeholder="E.g Dec 2020"
          />
        )}
        label="Harvest date"
        disableFuture={true}
        onChange={(value: React.ChangeEvent<{}>) => {
          formik.setFieldValue("harvestDate", value);
        }}
      />
    </LocalizationProvider>
  );
};

export default HarvestDate;
