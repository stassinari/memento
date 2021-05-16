import {
  Card as MuiCard,
  CardActionArea,
  CardMedia,
  CardContent,
  Box,
  Typography,
  makeStyles,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";
import EventIcon from "@material-ui/icons/Event";
import { format } from "date-fns";
import React, { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import firebase from "firebase/app";
import { toDate } from "../utils/dates";

interface Props {
  title?: string;
  aside?: string;
  secondLine?: string;
  thirdLine?: string;
  date?: firebase.firestore.Timestamp | Date | null;
  datePrefix?: string;
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
    image: {
      marginLeft: theme.spacing(2),
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
      width: "4rem",
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
    dateIcon: {
      fontSize: "0.875rem",
      color: theme.palette.grey[600],
      marginLeft: theme.spacing(0.5),
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

const Card: FunctionComponent<Props> = ({
  link,
  Icon,
  title,
  aside,
  secondLine,
  thirdLine,
  date,
  datePrefix,
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
                  {format(parsedDate, "dd/MM/yyyy @ HH:mm")}
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
