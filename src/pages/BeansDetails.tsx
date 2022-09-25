import {
  DocumentDuplicateIcon,
  PencilSquareIcon,
} from "@heroicons/react/20/solid";
import {
  ArchiveBoxArrowDownIcon,
  ArchiveBoxXMarkIcon,
  MoonIcon,
  SunIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { deleteDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "twin.macro";
import { Button } from "../components/Button";
import { Details } from "../components/Details";
import { useBeansDetails } from "../hooks/firestore/useBeansDetails";
import { NotFound } from "./NotFound";

export const BeansDetails = () => {
  const { beansId } = useParams();
  const navigate = useNavigate();

  const { beans, isLoading, docRef } = useBeansDetails(beansId);

  const handleArchive = async () => {
    await updateDoc(docRef, {
      isFinished: true,
    });
    navigate(`/beans`);
  };

  const handleUnarchive = async () => {
    await updateDoc(docRef, {
      isFinished: false,
    });
  };

  const handleFreeze = async () => {
    await updateDoc(docRef, {
      freezeDate: serverTimestamp(),
    });
  };

  const handleThaw = async () => {
    await updateDoc(docRef, {
      thawDate: serverTimestamp(),
    });
  };

  const handleDelete = async () => {
    // TODO check if beans have brews/espressos/tastings
    deleteDoc(docRef);
    navigate(`/beans`);
  };

  if (isLoading) return null;

  if (!beans) {
    return <NotFound />;
  }

  return (
    <div tw="space-y-8">
      <div>
        <h3 tw="text-lg font-medium leading-6 text-gray-900">
          Beans with id {beansId}
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
        {beans.isFinished ? (
          <Button
            variant="white"
            Icon={<ArchiveBoxXMarkIcon />}
            onClick={handleUnarchive}
          >
            Unarchive
          </Button>
        ) : (
          <Button
            variant="white"
            Icon={<ArchiveBoxArrowDownIcon />}
            onClick={handleArchive}
          >
            Archive
          </Button>
        )}
        {!beans.freezeDate ? (
          <Button variant="white" Icon={<MoonIcon />} onClick={handleFreeze}>
            Freeze
          </Button>
        ) : !beans.thawDate ? (
          <Button variant="white" Icon={<SunIcon />} onClick={handleThaw}>
            Thaw
          </Button>
        ) : null}
        <Button variant="white" Icon={<TrashIcon />} onClick={handleDelete}>
          Delete
        </Button>
      </div>

      <Details
        title="Roast information"
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
        title="Storage"
        rows={[
          {
            label: "Freeze date",
            value: beans.freezeDate?.toDate().toLocaleDateString() || "",
          },
          {
            label: "Thaw date",
            value: beans.thawDate?.toDate().toLocaleDateString() || "",
          },
        ]}
      />

      {beans.origin === "single-origin" ? (
        <Details
          title="Single-origin terroir"
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
            {
              label: "Harvest date",
              value: beans.harvestDate?.toDate().toLocaleDateString() || "",
            },
          ]}
        />
      ) : beans.origin === "blend" ? (
        <React.Fragment>
          {beans.blend.map((b, i) => (
            <Details
              key={i}
              title={`Blend item ${i + 1}`}
              rows={[
                { label: "Name", value: b.name || "" },
                {
                  label: "Percentage",
                  value: b.percentage ? `${b.percentage} %` : "",
                },
                { label: "Country", value: b.country || "" },
                { label: "Process", value: b.process || "" },
                { label: "Varietal(s)", value: b.varietals.join(", ") },
              ]}
            />
          ))}
        </React.Fragment>
      ) : null}
    </div>
  );
};

export default BeansDetails;
