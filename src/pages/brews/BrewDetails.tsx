import {
  DocumentDuplicateIcon,
  PencilSquareIcon,
} from "@heroicons/react/20/solid";
import dayjs from "dayjs";
import { Link, useNavigate, useParams } from "react-router-dom";
import "twin.macro";
import { Button } from "../../components/Button";
import { Details } from "../../components/Details";
import { useFirestoreDetails } from "../../hooks/firestore/useFirestoreDetails";
import { Brew } from "../../types/brews";
import { NotFound } from "../NotFound";

export const BrewDetails = () => {
  const { brewId } = useParams();
  const navigate = useNavigate();

  const {
    details: brew,
    isLoading,
    docRef,
  } = useFirestoreDetails<Brew>("brews", brewId);

  // const handleArchive = async () => {
  //   await updateDoc(docRef, {
  //     isFinished: true,
  //   });
  //   navigate(`/beans`);
  // };

  // const handleUnarchive = async () => {
  //   await updateDoc(docRef, {
  //     isFinished: false,
  //   });
  // };

  // const handleFreeze = async () => {
  //   await updateDoc(docRef, {
  //     freezeDate: serverTimestamp(),
  //   });
  // };

  // const handleThaw = async () => {
  //   await updateDoc(docRef, {
  //     thawDate: serverTimestamp(),
  //   });
  // };

  // const handleDelete = async () => {
  //   // TODO check if beans have brews/espressos/tastings
  //   deleteDoc(docRef);
  //   navigate(`/beans`);
  // };

  if (isLoading) return null;

  if (!brew) {
    return <NotFound />;
  }

  return (
    <div tw="space-y-8">
      <div>
        <h3 tw="text-lg font-medium leading-6 text-gray-900">
          Brew with id {brewId}
        </h3>
        <p tw="max-w-2xl mt-1 text-sm text-gray-500">
          Subtitle in case it's needed.
        </p>
      </div>
      <div tw="space-x-2">
        <Button
          variant="primary"
          as={Link}
          to="clone"
          Icon={<DocumentDuplicateIcon />}
        >
          Clone
        </Button>
        <Button variant="white" as={Link} to="edit" Icon={<PencilSquareIcon />}>
          Edit
        </Button>
        {/* <Button variant="white" Icon={<TrashIcon />} onClick={handleDelete}>
            Delete
          </Button> */}
      </div>

      <Details
        title="Prep"
        rows={[
          {
            label: "Date",
            value: brew.date
              ? dayjs(brew.date.toDate()).format("DD MMM YYYY | H:m")
              : "",
          },
          { label: "Method", value: brew.method },
          // { label: "Beans", value: brew.beans }, TBD
        ]}
      />

      <Details
        title="Equipment"
        rows={[
          { label: "Grinder", value: brew.grinder || "" },
          { label: "Burrs", value: brew.grinderBurrs || "" },
          { label: "Water type", value: brew.waterType || "" },
          { label: "Filter type", value: brew.filterType || "" },
        ]}
      />

      <Details
        title="Recipe"
        rows={[
          {
            label: "Water weight",
            value: brew.waterWeight ? `${brew.waterWeight} g` : "",
          },
          {
            label: "Beans weight",
            value: brew.beansWeight ? `${brew.beansWeight} g` : "",
          },
          {
            label: "Water temperature",
            value: brew.waterTemperature ? `${brew.waterTemperature} °C` : "",
          },
          { label: "Grind setting", value: brew.grindSetting || "" },
        ]}
      />

      <Details
        title="Time"
        rows={[
          {
            label: "Time",
            value:
              brew.timeMinutes || brew.timeSeconds
                ? `${brew.timeMinutes}:${brew.timeSeconds}`
                : "",
          },
        ]}
      />
    </div>
  );
};

export default BrewDetails;
