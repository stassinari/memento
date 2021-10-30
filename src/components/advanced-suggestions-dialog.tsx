import {
  Dialog,
  DialogTitle,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  withStyles,
} from "@material-ui/core";
import ListAltIcon from "@material-ui/icons/ListAlt";
import firebase from "firebase";
import React, { FunctionComponent, useState } from "react";
import { useFirestore, useUser } from "reactfire";
import { getBeans, getBrews, getEspressoList } from "../database/queries";
import { Beans } from "../database/types/beans";
import { BrewPrep } from "../database/types/brew";
import { EspressoPrep } from "../database/types/espresso";

const CustomListItem = withStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
}))(ListItem);

interface Props {
  open: boolean;
  onClose: (arg0?: string) => () => void;
  collection: "brews" | "espresso" | "beans";
  field: keyof BrewPrep | keyof EspressoPrep | keyof Beans;
}

const AdvancedSuggestionsDialog: FunctionComponent<Props> = ({
  open,
  onClose,
  collection,
  field,
}) => {
  const {
    data: { uid: userId },
  } = useUser();
  const firestore = useFirestore();

  const [values, setValues] = useState<string[]>([]);

  const handleEnter = async () => {
    let data: firebase.firestore.DocumentData[] = [];
    switch (collection) {
      case "brews":
        data = await getBrews(firestore, userId);
        break;
      case "espresso":
        data = await getEspressoList(firestore, userId);
        break;
      case "beans":
        data = await getBeans(firestore, userId);
        break;

      default:
        break;
    }
    setValues(
      Array.from(new Set(data.map((d) => d[field])))
        .filter((v) => !!v)
        .sort()
    );
  };

  const handleClose = () => {
    setValues([]);
    onClose()();
  };

  return (
    <Dialog
      onClose={handleClose}
      onEnter={handleEnter}
      aria-labelledby="advanced-suggestions-dialog-title"
      open={open}
      maxWidth="xs"
      fullWidth={true}
      scroll="paper"
    >
      <DialogTitle id="advanced-suggestions-dialog-title">
        Select {field}
      </DialogTitle>
      <List dense={true}>
        {values.map((v: string) => (
          <CustomListItem button onClick={onClose(v)} key={v}>
            <ListItemText primary={v} />
          </CustomListItem>
        ))}
      </List>
    </Dialog>
  );
};

export const advancedSuggestiongInputAdornment = (onClick: () => void) => ({
  endAdornment: (
    <InputAdornment position="end">
      <IconButton
        aria-label="open advanced selection dialog"
        onClick={onClick}
        edge="end"
      >
        <ListAltIcon />
      </IconButton>
    </InputAdornment>
  ),
});

export default AdvancedSuggestionsDialog;
