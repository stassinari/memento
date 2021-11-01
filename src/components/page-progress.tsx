import { LinearProgress, Theme } from "@mui/material";

import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';

const progressBarHeight = 4;

const PageProgress = withStyles((theme: Theme) =>
  createStyles({
    root: {
      position: "sticky",
      top: `calc(${theme.appBarHeight.default}px - ${progressBarHeight}px + env(safe-area-inset-top))`,
      zIndex: 2000,
      [theme.breakpoints.up("sm")]: {
        top: `calc(${theme.appBarHeight.sm}px - ${progressBarHeight}px)`,
      },
      [theme.breakpoints.up("md")]: {
        top: `calc(${theme.appBarHeight.md}px - ${progressBarHeight}px)`,
      },
    },
  })
)(LinearProgress);

export default PageProgress;
