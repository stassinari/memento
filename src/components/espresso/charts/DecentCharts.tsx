import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { getDecentReadings } from "~/db/queries";
import { PressureFlowWeightChart } from "./PressureFlowWeightChart";
import { TemperatureChart } from "./TemperatureChart";

interface DecentChartProps {
  espressoId: string;
}

const decentReadingsQueryOptions = (espressoId: string) =>
  queryOptions({
    queryKey: ["decentReadings", espressoId],
    queryFn: () =>
      getDecentReadings({
        data: { espressoId: espressoId },
      }),
  });

export const DecentCharts = ({ espressoId }: DecentChartProps) => {
  console.log("DecentCharts");

  const { data: decentReadings, isLoading } = useSuspenseQuery(
    decentReadingsQueryOptions(espressoId),
  );

  if (isLoading || !decentReadings) return null;

  return (
    <div className="md:grid md:grid-cols-2">
      <PressureFlowWeightChart readings={decentReadings} />

      <TemperatureChart decentReadings={decentReadings} />
    </div>
  );
};
