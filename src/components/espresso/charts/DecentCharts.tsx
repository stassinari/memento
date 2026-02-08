import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { doc, DocumentReference } from "firebase/firestore";
import { useMemo } from "react";

import { getDecentReadings } from "~/db/queries";
import { useFirestoreDocRealtime } from "~/hooks/firestore/useFirestoreDocRealtime";
import { useFeatureFlag } from "~/hooks/useFeatureFlag";
import { useCurrentUser } from "~/hooks/useInitUser";
import { DecentReadings } from "~/types/espresso";
import { db } from "../../../firebaseConfig";
import { PressureFlowWeightChart } from "./PressureFlowWeightChart";
import { TemperatureChart } from "./TemperatureChart";

interface DecentChartProps {
  espressoId?: string;
}

const decentReadingsQueryOptions = (espressoId: string, firebaseUid: string) =>
  queryOptions<DecentReadings | null>({
    queryKey: ["decentReadings", espressoId, firebaseUid],
    queryFn: () =>
      getDecentReadings({
        data: { espressoFbId: espressoId, firebaseUid },
      }) as Promise<DecentReadings | null>,
  });

export const DecentCharts = ({ espressoId }: DecentChartProps) => {
  console.log("DecentCharts");

  const user = useCurrentUser();
  const readFromPostgres = useFeatureFlag("read_from_postgres");

  // PostgreSQL readings
  const { data: sqlReadings } = useSuspenseQuery(
    decentReadingsQueryOptions(espressoId ?? "", user?.uid ?? ""),
  );

  // Firestore readings
  const readingsRef = useMemo(
    () =>
      doc(
        db,
        "users",
        user?.uid || "",
        "espresso",
        espressoId ?? "",
        "decentReadings",
        "decentReadings",
      ) as DocumentReference<DecentReadings>,
    [espressoId, user?.uid],
  );

  const { details: fbReadings, isLoading } =
    useFirestoreDocRealtime<DecentReadings>(readingsRef);

  const decentReadings = readFromPostgres ? sqlReadings : fbReadings;

  if (isLoading || !decentReadings) return null;

  return (
    <div className="md:grid md:grid-cols-2">
      <PressureFlowWeightChart readings={decentReadings} />

      <TemperatureChart decentReadings={decentReadings} />
    </div>
  );
};
