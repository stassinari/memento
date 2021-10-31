// eslint-disable-next-line no-use-before-define
import {
  Button,
  makeStyles,
  Snackbar,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import React from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

const useStyles = makeStyles((theme) => {
  return {
    anchorOriginTopCenter: {
      top: theme.appBarHeight.default + theme.spacing(1),
    },
    anchorOriginBottomLeft: {
      left: `calc(env(safe-area-inset-left) + ${
        theme.spacing(9) + theme.spacing(3) + 1
      }px)`,
      transition: theme.transitions.create("left", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.shorter,
      }),
    },
    contentRoot: {
      backgroundColor: theme.palette.background.default,
      [theme.breakpoints.up("md")]: {
        backgroundColor: theme.palette.background.paper,
      },
    },
    contentMessage: {
      color: theme.palette.text.primary,
    },
  };
});

const ReloadPrompt = () => {
  // replaced dynamically
  const reloadSW = "__RELOAD_SW__";

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // @ts-ignore
      if (reloadSW === "true") {
        r &&
          setInterval(() => {
            console.log("Checking for sw update");
            r.update();
          }, 20000 /* 20s for testing purposes */);
      } else {
        console.log("SW Registered: " + r);
      }
    },
    onRegisterError(error) {
      console.log("SW registration error", error);
    },
  });

  const classes = useStyles();
  const theme = useTheme();
  const isBreakpointSm = useMediaQuery(theme.breakpoints.up("sm"));
  const isBreakpointMd = useMediaQuery(theme.breakpoints.up("md"));

  const handleClose = () => {
    setNeedRefresh(false);
  };

  return (
    <Snackbar
      className="snackbar"
      classes={{
        anchorOriginTopCenter: classes.anchorOriginTopCenter,
        anchorOriginBottomLeft: classes.anchorOriginBottomLeft,
      }}
      anchorOrigin={{
        vertical: isBreakpointSm ? "bottom" : "top",
        horizontal: isBreakpointSm ? "left" : "center",
      }}
      ContentProps={{
        classes: { root: classes.contentRoot, message: classes.contentMessage },
      }}
      open={needRefresh}
      onClose={handleClose}
      message="New content available, reload to update."
      action={
        <Button
          color="primary"
          variant="outlined"
          size="small"
          onClick={() => updateServiceWorker(true)}
        >
          Restart
        </Button>
      }
    />
  );
};

export default ReloadPrompt;
