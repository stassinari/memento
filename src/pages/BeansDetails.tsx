import { doc, DocumentReference } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { useFirestore, useFirestoreDocData, useUser } from "reactfire";
import { Details } from "../components/Details";
import { Beans } from "../types/beans";

export const BeansDetails = () => {
  const { beansId } = useParams();

  const { data: user } = useUser();

  const firestore = useFirestore();
  const ref = doc(
    firestore,
    "users",
    user?.uid || "",
    "beans",
    beansId || ""
  ) as DocumentReference<Beans>;

  const { data: beansDetails } = useFirestoreDocData(ref);

  return (
    <div>
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Beans with id {beansId}
        </h3>
        <p className="max-w-2xl mt-1 text-sm text-gray-500">
          Subtitle in case it's needed.
        </p>
      </div>
      <Details
        rows={[
          { label: "Name", value: beansDetails.name },
          { label: "Roaster", value: beansDetails.roaster },
          { label: "Roast style", value: beansDetails.roastStyle || "" },
          {
            label: "Roast date",
            value: beansDetails.roastDate?.toDate().toLocaleDateString() || "",
          },
        ]}
      />
    </div>
  );
};
