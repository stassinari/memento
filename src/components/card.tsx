import {
  Box,
  Card as MuiCard,
  CardActionArea,
  CardContent,
  makeStyles,
  Typography,
} from "@material-ui/core";
import EventIcon from "@material-ui/icons/Event";
import clsx from "clsx";
import { format } from "date-fns";
import firebase from "firebase/app";
import React, { FunctionComponent, ReactNode } from "react";
import { Link } from "react-router-dom";
import { toDate } from "../utils/dates";

interface Props {
  title?: string;
  aside?: ReactNode;
  secondLine?: string;
  SecondLineIcon?: React.ElementType;
  thirdLine?: string;
  date?: firebase.firestore.Timestamp | Date | null;
  datePrefix?: string;
  includeDateTime?: boolean;
  link: string;
}

const useStyles = makeStyles((theme) => {
  return {
    content: {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1) + "px !important",
    },
    title: {
      fontWeight: "bold",
      paddingRight: theme.spacing(8),
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
  };
});

const Card: FunctionComponent<Props> = ({
  link,
  title,
  aside,
  secondLine,
  SecondLineIcon,
  thirdLine,
  date,
  datePrefix,
  includeDateTime = true,
}) => {
  const classes = useStyles();

  const parsedDate = date ? toDate(date) : null;

  return (
    <MuiCard>
      <CardActionArea component={Link} to={link}>
        <CardContent className={classes.content}>
          {aside}
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
      </CardActionArea>
    </MuiCard>
  );
};

interface CardRatingProps {
  children: ReactNode;
  variant?: "primary" | "secondary";
}

const useCardRatingStyles = makeStyles((theme) => {
  return {
    root: {
      position: "absolute",
      top: theme.spacing(1),
      right: theme.spacing(2),
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: theme.spacing(3),
      minWidth: theme.spacing(4),
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

export const CardRating: FunctionComponent<CardRatingProps> = ({
  children,
  variant,
}) => {
  const classes = useCardRatingStyles();
  return (
    <div
      className={clsx(
        classes.root,
        variant === "primary"
          ? classes.highScoreColours
          : variant === "secondary"
          ? classes.lowScoreColours
          : ""
      )}
    >
      {children}
    </div>
  );
};

export default Card;
