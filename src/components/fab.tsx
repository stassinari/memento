import React, { FunctionComponent, useState } from "react";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { Fab as MuiFab, makeStyles, useMediaQuery } from "@material-ui/core";
import {
  SpeedDial as MuiSpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from "@material-ui/lab";
import { useTheme } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";

import PortafilterIcon from "./icons/portafilter";
import ChemexIcon from "./icons/chemex";
import BeansIcon from "./icons/beans";

interface Props {
  link: string;
  label: string;
  disabled?: boolean;
}

const useStyles = makeStyles((theme) => ({
  common: {
    position: "fixed",
    right: theme.spacing(2),
    bottom: `calc(${theme.mixins.toolbar.minHeight}px + ${theme.spacing(
      2
    )}px + env(safe-area-inset-bottom))`,
    zIndex: theme.zIndex["appBar"],
    [theme.breakpoints.up("sm")]: {
      bottom: theme.spacing(2),
      width: "fit-content !important",
    },
    [theme.breakpoints.up("md")]: {
      zIndex: theme.zIndex["drawer"] + 2,
      top: theme.spacing(9),
      left: theme.spacing(12),
      transition: theme.transitions.create("left", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.shorter,
      }),
    },
  },
  fabOnly: {
    [theme.breakpoints.up("sm")]: {
      "& svg": {
        marginRight: theme.spacing(1),
      },
    },
  },
  speedDialOnly: {
    "& a svg": {
      display: "block",
      color: theme.palette.text.primary,
    },
    [theme.breakpoints.up("md")]: {
      alignItems: "initial",
      top: 68,
    },
  },
}));

const Fab: FunctionComponent<Props> = ({
  link,
  label,
  disabled = false,
  ...props
}) => {
  const theme = useTheme();
  const isBreakpointSm = useMediaQuery(theme.breakpoints.up("sm"));
  const isBreakpointMd = useMediaQuery(theme.breakpoints.up("md"));
  const classes = useStyles();
  return (
    <MuiFab
      color={isBreakpointMd ? "secondary" : "primary"}
      className={clsx([classes.common, classes.fabOnly, " fab"])}
      component={Link}
      to={link}
      size={isBreakpointSm ? "large" : "medium"}
      variant={isBreakpointSm ? "extended" : "round"}
      disabled={disabled}
      {...props}
    >
      <AddIcon />
      {isBreakpointSm ? label : ""}
    </MuiFab>
  );
};

const speedDialActions = [
  {
    icon: (
      <Link to="/brews/add/step0">
        <ChemexIcon />
      </Link>
    ),
    name: "Brew",
  },
  {
    icon: (
      <Link to="/espresso/add/step0">
        <PortafilterIcon />
      </Link>
    ),
    name: "Espresso",
  },
  {
    icon: (
      <Link to="/beans/add">
        <BeansIcon />
      </Link>
    ),
    name: "Beans",
  },
];

export const SpeedDial = () => {
  const theme = useTheme();
  const isBreakpointSm = useMediaQuery(theme.breakpoints.up("sm"));
  const isBreakpointMd = useMediaQuery(theme.breakpoints.up("md"));
  const classes = useStyles();

  const [open, setOpen] = useState(false);

  return (
    <MuiSpeedDial
      ariaLabel="add menu"
      className={clsx([classes.common, classes.speedDialOnly, " fab"])}
      icon={<SpeedDialIcon />}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      direction={isBreakpointMd ? "right" : "up"}
      FabProps={{
        color: isBreakpointMd ? "secondary" : "primary",
        size: isBreakpointSm ? "large" : "medium",
      }}
    >
      {speedDialActions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          tooltipPlacement={isBreakpointMd ? "bottom" : "left"}
          onClick={() => setOpen(false)}
        />
      ))}
    </MuiSpeedDial>
  );
};

export default Fab;
