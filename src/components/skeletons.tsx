import React, { FunctionComponent } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  useMediaQuery,
  useTheme,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  ListItemAvatar,
  Box,
} from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import { Skeleton } from '@mui/material';

const useStyles = makeStyles((theme) => {
  return {
    content: {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1) + "px !important",
    },
    smallText: {
      fontSize: "0.875rem",
    },
    sidebarTitle: {
      paddingTop: theme.spacing(2),
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      [theme.breakpoints.up("sm")]: {
        paddingTop: theme.spacing(1),
      },
    },
    marginBottom: {
      marginBottom: theme.spacing(2),
    },
  };
});

const animation = "wave";

const SkeletonCard = () => {
  const classes = useStyles();
  return (
    <Card>
      <CardContent className={classes.content}>
        <Typography variant="subtitle2" color="textSecondary">
          <Skeleton animation={animation} />
        </Typography>
        <Typography variant="h6">
          <Skeleton animation={animation} />
        </Typography>
        <Typography variant="subtitle1">
          <Skeleton animation={animation} />
        </Typography>
      </CardContent>
    </Card>
  );
};

interface SkeletonListProps {
  complex?: boolean;
}

const SkeletonList: FunctionComponent<SkeletonListProps> = ({ complex }) => (
  <List
    dense
    subheader={
      <ListSubheader disableSticky>
        <Skeleton animation={animation} />
      </ListSubheader>
    }
  >
    <ListItem>
      {complex && (
        <ListItemAvatar>
          <Skeleton
            animation={animation}
            variant="circular"
            width={40}
            height={40}
          />
        </ListItemAvatar>
      )}
      <ListItemText
        primary={<Skeleton animation={animation} />}
        secondary={complex ? <Skeleton animation={animation} /> : null}
      />
    </ListItem>
    <ListItem>
      {complex && (
        <ListItemAvatar>
          <Skeleton
            animation={animation}
            variant="circular"
            width={40}
            height={40}
          />
        </ListItemAvatar>
      )}
      <ListItemText
        primary={<Skeleton animation={animation} />}
        secondary={complex ? <Skeleton animation={animation} /> : null}
      />
    </ListItem>
    <ListItem>
      {complex && (
        <ListItemAvatar>
          <Skeleton
            animation={animation}
            variant="circular"
            width={40}
            height={40}
          />
        </ListItemAvatar>
      )}
      <ListItemText
        primary={<Skeleton animation={animation} />}
        secondary={complex ? <Skeleton animation={animation} /> : null}
      />
    </ListItem>
  </List>
);

export const SkeletonHomePage = () => {
  const classes = useStyles();
  return <>
    <Paper className={classes.marginBottom}>
      <SkeletonList complex={true} />
      <Box mx={2} pb={2}>
        <Skeleton
          variant="rectangular"
          width={128}
          height={36}
          animation={animation}
        ></Skeleton>
      </Box>
    </Paper>
    <Paper className={classes.marginBottom}>
      <SkeletonList complex={true} />
      <Box mx={2} pb={2}>
        <Skeleton
          variant="rectangular"
          width={128}
          height={36}
          animation={animation}
        ></Skeleton>
      </Box>
    </Paper>
    <Paper className={classes.marginBottom}>
      <SkeletonList complex={true} />
      <Box mx={2} pb={2}>
        <Skeleton
          variant="rectangular"
          width={128}
          height={36}
          animation={animation}
        ></Skeleton>
      </Box>
    </Paper>
  </>;
};

interface SkeletonListPageProps {
  sidebar?: boolean;
}

const SkeletonListPage: FunctionComponent<SkeletonListPageProps> = ({
  sidebar = false,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const isBreakpointXs = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Grid container spacing={4}>
      {sidebar && !isBreakpointXs && (
        <Grid item sm={4}>
          <Paper>
            <Typography variant="h5" className={classes.sidebarTitle}>
              <Skeleton animation={animation} />
            </Typography>
            <SkeletonList />
            <SkeletonList />
            <SkeletonList />
          </Paper>
        </Grid>
      )}
      <Grid item xs={12} sm={sidebar ? 8 : 12}>
        <Grid container direction={"column"} spacing={2}>
          <Grid item>
            <SkeletonCard />
          </Grid>
          <Grid item>
            <SkeletonCard />
          </Grid>
          <Grid item>
            <SkeletonCard />
          </Grid>
          <Grid item>
            <SkeletonCard />
          </Grid>
          <Grid item>
            <SkeletonCard />
          </Grid>
          <Grid item>
            <SkeletonCard />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SkeletonListPage;
