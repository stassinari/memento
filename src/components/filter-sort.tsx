import {
  Checkbox,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import React, { FunctionComponent } from "react";
import { Beans } from "../database/types/beans";
import { BrewPrep } from "../database/types/brew";
import { buildBeansIdLabelMap } from "../utils/beans";
import { extractSortedArray } from "../utils/form";

interface Props {
  brews: BrewPrep[];
  beans: Beans[];
  filters: Record<string, string[]>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  sorting: string;
  setSorting: React.Dispatch<React.SetStateAction<string>>;
}

const useStyles = makeStyles((theme) => {
  return {
    root: {
      paddingTop: "env(safe-area-inset-top)",
      backgroundImage: `linear-gradient(to bottom,
            #424242 0px,
          #424242 env(safe-area-inset-top),
          ${theme.palette.background.paper} env(safe-area-inset-top),
          ${theme.palette.background.paper} 100%
      )`,
      backgroundPosition: "0px 0px",
      backgroundRepeat: "no-repeat",
      [theme.breakpoints.up("sm")]: {
        paddingTop: 0,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[1],
        borderRadius: theme.shape.borderRadius,
      },
    },
    filterSortDrawer: {
      width: 250,
      [theme.breakpoints.up("sm")]: {
        width: "auto",
      },
    },
    title: {
      paddingTop: theme.spacing(2),
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      [theme.breakpoints.up("sm")]: {
        paddingTop: theme.spacing(1),
      },
    },
  };
});

const replaceBeansEntityWithId = (brews: BrewPrep[]) => {
  const coolerBrews = brews.map((brew) => ({
    ...brew,
    beans: brew.beans!.id,
  }));
  return coolerBrews;
};

const FilterSort: FunctionComponent<Props> = ({
  brews,
  beans,
  filters,
  setFilters,
  sorting,
  setSorting,
}) => {
  const classes = useStyles();
  const [checked, setChecked] = React.useState(filters);

  const brewMethodsSorted = extractSortedArray(brews, "method");
  // keep only non-finished beans
  const activeBeansId = beans
    .filter((bean) => !bean.isFinished)
    .map((bean) => bean.id);
  const brewBeansSorted = extractSortedArray(
    replaceBeansEntityWithId(brews),
    "beans"
  ).filter((beanId) => activeBeansId.includes(beanId));

  const beansIdLabelMap = buildBeansIdLabelMap(beans);

  const handleToggle = (field: string, value: string) => () => {
    const checkedMethods = checked[field];
    const currentIndex = checkedMethods.indexOf(value);
    const newChecked = [...checkedMethods];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    const newFilters = { ...checked, [field]: newChecked };

    setFilters(newFilters);
    setChecked(newFilters);
  };

  return (
    <div className={classes.root}>
      <Typography variant="h5" className={classes.title}>
        Sort / filter
      </Typography>

      <List
        dense
        className={classes.filterSortDrawer}
        subheader={<ListSubheader disableSticky>Sort by</ListSubheader>}
      >
        <RadioGroup
          name="sorting"
          value={sorting}
          onChange={(event) => setSorting(event.target.value)}
        >
          <ListItem>
            <ListItemText primary={"Date new - old"} />
            <ListItemSecondaryAction>
              <Radio edge="end" value="date/desc" />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText primary={"Date old - new"} />
            <ListItemSecondaryAction>
              <Radio edge="end" value="date/asc" />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText primary={"Rating high - low"} />
            <ListItemSecondaryAction>
              <Radio edge="end" value="rating/desc" />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText primary={"Rating low - high"} />
            <ListItemSecondaryAction>
              <Radio edge="end" value="rating/asc" />
            </ListItemSecondaryAction>
          </ListItem>
        </RadioGroup>
      </List>

      <List
        dense
        className={classes.filterSortDrawer}
        subheader={<ListSubheader disableSticky>Filter by beans</ListSubheader>}
      >
        {brewBeansSorted.map((beansId) => (
          <ListItem key={beansId}>
            <ListItemText primary={beansIdLabelMap[beansId]} />
            <ListItemSecondaryAction>
              <Checkbox
                edge="end"
                onChange={handleToggle("beans", beansId)}
                checked={checked["beans"].indexOf(beansId) !== -1}
                inputProps={{ "aria-labelledby": beansId }}
              />
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <List
        dense
        className={classes.filterSortDrawer}
        subheader={
          <ListSubheader disableSticky>Filter by method</ListSubheader>
        }
      >
        {brewMethodsSorted.map((method) => (
          <ListItem key={method}>
            <ListItemText primary={method} />
            <ListItemSecondaryAction>
              <Checkbox
                edge="end"
                onChange={handleToggle("method", method)}
                checked={checked["method"].indexOf(method) !== -1}
                inputProps={{ "aria-labelledby": method }}
              />
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default FilterSort;
