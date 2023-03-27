import {
  CartesianGrid,
  Dot,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { theme } from "twin.macro";
import { CustomTooltip } from "../../components/espresso/charts/ChartTooltip";
import { DecentReadings } from "../../types/espresso";

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

export const PressureFlowWeightChart: React.FC<
  PressureFlowWeightChartProps
> = ({ readings }) => {
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
        Math.max(...readings.flowGoal)
      )
    ) + 1;

  return (
    <div tw="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} syncId="decentChart">
          <CartesianGrid
            vertical={false}
            stroke={theme`colors.gray.300`}
            strokeDasharray="3 3"
          />
          <XAxis
            type="number"
            dataKey="time"
            unit="s"
            domain={[0, roundedTime]}
            minTickGap={48}
            tick={{ fill: theme`colors.gray.800` }}
            tickCount={xAxisTickCount}
            tickSize={4}
            interval="preserveStart"
          />
          <YAxis
            type="number"
            domain={[0, maxYAxis]}
            tick={{ fill: theme`colors.gray.800` }}
            tickCount={maxYAxis + 1}
            tickSize={4}
            allowDataOverflow={true}
            width={17}
          />
          <Tooltip
            animationDuration={100}
            animationEasing="ease-out"
            // FIXME add custom tooltip
            content={(props) => {
              return (
                <CustomTooltip title={props.label} payload={props.payload} />
              );
            }}
          />
          {/* FIXME add custom legend */}
          {/* <Legend content={CustomLegend} /> */}
          <Line
            type="basis"
            dot={false}
            dataKey="pressure"
            stroke={theme`colors.green.700`}
            strokeWidth={2}
          />
          <Line
            type="basis"
            dot={false}
            dataKey="pressureGoal"
            stroke={theme`colors.green.500`}
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
            stroke={theme`colors.blue.500`}
            strokeWidth={2}
          />
          <Line
            type="basis"
            dot={false}
            dataKey="flowGoal"
            stroke={theme`colors.blue.300`}
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
            stroke={theme`colors.mui-brown.500`}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
