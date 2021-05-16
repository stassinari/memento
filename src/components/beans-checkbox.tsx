import React, { FunctionComponent } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Checkbox,
  ListSubheader,
  FormControl,
  FormHelperText,
} from "@material-ui/core";

import { buildBeansSecondaryLabel, buildBeansLabel } from "../utils/beans";

interface Props {
  title?: string;
  beansList: Beans[];
  values: Record<string, boolean>;
  setValue: (arg0: any) => void;
  showError?: boolean;
  helperText?: string;
}
const useStyles = makeStyles((theme) => ({
  listIcon: {
    minWidth: 34,
  },
  errorMessage: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    marginTop: theme.spacing(-1),
    marginBottom: theme.spacing(1),
  },
}));

const BeansCheckbox: FunctionComponent<Props> = ({
  beansList,
  values,
  setValue,
  title = "Beans",
  showError = false,
  helperText,
}) => {
  const classes = useStyles();
  return (
    <Box>
      <FormControl error={showError}>
        <List
          subheader={
            <ListSubheader disableSticky={true}>{title}</ListSubheader>
          }
        >
          {Object.entries(beansList).map(([id, beanBag]) => (
            <ListItem
              key={beanBag.id}
              role={undefined}
              dense
              button
              onClick={() => {
                setValue(beanBag.id);
              }}
            >
              <ListItemIcon className={classes.listIcon}>
                <Checkbox
                  edge="start"
                  color="primary"
                  checked={values[beanBag.id!]}
                  tabIndex={-1}
                  disableRipple
                />
              </ListItemIcon>
              <ListItemText
                id={beanBag.id}
                primary={buildBeansLabel(beanBag, true)}
                secondary={buildBeansSecondaryLabel(beanBag)}
              />
            </ListItem>
          ))}
        </List>
        {showError && (
          <FormHelperText className={classes.errorMessage}>
            {helperText}
          </FormHelperText>
        )}
      </FormControl>
    </Box>
  );
};

export default BeansCheckbox;
