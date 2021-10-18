import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormHelperText,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  makeStyles,
  Radio,
  RadioGroup,
  Typography,
} from "@material-ui/core";
import ListAltIcon from "@material-ui/icons/ListAlt";
import { Field } from "formik";
import React, { FunctionComponent, useState } from "react";
import { useFirestore } from "reactfire";
import { Beans, RoastStyle } from "../database/types/beans";
import { buildBeansLabel, buildBeansSecondaryLabel } from "../utils/beans";
import { capitalise } from "../utils/string";

interface Props {
  beansList: Beans[];
  value: any;
  setValue: (arg0: any) => void;
  filterFirst?: boolean;
  showError?: boolean;
  helperText?: string;
}
const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingBottom: 0,
  },
  listContainer: {
    marginLeft: theme.spacing(-3),
    marginRight: theme.spacing(-3),
  },
  listCategory: {
    lineHeight: "inherit",
    marginTop: theme.spacing(1),
  },
  listIcon: {
    minWidth: 34,
  },
  errorMessage: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

type ListCategory = RoastStyle | "unknown roast";

const categoriesOrder = (filterFirst: boolean) => ({
  filter: filterFirst ? 1 : 3,
  "omni-roast": 2,
  espresso: filterFirst ? 3 : 1,
  "unknown roast": 4,
});

const BeansRadioDialog: FunctionComponent<Props> = ({
  beansList,
  value,
  setValue,
  filterFirst = true,
  showError = false,
  helperText,
}) => {
  const firestore = useFirestore();
  const [openDialog, setOpenDialog] = useState(false);
  const classes = useStyles();
  const handleClose = () => setOpenDialog(false);

  const selectedBeans = value && beansList.find((b) => b.id === value.id);

  const beansRoastMap = beansList
    .sort((a, b) => -b.name.localeCompare(a.name))
    .reduce((obj, currentValue) => {
      const currentRoastStyle = currentValue.roastStyle
        ? currentValue.roastStyle
        : "unknown roast";

      return {
        ...obj,
        [currentRoastStyle]: obj[currentRoastStyle]
          ? [...obj[currentRoastStyle], currentValue]
          : [currentValue],
      };
    }, {} as Record<ListCategory, Beans[]>);

  const renderBeansList = (beanBag: Beans) => {
    const isChecked = value ? value.id === beanBag.id : undefined;
    return (
      <ListItem
        key={beanBag.id}
        role={undefined}
        dense
        button
        onClick={() => {
          // replace beansId with Firestore ref
          const beansRef = firestore.collection("beans").doc(beanBag.id);
          setValue(beansRef);
          handleClose();
        }}
      >
        <ListItemIcon className={classes.listIcon}>
          <Radio
            edge="start"
            id={beanBag.id}
            value={beanBag.id}
            checked={isChecked}
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
    );
  };
  return (
    <>
      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
      >
        <DialogTitle id="alert-dialog-title" className={classes.dialogTitle}>
          Choose beans
        </DialogTitle>
        <DialogContent>
          <Field component={RadioGroup} name="beans">
            <List className={classes.listContainer}>
              {Object.keys(beansRoastMap)
                .sort((a, b) => {
                  return (
                    categoriesOrder(filterFirst)[a as ListCategory] -
                    categoriesOrder(filterFirst)[b as ListCategory]
                  );
                })
                .map((br) => (
                  <div key={br}>
                    <ListSubheader
                      className={classes.listCategory}
                      disableSticky
                    >
                      {capitalise(br)}
                    </ListSubheader>
                    {beansRoastMap[br as ListCategory].map(renderBeansList)}
                  </div>
                ))}
            </List>
          </Field>
        </DialogContent>
      </Dialog>
      <div>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Beans *
        </Typography>
        <Typography variant="body1" color="textPrimary" gutterBottom>
          {selectedBeans
            ? buildBeansLabel(selectedBeans, true)
            : "Not selected"}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ListAltIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Select beans
        </Button>

        {showError && (
          <FormHelperText error={showError} className={classes.errorMessage}>
            {helperText}
          </FormHelperText>
        )}
      </div>
    </>
  );
};

export default BeansRadioDialog;
