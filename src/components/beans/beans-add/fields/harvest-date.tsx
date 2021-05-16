import React, { FunctionComponent } from "react";
import { Field, FormikProps } from "formik";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import useCommonStyles from "../../../../config/use-common-styles";

interface Props {
  formik: FormikProps<Beans>;
}

const HarvestDate: FunctionComponent<Props> = ({ formik }) => {
  const commonStyles = useCommonStyles();
  return (
    <div>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Field
          as={DatePicker}
          className={commonStyles.formFieldWidth}
          name="harvestDate"
          views={["year", "month"]}
          autoOk
          label="Harvest date"
          inputVariant="outlined"
          margin="normal"
          disableFuture={true}
          onChange={(value: React.ChangeEvent<{}>) => {
            formik.setFieldValue("harvestDate", value);
          }}
        />
      </MuiPickersUtilsProvider>
    </div>
  );
};

export default HarvestDate;
