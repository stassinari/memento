import { makeStyles, useTheme } from "@material-ui/core";
import React, { FunctionComponent } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import red from "@material-ui/core/colors/red";
import amber from "@material-ui/core/colors/amber";
import { default as CustomTooltip } from "./tooltip";
import { default as CustomLegend } from "./legend";

interface Props {
  readings?: DecentReadings;
}

const useStyles = makeStyles((theme) => ({
  chart: {
    height: 180,
    [theme.breakpoints.up("sm")]: {
      height: 250,
    },
    [theme.breakpoints.up("md")]: {
      height: 320,
    },
    [theme.breakpoints.up("lg")]: {
      height: 350,
    },
  },
}));

const TemperaturesChart: FunctionComponent<Props> = ({ readings }) => {
  const theme = useTheme();
  const classes = useStyles();
  if (!readings || !readings.time) {
    return null;
  }
  const data = readings.time.map((t, i) => ({
    time: t,
    mix: readings.temperatureMix[i],
    basket: readings.temperatureBasket[i],
    goal: readings.temperatureGoal[i],
  }));

  const totalTime = Math.floor(readings.time[readings.time.length - 1]);
  const roundedTime = Math.ceil(totalTime / 5.0) * 5;
  const xAxisTickCount = Math.round(roundedTime / 5) + 1;

  const maxYAxis =
    Math.floor(
      Math.max(
        Math.max(...readings.temperatureMix),
        Math.max(...readings.temperatureBasket),
        Math.max(...readings.temperatureGoal)
      )
    ) + 1;
  const minYAxis =
    Math.ceil(
      Math.min(
        Math.min(...readings.temperatureMix),
        Math.min(...readings.temperatureBasket),
        Math.min(...readings.temperatureGoal)
      )
    ) - 1;

  return (
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
            domain={[minYAxis, maxYAxis]}
            tick={{ fill: theme.palette.text.primary }}
            tickCount={maxYAxis - minYAxis + 1}
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
            dataKey="basket"
            stroke={red[700]}
            strokeWidth={2}
          />
          <Line
            type="basis"
            dot={false}
            dataKey="mix"
            stroke={amber[500]}
            strokeWidth={2}
          />
          <Line
            type="basis"
            dot={false}
            dataKey="goal"
            stroke={red[300]}
            strokeWidth={2}
            strokeDasharray="5 5"
            //   activeDot={(props) =>
            //     props.value >= 0 ? <Dot {...props} /> : <Dot />
            //   }
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TemperaturesChart;
