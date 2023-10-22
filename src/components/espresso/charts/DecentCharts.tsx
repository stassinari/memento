import { doc, DocumentReference } from "firebase/firestore";
import { useMemo } from "react";
import "twin.macro";
import { db } from "../../../firebaseConfig";
import { useFirestoreDocRealtime } from "../../../hooks/firestore/useFirestoreDocRealtime";
import { useCurrentUser } from "../../../hooks/useInitUser";
import { DecentReadings } from "../../../types/espresso";
import { PressureFlowWeightChart } from "./PressureFlowWeightChart";
import { TemperatureChart } from "./TemperatureChart";

interface DecentChartProps {
  espressoId?: string;
}

export const DecentCharts: React.FC<DecentChartProps> = ({ espressoId }) => {
  console.log("DecentCharts");

  const user = useCurrentUser();

  const readingsRef = useMemo(
    () =>
      doc(
        db,
        "users",
        user?.uid || "",
        "espresso",
        espressoId ?? "",
        "decentReadings",
        "decentReadings"
      ) as DocumentReference<DecentReadings>,
    [espressoId, user?.uid]
  );

  const { details: decentReadings, isLoading } =
    useFirestoreDocRealtime<DecentReadings>(readingsRef);

  if (isLoading || !decentReadings) return null;

  return (
    <div tw="md:(grid grid-cols-2)">
      <PressureFlowWeightChart readings={decentReadings} />

      <TemperatureChart decentReadings={decentReadings} />
    </div>
  );
};
