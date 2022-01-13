import { Autocomplete, TextField } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import React, { FunctionComponent } from "react";
import useCommonStyles from "../../../../config/use-common-styles";
import countries from "../../../../database/countries";
import { countryToFlag } from "../../../../utils/form";

interface Props {
  value: string | null;
  setValue: (arg0: string) => void;
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
      options={countries}
      clearOnBlur={false}
      classes={{
        option: classes.option,
      }}
      defaultValue={{ label: value, code: "" }}
      getOptionLabel={(option) => option.label || ""}
      renderOption={(props, option) => (
        <li {...props}>
          <span>{countryToFlag(option.code)}</span>
          {option.label}
        </li>
      )}
      isOptionEqualToValue={(option, value) => {
        return option.label === value.label || !option.label;
      }}
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
      onChange={(
        event: React.ChangeEvent<{}>,
        value: { code: string; label: string | null } | null
      ) => {
        setValue(value?.label || "");
      }}
    />
  );
};

export default Country;
