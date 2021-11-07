import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DatePicker from "@mui/lab/DatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { TextField, TextFieldProps } from "@mui/material";
import { Field, FormikProps } from "formik";
import React, { FunctionComponent } from "react";
import useCommonStyles from "../../../../config/use-common-styles";
import { Beans } from "../../../../database/types/beans";

interface Props {
  formik: FormikProps<Beans>;
}

const RoastDate: FunctionComponent<Props> = ({ formik }) => {
  const commonStyles = useCommonStyles();
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Field
        as={DatePicker}
        className={commonStyles.formFieldWidth}
        name="roastDate"
        renderInput={(props: TextFieldProps) => (
          <TextField
            {...props}
            className={commonStyles.formFieldWidth}
            margin="normal"
            placeholder="E.g 10/10/2018"
          />
        )}
        label="Roast date"
        inputFormat="dd/MM/yyyy"
        mask="__/__/____"
        disableFuture={true}
        onChange={(value: React.ChangeEvent<{}>) => {
          formik.setFieldValue("roastDate", value);
        }}
      />
    </LocalizationProvider>
  );
};

export default RoastDate;
