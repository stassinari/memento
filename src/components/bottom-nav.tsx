import {
  BottomNavigation,
  BottomNavigationAction,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import withStyles from "@mui/styles/withStyles";
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import BeansIcon from "./icons/beans";
import ChemexIcon from "./icons/chemex";
import PortafilterIcon from "./icons/portafilter";
import SpoonIcon from "./icons/spoon";

const useStyles = makeStyles((theme) => {
  return {
    container: {
      paddingBottom: "env(safe-area-inset-bottom)", // make space for silly iPhone thingie
      position: "fixed",
      width: "100%",
      bottom: 0,
      boxShadow: theme.shadows[8],
      zIndex: 3,
      height: `calc(env(safe-area-inset-bottom) + ${theme.mixins.toolbar.minHeight}px)`,
    },
  };
});

const CustomBottomNavigationAction = withStyles((theme) => {
  return {
    root: {
      // backgroundColor: theme.palette.primary.main,
      // color: theme.palette.primary.light,
      // "&:not(.active)": {
      //   color: theme.palette.primary.light,
      // },
      // "&.active": {
      //   color: "white",
      // },
    },
    selected: {},
  };
})(BottomNavigationAction) as typeof BottomNavigationAction;

const BottomNav = () => {
  const theme = useTheme();
  const isBreakpointXs = useMediaQuery(theme.breakpoints.down("sm"));
  const classes = useStyles();
  const location = useLocation();
  const topLevelPage = location.pathname.split("/")[1];
  const [value, setValue] = React.useState(`/${topLevelPage}`);

  return (
    <>
      {isBreakpointXs && (
        <BottomNavigation
          sx={{ backgroundColor: theme.isDark ? "#424242" : "inherit" }}
          className={classes.container}
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          showLabels
        >
          <CustomBottomNavigationAction
            component={NavLink}
            to="/brews"
            value="/brews"
            label="Brews"
            icon={<ChemexIcon />}
          />
          <CustomBottomNavigationAction
            component={NavLink}
            to="/espresso"
            value="/espresso"
            label="Espresso"
            icon={<PortafilterIcon />}
          />
          <CustomBottomNavigationAction
            component={NavLink}
            to="/tastings"
            value="/tastings"
            label="Tastings"
            icon={<SpoonIcon />}
          />
          <CustomBottomNavigationAction
            component={NavLink}
            to="/beans"
            value="/beans"
            label="Beans"
            icon={<BeansIcon />}
          />
        </BottomNavigation>
      )}
    </>
  );
};

export default BottomNav;
