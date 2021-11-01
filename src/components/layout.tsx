import { Container, CssBaseline } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import clsx from "clsx";
import React, { FunctionComponent } from "react";
import BottomNav from "./bottom-nav";
import Header from "./header";
import ReloadPrompt from "./reload-prompt";
import Sidebar from "./sidebar";

interface Props {
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
  hideMenu?: boolean;
  title: string;
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    minHeight: "100vh",
  },
  rootOpen: {
    display: "flex",
    "& .fab": {
      left: theme.spacing(28),
    },
    "& .snackbar": {
      left: theme.spacing(28),
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  fab: {
    position: "absolute",
    right: theme.spacing(2),
    bottom: theme.spacing(9),
  },
  main: {
    [theme.breakpoints.down('sm')]: {
      marginTop: `calc(env(safe-area-inset-top) + ${theme.mixins.toolbar.minHeight}px)`,
      marginBottom: `calc(env(safe-area-inset-bottom) + ${theme.mixins.toolbar.minHeight}px)`,
      overflowX: "hidden",
    },
    [theme.breakpoints.up("sm")]: {
      marginTop: theme.appBarHeight.sm,
    },
    [theme.breakpoints.up("md")]: {
      marginTop: theme.spacing(16),
    },
    marginTop: theme.mixins.toolbar.minHeight,
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    flexGrow: 1,
  },
}));

const Layout: FunctionComponent<Props> = ({
  children,
  maxWidth = "sm",
  hideMenu = false,
  title,
  ...props
}) => {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  return (
    <div className={clsx({ [classes.root]: !open, [classes.rootOpen]: open })}>
      <CssBaseline />
      <Header
        open={open}
        setOpen={setOpen}
        title={title}
        hideHamburger={hideMenu}
      />

      {!hideMenu && <Sidebar open={open} setOpen={setOpen} />}

      <main {...props} className={classes.main}>
        {children && <Container maxWidth={maxWidth}>{children}</Container>}
      </main>
      {!hideMenu && <BottomNav />}

      <ReloadPrompt />
    </div>
  );
};

export default Layout;
