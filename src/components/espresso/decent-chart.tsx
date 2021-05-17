import React, { FunctionComponent } from "react";
import green from "@material-ui/core/colors/green";
import blue from "@material-ui/core/colors/blue";
import brown from "@material-ui/core/colors/brown";
import { makeStyles, Typography, useTheme } from "@material-ui/core";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Dot,
} from "recharts";

import { default as CustomTooltip } from "./tooltip";
import { default as CustomLegend } from "./legend";

interface Props {
  profileName?: string;
  readings?: DecentReadings;
}

interface DataValues {
  label: string;
  unit: string;
}

export const propertyToValues: Record<string, DataValues> = {
  pressure: { label: "Pressure", unit: "bar" },
  pressureGoal: { label: "Pressure goal", unit: "bar" },
  flow: { label: "Flow", unit: "ml/s" },
  flowGoal: { label: "Flow goal", unit: "ml/s" },
  weight: { label: "Weight", unit: "g/s" },

  mix: { label: "T. mix", unit: "℃" },
  basket: { label: "T. basket", unit: "℃" },
  goal: { label: "T. goal", unit: "℃" },
};

const useStyles = makeStyles((theme) => ({
  title: {
    textAlign: "center",
    marginBottom: theme.spacing(2),
  },
  chart: {
    height: 250,
    [theme.breakpoints.up("sm")]: {
      height: 350,
    },
    [theme.breakpoints.up("md")]: {
      height: 450,
    },
    [theme.breakpoints.up("lg")]: {
      height: 400,
    },
    [theme.breakpoints.up("xl")]: {
      height: 500,
    },
  },
}));

const DecentChart: FunctionComponent<Props> = ({ readings, profileName }) => {
  const theme = useTheme();
  const classes = useStyles();
  if (!readings || !readings.time) {
    return null;
  }

  const data = readings.time.map((t, i) => ({
    time: t,
    pressure: readings.pressure[i],
    pressureGoal: readings.pressureGoal[i],
    flow: readings.flow[i],
    flowGoal: readings.flowGoal[i],
    weight: readings.weightFlow[i],
  }));

  const totalTime = Math.floor(readings.time[readings.time.length - 1]);
  const roundedTime = Math.ceil(totalTime / 5.0) * 5;
  const xAxisTickCount = Math.round(roundedTime / 5) + 1;

  const maxYAxis =
    Math.floor(
      Math.max(
        Math.max(...readings.pressure),
        Math.max(...readings.pressure),
        Math.max(...readings.flow),
        Math.max(...readings.flowGoal)
      )
    ) + 1;

  return (
    <>
      <Typography
        variant="subtitle2"
        className={classes.title}
        color="textSecondary"
      >
        {profileName}
      </Typography>
      <div className={classes.chart}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} syncId="decentChart">
            <CartesianGrid
              vertical={false}
              stroke={
                theme.isDark ? theme.palette.grey[700] : theme.palette.grey[300]
              }
              strokeDasharray="3 3"
            />
            <XAxis
              type="number"
              dataKey="time"
              unit="s"
              domain={[0, roundedTime]}
              minTickGap={48}
              tick={{ fill: theme.palette.text.primary }}
              tickCount={xAxisTickCount}
              tickSize={4}
              interval="preserveStart"
            />
            <YAxis
              type="number"
              domain={[0, maxYAxis]}
              tick={{ fill: theme.palette.text.primary }}
              tickCount={maxYAxis + 1}
              tickSize={4}
              allowDataOverflow={true}
              width={17}
            />
            <Tooltip
              animationDuration={100}
              animationEasing="ease-out"
              content={(props) => {
                return (
                  <CustomTooltip title={props.label} payload={props.payload} />
                );
              }}
            />
            <Legend content={CustomLegend} />
            <Line
              type="basis"
              dot={false}
              dataKey="pressure"
              stroke={green[700]}
              strokeWidth={2}
            />
            <Line
              type="basis"
              dot={false}
              dataKey="pressureGoal"
              stroke={green[300]}
              strokeWidth={2}
              strokeDasharray="5 5"
              activeDot={(props) =>
                props.value >= 0 ? <Dot {...props} /> : <Dot />
              }
            />
            <Line
              type="basis"
              dot={false}
              dataKey="flow"
              stroke={blue[700]}
              strokeWidth={2}
            />
            <Line
              type="basis"
              dot={false}
              dataKey="flowGoal"
              stroke={blue[300]}
              strokeWidth={2}
              strokeDasharray="5 5"
              activeDot={(props) =>
                props.value >= 0 ? <Dot {...props} /> : <Dot />
              }
            />
            <Line
              type="basis"
              dot={false}
              dataKey="weight"
              strokeWidth={2}
              stroke={brown[500]}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default DecentChart;
