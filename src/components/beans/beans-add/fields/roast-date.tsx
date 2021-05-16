import React, { FunctionComponent } from "react";
import { Field, FormikProps } from "formik";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import useCommonStyles from "../../../../config/use-common-styles";

interface Props {
  formik: FormikProps<Beans>;
}

const RoastDate: FunctionComponent<Props> = ({ formik }) => {
  const commonStyles = useCommonStyles();
  return (
    <div>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Field
          as={KeyboardDatePicker}
          className={commonStyles.formFieldWidth}
          InputAdornmentProps={{ position: "end" }}
          KeyboardButtonProps={{ edge: "end" }}
          name="roastDate"
          autoOk
          label="Roast date"
          format="dd/MM/yyyy"
          inputVariant="outlined"
          margin="normal"
          placeholder="E.g 10/10/2018"
          disableFuture={true}
          onChange={(value: React.ChangeEvent<{}>) => {
            formik.setFieldValue("roastDate", value);
          }}
        />
      </MuiPickersUtilsProvider>
    </div>
  );
};

export default RoastDate;
