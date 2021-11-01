import React, { FunctionComponent } from "react";
import Autocomplete, {
  createFilterOptions,
} from '@mui/material/Autocomplete';
import { TextField } from "@mui/material";

import varietals from "../../../../database/varietals";
import useCommonStyles from "../../../../config/use-common-styles";

interface Props {
  value: any;
  setValue: (arg0: any[]) => void;
}

const filter = createFilterOptions();

const Varietal: FunctionComponent<Props> = ({ value, setValue }) => {
  const commonStyles = useCommonStyles();
  return (
    <div className={commonStyles.formFieldMarginCompensation}>
      <Autocomplete
        className={commonStyles.formFieldWidth}
        multiple
        limitTags={2}
        freeSolo
        options={varietals}
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
          <TextField {...params} variant="outlined" label="Varietal(s)" />
        )}
        onChange={(event, value, reason) => setValue(value)}
      />
    </div>
  );
};

export default Varietal;
