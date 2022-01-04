import React, { FunctionComponent } from "react";
import Autocomplete, {
  createFilterOptions,
} from '@mui/material/Autocomplete';
import { TextField } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';

import processes from "../../../../database/processes";
import useCommonStyles from "../../../../config/use-common-styles";

interface Props {
  value: any;
  setValue: (arg0: any) => void;
}

const filter = createFilterOptions();

const useStyles = makeStyles((theme) => {
  return {
    root: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(1),
    },
  };
});

const Process: FunctionComponent<Props> = ({ value, setValue }) => {
  const classes = useStyles();
  const commonStyles = useCommonStyles();
  return (
    <div className={classes.root}>
      <Autocomplete
        className={commonStyles.formFieldWidth}
        freeSolo
        options={processes}
        value={value}
        // @ts-ignore
        filterOptions={(options, params) => {
          // @ts-ignore
          const filtered = filter(options, params);
          // Suggest the creation of a new value
          if (params.inputValue !== "") {
            filtered.push(params.inputValue);
          }
          return filtered;
        }}
        renderInput={(params) => (
          <TextField {...params} variant="outlined" label="Process" />
        )}
        onChange={(event: React.ChangeEvent<{}>, value: string | null) =>
          setValue(value)
        }
      />
    </div>
  );
};

export default Process;
