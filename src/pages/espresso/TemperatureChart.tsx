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
import { theme } from "twin.macro";
import { ChartLegend } from "../../components/espresso/charts/ChartLegend";
import { ChartTooltip } from "../../components/espresso/charts/ChartTooltip";
import { DecentReadings } from "../../types/espresso";

interface TemperatureChartProps {
  decentReadings: DecentReadings;
}

export const TemperatureChart: React.FC<TemperatureChartProps> = ({
  decentReadings,
}) => {
  const data = decentReadings.time.map((t, i) => ({
    time: t,
    mix: decentReadings.temperatureMix[i],
    basket: decentReadings.temperatureBasket[i],
    goal: decentReadings.temperatureGoal[i],
  }));

  const totalTime = Math.floor(
    decentReadings.time[decentReadings.time.length - 1]
  );
  const roundedTime = Math.ceil(totalTime / 5.0) * 5;
  const xAxisTickCount = Math.round(roundedTime / 5) + 1;

  const maxYAxis =
    Math.floor(
      Math.max(
        Math.max(...decentReadings.temperatureMix),
        Math.max(...decentReadings.temperatureBasket),
        Math.max(...decentReadings.temperatureGoal)
      )
    ) + 1;
  const minYAxis =
    Math.ceil(
      Math.min(
        Math.min(...decentReadings.temperatureMix),
        Math.min(...decentReadings.temperatureBasket),
        Math.min(...decentReadings.temperatureGoal)
      )
    ) - 1;

  return (
    <div tw="h-56">
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
            domain={[minYAxis, maxYAxis]}
            tick={{ fill: theme`colors.gray.800` }}
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
                <ChartTooltip title={props.label} payload={props.payload} />
              );
            }}
          />
          <Legend content={ChartLegend} />
          <Line
            type="basis"
            dot={false}
            dataKey="basket"
            stroke={theme`colors.red.700`}
            strokeWidth={2}
          />
          <Line
            type="basis"
            dot={false}
            dataKey="mix"
            stroke={theme`colors.amber.500`}
            strokeWidth={1}
          />
          <Line
            type="basis"
            dot={false}
            dataKey="goal"
            stroke={theme`colors.red.500`}
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
