import {
  DocumentDuplicateIcon,
  PencilSquareIcon,
} from "@heroicons/react/20/solid";
import { useFirestoreDocumentData } from "@react-query-firebase/firestore";
import { doc, DocumentReference } from "firebase/firestore";
import { useAtom } from "jotai";
import { Link, useParams } from "react-router-dom";
import { Button } from "../components/Button";
import { Details } from "../components/Details";
import { db } from "../firebaseConfig";
import { userAtom } from "../hooks/useInitUser";
import { Beans } from "../types/beans";

export const BeansDetails = () => {
  const { beansId } = useParams();
  const [user] = useAtom(userAtom);

  const ref = doc(
    db,
    "users",
    user?.uid || "",
    "beans",
    beansId || ""
  ) as DocumentReference<Beans>;

  const { data: beans } = useFirestoreDocumentData(
    ["beansDetails", beansId],
    ref
  );

  if (!beans) {
    return null;
  }

  return (
    <div>
      <div>
        <h3 tw="text-lg font-medium leading-6 text-gray-900">
          Beans with id {beansId}
        </h3>
        <p tw="max-w-2xl mt-1 text-sm text-gray-500">
          Subtitle in case it's needed.
        </p>
      </div>
      <Button
        variant="primary"
        as={Link}
        to="clone"
        Icon={<DocumentDuplicateIcon />}
      >
        Clone
      </Button>
      <Button
        variant="secondary"
        as={Link}
        to="edit"
        Icon={<PencilSquareIcon />}
      >
        Edit
      </Button>

      <Details
        rows={[
          { label: "Name", value: beans.name },
          { label: "Roaster", value: beans.roaster },
          {
            label: "Roast date",
            value: beans.roastDate?.toDate().toLocaleDateString() || "",
          },
          { label: "Roast style", value: beans.roastStyle || "" },
          { label: "Roast level", value: beans.roastLevel?.toString() || "" },
          { label: "Roasting notes", value: beans.roastingNotes.join(", ") },
        ]}
      />

      <Details
        rows={[
          { label: "Country", value: beans.country || "" },
          { label: "Region", value: beans.region || "" },
          { label: "Farmer", value: beans.farmer || "" },
          {
            label: "Altitude",
            value: beans.altitude ? `${beans.altitude} masl` : "",
          },
          { label: "Process", value: beans.process || "" },
          { label: "Varietal(s)", value: beans.varietals.join(", ") },
        ]}
      />
    </div>
  );
};

export default BeansDetails;
