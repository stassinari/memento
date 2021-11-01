import React, { FunctionComponent } from "react";
import { Chip as MuiChip, Typography } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import AddIcon from "@mui/icons-material/Add";

interface Chip {
  key: number;
  label: string;
}

interface Props {
  chips: Chip[];
  setValue: (arg0: string) => void;
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(1),
  },
  label: {
    color: theme.palette.text.secondary,
    marginTop: 3,
    marginRight: theme.spacing(1),
    marginLeft: 14,
  },
  listWrapper: {
    position: "relative",
    overflowX: "scroll",

    "-ms-overflow-style": "none",
    scrollbarWidth: "none",
    backgroundImage: `
      linear-gradient(to right, ${theme.palette.background.paper}, ${theme.palette.background.paper}),
      linear-gradient(to right, ${theme.palette.background.paper}, ${theme.palette.background.paper}),

      linear-gradient(to right, rgba(0,0,0,.25), rgba(255,255,255,0)),
      linear-gradient(to left, rgba(0,0,0,.25), rgba(255,255,255,0));`,
    backgroundPosition: `left center, right center, left center, right center`,
    backgroundRepeat: `no-repeat`,
    backgroundColor: theme.palette.background.paper,
    backgroundSize: `20px 100%, 20px 100%, 10px 100%, 10px 100%`,
    /* Opera doesn't support this in the shorthand */
    backgroundAttachment: "local, local, scroll, scroll",
    [theme.breakpoints.up("sm")]: {
      background: "none",
      overflowX: "visible",
    },
    "&::-webkit-scrollbar": {
      display: "none",
    },
    // Stupid hack for a 1px gradient blip when NOT scrolling
    "&::after": {
      content: '""',
      position: "absolute",
      top: 0,
      right: 0,
      width: "1px",
      height: "100%",
      backgroundColor: theme.palette.background.paper,
      [theme.breakpoints.up("sm")]: {
        content: "none",
      },
    },
  },
  list: {
    display: "flex",
    justifyContent: "left",
    listStyle: "none",
    paddingLeft: 0,
    margin: 0,
    [theme.breakpoints.up("sm")]: {
      flexWrap: "wrap",
    },
  },
  chip: {
    marginRight: theme.spacing(1),
    [theme.breakpoints.up("sm")]: {
      marginBottom: theme.spacing(0.5),
    },
  },
}));

const RecentSuggestions: FunctionComponent<Props> = ({ chips, setValue }) => {
  const classes = useStyles();
  const handleClick = (chipToAdd: Chip) => () => {
    setValue(chipToAdd.label);
  };
  if (chips.length === 0) return null;
  return (
    <div className={classes.root}>
      <Typography className={classes.label} variant="caption">
        Recent:
      </Typography>
      <div className={classes.listWrapper}>
        <ul className={classes.list}>
          {chips.map((data) => {
            return (
              <li key={data.key}>
                <MuiChip
                  size="small"
                  variant="outlined"
                  deleteIcon={<AddIcon />}
                  onDelete={handleClick(data)}
                  label={data.label}
                  onClick={handleClick(data)}
                  className={classes.chip}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default RecentSuggestions;
