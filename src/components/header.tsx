import {
  AppBar,
  Badge,
  Chip,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import MenuIcon from "@mui/icons-material/Menu";
import clsx from "clsx";
import React, { FunctionComponent } from "react";
import { Offline } from "react-detect-offline";
import { Link } from "react-router-dom";
import { useUser } from "reactfire";
import HomeIcon from "./icons/home";

interface Props {
  open: boolean;
  setOpen: (arg0: boolean) => void;
  title: string;
  hideHamburger?: boolean;
}

const drawerWidth = 200;

const useStyles = makeStyles((theme) => ({
  appBar: {
    paddingTop: "env(safe-area-inset-top)",
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.shorter,
    }),
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
  },
  leftSide: {
    display: "flex",
    alignItems: "center",
    paddingLeft: "env(safe-area-inset-left)",
    [theme.breakpoints.up("md")]: {
      minHeight: theme.appBarHeight.md,
      alignItems: "flex-start",
      paddingTop: theme.spacing(1),
    },
  },
  rightSide: {
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.up("md")]: {
      minHeight: theme.appBarHeight.md,
      alignItems: "flex-start",
      paddingTop: theme.spacing(2.5),
    },
  },
  userIcon: {
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.shorter,
    }),
  },
  homeButton: {
    display: "flex",
    [theme.breakpoints.up("sm")]: {
      display: "none",
      marginRight: 36,
    },
  },
  menuButton: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      marginRight: 36,
      display: "flex",
    },
  },
  title: {
    [theme.breakpoints.up("md")]: {
      paddingTop: theme.spacing(1),
    },
  },
  hide: {
    display: "none",
  },
}));

const Header: FunctionComponent<Props> = ({
  open,
  setOpen,
  title,
  hideHamburger,
}) => {
  const { data: userData } = useUser();
  const isUserAnonymous = userData && userData.isAnonymous;
  const classes = useStyles();
  const theme = useTheme();
  const isBreakpointMd = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <AppBar
      position="fixed"
      className={clsx(classes.appBar, {
        [classes.appBarShift]: open,
      })}
    >
      <Toolbar className={classes.toolbar}>
        <div className={classes.leftSide}>
          {!hideHamburger && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={() => setOpen(true)}
              edge="start"
              className={clsx(classes.menuButton, {
                [classes.hide]: open,
              })}
              size="large">
              <MenuIcon />
            </IconButton>
          )}
          <IconButton
            color="inherit"
            aria-label="home"
            component={Link}
            to="/"
            edge="start"
            className={classes.homeButton}
            size="large">
            <HomeIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {title}
          </Typography>
        </div>
        <div className={classes.rightSide}>
          <Offline>
            <Chip
              label="Offline"
              size={isBreakpointMd ? "medium" : "small"}
              color="secondary"
              icon={<CloudOffIcon />}
            />
          </Offline>
          {userData && (
            <IconButton
              className={classes.userIcon}
              color="inherit"
              component={Link}
              edge="end"
              to="/account"
              size="large">
              <Badge
                badgeContent="!"
                color="secondary"
                invisible={!isUserAnonymous}
              >
                <AccountCircleIcon />
              </Badge>
            </IconButton>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
