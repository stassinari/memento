import {
  CartesianGrid,
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

interface TemperatureChartProps {
  decentReadings: DecentReadings;
}

export const TemperatureChart = ({ decentReadings }: TemperatureChartProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const data = decentReadings.time.map((t, i) => ({
    time: t,
    mix: decentReadings.temperatureMix[i],
    basket: decentReadings.temperatureBasket[i],
    goal: decentReadings.temperatureGoal[i],
  }));

  const totalTime = Math.floor(decentReadings.time[decentReadings.time.length - 1]);
  const roundedTime = Math.ceil(totalTime / 5.0) * 5;
  const xAxisTickCount = Math.round(roundedTime / 5) + 1;

  const maxYAxis =
    Math.floor(
      Math.max(
        Math.max(...decentReadings.temperatureMix),
        Math.max(...decentReadings.temperatureBasket),
        Math.max(...decentReadings.temperatureGoal),
      ),
    ) + 1;
  const minYAxis =
    Math.ceil(
      Math.min(
        Math.min(...decentReadings.temperatureMix),
        Math.min(...decentReadings.temperatureBasket),
        Math.min(...decentReadings.temperatureGoal),
      ),
    ) - 1;

  const gridStroke = isDark ? "#4b5563" : "#d1d5db";
  const tickColor = isDark ? "#d1d5db" : "#1f2937";
  const basketColor = isDark ? "#f87171" : "#b91c1c";
  const mixColor = isDark ? "#fbbf24" : "#f59e0b";
  const goalColor = isDark ? "#fb7185" : "#ef4444";

  return (
    <div className="h-44 md:h-56">
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
            domain={[minYAxis, maxYAxis]}
            tick={{ fill: tickColor }}
            tickCount={maxYAxis - minYAxis + 1}
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
            dataKey="basket"
            stroke={basketColor}
            strokeWidth={2}
          />
          <Line
            type="basis"
            dot={false}
            dataKey="mix"
            stroke={mixColor}
            strokeWidth={1}
          />
          <Line
            type="basis"
            dot={false}
            dataKey="goal"
            stroke={goalColor}
            strokeWidth={1.5}
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
