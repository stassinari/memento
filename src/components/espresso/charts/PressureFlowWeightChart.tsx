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
import { DecentReadings } from "../../../types/espresso";
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
        Math.max(...readings.flowGoal),
      ),
    ) + 1;

  return (
    <div className="h-56 md:h-[248px]">
      {/* FIXME find a way to better define height (of the legend in particular) */}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} syncId="decentChart">
          <CartesianGrid
            vertical={false}
            stroke={"#d1d5db"} // FIXME better tw theme theme`colors.gray.300`
            strokeDasharray="3 3"
          />
          <XAxis
            type="number"
            dataKey="time"
            unit="s"
            domain={[0, roundedTime]}
            minTickGap={48}
            tick={{ fill: "#1f2937" }} // FIXME better tw theme theme`colors.gray.800`
            tickCount={xAxisTickCount}
            tickSize={4}
            interval="preserveStart"
          />
          <YAxis
            type="number"
            domain={[0, maxYAxis]}
            tick={{ fill: "#1f2937" }} // FIXME better tw theme theme`colors.gray.800`
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
                <ChartTooltip title={props.label} payload={props.payload} />
              );
            }}
          />
          <Legend content={ChartLegend} />
          <Line
            type="basis"
            dot={false}
            dataKey="pressure"
            stroke={"#15803d"} // FIXME better tw theme theme`colors.green.700`
            strokeWidth={2}
          />
          <Line
            type="basis"
            dot={false}
            dataKey="pressureGoal"
            stroke={"#22c55e"} // FIXME better tw theme theme`colors.green.500`
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
            stroke={"#3b82f6"} // FIXME better tw theme theme`colors.blue.500`
            strokeWidth={2}
          />
          <Line
            type="basis"
            dot={false}
            dataKey="flowGoal"
            stroke={"#7dd3fc"} // FIXME better tw theme theme`colors.blue.300`
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
            stroke={"#795548"} // FIXME better tw theme theme`colors.mui-brown.500`
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
