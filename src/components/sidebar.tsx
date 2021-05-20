import React, { FunctionComponent } from "react";
import clsx from "clsx";
import { NavLink } from "react-router-dom";
import {
  Badge,
  makeStyles,
  useMediaQuery,
  useTheme,
  withStyles,
} from "@material-ui/core";
import {
  Drawer,
  List,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";

import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

import BeansIcon from "./icons/beans";
import PortafilterIcon from "./icons/portafilter";
import ChemexIcon from "./icons/chemex";
import SpoonIcon from "./icons/spoon";
import HomeIcon from "./icons/home";
import { useUser } from "reactfire";

interface Props {
  open: boolean;
  setOpen: (arg0: boolean) => void;
}

const drawerWidth = 200;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "flex",
    },
  },
  divider: {
    visibility: "hidden",
    [theme.breakpoints.up("md")]: {
      visibility: "visible",
    },
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.shorter,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.shorter,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: `calc(env(safe-area-inset-left) + ${theme.spacing(9) + 1}px)`,
    },
  },
  toolbar: {
    visibility: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    minHeight: theme.spacing(7),
    [theme.breakpoints.up("md")]: {
      visibility: "visible",
      minHeight: theme.spacing(12),
    },
  },
  menuContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
    paddingLeft: "env(safe-area-inset-left)",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

const CustomListItem = withStyles((theme) => {
  return {
    root: {
      height: theme.spacing(9),
      width: theme.spacing(9),
      color: theme.palette.text.secondary,
      "&.active svg": {
        color: theme.palette.primary.main,
      },
      [theme.breakpoints.down("sm")]: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      },
      [theme.breakpoints.up("md")]: {
        width: "auto",
      },
    },
  };
})(ListItem) as typeof ListItem;

const CustomListItemIcon = withStyles((theme) => {
  return {
    root: {
      [theme.breakpoints.down("sm")]: {
        marginTop: theme.spacing(1),
        minWidth: "auto",
      },
      [theme.breakpoints.up("md")]: {
        marginLeft: theme.spacing(1),
        minWidth: theme.spacing(6),
      },
    },
  };
})(ListItemIcon);

const Sidebar: FunctionComponent<Props> = ({ open, setOpen }) => {
  const { data: userData } = useUser();
  const isUserAnonymous = userData && userData.isAnonymous;
  const classes = useStyles();

  const theme = useTheme();
  const isBreakpointMd = useMediaQuery(theme.breakpoints.up("md"));
  const activeNavLinkStyles = {
    color: theme.palette.primary.main,
  };

  return (
    <>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={() => setOpen(false)}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider className={classes.divider} />
        <div className={classes.menuContainer}>
          <div>
            <List>
              <CustomListItem
                dense
                button
                component={NavLink}
                to="/"
                exact
                activeStyle={activeNavLinkStyles}
              >
                <CustomListItemIcon>
                  <HomeIcon />
                </CustomListItemIcon>
                <ListItemText primary="Home" />
              </CustomListItem>
              <CustomListItem
                dense
                button
                component={NavLink}
                to="/brews"
                activeStyle={activeNavLinkStyles}
              >
                <CustomListItemIcon>
                  <ChemexIcon />
                </CustomListItemIcon>
                <ListItemText primary="Brews" />
              </CustomListItem>
              <CustomListItem
                dense
                button
                component={NavLink}
                to="/espresso"
                activeStyle={activeNavLinkStyles}
              >
                <CustomListItemIcon>
                  <PortafilterIcon />
                </CustomListItemIcon>
                <ListItemText primary="Espresso" />
              </CustomListItem>
              <CustomListItem
                dense
                button
                component={NavLink}
                to="/tastings"
                activeStyle={activeNavLinkStyles}
              >
                <CustomListItemIcon>
                  <SpoonIcon />
                </CustomListItemIcon>
                <ListItemText primary="Tastings" />
              </CustomListItem>
              <CustomListItem
                dense
                button
                component={NavLink}
                to="/beans"
                activeStyle={activeNavLinkStyles}
              >
                <CustomListItemIcon>
                  <BeansIcon />
                </CustomListItemIcon>
                <ListItemText primary="Beans" />
              </CustomListItem>
            </List>
            {isBreakpointMd && (
              <>
                <Divider className={classes.divider} />
                <List>
                  <CustomListItem
                    dense
                    button
                    component={NavLink}
                    to="/espresso/decent/upload"
                    activeStyle={activeNavLinkStyles}
                  >
                    <CustomListItemIcon>
                      <CloudUploadIcon />
                    </CustomListItemIcon>
                    <ListItemText primary="DE Upload" />
                  </CustomListItem>
                </List>
              </>
            )}
          </div>
          <List>
            <CustomListItem
              dense
              button
              component={NavLink}
              to="/account"
              activeStyle={activeNavLinkStyles}
            >
              <CustomListItemIcon>
                <Badge
                  badgeContent="!"
                  color="primary"
                  invisible={!isUserAnonymous}
                >
                  <AccountCircleIcon />
                </Badge>
              </CustomListItemIcon>
              <ListItemText primary="Account" />
            </CustomListItem>
          </List>
        </div>
      </Drawer>
    </>
  );
};

export default Sidebar;
