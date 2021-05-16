import React, { FunctionComponent } from "react";
import { Field } from "formik";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
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
    <div>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Field
          as={KeyboardDatePicker}
          className={commonStyles.formFieldWidth}
          InputAdornmentProps={{ position: "end" }}
          KeyboardButtonProps={{ edge: "end" }}
          value={value}
          name="date"
          autoOk
          label="Date"
          format="dd/MM/yyyy"
          inputVariant="outlined"
          margin="normal"
          placeholder="E.g 10/10/2018"
          disableFuture={true}
          onChange={(event: React.ChangeEvent) => {
            setValue(event);
          }}
          error={showError}
          helperText={showError && helperText}
        />
      </MuiPickersUtilsProvider>
    </div>
  );
};

export default Date;
