import { makeStyles } from "@material-ui/core";
import React, { FunctionComponent } from "react";
import { propertyToValues } from "./decent-chart";

const useLegendRectangleStyles = (color: string) =>
  makeStyles((theme) => ({
    root: {
      display: "inline-block",
      width: 16,
      height: 8,
      backgroundColor: color,
      borderRadius: 4,
      marginRight: theme.spacing(1),
      [theme.breakpoints.up("md")]: {
        width: 24,
        height: 12,
      },
    },
  }));

interface LegendRectangleProps {
  color: string;
}

const LegendRectangle: FunctionComponent<LegendRectangleProps> = ({
  color,
}) => {
  const classes = useLegendRectangleStyles(color)();
  return <div className={classes.root}></div>;
};

const useLegendStyles = makeStyles((theme) => ({
  root: {
    margin: 0,
    padding: 0,
    textAlign: "center",
  },
  item: {
    display: "inline-flex",
    alignItems: "center",
    listStyleType: "none",
    marginRight: theme.spacing(2),
    color: theme.palette.text.secondary,
    fontSize: 12,
    [theme.breakpoints.up("md")]: {
      fontSize: 14,
    },
  },
}));

const Legend = ({ payload }: any) => {
  const classes = useLegendStyles();

  return (
    <ul className={classes.root}>
      {payload.map((entry: any, index: any) => (
        <li key={`item-${index}`} className={classes.item}>
          <LegendRectangle color={entry.color} />
          {propertyToValues[entry.value].label}
        </li>
      ))}
    </ul>
  );
};

export default Legend;
