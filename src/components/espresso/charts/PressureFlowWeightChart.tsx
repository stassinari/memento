import {
  CartesianGrid,
  Dot,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTheme } from "~/hooks/useTheme";
import { DecentReadings } from "~/lib/decent-parsers";
import { ChartLegend } from "./ChartLegend";
import { ChartTooltip } from "./ChartTooltip";

interface PressureFlowWeightChartProps {
  //   profileName?: string;
  readings: DecentReadings;
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

export const PressureFlowWeightChart = ({ readings }: PressureFlowWeightChartProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // TODO improve performance of this chart
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
        Math.max(...readings.flowGoal),
      ),
    ) + 1;

  const gridStroke = isDark ? "#4b5563" : "#d1d5db";
  const tickColor = isDark ? "#d1d5db" : "#1f2937";
  const pressureColor = isDark ? "#22c55e" : "#15803d";
  const pressureGoalColor = isDark ? "#4ade80" : "#22c55e";
  const flowColor = isDark ? "#60a5fa" : "#3b82f6";
  const flowGoalColor = isDark ? "#93c5fd" : "#7dd3fc";
  const weightColor = isDark ? "#a1887f" : "#795548";

  return (
    <div className="h-56 md:h-[248px]">
      {/* FIXME find a way to better define height (of the legend in particular) */}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} syncId="decentChart">
          <CartesianGrid
            vertical={false}
            stroke={gridStroke}
            strokeDasharray="3 3"
          />
          <XAxis
            type="number"
            dataKey="time"
            unit="s"
            domain={[0, roundedTime]}
            minTickGap={48}
            tick={{ fill: tickColor }}
            tickCount={xAxisTickCount}
            tickSize={4}
            interval="preserveStart"
          />
          <YAxis
            type="number"
            domain={[0, maxYAxis]}
            tick={{ fill: tickColor }}
            tickCount={maxYAxis + 1}
            tickSize={4}
            allowDataOverflow={true}
            width={17}
          />
          <Tooltip
            animationDuration={100}
            animationEasing="ease-out"
            content={(props) => {
              return <ChartTooltip title={props.label} payload={props.payload} />;
            }}
          />
          <Legend content={ChartLegend} />
          <Line
            type="basis"
            dot={false}
            dataKey="pressure"
            stroke={pressureColor}
            strokeWidth={2}
          />
          <Line
            type="basis"
            dot={false}
            dataKey="pressureGoal"
            stroke={pressureGoalColor}
            strokeWidth={2}
            strokeDasharray="5 5"
            activeDot={(props) => (props.value >= 0 ? <Dot {...props} /> : <Dot />)}
          />
          <Line
            type="basis"
            dot={false}
            dataKey="flow"
            stroke={flowColor}
            strokeWidth={2}
          />
          <Line
            type="basis"
            dot={false}
            dataKey="flowGoal"
            stroke={flowGoalColor}
            strokeWidth={2}
            strokeDasharray="5 5"
            activeDot={(props) => (props.value >= 0 ? <Dot {...props} /> : <Dot />)}
          />
          <Line
            type="basis"
            dot={false}
            dataKey="weight"
            strokeWidth={2}
            stroke={weightColor}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
