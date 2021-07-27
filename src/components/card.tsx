import {
  Box,
  Card as MuiCard,
  CardActionArea,
  CardContent,
  CardMedia,
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import EventIcon from "@material-ui/icons/Event";
import clsx from "clsx";
import { format } from "date-fns";
import firebase from "firebase/app";
import React, { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import { toDate } from "../utils/dates";

interface Props {
  title?: string;
  rating?: number;
  secondLine?: string;
  SecondLineIcon?: React.ElementType;
  thirdLine?: string;
  date?: firebase.firestore.Timestamp | Date | null;
  datePrefix?: string;
  includeDateTime?: boolean;
  link: string;
  Icon: React.ElementType;
  Tag?: React.ReactNode;
}

const useStyles = makeStyles((theme) => {
  return {
    root: {
      display: "flex",
    },
    details: {
      flexGrow: 1,
    },
    content: {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1) + "px !important",
    },
    title: {
      fontWeight: "bold",
    },
    image: {
      marginLeft: theme.spacing(2),
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
      minWidth: "4rem",
      height: "4rem",
      backgroundColor: theme.palette.primary.light,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: "100%",
    },
    icon: {
      fontSize: 40,
      color: "white",
    },
    smallText: {
      fontSize: "0.875rem",
      fontWeight: 500,
    },
    baseIcon: {
      fontSize: "0.875rem",

      marginRight: theme.spacing(0.5),
    },
    dateIcon: {
      color: theme.palette.text.secondary,
    },
    primaryText: {
      color: theme.palette.text.primary,
    },
    tag: {
      position: "absolute",
      top: theme.spacing(1),
      right: theme.spacing(2),
    },
    controls: {
      display: "flex",
      alignItems: "center",
      paddingLeft: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
  };
});

interface RatingProps {
  rating: number;
}

const useRatingStyles = makeStyles((theme) => {
  return {
    root: {
      position: "absolute",
      top: theme.spacing(1),
      right: theme.spacing(2),
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: theme.spacing(3),
      width: theme.spacing(4),
      fontWeight: "bold",
      borderRadius: theme.spacing(0.5),
    },
    lowScoreColours: {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.secondary.contrastText,
    },
    highScoreColours: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
  };
});

const Rating: FunctionComponent<RatingProps> = ({ rating }) => {
  const classes = useRatingStyles();
  return (
    <span
      className={clsx(
        classes.root,
        rating >= 6 ? classes.highScoreColours : classes.lowScoreColours
      )}
    >
      {rating}
    </span>
  );
};

const Card: FunctionComponent<Props> = ({
  link,
  Icon,
  title,
  rating,
  secondLine,
  SecondLineIcon,
  thirdLine,
  date,
  datePrefix,
  includeDateTime = true,
  Tag,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const isBreakpointSmOrUp = useMediaQuery(theme.breakpoints.up("sm"));

  const parsedDate = date ? toDate(date) : null;

  return (
    <MuiCard>
      <CardActionArea component={Link} to={link} className={classes.root}>
        <div className={classes.details}>
          <CardContent className={classes.content}>
            {/* {Tag && <span className={classes.tag}>{Tag}</span>} */}
            {rating && <Rating rating={rating} />}
            {title && (
              <Typography variant="body1" className={classes.title}>
                {title}
              </Typography>
            )}
            {secondLine && (
              <Box alignItems="center" display="flex">
                {SecondLineIcon && (
                  <SecondLineIcon className={classes.baseIcon} />
                )}
                <Typography variant="subtitle1" component="span">
                  {secondLine}
                </Typography>
              </Box>
            )}
            {thirdLine && (
              <Typography className={classes.smallText} color="textSecondary">
                {thirdLine}
              </Typography>
            )}
            {date && (
              <Box alignItems="center" display="flex">
                <EventIcon
                  className={clsx([classes.baseIcon, classes.dateIcon])}
                />
                <Typography className={classes.smallText} color="textSecondary">
                  {datePrefix}{" "}
                  {format(
                    parsedDate,
                    `dd/MM/yyyy${includeDateTime ? " @ HH:mm" : ""}`
                  )}
                </Typography>
              </Box>
            )}
          </CardContent>
        </div>
      </CardActionArea>
    </MuiCard>
  );
};

interface OldProps {
  title?: string;
  aside?: string;
  secondLine?: string;
  thirdLine?: string;
  date?: firebase.firestore.Timestamp | Date | null;
  datePrefix?: string;
  includeDateTime?: boolean;
  link: string;
  Icon: React.ElementType;
  Tag?: React.ReactNode;
}

const CardOld: FunctionComponent<OldProps> = ({
  link,
  Icon,
  title,
  aside,
  secondLine,
  thirdLine,
  date,
  datePrefix,
  includeDateTime = true,
  Tag,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const isBreakpointSmOrUp = useMediaQuery(theme.breakpoints.up("sm"));

  const parsedDate = date ? toDate(date) : null;

  return (
    <MuiCard>
      <CardActionArea component={Link} to={link} className={classes.root}>
        {isBreakpointSmOrUp && (
          <CardMedia className={classes.image}>
            <Icon className={classes.icon} />
          </CardMedia>
        )}
        <div className={classes.details}>
          <CardContent className={classes.content}>
            {date && (
              <Box alignItems="center" display="flex">
                <Typography className={classes.smallText} color="textSecondary">
                  {datePrefix && datePrefix}{" "}
                  {format(
                    parsedDate,
                    `dd/MM/yyyy${includeDateTime ? " @ HH:mm" : ""}`
                  )}
                </Typography>
                <EventIcon className={classes.dateIcon} />
              </Box>
            )}
            {Tag && <span className={classes.tag}>{Tag}</span>}
            {title && (
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6">{title}</Typography>
                {aside && <Typography variant="h6">{aside}</Typography>}
              </Box>
            )}
            {secondLine && (
              <Typography variant="subtitle1">{secondLine}</Typography>
            )}
            {thirdLine && (
              <Typography className={classes.smallText} color="textSecondary">
                {thirdLine}
              </Typography>
            )}
          </CardContent>
        </div>
      </CardActionArea>
    </MuiCard>
  );
};

export default Card;
