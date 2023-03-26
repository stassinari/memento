import { doc, DocumentReference } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useFirestoreAnyDoc } from "../../hooks/firestore/useFirestoreAnyDoc";
import { useCurrentUser } from "../../hooks/useInitUser";
import { DecentReadings } from "../../types/espresso";
import { PressureFlowWeightChart } from "./PressureFlowWeightChart";
import { TemperatureChart } from "./TemperatureChart";

interface DecentChartProps {
  espressoId?: string;
}

export const DecentCharts: React.FC<DecentChartProps> = ({ espressoId }) => {
  const user = useCurrentUser();

  const readingsRef = doc(
    db,
    "users",
    user?.uid || "",
    "espresso",
    espressoId ?? "",
    "decentReadings",
    "decentReadings"
  ) as DocumentReference<DecentReadings>;

  const { details: decentReadings, isLoading } =
    useFirestoreAnyDoc<DecentReadings>(readingsRef);

  if (isLoading || !decentReadings) return null;

  return (
    <div>
      <PressureFlowWeightChart readings={decentReadings} />

      <TemperatureChart decentReadings={decentReadings} />
    </div>
  );
};
