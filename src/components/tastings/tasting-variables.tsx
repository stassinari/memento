import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import {
  Button,
  IconButton,
  InputLabel,
  FormControl,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  Typography,
  FormHelperText,
  ListSubheader,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";

import useCommonStyles from "../../config/use-common-styles";
import { tastingVariablesList } from "../../utils/constants";
import RecentSuggestions from "../recent-suggestions";
import { extractSuggestions } from "../../utils/form";

interface Props {
  tastingVariable: TastingVariable | "";
  setTastingVariable: React.Dispatch<
    React.SetStateAction<TastingVariable | "">
  >;
  tastingSamplesVarValues: string[];
  setTastingSamplesVarValues: React.Dispatch<React.SetStateAction<string[]>>;
  brews: Brew[];
  formErrors: Record<string, string>;
}

const useStyles = makeStyles((theme) => ({
  formContainer: {
    padding: theme.spacing(2),
  },
  inlineForm: {
    display: "flex",
    alignItems: "center",
  },
  inlineButton: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
    marginLeft: theme.spacing(2),
  },
  tastingSamplesTitle: {
    marginTop: theme.spacing(2),
  },
  errorMessage: {
    color: theme.palette.error.main,
  },
  samplesList: {
    marginLeft: theme.spacing(-2),
    marginRight: theme.spacing(-2),
  },
}));

const TastingVariables: FunctionComponent<Props> = ({
  tastingVariable,
  setTastingVariable,
  tastingSamplesVarValues,
  setTastingSamplesVarValues,
  brews,
  formErrors,
}) => {
  const classes = useStyles();
  const commonStyles = useCommonStyles();
  const [newSampleVarValue, setNewSampleVarValue] = useState<string>("");

  const newSampleInput = useRef<HTMLInputElement>(null);

  // set focus on input when tasting variable changes
  // Note: can't do it in the onClick callback because of a race condition
  useEffect(() => newSampleInput.current?.focus(), [tastingVariable]);

  return (
    <>
      <Typography variant="subtitle1">
        Select which variable you're tasting
      </Typography>

      <div>
        <FormControl
          variant="outlined"
          className={commonStyles.formFieldWidth}
          margin="normal"
          error={!!formErrors.tastingVariable}
        >
          <InputLabel>Tasting variable</InputLabel>
          <Select
            name="tastingVariable"
            label="Tasting variable"
            value={tastingVariable}
            onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
              setTastingVariable(event.target.value as TastingVariable);
              setTastingSamplesVarValues([]);
              setNewSampleVarValue("");
              // setTimeout(() => newSampleInput.current?.focus(), 50);
            }}
          >
            {tastingVariablesList.map((v) => (
              <MenuItem key={v.value} value={v.value}>
                {v.label}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>{formErrors.tastingVariable}</FormHelperText>
        </FormControl>
      </div>

      {tastingVariable && (
        <>
          <Typography
            variant="subtitle1"
            className={classes.tastingSamplesTitle}
          >
            {`Add some different ${
              tastingVariablesList.find((v) => v.value === tastingVariable)
                ?.plural
            }
            for your tasting`}
          </Typography>
          <div className={classes.inlineForm}>
            <TextField
              value={newSampleVarValue}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setNewSampleVarValue(event.target.value)
              }
              label="Sample"
              variant="outlined"
              className={commonStyles.formFieldWidth}
              margin="normal"
              inputRef={newSampleInput}
            />
            <Button
              className={classes.inlineButton}
              variant="contained"
              color="primary"
              onClick={() => {
                if (newSampleVarValue) {
                  setTastingSamplesVarValues([
                    ...tastingSamplesVarValues,
                    newSampleVarValue,
                  ]);
                  setNewSampleVarValue("");
                  newSampleInput.current?.focus();
                }
              }}
            >
              Add
            </Button>
          </div>
          <RecentSuggestions
            chips={extractSuggestions(brews, tastingVariable, 5)}
            setValue={(value) =>
              setTastingSamplesVarValues([...tastingSamplesVarValues, value])
            }
          />
        </>
      )}

      <List
        subheader={
          tastingSamplesVarValues.length > 0 ? (
            <ListSubheader>Tasting samples</ListSubheader>
          ) : undefined
        }
        className={classes.samplesList}
      >
        {tastingSamplesVarValues.map((occurrence) => (
          <ListItem key={occurrence}>
            <ListItemText primary={occurrence} />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() =>
                  setTastingSamplesVarValues(
                    tastingSamplesVarValues.filter((occ) => occ !== occurrence)
                  )
                }
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      {formErrors.tastingSamplesVarValues && (
        <Typography
          className={classes.errorMessage}
          variant="caption"
          display="block"
          gutterBottom
        >
          {formErrors.tastingSamplesVarValues}
        </Typography>
      )}
    </>
  );
};

export default TastingVariables;
