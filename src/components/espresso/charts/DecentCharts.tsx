import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { getDecentReadings } from "~/db/queries";
import { useCurrentUser } from "~/hooks/useInitUser";
import { PressureFlowWeightChart } from "./PressureFlowWeightChart";
import { TemperatureChart } from "./TemperatureChart";

interface DecentChartProps {
  espressoId?: string;
}

const decentReadingsQueryOptions = (espressoId: string, firebaseUid: string) =>
  queryOptions({
    queryKey: ["decentReadings", espressoId, firebaseUid],
    queryFn: () =>
      getDecentReadings({
        data: { espressoId: espressoId, firebaseUid },
      }),
  });

export const DecentCharts = ({ espressoId }: DecentChartProps) => {
  console.log("DecentCharts");

  const user = useCurrentUser();

  const { data: decentReadings, isLoading } = useSuspenseQuery(
    decentReadingsQueryOptions(espressoId ?? "", user?.uid ?? ""),
  );

  if (isLoading || !decentReadings) return null;

  return (
    <div className="md:grid md:grid-cols-2">
      <PressureFlowWeightChart readings={decentReadings} />

      <TemperatureChart decentReadings={decentReadings} />
    </div>
  );
};
