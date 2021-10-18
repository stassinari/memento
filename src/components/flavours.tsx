import { TextField } from "@material-ui/core";
import { FilterOptionsState } from "@material-ui/lab";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import React, { FunctionComponent } from "react";
import { default as tastingNotesArray } from "../database/tasting-notes";
import { ITastingNotes } from "../database/types/common";

interface Props {
  values: string[];
  defaultValues: string[];
  setValues: (arg0: string[]) => void;
  label: string;
}

interface TastingNoteOption {
  label: string;
  group: string;
}

const notesToOptions = (
  children: ITastingNotes[],
  parentName?: string
): TastingNoteOption[] =>
  children.reduce(
    (accumulator, currentValue) =>
      !currentValue.children
        ? // no children means breaking the recursion
          [...accumulator, { label: currentValue.name, group: parentName! }]
        : [
            ...accumulator,
            ...notesToOptions(
              currentValue.children,
              parentName
                ? `${parentName} > ${currentValue.name}`
                : currentValue.name
            ),
          ],
    [] as TastingNoteOption[]
  );

const filter = createFilterOptions();
const tastingNotes = notesToOptions(tastingNotesArray);

const Flavours: FunctionComponent<Props> = ({
  values,
  defaultValues,
  setValues,
  label,
}) => (
  <div>
    <Autocomplete
      value={values}
      defaultValue={defaultValues}
      multiple
      limitTags={2}
      freeSolo
      options={tastingNotes
        .sort((a, b) => -b.group.localeCompare(a.group))
        .map((n) => n.label)}
      groupBy={(option) => {
        const obj = tastingNotes.find((n) => n.label === option);
        return obj ? obj.group : "";
      }}
      filterSelectedOptions
      filterOptions={(options, params) => {
        const filtered = filter(options, params as FilterOptionsState<unknown>);
        // Suggest the creation of a new value
        if (params.inputValue !== "") {
          filtered.push(params.inputValue);
        }
        return filtered as string[];
      }}
      renderInput={(params) => (
        <TextField {...params} variant="outlined" label={label} />
      )}
      onChange={(event, value, reason) => {
        setValues(value);
      }}
    />
  </div>
);

export default Flavours;
