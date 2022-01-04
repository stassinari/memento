import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DateTimePicker from "@mui/lab/DateTimePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { TextField } from "@mui/material";
import React, { FunctionComponent } from "react";
import useCommonStyles from "../../../../config/use-common-styles";

interface Props {
  value: any;
  setValue: (arg0: any) => void;
  showError?: boolean;
  helperText?: any;
}

const Date: FunctionComponent<Props> = ({
  value,
  setValue,
  showError = false,
  helperText,
}) => {
  const commonStyles = useCommonStyles();
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateTimePicker
        className={commonStyles.formFieldWidth}
        renderInput={(props) => (
          <TextField
            {...props}
            className={commonStyles.formFieldWidth}
            margin="normal"
            helperText={showError && helperText}
            placeholder="E.g 10/10/2018 @ 08:34"
            error={showError}
          />
        )}
        label="Date"
        ampm={false}
        inputFormat="dd/MM/yyyy @ HH:mm"
        mask="__/__/____ @ __:__"
        disableFuture={true}
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
        }}
      />
    </LocalizationProvider>
  );
};

export default Date;
