import { Autocomplete, TextField } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import React, { FunctionComponent } from "react";
import useCommonStyles from "../../../../config/use-common-styles";
import countries from "../../../../database/countries";
import { countryToFlag } from "../../../../utils/form";

interface Props {
  value: any;
  setValue: (arg0: any) => void;
}

const useStyles = makeStyles({
  option: {
    fontSize: 15,
    "& > span": {
      marginRight: 10,
      fontSize: 18,
    },
  },
});

const Country: FunctionComponent<Props> = ({ value, setValue }) => {
  const classes = useStyles();
  const commonStyles = useCommonStyles();
  return (
    <Autocomplete
      className={commonStyles.formFieldWidth}
      options={Object.keys(countries)}
      clearOnBlur={false}
      classes={{
        option: classes.option,
      }}
      value={value}
      renderOption={(props, option) => (
        <li {...props}>
          <span>{countryToFlag(countries[option])}</span>
          {option}
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Country"
          variant="outlined"
          margin="normal"
          inputProps={{
            ...params.inputProps,
            autoComplete: "new-password", // disable autocomplete and autofill
          }}
        />
      )}
      onChange={(event: React.ChangeEvent<{}>, value: string | null) => {
        setValue(value);
      }}
    />
  );
};

export default Country;
