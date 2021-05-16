import React, { FunctionComponent } from "react";
import { makeStyles, Paper } from "@material-ui/core";
import {
  NameType,
  Payload,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { roundToDecimal } from "../../utils/numbers";
import { propertyToValues } from "./decent-chart";

interface Props {
  title: number;
  payload?: Payload<ValueType, NameType>[];
}

const useTooltipStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
    opacity: 0.9,
    backgroundColor: theme.isDark
      ? theme.palette.background.default
      : theme.palette.background.paper,
  },
  header: {
    padding: 0,
    textAlign: "left",
    color: theme.palette.text.secondary,
  },
  row: {
    padding: 0,
    lineHeight: "14px",
  },
  label: {
    paddingRight: theme.spacing(1),
  },
}));

const useCircleStyles = (color: string) =>
  makeStyles((theme) => ({
    root: {
      display: "inline-block",
      width: 10,
      height: 10,
      backgroundColor: color,
      borderRadius: 5,
      marginRight: theme.spacing(1),
    },
  }));

interface CircleProps {
  color: string;
}

const Circle: FunctionComponent<CircleProps> = ({ color }) => {
  const classes = useCircleStyles(color)();
  return <div className={classes.root}></div>;
};

const CustomTooltip = ({ title, payload }: Props) => {
  const classes = useTooltipStyles();
  if (!payload) {
    return null;
  }

  return (
    <Paper className={classes.root}>
      <table>
        <thead>
          <tr className={classes.header}>
            <th colSpan={2}>
              @ <strong>{roundToDecimal(title)}</strong>s
            </th>
          </tr>
        </thead>
        <tbody>
          {payload.map((p) => {
            const property = propertyToValues[p.name!];
            if (!p.value || p.value < 0) {
              return null;
            }
            return (
              <tr key={p.name} className={classes.row}>
                <td className={classes.label}>{property.label}:</td>
                <td>
                  <Circle color={p.color!} />
                  <strong>{roundToDecimal(p.value as number)}</strong>
                  {property.unit}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Paper>
  );
};

export default CustomTooltip;
