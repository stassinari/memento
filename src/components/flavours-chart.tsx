import { makeStyles, useTheme } from "@material-ui/core";
import React, { FunctionComponent } from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import { TastingScores } from "../database/types/common";

interface Props {
  tastingScores: TastingScores;
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: 250,
    [theme.breakpoints.up("md")]: {
      height: 300,
    },
    [theme.breakpoints.up("lg")]: {
      height: 320,
    },
  },
}));

const FlavoursChart: FunctionComponent<Props> = ({ tastingScores }) => {
  const theme = useTheme();
  const classes = useStyles();

  const data = [
    {
      note: "Aroma",
      val: tastingScores.aroma,
    },
    {
      note: "Acidity",
      val: tastingScores.acidity,
    },
    {
      note: "Sweetness",
      val: tastingScores.sweetness,
    },
    {
      note: "Body",
      val: tastingScores.body,
    },
    {
      note: "Finish",
      val: tastingScores.finish,
    },
  ];

  return (
    <div className={classes.root}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid
            stroke={
              theme.isDark ? theme.palette.grey[700] : theme.palette.grey[300]
            }
          />
          <PolarAngleAxis
            tick={{ fill: theme.palette.text.secondary }}
            dataKey="note"
          />
          <PolarRadiusAxis
            domain={[0, 10]}
            tickCount={6}
            angle={18}
            type="number"
            axisLine={{
              stroke: theme.isDark
                ? theme.palette.grey[700]
                : theme.palette.grey[300],
            }}
            tick={{ fill: theme.palette.text.disabled }}
          />
          <Radar
            name="tasting"
            dataKey="val"
            stroke={theme.palette.secondary.main}
            fill={theme.palette.secondary.main}
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FlavoursChart;
