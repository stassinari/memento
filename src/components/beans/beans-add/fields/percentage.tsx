import React, { FunctionComponent } from "react";
import { TextField, InputAdornment } from "@mui/material";
import useCommonStyles from "../../../../config/use-common-styles";

interface Props {
  value: any;
  setValue: (arg0: any) => void;
}

const Percentage: FunctionComponent<Props> = ({ value, setValue }) => {
  const commonStyles = useCommonStyles();
  return (
    <div>
      <TextField
        className={commonStyles.formFieldWidth}
        value={value}
        type="number"
        inputMode="decimal"
        name="percentage"
        margin="normal"
        label="Percentage"
        placeholder="E.g: 40"
        inputProps={{ step: "any" }}
        InputProps={{
          endAdornment: <InputAdornment position="end">%</InputAdornment>,
        }}
        variant="outlined"
        onChange={(event) => {
          setValue(event.target.value);
        }}
      />
    </div>
  );
};

export default Percentage;
