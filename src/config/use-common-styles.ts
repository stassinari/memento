import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
  listTitle: {
    marginTop: theme.spacing(2),
    color: theme.palette.text.secondary,
    [theme.breakpoints.up("sm")]: {
      marginTop: theme.spacing(4),
    },
    [theme.breakpoints.up("sm")]: {
      marginTop: theme.spacing(6),
    },
  },
  viewMoreButton: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
    },
  },
  actionsButton: {
    textAlign: "right",
    marginBottom: theme.spacing(1),
    [theme.breakpoints.up("sm")]: {
      marginBottom: theme.spacing(2),
    },
  },
  // GENERIC FORM
  formContainer: {
    padding: theme.spacing(2),
  },
  formFieldWidth: {
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(40),
    },
  },
  formFieldMarginCompensation: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  equipmentHeading: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  sectionHeading: {
    marginBottom: theme.spacing(1),
  },
  // DOSES FORM LAYOUT
  threeColsFormContainer: {
    display: "grid",
    gridTemplateRows: "repeat(2, 1fr)",
    gridTemplateColumns: "3fr 1fr 3fr",
    marginTop: theme.spacing(-2),
    marginBottom: theme.spacing(1),
  },
  colStart3: {
    gridColumnStart: 3,
  },
  ratioContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    justifyContent: "flex-start",
    minWidth: "40px",
    height: "56px",
    marginTop: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
    },
  },
  table: {
    marginBottom: theme.spacing(2),
  },
  label: {
    color: theme.palette.text.secondary,
  },
  ratioValue: {
    fontSize: "11px",
    [theme.breakpoints.up("sm")]: {
      fontSize: "12px",
    },
  },
  // EXPANDABLE INFO PANE
  expandableInfo: {
    padding: theme.spacing(1),
    "&:hover": {
      cursor: "pointer",
      backgroundColor: theme.palette.action.hover,
    },
  },
  expandableInfoLabel: {
    lineHeight: `${theme.spacing(3)}px`,
    color: theme.palette.text.secondary,
  },
  expandableInfoValue: {
    paddingLeft: theme.spacing(2),
  },
  // FORM TOGGLES
  toggleGroupContainer: {
    display: "flex",
    flexDirection: "column",
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  toggleGroupLabel: {
    color: theme.palette.text.secondary,
  },
  toggleGroup: {
    marginTop: theme.spacing(0.5),
  },
  toggleGroupIcon: {
    width: theme.spacing(3),
    marginRight: theme.spacing(1),
  },
}));
